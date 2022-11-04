import { describe, it, expect } from 'vitest';
import SpatialTree from '@/state/store/spatialTree';
import { Shapes } from './fixtures';

describe('SpatialTree', () => {
  it('should insert shapes correctly', () => {
    const tree = new SpatialTree();

    Shapes.forEach((s) => tree.insert(s));

    expect(tree.size()).toBe(2);
  });

  it('should properly remove shapes', () => {
    const tree = new SpatialTree();

    Shapes.forEach((s) => tree.insert(s));
    expect(tree.size()).toBe(2);

    tree.remove(Shapes[0]);

    expect(tree.size()).toBe(1);
    expect(tree.all()[0].id).toEqual(Shapes[1].id);
  });

  it('should do correct hit tests', () => {
    const tree = new SpatialTree();

    Shapes.forEach((s) => tree.insert(s));

    const hit = tree.getAt(160, 120);

    expect(hit).toBeDefined();
    expect(hit?.id).toBe(Shapes[0].id);
  });
});
