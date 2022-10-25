import { ToolHandle } from '..';
import type { Rectangle } from '../../shapes';

export const editRectangle = (rect: Rectangle, handle: ToolHandle, delta: number[]): Rectangle => {
  const initialBounds = rect.geometry.bounds;

  let [x0, y0] = [initialBounds.minX, initialBounds.minY];
  let [x1, y1] = [initialBounds.maxX, initialBounds.maxY];

  const [dx, dy] = delta;

  if (handle === ToolHandle.SHAPE) {
    x0 += dx;
    x1 += dx;
    y0 += dy;
    y1 += dy;
  } else {
    switch (handle) {
      case ToolHandle.TOP:
      case ToolHandle.TOP_LEFT:
      case ToolHandle.TOP_RIGHT: {
        y0 += dy;
        break;
      }

      case ToolHandle.BOTTOM:
      case ToolHandle.BOTTOM_LEFT:
      case ToolHandle.BOTTOM_RIGHT: {
        y1 += dy;
        break;
      }
    }

    switch (handle) {
      case ToolHandle.LEFT:
      case ToolHandle.TOP_LEFT:
      case ToolHandle.BOTTOM_LEFT: {
        x0 += dx;
        break;
      }

      case ToolHandle.RIGHT:
      case ToolHandle.TOP_RIGHT:
      case ToolHandle.BOTTOM_RIGHT: {
        x1 += dx;
        break;
      }
    }
  }

  return {
    ...rect,
    geometry: {
      x: x0,
      y: y0,
      w: x1 - x0,
      h: y1 - y0,
      bounds: {
        minX: x0,
        minY: y0,
        maxX: x1,
        maxY: y1
      }
    }
  };
};
