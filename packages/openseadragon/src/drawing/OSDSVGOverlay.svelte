<script type="ts">
  import { onMount } from 'svelte';
  import { Hover, Store, Selection, EditableRectangle, ShapeType, type Shape } from '@annotorious/core';

  export let viewer: OpenSeadragon.Viewer;

  export let viewTransform: Function;
  
  export let screenTransform: Function;

  export let shapeTransform: Function = null;

  export let reverseShapeTransform: Function = null;

  let transform = null;

  let scale = 1;

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
        isSelected: false
      }
    });

    Hover.set(null);
  }

  onMount(() => {
    viewer.addHandler('update-viewport', onUpdateViewport);

    return () => 
      viewer.removeHandler('update-viewport', onUpdateViewport);
  });
</script>

<svg class="a9s-gl-drawing-pane">
  <g transform={transform}>
    {#each $Selection as selected}
      {#if selected.type === ShapeType.RECTANGLE}
        <EditableRectangle
          shape={selected} 
          screenTransform={screenTransform} 
          shapeTransform={shapeTransform}
          reverseShapeTransform={reverseShapeTransform}
          viewportScale={scale}
          on:grab={onGrab} 
          on:release={onRelease} 
          on:save={({ detail }) => onComplete(detail)} 
          on:cancel={({ detail }) => onComplete(detail)} />
      {/if}
    {/each}
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
  }
</style>