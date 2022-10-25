import type { Shape } from '@annotorious/core';
import type { AnnotationBody } from './WebAnnotation';

export const getBodies = (shape: Shape, purpose: string): AnnotationBody[] => {
  if (shape.data) {
    return Array.isArray(shape.data)
      ? // Body array - filter by purpose
        shape.data.filter((b) => b.purpose === purpose)
      : // Single body - return if it matches, or []
      shape.data.purpose === purpose
      ? [shape.data]
      : [];
  } else {
    return [];
  }
};

export const getFirstBody = (shape: Shape, purpose: string): AnnotationBody | null => {
  const bodies = getBodies(shape, purpose);
  return bodies.length > 0 ? bodies[0] : null;
};

export const upsertFirst = (shape: Shape, updated: AnnotationBody): Shape => {
  let updatedBody: AnnotationBody | AnnotationBody[];

  if (Array.isArray(shape.data.body)) {
    const existing = shape.data.body.find((b) => b.purpose === updated.purpose);
    if (existing) {
      updatedBody = shape.data.body.map((b) => (b.purpose === updated.purpose ? updated : b));
    } else {
      updatedBody = [...shape.data.body, updated];
    }
  } else {
    if (shape.data.body.purpose === updated.purpose) {
      updatedBody = updated;
    } else {
      updatedBody = [shape.data.body, updated];
    }
  }

  return {
    ...shape,
    data: {
      ...shape.data,
      body: updatedBody
    }
  };
};
