import type OpenSeadragon from 'openseadragon';
import type { APIOptions } from './APIOptions';
import { Store } from '@annotorious/core';
import { parseW3C, type WebAnnotation } from '@annotorious/formats';
import OSDPixiImageAnnotationLayer from './pixi/OSDPixiImageAnnotationLayer.svelte';
import OSDSVGDrawingLayer from './drawing/OSDSVGDrawingLayer.svelte';

export class API {
  annotationLayer: OSDPixiImageAnnotationLayer;

  drawingLayer: OSDSVGDrawingLayer;

  constructor(viewer: OpenSeadragon.Viewer, opts: APIOptions) {
    this.annotationLayer = new OSDPixiImageAnnotationLayer({
      target: viewer.container,
      props: { viewer }
    });

    this.drawingLayer = new OSDSVGDrawingLayer({
      target: viewer.container,
      props: { viewer }
    });
  }

  loadAnnotations = (url: string) => fetch(url)
    .then(response => response.json()).then((annotations: WebAnnotation[]) => {
      this.setAnnotations(annotations);
      return annotations;
    });

  setAnnotations = (annotations: WebAnnotation[]) => {
    const { parsed } = parseW3C(annotations);
    Store.set(parsed);
  };
}
