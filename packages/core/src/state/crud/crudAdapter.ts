import { createNanoEvents, type Emitter, type Unsubscribe } from 'nanoevents';
import { equalsIgnoreState, type Shape } from '../../shapes';
import type { Store } from '../store';
import type { CRUDEvents } from './crudEvents';

const observeOptions = {
  ignoreHoverStateChanges: true
};

export class CRUDAdapter {
  emitter: Emitter<CRUDEvents>;

  eventsEnabled: boolean;

  constructor(store: typeof Store) {
    this.emitter = createNanoEvents<CRUDEvents>();

    this.eventsEnabled = true;

    // Selected shapes, in their original state
    const selected: { [key: string]: Shape } = {};

    store.observe((changes) => {
      if (this.eventsEnabled) {
        const { added, deleted, updated } = changes;

        added.forEach((shape) => {
          delete selected[shape.id];
          this.emitter.emit('createShape', shape);
        });

        deleted.forEach((shape) => {
          delete selected[shape.id];
          this.emitter.emit('deleteShape', shape);
        });

        updated.forEach(({ oldValue, newValue }) => {
          if (!oldValue.state.isSelected && newValue.state.isSelected) {
            // This shape was selected
            selected[newValue.id] = newValue;
          } else if (oldValue.state.isSelected && !newValue.state.isSelected) {
            const stateOnSelection = selected[newValue.id];

            if (!equalsIgnoreState(stateOnSelection, newValue)) {
              this.emitter.emit('updateShape', newValue, stateOnSelection);
            }
          }
        });
      }
    }, observeOptions);
  }

  on = <E extends keyof CRUDEvents>(event: E, callback: CRUDEvents[E]): Unsubscribe => {
    return this.emitter.on(event, callback);
  };

  get enabled() {
    return this.eventsEnabled;
  }

  set enabled(enabled: boolean) {
    this.eventsEnabled = enabled;
  }
}
