import { createNanoEvents, type Emitter } from 'nanoevents';
import { Env, Hover, Selection, Store, CRUDAdapter } from '@annotorious/annotorious';
import type { User, Shape } from '@annotorious/annotorious';
import { parseW3C, serializeW3C, type WebAnnotation } from '@annotorious/formats';
import type { APIOptions } from './APIOptions';
import type { APIEvents } from './APIEvents';
import { OsdPixiImageAnnotationLayer, OsdSvgDrawingLayer } from '../components';
import type OpenSeadragon from 'openseadragon';

export class API {
  annotationLayer: OsdPixiImageAnnotationLayer;

  drawingLayer: OsdSvgDrawingLayer;

  emitter: Emitter<APIEvents>;

  crud: CRUDAdapter;

  constructor(viewer: OpenSeadragon.Viewer, opts: APIOptions) {
    const source =
      viewer.world.getItemAt(0).source['@id'] ||
      new URL(viewer.world.getItemAt(0).source.url, document.baseURI).href;

    this.annotationLayer = new OsdPixiImageAnnotationLayer({
      target: viewer.element,
      props: { viewer }
    });

    this.drawingLayer = new OsdSvgDrawingLayer({
      target: viewer.element,
      props: { viewer }
    });

    window.addEventListener('keydown', (evt: KeyboardEvent) => {
      if (evt.key === 'Shift') this.drawingLayer.$set({ drawingEnabled: true });
    });

    window.addEventListener('keyup', (evt: KeyboardEvent) => {
      if (evt.key === 'Shift') this.drawingLayer.$set({ drawingEnabled: false });
    });

    this.emitter = createNanoEvents<APIEvents>();

    let currentHover: Shape = null;

    Selection.subscribe((shapes) => {
      const annotations = shapes.map((s) => serializeW3C(s, source));

      // Legacy interop
      if (annotations.length > 0) {
        this.emitter.emit('selectAnnotation', annotations[annotations.length - 1]);
      }
    });

    Hover.subscribe(({ shape, originalEvent }) => {
      if (shape) {
        if (shape.id !== currentHover?.id) {
          if (currentHover) {
            // Emit leave event first
            this.emitter.emit(
              'mouseLeaveAnnotation',
              serializeW3C(currentHover, source),
              originalEvent
            );
          }

          this.emitter.emit('mouseEnterAnnotation', serializeW3C(shape, source), originalEvent);
          currentHover = shape;
        }
      } else if (currentHover) {
        this.emitter.emit(
          'mouseLeaveAnnotation',
          serializeW3C(currentHover, source),
          originalEvent
        );
        currentHover = null;
      }
    });

    this.crud = new CRUDAdapter(Store);

    this.crud.on('createShape', (shape) =>
      this.emitter.emit('createAnnotation', serializeW3C(shape, source))
    );

    this.crud.on('deleteShape', (shape) =>
      this.emitter.emit('deleteAnnotation', serializeW3C(shape, source))
    );

    this.crud.on('updateShape', (shape, previous) =>
      this.emitter.emit(
        'updateAnnotation',
        serializeW3C(shape, source),
        serializeW3C(previous, source)
      )
    );
  }

  addAnnotation = (annotation: WebAnnotation) => {
    const { parsed } = parseW3C([annotation]);

    if (parsed.length === 1) {
      this.crud.enabled = false;
      Store.add(parsed[0]);
      this.crud.enabled = true;
    } else {
      console.error('Invalid annotation', annotation);
    }
  };

  clearAnnotations = () => {
    this.crud.enabled = false;
    Store.clear();
    this.crud.enabled = true;
  };

  loadAnnotations = (url: string) =>
    fetch(url)
      .then((response) => response.json())
      .then((annotations: WebAnnotation[]) => {
        this.setAnnotations(annotations);
        return annotations;
      });

  removeAnnotation = (arg: string | WebAnnotation) => {
    const id = typeof arg === 'string' ? arg : arg.id;

    this.crud.enabled = false;
    Store.remove(id);
    this.crud.enabled = true;
  };

  selectAnnotation = (arg: WebAnnotation | string) => {
    const id = typeof arg === 'string' ? arg : arg.id;
    Selection.select(id);
  };

  setAnnotations = (annotations: WebAnnotation[]) => {
    const { parsed } = parseW3C(annotations);

    this.crud.enabled = false;
    Store.set(parsed);
    this.crud.enabled = true;
  };

  setAuthInfo = (auth: User | undefined) => (Env.currentUser = auth);

  updateAnnotation = (arg: WebAnnotation | string, updated: WebAnnotation) => {
    const id = typeof arg === 'string' ? arg : arg.id;

    const { parsed } = parseW3C([updated]);

    if (parsed.length === 1) {
      Store.update(id, parsed[0]);
    } else {
      console.error('Invalid annotation', updated);
    }
  };

  on<E extends keyof APIEvents>(event: E, callback: APIEvents[E]) {
    this.emitter.on(event, callback);
  }
}
