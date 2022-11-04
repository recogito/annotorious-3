<script lang="ts">
  import * as PIXI from 'pixi.js';

  import { ShapeType, simplify, type Polygon, type Rectangle, type Shape } from '@annotorious/annotorious';
  import BaseAnnotationLayer from '../pixi/OSDPixiBaseAnnotationLayer.svelte';  
  import { latLonShapeToImageRegion } from './transform';

  export let viewer: any;
  export let map: any;

  const drawShape = (shape: Shape) => {
    const translated = latLonShapeToImageRegion(shape, map);

    if (translated.type === ShapeType.RECTANGLE) {
      const { x, y, w, h } = (translated as Rectangle).geometry;
      
      const rect = new PIXI.Graphics();

      rect.beginFill(0x1a73e8, 0.45);
      rect.drawRect(x, y, w, - h);
      rect.endFill();

      return rect;
    } else if (translated.type === ShapeType.POLYGON) {
      const simplified = simplify(translated as Polygon);
      const flattend = simplified.geometry.points.reduce((flat, xy) => ([...flat, ...xy]), []);  
      
      const poly = new PIXI.Graphics();
      poly.beginFill(0x1a73e8, 0.45);
      poly.drawPolygon(flattend);
      poly.endFill();

      return poly;
    }
  }

  const viewportToLayerPoint = (vpt: OpenSeadragon.Point, viewer: OpenSeadragon.Viewer) => {
    const [x, y] = map.viewportToLonLat([vpt.x, vpt.y]);
    return { x, y };
  }

  const viewportToLayerDelta = (viewportBounds: OpenSeadragon.Rect, scale: number) => ({
    dx: - (viewportBounds.x - map.imageRegion.x) * scale,
    dy: - (viewportBounds.y - map.imageRegion.y) * scale
  });
</script>

<BaseAnnotationLayer
  viewer={viewer}
  config={{
    drawShape, 
    viewportToLayerPoint,
    viewportToLayerDelta
  }}
  on:enterShape
  on:leaveShape />