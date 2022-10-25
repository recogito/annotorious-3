import { describe, it, expect } from 'vitest';
import { Shapes } from './fixtures';
import { ShapeIndex } from '@/state';

describe('ShapeIndex', () => {
  it('should insert shapes correctly', () => {
    const index = new ShapeIndex();
    index.set(Shapes);
    expect(index.size()).toBe(2);
  });

  it('should delete shapes correctly', () => {
    const index = new ShapeIndex();

    index.set(Shapes);
    expect(index.size()).toBe(2);

    index.clear();
    expect(index.size()).toBe(0);
  });

  it('should add a shape correctly', () => {
    const index = new ShapeIndex();

    index.add(Shapes[0]);
    expect(index.size()).toBe(1);

    index.add(Shapes[1]);
    expect(index.size()).toBe(2);
  });

  it('should update a shape correctly', () => {
    const index = new ShapeIndex();
    index.set(Shapes);
    expect(index.size()).toBe(2);

    const updated = { ...Shapes[0], data: 'updated' };
    index.update(Shapes[0], updated);

    expect(index.size()).toBe(2);

    const shape = index.get(updated.id);
    expect(shape?.data).toBe('updated');
  });

  it('should delete a shape correctly', () => {
    const index = new ShapeIndex();
    index.set(Shapes);
    expect(index.size()).toBe(2);

    index.remove(Shapes[0]);
    expect(index.size()).toBe(1);
  });

  it('should delete a shape correctly by ID', () => {
    const index = new ShapeIndex();
    index.set(Shapes);
    expect(index.size()).toBe(2);

    index.remove(Shapes[0].id);
    expect(index.size()).toBe(1);
  });
});
