import { createNanoEvents, type Unsubscribe } from 'nanoevents';
import type { Store } from '../store';
import { equalsIgnoreState, type Shape } from '../../shapes';
import type { CRUDEvents } from './crudEvents';

export const CRUDAdapter = (store: typeof Store) => {

  const emitter = createNanoEvents<CRUDEvents>();

  // Selected shapes, in their original state
  const selected: { [ key: string ]: Shape } = {};

  const observeOptions = {
    ignoreHoverStateChanges: true
  };
  
  store.observe(changes => {
    const { added, deleted, updated }  = changes;

    added.forEach(shape => {
      delete selected[shape.id];
      emitter.emit('createShape', shape);
    });

    deleted.forEach(shape => {
      delete selected[shape.id];
      emitter.emit('deleteShape', shape);
    });

    updated.forEach(({ oldValue, newValue }) => {
      if (!oldValue.state.isSelected && newValue.state.isSelected) {
        // This shape was selected
        selected[newValue.id] = newValue;

      } else if (oldValue.state.isSelected && !newValue.state.isSelected) {
        const stateOnSelection = selected[newValue.id];

        if (!equalsIgnoreState(stateOnSelection, newValue)) {
          emitter.emit('updateShape', newValue, stateOnSelection);
        }
      }
    });
  }, observeOptions);

  function on<E extends keyof CRUDEvents>(event: E, callback: CRUDEvents[E]): Unsubscribe {
    return emitter.on(event, callback);
  }

  return { on };
}