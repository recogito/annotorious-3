<script type="ts">
  import { onMount } from 'svelte';
  import OpenSeadragon from 'openseadragon';
  import OSDSVGOverlay from './OsdSvgOverlay.svelte';

  export let viewer: OpenSeadragon.Viewer;

  let overlay: OSDSVGOverlay;

  /**
   * The view transform computes the CSS transform that aligns
   * the SVG layer with the current OpenSeadradgon viewer state.
   */
  const viewTransform = () => {
    const containerWidth = viewer.viewport.getContainerSize().x;
    const zoom = viewer.viewport.getZoom(true);
    const flipped = viewer.viewport.getFlip();

    const p = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(0, 0), true);
    if (flipped)
      // @ts-ignore We're using an undocumented OSD method here
      p.x = viewer.viewport._containerInnerSize.x - p.x;

    const scaleY = zoom * containerWidth / viewer.world.getContentFactor();
    const scaleX = flipped ? - scaleY : scaleY;
    const rotation = viewer.viewport.getRotation();

    return `translate(${p.x}, ${p.y}) scale(${scaleX}, ${scaleY}) rotate(${rotation})`;
  }

  /**
   * The screen transform computes the image coordinates that correspond
   * to the given screen pointer coordinates.
   */
  const screenTransform = (px: number, py: number) => {
    const {x, y} = viewer.viewport.viewerElementToImageCoordinates(new OpenSeadragon.Point(px, py));
    return [x, y];
  }

  onMount(() => {
    overlay = new OSDSVGOverlay({
      target: viewer.element.querySelector('.openseadragon-canvas'),
      props: {
        viewer,
        viewTransform,
        screenTransform
      }
    });
  });

  $: overlay && overlay.$set({ viewer, viewTransform, screenTransform });
</script>

