<script type="ts">
  import { onMount } from 'svelte';
  import { nanoid } from 'nanoid';
  import { Env } from '../../../environment';
  import { Store, Selection } from '../../../state';
  import { ShapeType, type Polygon } from '../../../shapes';

  export let element: SVGElement;

  export let screenTransform: Function;

  // Points created so far
  let points: [number, number][] = [];
  
  // The 'floating' point under the mouse
  let cursor: [number, number] = null;

  onMount(() => {
    const onPointerDown = (evt: PointerEvent) => {
      evt.preventDefault();

      const point = screenTransform(evt.offsetX, evt.offsetY);
      points.push(point);
      cursor = point;
    };

    const onPointerMove = (evt: PointerEvent) => {
      if (points.length > 1) {
        evt.preventDefault();

        cursor = screenTransform(evt.offsetX, evt.offsetY);
      }
    };

    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointermove', onPointerMove);

    return () => {
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointermove', onPointerMove);
    }
  });
</script>

{#if Boolean(cursor)}
  <g class="a9s-selection polygon">
    <polygon points={[...points, cursor].map(xy => xy.join(',')).join(' ')} />
  </g>
{/if}

<style>

</style>