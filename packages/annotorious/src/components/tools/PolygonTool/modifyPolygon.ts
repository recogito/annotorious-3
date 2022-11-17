import type { Polygon } from '../../../shapes';
import { ToolHandle } from '../ToolHandle';
import { boundsFromPoints } from '../../../shapes';

export const modifyPolygon = (polygon: Polygon, handle: ToolHandle, delta: number[]): Polygon => {
  let points: [number, number][];

  if (handle === ToolHandle.SHAPE) {
    points = polygon.geometry.points.map(([x, y]) => [x + delta[0], y + delta[1]]);
  } else {
    points = polygon.geometry.points.map(([x, y], idx) =>
      handle === ToolHandle(idx) ? [x + delta[0], y + delta[1]] : [x, y]
    );
  }

  const bounds = boundsFromPoints(points);

  return {
    ...polygon,
    geometry: {
      points,
      bounds
    }
  };
};
