import { createNanoEvents, type Emitter } from 'nanoevents';
import { Hover, type Shape, Selection, Store, CRUDAdapter } from '@annotorious/core';
import { parseW3C, serializeW3C, type WebAnnotation } from '@annotorious/formats';
import type { APIOptions } from './APIOptions';
import OSDPixiImageAnnotationLayer from '../pixi/OSDPixiImageAnnotationLayer.svelte';
import OSDSVGDrawingLayer from '../drawing/OSDSVGDrawingLayer.svelte';

interface AnnotoriousEvents {

  // User has changed the selection
  changeSelection: (annotations: WebAnnotation[]) => void

  // Mouse enters the given annotation
  mouseEnterAnnotation: (annotation: WebAnnotation) => void

  // Mouse leaves the given annotation
  mouseLeaveAnnotation: (annotation: WebAnnotation) => void

  // Legacy API, assumes single selection
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

    let currentHover: Shape = null;
    
    Selection.subscribe(shapes => {
      const annotations = shapes.map(serializeW3C);
      this.emitter.emit('changeSelection', annotations);

      // Legacy interop
      if (annotations.length > 0) {
        this.emitter.emit('selectAnnotation', annotations[annotations.length - 1]);
      }
    });

    Hover.subscribe(hover => {
      if (hover) {
        if (hover.shape.id !== currentHover?.id) {
          if (currentHover) {
            // Emit leave event first
            this.emitter.emit('mouseLeaveAnnotation', serializeW3C(currentHover));
          }

          this.emitter.emit('mouseEnterAnnotation', serializeW3C(hover.shape));
          currentHover = hover.shape;
        }
      } else if (currentHover) {
        this.emitter.emit('mouseLeaveAnnotation', serializeW3C(currentHover));
        currentHover = null;
      }
    });

    const crud = CRUDAdapter(Store);

    crud.on('createShape', shape => {
      console.log('create', shape);
    });

    crud.on('deleteShape', shape => {
      console.log('delete', shape);
    })

    crud.on('updateShape', (shape, previous) => {
      console.log('update', previous, 'with', shape);
    })
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
