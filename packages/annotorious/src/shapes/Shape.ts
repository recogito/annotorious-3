export interface Shape {
  id: string;

  type: ShapeType;

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
  isHovered?: boolean;

  isSelected?: boolean;

  isLockedBy?: string;

  props?: Object;
}
