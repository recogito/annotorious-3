<script>
  import { onMount } from 'svelte';

  import WMTS from 'openseadragon-wmts/src';

  export let viewer;
  export let url;

  let map;

  onMount(async () => {
    map = await WMTS(viewer, { url });
  });
</script>

{#if map}
  <slot viewer={viewer} map={map} />
{/if}