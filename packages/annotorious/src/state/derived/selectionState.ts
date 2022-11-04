import { readable } from 'svelte/store';
import { Store } from '..';
import type { Shape } from '../../shapes';

const Selection = readable<Shape[]>([], (set) => {
  let currentSelection: Shape[] = [];

  Store.observe(({ deleted, updated }) => {
    // State changes
    const withChangedState: Shape[] = updated
      .filter(({ oldValue, newValue }) => oldValue.state.isSelected !== newValue.state.isSelected)
      .map(({ newValue }) => newValue);

    // Shapes that have changed to 'selected' in this update
    const selected = withChangedState.filter((newValue) => newValue.state.isSelected);

    // IDs for the shapes that were 'deselected' in this update...
    const deselectedIds = new Set([
      //...because their status changed
      ...withChangedState.filter((newValue) => !newValue.state.isSelected).map((s) => s.id),

      // ...because they were deleted while selected
      ...deleted.filter(shape => currentSelection.find(s => s.id === shape.id)).map(s => s.id)
    ]);
   
    if (selected.length + deselectedIds.size > 0) {
      currentSelection = [
        // Remove shapes that were disabled in this update
        ...currentSelection.filter((shape) => !deselectedIds.has(shape.id)),

        // Add shapes that were enabled in this update
        ...selected
      ];

      set(currentSelection);
    }
  });
});

export default Selection;
