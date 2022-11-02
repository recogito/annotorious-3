import type { Shape } from '../../shapes';

export interface CRUDEvents {

  createShape: (shape: Shape) => void

  deleteShape: (shape: Shape) => void

  updateShape: (shape: Shape, previous: Shape) => void

}