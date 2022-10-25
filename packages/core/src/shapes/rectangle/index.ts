import { ShapeType, registerShapeUtil } from '..';
import type { Bounds, Geometry, Shape, ShapeUtil } from '..';

export interface Rectangle extends Shape {

  geometry: RectangleGeometry

}

export interface RectangleGeometry extends Geometry {

  x: number

  y: number

  w: number

  h: number,

  bounds: Bounds

}

const RectangleUtil: ShapeUtil<Rectangle> = {

  area: (rect: Rectangle): number =>
    rect.geometry.w * rect.geometry.h,

  intersects: (rect: Rectangle, x: number, y: number): boolean =>
    x >= rect.geometry.x && 
    x <= rect.geometry.x + rect.geometry.w &&
    y >= rect.geometry.y  &&
    y <= rect.geometry.y + rect.geometry.h

}

registerShapeUtil(ShapeType.RECTANGLE, RectangleUtil);