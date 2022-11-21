import { writable } from 'svelte/store';
import { Store } from '..';
import type { Shape } from '../../shapes';

const Hover = () => {
  const { subscribe, update } = writable<{ shape: Shape, originalEvent: PointerEvent}>();

  const changeHover = (shape: Shape | null, originalEvent: PointerEvent) =>
    update((currentHover) => {
      // Update the store only if hover changed to a different shape
      if (currentHover?.shape.id !== shape?.id) {
        if (currentHover) Store.setState(currentHover.shape.id, { isHovered: false });

        if (shape) Store.setState(shape.id, { isHovered: true });
      }

      return { shape, originalEvent };
    });

  return { subscribe, set: changeHover };
};

export default Hover();
