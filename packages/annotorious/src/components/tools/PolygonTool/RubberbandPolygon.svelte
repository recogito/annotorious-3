<script type="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { nanoid } from 'nanoid';
  import { Store } from '../../../state';
  import { Env } from '../../../environment';
  import { distance } from '../../../geom';
  import { boundsFromPoints, ShapeType, type Polygon } from '../../../shapes';

  const dispatch = createEventDispatcher();

  export let element: SVGElement;

  export let screenTransform: Function;

  export let viewportScale: number = null;

  export let closeDistance = 40;

  let points: [number, number][] = [];
  
  let cursor: [number, number] = null;

  let isClosable: boolean = false;

  $: handleSize = 10 / viewportScale;

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

        if (points.length >  2) {
          const d = viewportScale ? distance(cursor, points[0]) / viewportScale : distance(cursor, points[0]);
          isClosable = d < closeDistance;
        }
      }
    };

    const onPointerUp = () => {
      if (isClosable) {
        const shape: Polygon = {
          id: nanoid(),
          type: ShapeType.POLYGON, 
          creator: Env.currentUser.id,
          created: new Date(),
          geometry: {
            bounds: boundsFromPoints(points),
            points
          },
          state: {
            isSelectedBy: Env.currentUser.id
          }
        }

        Store.add(shape);

        dispatch('created');
      } else {
        points.push(cursor);
      }
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
    <polygon points={(isClosable ? points : [...points, cursor]).map(xy => xy.join(',')).join(' ')} />
      
    {#if isClosable}
      <rect 
        class="a9s-corner-handle"
        x={points[0][0] - handleSize / 2} y={points[0][1] - handleSize / 2} height={handleSize} width={handleSize} />
    {/if}
  </g>
{/if}

<style>
  polygon {
    vector-effect: non-scaling-stroke;
    fill: rgba(26, 115, 232, 0.25);
    stroke: rgb(26, 115, 232);
    stroke-width: 2px;
  }

  .a9s-corner-handle {
    vector-effect: non-scaling-stroke;
    fill: rgba(255, 255, 255);
    stroke: rgb(26, 115, 232);
    stroke-width: 1px;
  }
</style>