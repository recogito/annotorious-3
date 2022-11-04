<script type="ts">
  import { onMount } from 'svelte';
  import { nanoid } from 'nanoid';
  import { ShapeType, type Rectangle } from '../../../shapes';

  export let element: SVGElement;

  export let screenTransform: Function;

  let drawing = false;

  let origin: [number, number]; 

  let anchor: [number, number];

  onMount(() => {
    element.addEventListener('pointerdown', (evt: PointerEvent) => {
      evt.preventDefault();

      drawing = true;

      origin = screenTransform(evt.offsetX, evt.offsetY);
      anchor = origin;
    });

    element.addEventListener('pointermove', (evt: PointerEvent) => {
      if (drawing) {
        evt.preventDefault();

        anchor = screenTransform(evt.offsetX, evt.offsetY);
      }
    });

    element.addEventListener('pointerup', (evt: PointerEvent) => {
      drawing = false;

      const [minX, minY] = origin;

      const [maxX, maxY] = anchor;

      const w = maxX - minX;
      const h = maxY - minY;

      const shape: Rectangle = {
        id: nanoid(),
        type: ShapeType.RECTANGLE,  
        geometry: {
          bounds: {
            minX, 
            minY,
            maxX,
            maxY
          },
          x: minX, y: minY, w, h
        },
        state: {}
      }

      console.log(shape);
    });
  });
</script>

{#if drawing}
  <rect x={origin[0]} y={origin[1]} width={anchor[0] - origin[0]} height={anchor[1] - origin[1]} />
{/if}

<style>
  rect {
    fill: rgba(0,0,0,0.5);
    stroke: red;
    stroke-width: 3px;
  }
</style>