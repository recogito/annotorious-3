var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect } from 'vitest';
import { Store, StoreChangeEvent } from '@/state';
import { Shapes } from './fixtures';
describe('Store', () => {
    it('should insert shapes correctly', () => {
        Store.set(Shapes);
        expect(Store.all().length).toBe(2);
    });
    it('should delete shapes correctly', () => {
        Store.set(Shapes);
        Store.remove(Shapes[0]);
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
        const updated = Object.assign(Object.assign({}, Shapes[0]), { data: 'updated' });
        Store.update(Shapes[0], updated);
        expect(Store.all().length).toBe(2);
        const shape = Store.get(updated.id);
        expect(shape === null || shape === void 0 ? void 0 : shape.data).toBe('updated');
    });
    it('should do correct hit tests', () => {
        Store.clear();
        Store.set(Shapes);
        const hit = Store.getAt(11, 11);
        expect(hit).toBeDefined();
        expect(hit === null || hit === void 0 ? void 0 : hit.id).toBe(Shapes[1].id);
    });
    it('should emit an event when shapes are added', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        Store.clear();
        const result = yield new Promise(resolve => {
            const callback = (event) => {
                resolve(event);
            };
            Store.observe(callback);
            Store.set(Shapes);
        });
        expect((_a = result.added) === null || _a === void 0 ? void 0 : _a.length).toBe(2);
    }));
});
//# sourceMappingURL=store.test.js.map