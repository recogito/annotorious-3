import { ShapeType } from '@/shapes';

export const Shapes = [
  {
    id: '1',
    type: ShapeType.POLYGON,
    geometry: {
      points: [
        [110, 110],
        [210, 120],
        [160, 200]
      ],
      bounds: {
        minX: 110,
        maxX: 210,
        minY: 110,
        maxY: 200
      }
    },
    state: {}
  }, {
    id: '2',
    type: ShapeType.RECTANGLE,
    geometry: {
      x: 10,
      y: 10,
      w: 200,
      h: 100,
      bounds: {
        minX: 10,
        minY: 10,
        maxX: 210,
        maxY: 110
      }
    },
    state: {}
  }
]