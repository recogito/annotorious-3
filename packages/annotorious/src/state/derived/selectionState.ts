import { writable } from 'svelte/store';
import Store from '../store/store';
import { Env } from '../../environment';
import type { Shape } from '../../shapes';
import store from '../store/store';

const Selection = () => {
  const { subscribe, update } = writable<Shape[]>([]);

  Store.observe(({ added, deleted, updated }) => {
    // State changes
    const withChangedState: Shape[] = updated
      .filter(
        ({ oldValue, newValue }) => oldValue.state.isSelectedBy !== newValue.state.isSelectedBy
      )
      .map(({ newValue }) => newValue);

    // Added in selected state?
    const newSelections = added.filter((shape) => shape.state.isSelectedBy);

    if (withChangedState.length + deleted.length + newSelections.length > 0) {
      update((currentSelection: Shape[]) => {
        // Shapes that have changed to 'selected' in this update
        const selected = [
          ...withChangedState.filter(
            (newValue) => newValue.state.isSelectedBy === Env.currentUser.id
          ),
          ...newSelections
        ];

        // IDs for the shapes that were 'deselected' in this update...
        const deselectedIds = new Set([
          //...because their status changed
          ...withChangedState.filter((newValue) => !newValue.state.isSelectedBy).map((s) => s.id),

          // ...because they were deleted while selected
          ...deleted
            .filter((shape) => currentSelection.find((s) => s.id === shape.id))
            .map((s) => s.id)
        ]);

        if (selected.length + deselectedIds.size > 0) {
          const updatedSelection = [
            // Remove shapes that were disabled in this update
            ...currentSelection.filter((shape) => !deselectedIds.has(shape.id)),

            // Add shapes that were enabled in this update
            ...selected
          ];

          // We're all immutable here. The position of the actual shapes in the store
          // might have changed, therefore the selection 'copies' may need updating.
          // This could possibly be optimized.
          return updatedSelection.map(s => store.get(s.id));
        } else {
          return currentSelection.map(s => Store.get(s.id));
        }
      });
    }
  }, true);

  // For convenience
  const select = (arg: Shape | string) => {
    const id = typeof arg === 'string' ? arg : arg.id;
    Store.setState(id, { isSelectedBy: Env.currentUser.id });
  };

  const deselect = (arg: Shape | string) => {
    const id = typeof arg === 'string' ? arg : arg.id;
    Store.setState(id, { isSelectedBy: undefined });
  };

  return { subscribe, select, deselect };
};

export default Selection();
