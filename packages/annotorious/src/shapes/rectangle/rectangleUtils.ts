import { registerShapeUtil, ShapeType } from '..';
import type { Rectangle, ShapeUtil } from '..';

export const RectangleUtil: ShapeUtil<Rectangle> = {
  area: (rect: Rectangle): number => rect.geometry.w * rect.geometry.h,

  intersects: (rect: Rectangle, x: number, y: number): boolean =>
    x >= rect.geometry.x &&
    x <= rect.geometry.x + rect.geometry.w &&
    y >= rect.geometry.y &&
    y <= rect.geometry.y + rect.geometry.h
};

registerShapeUtil(ShapeType.RECTANGLE, RectangleUtil);
