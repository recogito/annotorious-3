import { writable } from 'svelte/store';
import Store from '../store/store';
import { CurrentUser } from '../users';
import type { Shape } from '../../shapes';

const Selection = () => {
  
  const { subscribe, update } = writable<Shape[]>([]);

  Store.observe(({ deleted, updated }) => {
    // State changes
    const withChangedState: Shape[] = updated
      .filter(({ oldValue, newValue }) => oldValue.state.isSelectedBy !== newValue.state.isSelectedBy)
      .map(({ newValue }) => newValue);

    if (withChangedState.length + deleted.length > 0) {
      update((currentSelection: Shape[]) => {
        // Shapes that have changed to 'selected' in this update
        const selected = withChangedState.filter((newValue) => newValue.state.isSelectedBy === CurrentUser);

        // IDs for the shapes that were 'deselected' in this update...
        const deselectedIds = new Set([
          //...because their status changed
          ...withChangedState.filter((newValue) => !newValue.state.isSelectedBy).map((s) => s.id),

          // ...because they were deleted while selected
          ...deleted.filter((shape) => currentSelection.find((s) => s.id === shape.id)).map((s) => s.id)
        ]);

        if (selected.length + deselectedIds.size > 0) {
          const updatedSelection = [
            // Remove shapes that were disabled in this update
            ...currentSelection.filter((shape) => !deselectedIds.has(shape.id)),

            // Add shapes that were enabled in this update
            ...selected
          ];

          return(updatedSelection);
        } else {
          return currentSelection;
        }
      });
    }
  }, true);

  const setSelected = (shape: Shape, selected: boolean) =>
    Store.setState(shape.id, { isSelectedBy: selected ? CurrentUser : undefined });

  return { subscribe, setSelected };

}

export default Selection();
