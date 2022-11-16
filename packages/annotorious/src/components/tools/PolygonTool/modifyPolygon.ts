import type { Polygon } from '../../../shapes';
import type { ToolHandle } from '../ToolHandle';
import { boundsFromPoints } from '../../../shapes';

export const modifyPolygon = (
  polygon: Polygon,
  handle: ToolHandle,
  delta: number[]
): Polygon => {

  const points = polygon.geometry.points.map(([ x, y ]) => ([ x + delta[0], y + delta[1] ]));

  const bounds = boundsFromPoints(points);

  return {
    ...polygon,
    geometry: {
      points, bounds
    }
  };

}