import { createNanoEvents, type Emitter } from 'nanoevents';
import { Selection, Store } from '@annotorious/core';
import { parseW3C, type WebAnnotation } from '@annotorious/formats';
import type { APIOptions } from './APIOptions';
import OSDPixiImageAnnotationLayer from '../pixi/OSDPixiImageAnnotationLayer.svelte';
import OSDSVGDrawingLayer from '../drawing/OSDSVGDrawingLayer.svelte';

interface AnnotoriousEvents {

  selectAnnotation: (annotation: WebAnnotation) => void

}

export class API {
  annotationLayer: OSDPixiImageAnnotationLayer;

  drawingLayer: OSDSVGDrawingLayer;

  emitter: Emitter<AnnotoriousEvents>;

  constructor(viewer: OpenSeadragon.Viewer, opts: APIOptions) {
    this.annotationLayer = new OSDPixiImageAnnotationLayer({
      target: viewer.element,
      props: { viewer },
    });

    this.drawingLayer = new OSDSVGDrawingLayer({
      target: viewer.element,
      props: { viewer }
    });

    this.emitter = createNanoEvents<AnnotoriousEvents>();
    
    Selection.subscribe(value => {
      console.log('select', value);
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
