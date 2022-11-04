<script lang="ts">
  import { onMount } from 'svelte';
  import OpenSeadragon from 'openseadragon';
  import * as PIXI from 'pixi.js';
  import { Hover, Selection, Store, type Shape } from '@annotorious/annotorious';

  // OpenSeadragon viewer
  export let viewer: any;
  
  // AnnotationLayer config
  export let config: {
    drawShape:Function,
    viewportToLayerPoint: Function,
    viewportToLayerDelta: Function
  };

  // Pixi stage
  const graphics = new PIXI.Graphics();

  // Pixi renderer - initialized on mount
  let renderer: PIXI.AbstractRenderer; 

  // Lookup table: rendered graphics objects by shape ID
  let renderedObjects = {}; 

  const drawShape = (shape: Shape) => {
    const g = config.drawShape(shape);
    graphics.addChild(g);
    renderedObjects[shape.id] = g;
  }

  const refresh = () => {
    const viewportBounds = viewer.viewport.viewportToImageRectangle(viewer.viewport.getBounds(true));

    const containerWidth = viewer.viewport.getContainerSize().x;
    const zoom = viewer.viewport.getZoom(true);
    const scale = zoom * containerWidth / viewer.world.getContentFactor();

    const { dx, dy } = config.viewportToLayerDelta(viewportBounds, scale);

    const rotation = Math.PI * viewer.viewport.getRotation() / 180;

    let offsetX: number, offsetY: number;

    if (rotation > 0 && rotation <= Math.PI / 2) {
      offsetX = viewportBounds.height * scale;
      offsetY = 0;
    } else if (rotation > Math.PI / 2 && rotation <= Math.PI) {
      offsetX = viewportBounds.width * scale;
      offsetY = viewportBounds.height * scale;
    } else if (rotation > Math.PI && rotation <= Math.PI * 1.5) {
      offsetX = 0;
      offsetY = viewportBounds.width * scale;
    } else {
      offsetX = 0;
      offsetY = 0;
    }

    graphics.position.x = offsetX + dx * Math.cos(rotation) - dy * Math.sin(rotation);
    graphics.position.y = offsetY + dx * Math.sin(rotation) + dy * Math.cos(rotation);

    graphics.scale.set(scale, scale);
    graphics.rotation = rotation;
    
    renderer.render(graphics);
  };

  onMount(() => {
    const { offsetWidth, offsetHeight } = viewer.canvas;

    const canvas = document.createElement('canvas');
    canvas.width = offsetWidth;
    canvas.height = offsetHeight;
    canvas.className = 'a9s-gl-canvas';

    viewer.element.querySelector('.openseadragon-canvas').appendChild(canvas);

    canvas.addEventListener('pointermove', evt => { 
      const xy = new OpenSeadragon.Point(evt.offsetX, evt.offsetY);
      const vpt = viewer.viewport.pointFromPixel(xy);
      const img = config.viewportToLayerPoint(vpt, viewer);

      const hovered = Store.getAt(img.x, img.y);
      if (hovered?.id !== $Hover?.shape.id) {
        if (hovered)
          Hover.set({ shape: hovered, originalEvent: evt});
        else 
          Hover.set(null);
      } else {
        // Should we update the originalEvent in the hover state?
        if (hovered)
          Hover.set({ shape: hovered, originalEvent: evt })
      }
    });

    canvas.addEventListener('pointerdown', () => {
      // Checks if the selection contains this is
      const isSelected = (id: string) => 
        $Selection.find(shape => shape.id === id);

      // De-selects all selected shapes
      const deselectAll = () => $Selection.forEach(shape => 
        Store.setState(shape.id, { isSelected: false }));

      if ($Hover && !isSelected($Hover.shape.id)) {
        deselectAll();
        Store.setState($Hover.shape.id, { isSelected: true });
      } else if (!$Hover) {
        deselectAll();
      }
    });

    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      canvas.width = width;
      canvas.height = height;
      renderer.render(graphics);
    });

    observer.observe(canvas);

    renderer = PIXI.autoDetectRenderer({ 
      width: offsetWidth, 
      height: offsetHeight,
      backgroundAlpha: 0,
      view: canvas
    });

    viewer.addHandler('update-viewport', refresh);

    Store.all().forEach(drawShape);
  });

  Store.observe(changes => {
    changes.added.forEach(drawShape);

    changes.updated.forEach(({ oldValue, newValue }) => {
      if (oldValue.state.isSelected && !newValue.state.isSelected) {
        // Deselect - restore shape
        drawShape(newValue);
      } else {
        const g = renderedObjects[oldValue.id];
        g?.destroy();
        delete renderedObjects[oldValue.id];

        // Add new (unless selected!)
        if (!newValue.state.isSelected)
          drawShape(newValue);
      }
    });

    changes.deleted.forEach(shape => {
      const g = renderedObjects[shape.id];
      g?.destroy();
      delete renderedObjects[shape.id];
    });

    refresh();
  });
</script>

<style>
  :global(canvas.a9s-gl-canvas) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
