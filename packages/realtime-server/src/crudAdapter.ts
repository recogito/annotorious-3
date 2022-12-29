import equal from 'deep-equal';

const stripState = (shape: { state: Object }) => {
  const { state, ...rest } = shape;
  return rest;
};

const equalsIgnoreState = (a: { state: Object }, b: { state: Object }): boolean => {
  const statelessA = stripState(a);
  const statelessB = stripState(b);

  return equal(statelessA, statelessB);
};

export const observe = (storage, source) => { 

  const selected: { [key: string]: Object } = {};

  const stripHover = obj => {
    const clone = { ...obj, state: {...obj.state } };
    delete clone.state['isHovered'];
    return clone;
  }
  
  return changes => {

    const { added, deleted, updated } = changes;

    added.forEach((shape) => {
      if (!shape.state.isSelectedBy) {
        delete selected[shape.id];
        storage.onCreate(shape, source);
      }
    });

    deleted.forEach((shape) => {  
      delete selected[shape.id];
      storage.onDelete(shape, source);
    });

    updated.forEach(({ oldValue, newValue }) => {
      const o = oldValue && stripHover(oldValue);
      const n = newValue && stripHover(newValue);

      if (!o.state.isSelectedBy && n.state.isSelectedBy) {
        // This shape was selected
        selected[n.id] = n;
      } else if (o.state.isSelectedBy && !n.state.isSelectedBy) {
        const stateOnSelection = selected[n.id];

        if (stateOnSelection) {
          // @ts-ignore
          if (!equalsIgnoreState(stateOnSelection, n))
            storage.onUpdate(n, stateOnSelection, source);
        } else {
          storage.onCreate(n, source);
        }
      } else if (!o.state.isSelectedBy && !n.state.isSelectedBy) {
        // This annotation was updated programmatically, without a selection in between
        storage.onUpdate(n, o, source);
      }
    });
  }

}