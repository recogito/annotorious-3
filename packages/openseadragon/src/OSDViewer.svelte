<script>
  import OpenSeadragon from 'openseadragon';
  import { onMount } from 'svelte';

  let element, viewer;

  onMount(() => {
    const config = $$props.config || {};

    viewer = OpenSeadragon({
      prefixUrl: 'http://openseadragon.github.io/openseadragon/images/',
      ...config,
      element
    });
  });
</script>

<div class={$$props.class} id={$$props.id}  bind:this={element}>
  {#if viewer}
    <slot viewer={viewer} />
  {/if}
</div>