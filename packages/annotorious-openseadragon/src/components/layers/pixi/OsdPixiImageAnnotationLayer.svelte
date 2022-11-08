<script lang="ts">
  import * as PIXI from 'pixi.js';
  import type OpenSeadragon from 'openseadragon';
  import { Env, ShapeType, simplifyPolygon, type Polygon, type Rectangle, type Shape } from '@annotorious/annotorious';
  import BaseAnnotationLayer from './OsdPixiBaseAnnotationLayer.svelte';

  export let viewer: OpenSeadragon.Viewer;

  const getColor = (s: Shape) => {
    if (s.state.isSelectedBy && s.state.isSelectedBy !== Env.currentUser.id) {
      return 0xff0000;
    } else {
      return 0x1a73e8;
    }
  }

  const drawShape = (shape: Shape) => {
    if (shape.type === ShapeType.RECTANGLE) {
      const { x, y, w, h } = (shape as Rectangle).geometry;

      const rect = new PIXI.Graphics();
      // rect.beginFill(0x1a73e8, 0.25);
      rect.beginFill(getColor(shape), 0.25);
      rect.drawRect(x, y, w, h);
      rect.endFill();

      return rect;
    } else if (shape.type === ShapeType.POLYGON) {
      const simplified = simplifyPolygon(shape as Polygon);
      const flattend = simplified.geometry.points.reduce((flat, xy) => ([...flat, ...xy]), []);   

      const poly = new PIXI.Graphics();
      // poly.beginFill(0x1a73e8, 0.25);
      poly.beginFill(getColor(shape), 0.25);
      poly.drawPolygon(flattend);
      poly.endFill();

      return poly;
    }
  }

  const viewportToLayerPoint = (vpt: OpenSeadragon.Point, viewer: OpenSeadragon.Viewer) =>
    viewer.viewport.viewportToImageCoordinates(vpt.x, vpt.y);

  const viewportToLayerDelta = (viewportBounds: OpenSeadragon.Rect, scale: number) => ({
    dx: - viewportBounds.x * scale,
    dy: - viewportBounds.y * scale
  });
</script>

<BaseAnnotationLayer
  viewer={viewer}
  config={{
    drawShape, 
    viewportToLayerPoint,
    viewportToLayerDelta
  }} />