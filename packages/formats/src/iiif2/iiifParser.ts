import { nanoid } from 'nanoid';
import { type Shape, ShapeType } from '@annotorious/core';
import { parseMediaFragment } from '../mediafrags';
import type { IIIFAnnotation } from '.';
import { parseSVG } from '../svg';

export const parseAnnotations = (
  annotations: IIIFAnnotation[]
): { parsed: Shape[]; failed: IIIFAnnotation[] } =>
  annotations.reduce(
    (result, annotation) => {
      const { on, resource } = annotation;

      let shape: Shape;

      if (on.selector['@type'] === 'oa:FragmentSelector') {
        shape = {
          id: annotation['@id'],

          type: ShapeType.RECTANGLE,

          // Bit of a hard-wired hack, assuming Luna data
          data: {
            body: [
              {
                purpose: 'transcribing',
                value: resource.chars
              }
            ]
          },

          geometry: parseMediaFragment(on.selector.value),

          state: {}
        };
      } else if (on.selector['@type'] === 'oa:SvgSelector') {
        const parsed = parseSVG(on.selector.value);
        if (parsed) {
          shape = {
            id: annotation['@id'] || nanoid(),
            type: parsed.type,
            data: {
              body: [
                {
                  purpose: 'transcribing',
                  value: resource.chars
                }
              ]
            },
            geometry: {
              ...parsed.geometry
            },
            state: {}
          };
        }
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
