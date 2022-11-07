<script type="ts">
  import { onMount } from 'svelte';
  import { nanoid } from 'nanoid';
  import { CurrentUser, Store } from '../../../state';
  import { ShapeType, type Rectangle } from '../../../shapes';

  export let element: SVGElement;

  export let screenTransform: Function;

  let drawing = false;

  let origin: [number, number]; 

  let anchor: [number, number];

  onMount(() => {
    const onPointerDown = (evt: PointerEvent) => {
      evt.preventDefault();

      drawing = true;

      origin = screenTransform(evt.offsetX, evt.offsetY);
      anchor = origin;
    };

    const onPointerMove = (evt: PointerEvent) => {
      if (drawing) {
        evt.preventDefault();

        anchor = screenTransform(evt.offsetX, evt.offsetY);
      }
    };

    const onPointerUp = () => {
      drawing = false;

      const [minX, minY] = origin;

      const [maxX, maxY] = anchor;

      const w = maxX - minX;
      const h = maxY - minY;

      const shape: Rectangle = {
        id: nanoid(),
        type: ShapeType.RECTANGLE, 
        creator: $CurrentUser.id,
        created: new Date(),
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

      Store.add(shape);
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