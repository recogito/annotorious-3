import { describe, it, expect } from 'vitest'
import { Store, StoreChangeEvent } from '@/state';
import { Shapes } from './fixtures';

describe('Store', () => {

  it('should insert shapes correctly', () => {
    Store.set(Shapes);
    expect(Store.all().length).toBe(2);
  });

  it('should delete shapes correctly', () => {
    Store.set(Shapes);
    Store.remove(Shapes[0])
    expect(Store.all().length).toBe(1);
    expect(Store.get('1')).toBeUndefined();
    expect(Store.get('2')).toBeDefined();
  });

  it('should add a shape correctly', () => {
    Store.clear();
    Store.add(Shapes[0]);
    expect(Store.all().length).toBe(1);
    expect(Store.get('1')).toBeDefined();
  });

  it('should update a shape correctly', () => {
    Store.clear();
    Store.set(Shapes);
    expect(Store.all().length).toBe(2);

    const updated = { ...Shapes[0], data: 'updated' };
    Store.update(Shapes[0], updated);

    expect(Store.all().length).toBe(2);

    const shape = Store.get(updated.id);
    expect(shape?.data).toBe('updated');
  });

  it('should do correct hit tests', () => {
    Store.clear();
    Store.set(Shapes);

    const hit = Store.getAt(11, 11);
    
    expect(hit).toBeDefined();
    expect(hit?.id).toBe(Shapes[1].id);
  });

  it('should emit an event when shapes are added', async () => {
    Store.clear();

    const result: StoreChangeEvent = await new Promise(resolve => {
      const callback = (event: StoreChangeEvent) => {
        resolve(event);
      }

      Store.observe(callback);
      Store.set(Shapes);
    });

    expect(result.added?.length).toBe(2)
  })

});