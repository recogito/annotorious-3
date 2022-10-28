import { createNanoEvents, type Emitter } from 'nanoevents';
import { Selection, Store } from '@annotorious/core';
import { parseW3C, serializeW3C, type WebAnnotation } from '@annotorious/formats';
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
      if (value.length > 0) {
        // For the time being, assume, the selection is always of length 1
        const annotation = serializeW3C(value[0]);
        this.emitter.emit('selectAnnotation', annotation);
      }
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

  on<E extends keyof AnnotoriousEvents>(event: E, callback: AnnotoriousEvents[E]) {
    this.emitter.on(event, callback);
  }
}
