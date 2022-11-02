<script type="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { Store } from '../state';
  import type { ToolHandle } from '.';
  import type { Shape, Rectangle } from '../shapes';

  const dispatch = createEventDispatcher();

  export let shape: Shape;

  export let screenTransform: Function;
  
  export let shapeTransform: Function = null;
  
  export let reverseShapeTransform: Function = null; 

  export let dragHandler: (s: Shape, h: ToolHandle, delta: number[]) => Shape;

  let initialShape: Shape;

  let grabbedHandle: ToolHandle;

  let grabbedShape: Shape;
  
  let grabbedOrigin: number[];  

  $: geometry = shapeTransform ?
    shapeTransform(shape).geometry : shape.geometry;

  const onGrab = (handle: ToolHandle) => (evt: PointerEvent) => {
    grabbedHandle = handle;    
    grabbedShape = shapeTransform ? shapeTransform(shape as Rectangle) : shape as Rectangle;
    grabbedOrigin = screenTransform(evt.offsetX, evt.offsetY);

    const target = evt.target as Element;
    target.setPointerCapture(evt.pointerId);
    
    dispatch('grab');
  }

  const onPointerMove = (evt: PointerEvent) => {
    if (grabbedHandle) {
      const [x, y] = screenTransform(evt.offsetX, evt.offsetY);

      const delta = [x - grabbedOrigin[0], y - grabbedOrigin[1]];

      let updated = dragHandler(grabbedShape, grabbedHandle, delta);

      if (reverseShapeTransform)
        updated = reverseShapeTransform(updated);

      Store.update(shape, updated);

      shape = updated;
    }
  }

  const onRelease = (evt: PointerEvent) => {
    const target = evt.target as Element;    
    target.releasePointerCapture(evt.pointerId);

    grabbedHandle = null;

    dispatch('release');
  }

  onMount(() => {
    initialShape = shape;
     
    const onKeyDown = (evt: KeyboardEvent) => {
      if (evt.code === 'Enter')
        dispatch('save', shape)
      else if (evt.code === 'Escape')
        dispatch('cancel', initialShape);
      else if (evt.code === 'Delete')
        dispatch('delete', initialShape);
    };
    
    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  });
</script>

<slot  
  grab={onGrab} 
  pointerMove={onPointerMove} 
  release={onRelease} 
  geometry={geometry} />