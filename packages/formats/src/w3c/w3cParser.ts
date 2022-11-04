import { nanoid } from 'nanoid';
import { type Shape, ShapeType } from '@annotorious/annotorious';
import { parseMediaFragment } from '../mediafragments';
import { parseSVG } from '../svg';
import type { WebAnnotation } from '.';

export const parseW3C = (
  annotations: WebAnnotation[],
  invertY: boolean = false
): { parsed: any[]; failed: WebAnnotation[] } =>
  annotations.reduce(
    (result, annotation) => {
      const { id, body } = annotation;

      const target = Array.isArray(annotation.target) ? annotation.target[0] : annotation.target;

      const selector = Array.isArray(target.selector) ? target.selector[0] : target.selector;

      let shape: Shape;

      if (selector.type === 'FragmentSelector') {
        shape = {
          id: id || nanoid(),
          type: ShapeType.RECTANGLE,
          data: { body },
          geometry: parseMediaFragment(selector.value, invertY),
          state: {}
        };
      } else if (selector.type === 'SvgSelector') {
        const parsed = parseSVG(selector.value);
        if (parsed) {
          shape = {
            id: id || nanoid(),
            type: parsed.type,
            data: { body },
            geometry: {
              ...parsed.geometry
            },
            state: {}
          };
        }
      } else {
        console.error(`Unknown selector type: ${selector.type}`);
      }

      return shape
        ? {
            parsed: [...result.parsed, shape],
            failed: result.failed
          }
        : {
            parsed: result.parsed,
            failed: [...result.failed, annotation]
          };
    },
    { parsed: [], failed: [] }
  );
