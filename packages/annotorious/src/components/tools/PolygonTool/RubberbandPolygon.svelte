<script type="ts">
  import { onMount } from 'svelte';

  export let element: SVGElement;

  export let screenTransform: Function;

  let points: [number, number][] = [];
  
  let cursor: [number, number] = null;

  onMount(() => {
    const onPointerDown = (evt: PointerEvent) => {
      evt.preventDefault();

      const point = screenTransform(evt.offsetX, evt.offsetY);

      if (points.length === 0)
        points.push(point);
  
      cursor = point;
    };

    const onPointerMove = (evt: PointerEvent) => {
      if (points.length > 0) {
        evt.preventDefault();

        cursor = screenTransform(evt.offsetX, evt.offsetY);
      }
    };

    const onPointerUp = () => {
      points.push(cursor);
    }

    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerup', onPointerUp);

    return () => {
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerup', onPointerUp);
    }
  });
</script>

{#if (Boolean(cursor))}
  <g class="a9s-selection polygon">
    <polygon points={[...points, cursor].map(xy => xy.join(',')).join(' ')} />
  </g>
{/if}

<style>

</style>