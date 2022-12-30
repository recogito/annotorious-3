<script type="ts">
  import { onMount, SvelteComponent } from 'svelte';
  import { Hover, Store, Selection, EditablePolygon, EditableRectangle, RubberbandPolygon, RubberbandRectangle, ShapeType } from '@annotorious/annotorious';
  import type { Shape } from '@annotorious/annotorious';

  export let viewer: OpenSeadragon.Viewer;

  export let drawingEnabled: boolean;

  export let viewTransform: Function;
  
  export let screenTransform: Function;

  export let shapeTransform: Function = null;

  export let reverseShapeTransform: Function = null;

  let svgElement: SVGElement; 

  let transform = null;

  let scale = 1;

  let currentDrawingTool: typeof SvelteComponent = null;

  $: {
    if (drawingEnabled) {
      currentDrawingTool = RubberbandRectangle;
      viewer.setMouseNavEnabled(false);
    }
  }

  const onUpdateViewport = () => {
    // Keep SVG layer in sync with OSD state
    transform = viewTransform();

    // Current OSD scale to counter-scale constant-size elements
    const containerWidth = viewer.viewport.getContainerSize().x;
    const zoom = viewer.viewport.getZoom(true);
    scale = zoom * containerWidth / viewer.world.getContentFactor();
  }

  const onGrab = () => viewer.setMouseNavEnabled(false);

  const onRelease = () => viewer.setMouseNavEnabled(true);

  const onComplete = (shape: Shape) => {
    // Live state from the store
    const { state } = Store.get(shape.id);

    Store.update(shape.id, { 
      ...shape,
      state: {
        ...state,
        isSelectedBy: null
      }
    });

    Hover.set(null);

    viewer.setMouseNavEnabled(true);
  }

  const onDelete = (shape: Shape) => {
    Store.remove(shape);
  }

  const onCreated = () => {
    console.log('created current tool = null');
    currentDrawingTool = null;
    viewer.setMouseNavEnabled(true);
  }

  onMount(() => {
    viewer.addHandler('update-viewport', onUpdateViewport);

    return () => 
      viewer.removeHandler('update-viewport', onUpdateViewport);
  });

  // A typecasting helper, because 'as' doesn't work in Svelte markup
  const cast = <T extends Shape>(x: Shape) => x as T
</script>

<svg 
  class="a9s-gl-drawing-pane" 
  class:active={$Selection.length > 0 || Boolean(currentDrawingTool)}
  bind:this={svgElement}>
  <g transform={transform}>
    {#if $Selection.length > 0}
      {#each $Selection as selected}
        {#if selected.type === ShapeType.RECTANGLE}
          <EditableRectangle
            shape={cast(selected)} 
            screenTransform={screenTransform} 
            shapeTransform={shapeTransform}
            reverseShapeTransform={reverseShapeTransform}
            viewportScale={scale}
            on:grab={onGrab} 
            on:release={onRelease} 
            on:save={({ detail }) => onComplete(detail)} 
            on:cancel={({ detail }) => onComplete(detail)} 
            on:delete={({ detail }) => onDelete(detail)} />
        {:else if selected.type === ShapeType.POLYGON}
          <EditablePolygon 
            shape={cast(selected)}
            screenTransform={screenTransform}
            shapeTransform={shapeTransform}
            reverseShapeTransform={reverseShapeTransform}
            viewportScale={scale}
            on:grab={onGrab}
            on:release={onRelease}
            on:save={({ detail }) => onComplete(detail)} 
            on:cancel={({ detail }) => onComplete(detail) }
            on:delete={({ detail }) => onDelete(detail) } />
        {/if}
      {/each}
    {:else if Boolean(currentDrawingTool)} 
      <svelte:component 
        this={currentDrawingTool}
        element={svgElement}
        screenTransform={screenTransform} 
        viewportScale={scale} 
        on:created={onCreated} />
    {/if}
  </g>
</svg>

<style>
  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    outline: none;
    pointer-events: none;
  }
  
  svg.active {
    pointer-events: all;
  }

  svg * {
    pointer-events: all;
  }
</style>