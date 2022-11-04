import * as Y from 'yjs';

import type { Shape } from '../../shapes';

export default class ShapeIndex {
  doc: Y.Doc;

  map: Y.Map<Shape>;

  constructor() {
    this.doc = new Y.Doc();
    this.map = this.doc.getMap();
  }

  clear = () => {
    const { size } = this.map;

    if (size === 0) return;

    this.doc.transact(() => this.map.forEach((_, key) => this.map.delete(key)));
  };

  set = (shapes: Shape[], clear = true) => {
    if (clear) this.clear();

    this.doc.transact(() => shapes.forEach((shape) => this.map.set(shape.id, shape)));
  };

  add = (shape: Shape) => this.map.set(shape.id, shape);

  all = () => Array.from(this.map.values());

  update = (previous: Shape | string, shape: Shape) => {
    const prevId = typeof previous === 'string' ? previous : previous.id;

    if (prevId === shape.id) {
      this.map.set(shape.id, shape);
    } else {
      this.doc.transact(() => {
        this.map.delete(prevId);
        this.map.set(shape.id, shape);
      });
    }
  };

  bulkUpsert = (shapes: Shape[]) => {
    this.doc.transact(() => {
      shapes.forEach((shape) => {
        this.map.set(shape.id, shape);
      });
    });
  };

  remove = (shape: Shape | string) => {
    if (typeof shape === 'string') this.map.delete(shape);
    else this.map.delete(shape.id);
  };

  get = (id: string): Shape | null => this.map.get(id);

  size = () => this.map.size;

  observe = (callback: (evt: Y.YMapEvent<Shape>, transaction: Y.Transaction) => void) =>
    this.map.observe(callback);
}
