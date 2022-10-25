import RBush from 'rbush';

import { type Shape, ShapeType, computeArea, intersects } from '../../shapes';

interface IndexedShape {

  minX: number,

  minY: number,
  
  maxX: number,
  
  maxY: number,
  
  shape: Shape

} 

export default class SpatialTree {
  
  tree: RBush<IndexedShape>;
 
  constructor() {
   this.tree = new RBush();
  }

  all = () =>
    this.tree.all().map(item => item.shape);

  clear = () =>
    this.tree.clear();

  insert = (shape: Shape) => {
    const { minX, minY, maxX, maxY } = shape.geometry.bounds;
    this.tree.insert({ minX, minY, maxX, maxY, shape});
  }

  remove = (shape: Shape) => {
    const item = {
      ...shape.geometry.bounds,
      shape
    }

    this.tree.remove(item, (a, b) =>
      a.shape.id === b.shape.id);
  }

  update = (previous: Shape, shape: Shape) => {
    this.remove(previous);
    this.insert(shape);
  }

  set = (shapes: Shape[], clear: boolean = true) => {
    if (clear)
      this.tree.clear();
    
    this.tree.load(shapes.map(shape => {
      const { minX, minY, maxX, maxY } = shape.geometry.bounds;
      return { minX, minY, maxX, maxY, shape };
    }));
  }

  getAt = (x: number, y: number): (Shape | null) => {
    const idxHits = this.tree.search({
      minX: x,
      minY: y,
      maxX: x,
      maxY: y
    }).map(item => item.shape);

    // Exact hit test on shape (not needed for rectangles!)
    const exactHits = idxHits.filter(shape => {
      if (shape.type === ShapeType.RECTANGLE) {
        return true; 
      } else {
        return intersects(shape, x, y);
      }
    });

    // Get smallest shape
    if (exactHits.length > 0) {
      exactHits.sort((a, b) => computeArea(a) - computeArea(b));
      return exactHits[0];
    }
  }

  size = () =>
    this.tree.all().length;

}