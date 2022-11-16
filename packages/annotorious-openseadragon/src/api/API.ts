import { createNanoEvents, type Emitter } from 'nanoevents';
import { type User, Env, Hover, type Shape, Selection, Store, CRUDAdapter } from '@annotorious/annotorious';
import { parseW3C, serializeW3C, type WebAnnotation } from '@annotorious/formats';
import type { APIOptions } from './APIOptions';
import type { APIEvents } from './APIEvents';
import { OsdPixiImageAnnotationLayer, OsdSvgDrawingLayer } from '../components';

export class API {
  annotationLayer: OsdPixiImageAnnotationLayer;

  drawingLayer: OsdSvgDrawingLayer;

  emitter: Emitter<APIEvents>;

  crud: CRUDAdapter;

  constructor(viewer: OpenSeadragon.Viewer, opts: APIOptions) {    
    this.annotationLayer = new OsdPixiImageAnnotationLayer({
      target: viewer.element,
      props: { viewer }
    });

    this.drawingLayer = new OsdSvgDrawingLayer({
      target: viewer.element,
      props: { viewer }
    });

    document.addEventListener('keydown', (evt: KeyboardEvent) => {
      if (evt.key === 'Shift')
        this.drawingLayer.$set({ drawingEnabled: true });
    });

    document.addEventListener('keyup', (evt: KeyboardEvent) => {
      if (evt.key === 'Shift')
        this.drawingLayer.$set({ drawingEnabled: false });
    });

    this.emitter = createNanoEvents<APIEvents>();

    let currentHover: Shape = null;

    Selection.subscribe((shapes) => {
      const annotations = shapes.map(serializeW3C);

      // Legacy interop
      if (annotations.length > 0) {
        this.emitter.emit('selectAnnotation', annotations[annotations.length - 1]);
      }
    });

    Hover.subscribe((hover) => {
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

    this.crud = new CRUDAdapter(Store);

    this.crud.on('createShape', (shape) =>
      this.emitter.emit('createAnnotation', serializeW3C(shape))
    );

    this.crud.on('deleteShape', (shape) =>
      this.emitter.emit('deleteAnnotation', serializeW3C(shape))
    );

    this.crud.on('updateShape', (shape, previous) =>
      this.emitter.emit('updateAnnotation', serializeW3C(shape), serializeW3C(previous))
    );
  }

  addAnnotation = (annotation: WebAnnotation) => {
    const { parsed } = parseW3C([ annotation ]);

    if (parsed.length > 0) {
      this.crud.enabled = false;
      Store.add(parsed[0]);
      this.crud.enabled = true;
    } else {
      console.error('Failed parsing annotation', annotation);
    }
  }

  clearAnnotations = () => {
    this.crud.enabled = false;
    Store.clear();
    this.crud.enabled = true;
  }

  loadAnnotations = (url: string) =>
    fetch(url)
      .then((response) => response.json())
      .then((annotations: WebAnnotation[]) => {
        this.setAnnotations(annotations);
        return annotations;
      });

  setAnnotations = (annotations: WebAnnotation[]) => {
    const { parsed } = parseW3C(annotations);

    this.crud.enabled = false;
    Store.set(parsed);
    this.crud.enabled = true;
  };

  setAuthInfo = (auth: User | undefined) =>
    Env.currentUser = auth;

  on<E extends keyof APIEvents>(event: E, callback: APIEvents[E]) {
    this.emitter.on(event, callback);
  }
}
