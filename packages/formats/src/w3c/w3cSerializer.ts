import type { RectangleGeometry, Shape } from '@annotorious/annotorious';
import type { WebAnnotation } from './WebAnnotation';

export const serializeW3C = (s: Shape): WebAnnotation => {
  const geom = s.geometry as RectangleGeometry;

  return {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    id: s.id,
    type: 'Annotation',
    body: s.data?.body,
    target: {
      source: '',
      selector: {
        type: 'FragmentSelector',
        conformsTo: 'http://www.w3.org/TR/media-frags/',
        value: `xywh=pixel:${geom.x},${geom.y},${geom.w},${geom.h}`
      }
    }
  };
};
