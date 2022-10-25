import { type Bounds, boundsFromPoints, ShapeType } from '../../../core/src/shapes';

interface SVGGeometry {
  type: ShapeType;

  geometry: {
    [key: string]: any;

    bounds: Bounds;
  };
}

export const parseSVG = (valueOrSelector: string | { value: string }): SVGGeometry => {
  const value = typeof valueOrSelector === 'string' ? valueOrSelector : valueOrSelector.value;

  // TODO hack for testing - need to port the original Annotorious code for this
  const [a, b, str] = value.match(/(<polygon points=")([^"]*)/) || [];

  if (!str) return;

  const points = str.split(' ').map((p) => p.split(',').map(parseFloat));

  return {
    type: ShapeType.POLYGON,
    geometry: {
      points,
      bounds: boundsFromPoints(points)
    }
  };
};
