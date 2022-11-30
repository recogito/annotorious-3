import { writable } from 'svelte/store';
import { Store } from '..';
import type { Shape } from '../../shapes';

const Hover = () => {
  const { subscribe, update } = writable<Shape>(null);

  const changeHover = (shape: Shape | null) =>
    update((currentHover) => {
      // Update the store only if hover changed to a different shape
      if (currentHover?.id !== shape?.id) {
        if (currentHover) Store.setState(currentHover.id, { isHovered: false });

        if (shape) Store.setState(shape.id, { isHovered: true });
      }

      return shape;
    });

  return { subscribe, set: changeHover };
};

export default Hover();
