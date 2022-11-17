<script type="ts">
  import type { Polygon } from '../../../shapes';
  import { ToolHandle, Tool } from '..';
  import { modifyPolygon } from './modifyPolygon';

  export let shape: Polygon;
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
  dragHandler={modifyPolygon}

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

    <polygon
      class="a9s-shape-handle"
      on:pointerdown={grab(ToolHandle.SHAPE)}
      points={geometry.points.map(xy => xy.join(',')).join(' ')} />

    {#each geometry.points as point, idx}
      <rect 
        class="a9s-corner-handle"
        on:pointerdown={grab(ToolHandle(idx))}
        x={point[0] - handleSize / 2} y={point[1] - handleSize / 2} height={handleSize} width={handleSize} />
    {/each}
  </g>
</Tool>

<style>
  polygon.a9s-shape-handle {
    vector-effect: non-scaling-stroke;
    fill: rgba(26, 115, 232, 0.25);
    stroke: rgb(26, 115, 232);
    stroke-width: 2px;
    cursor: move;
  }

  polygon.a9s-shape-handle:hover {
    fill: rgba(26, 115, 232, 0.18);
  }

  .a9s-corner-handle {
    vector-effect: non-scaling-stroke;
    fill: rgba(255, 255, 255);
    stroke: rgb(26, 115, 232);
    stroke-width: 1px;
    cursor: move;
  }
</style>
