<script type="ts">
  import type { Rectangle } from '../../../shapes';
  import { ToolHandle, Tool } from '..';
  import { modifyRectangle } from './modifyRectangle';

  export let shape: Rectangle;
  export let screenTransform: Function;
  export let shapeTransform: Function = null;
  export let reverseShapeTransform: Function = null;
  export let viewportScale: number = null;

  $: handleSize = 10 / viewportScale;
</script>

<Tool
  shape={shape}
  screenTransform={screenTransform}
  shapeTransform={shapeTransform}
  reverseShapeTransform={reverseShapeTransform} 
  dragHandler={modifyRectangle}

  on:grab
  on:release
  on:save
  on:cancel
  on:delete

  let:geometry={geometry}
  let:grab={grab}
  let:pointerMove={pointerMove}
  let:release={release}>

  <g
    class="a9s-annotation selected"
    on:pointerup={release}
    on:pointermove={pointerMove}>

    <rect 
      class="a9s-shape-handle"
      on:pointerdown={grab(ToolHandle.SHAPE)}
      x={geometry.x} y={geometry.y} width={geometry.w} height={geometry.h} />

    <rect 
      class="a9s-edge-handle a9s-edge-handle-top" 
      on:pointerdown={grab(ToolHandle.TOP)}
      x={geometry.x} y={geometry.y} height={1} width={geometry.w} />

    <rect 
      class="a9s-edge-handle a9s-edge-handle-right"
      on:pointerdown={grab(ToolHandle.RIGHT)}
      x={geometry.x + geometry.w} y={geometry.y} height={geometry.h} width={1}/>

    <rect 
      class="a9s-edge-handle a9s-edge-handle-bottom" 
      on:pointerdown={grab(ToolHandle.BOTTOM)}
      x={geometry.x} y={geometry.y + geometry.h} height={1} width={geometry.w} />

    <rect 
      class="a9s-edge-handle a9s-edge-handle-left" 
      on:pointerdown={grab(ToolHandle.LEFT)}
      x={geometry.x} y={geometry.y} height={geometry.h} width={1} />

    <rect 
      class="a9s-corner-handle a9s-corner-handle-topleft"
      on:pointerdown={grab(ToolHandle.TOP_LEFT)}
      x={geometry.x - handleSize / 2} y={geometry.y - handleSize / 2} height={handleSize} width={handleSize} />

    <rect 
      class="a9s-corner-handle a9s-corner-handle-topright"
      on:pointerdown={grab(ToolHandle.TOP_RIGHT)}
      x={geometry.x + geometry.w - handleSize / 2} y={geometry.y - handleSize / 2} height={handleSize} width={handleSize} />
    
    <rect 
      class="a9s-corner-handle a9s-corner-handle-bottomright"
      on:pointerdown={grab(ToolHandle.BOTTOM_RIGHT)}
      x={geometry.x + geometry.w - handleSize / 2} y={geometry.y + geometry.h - handleSize / 2} height={handleSize} width={handleSize} />
      
    <rect 
      class="a9s-corner-handle a9s-corner-handle-bottomleft"
      on:pointerdown={grab(ToolHandle.BOTTOM_LEFT)}
      x={geometry.x - handleSize / 2} y={geometry.y + geometry.h - handleSize / 2} height={handleSize} width={handleSize} />
  </g>
</Tool>

<style>
  rect {
    vector-effect: non-scaling-stroke;
    stroke: #fff;
    fill: rgb(26, 115, 232);
    stroke-width: 2px;
  }

  .a9s-shape-handle {
    fill: rgba(26, 115, 232, 0.25);
    stroke: rgb(26, 115, 232);
    stroke-width: 1px;
  }

  .a9s-shape-handle:hover {
    fill: rgba(26, 115, 232, 0.18);
    cursor: move;
  }

  .a9s-corner-handle {
    fill: rgba(255, 255, 255);
    stroke: rgb(26, 115, 232);
    stroke-width: 1px;
  }

  .a9s-edge-handle {
    stroke: transparent;
    stroke-width: 6px;
  }

  .a9s-edge-handle-top {
    cursor:n-resize;
  }

  .a9s-edge-handle-right {
    cursor:e-resize;
  }

  .a9s-edge-handle-bottom {
    cursor:s-resize;
  }

  .a9s-edge-handle-left {
    cursor:w-resize;
  }

  .a9s-corner-handle-topleft {
    cursor:nw-resize;
  }

  .a9s-corner-handle-topright {
    cursor:ne-resize;
  }

  .a9s-corner-handle-bottomright {
    cursor:se-resize;
  }

  .a9s-corner-handle-bottomleft {
    cursor:sw-resize;
  }
</style>
