import equal from 'deep-equal';
import type { Shape } from '../../shapes';

export default class StoreChangeEvent {
  added: Shape[];

  deleted: Shape[];

  updated: { oldValue: Shape; newValue: Shape }[];

  constructor(
    added: Shape[],
    deleted: Shape[],
    updated: {
      oldValue: Shape;
      newValue: Shape;
    }[]
  ) {
    this.added = added;
    this.deleted = deleted;
    this.updated = updated;
  }

  isEmpty = (): boolean => this.added.length + this.deleted.length + this.updated.length === 0;

  removeStateChanges = (propsToRemove: string[] = []): StoreChangeEvent => {
    const { added, deleted, updated } = this;

    // Returns the shape object, without state
    const stripState = (shape: Shape) => {
      const { state, ...rest } = shape;

      if (propsToRemove.length === 0) {
        // Remove all state
        return rest;
      } else {
        // Remove specific state props only
        propsToRemove.forEach((prop) => {
          delete state[prop];
        });

        return { ...rest, state };
      }
    };

    const updatesWithoutStateChanges = updated.filter(({ oldValue, newValue }) => {
      const a = stripState(oldValue);
      const b = stripState(newValue);
      return !equal(a, b);
    });

    return new StoreChangeEvent(added, deleted, updatesWithoutStateChanges);
  };
}
