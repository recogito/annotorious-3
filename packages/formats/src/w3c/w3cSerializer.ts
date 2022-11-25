import { ShapeType, type RectangleGeometry, type Shape } from '@annotorious/annotorious';
import { toSVGSelector, toMediaFragmentSelector } from '..';
import type { WebAnnotation } from './WebAnnotation';

export const serializeW3C = (s: Shape): WebAnnotation => {
  const selector = s.type == ShapeType.RECTANGLE ?
    toMediaFragmentSelector(s.geometry as RectangleGeometry) :
    toSVGSelector(s);

  return {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    id: s.id,
    type: 'Annotation',
    body: s.data?.body,
    target: {
      source: '',
      selector
    }
  };
};
