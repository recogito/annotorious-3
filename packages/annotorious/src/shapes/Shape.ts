import type { AnonymousLocalUser } from '../state/users';

export interface Shape {
  id: string;

  type: ShapeType;

  creator?: string | typeof AnonymousLocalUser; 

  created?: Date;

  data?: any;

  geometry: Geometry;

  state: ShapeState;
}

export enum ShapeType {
  POLYGON = 'POLYGON',

  RECTANGLE = 'RECTANGLE'
}

export interface Geometry {
  bounds: Bounds;
}

export interface Bounds {
  minX: number;

  minY: number;

  maxX: number;

  maxY: number;
}

export interface ShapeState {
  isHoveredBy?: string[];

  isSelectedBy?: string;

  props?: Object;
}
