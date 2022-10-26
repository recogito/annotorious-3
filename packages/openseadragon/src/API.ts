import type OpenSeadragon from 'openseadragon';
import type { APIOptions } from './APIOptions';
import { Store } from '@annotorious/core';
import { parseW3C } from '@annotorious/formats';
import OSDPixiImageAnnotationLayer from './pixi/OSDPixiImageAnnotationLayer.svelte';

export class API {

  anno: OSDPixiImageAnnotationLayer;

  constructor(viewer: OpenSeadragon.Viewer, opts: APIOptions) {
    this.anno = new OSDPixiImageAnnotationLayer({
      target: viewer.container, 
      props: { viewer }
    });
  }

  setAnnotations = (annotations: any[]) => {
    const { parsed } = parseW3C(annotations);
    Store.set(parsed);
  }

}