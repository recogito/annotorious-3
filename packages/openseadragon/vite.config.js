import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { visualizer } from 'rollup-plugin-visualizer';
import sveltePreprocess from 'svelte-preprocess';

export default defineConfig({
  plugins: [
    svelte({ preprocess: sveltePreprocess() }), 
    visualizer({ filename: './dist/stats.html', template: 'treemap' })
  ],
  server: {
    open: '/test/example/index.html'
  },
  build: {
    sourcemap: true,
    lib: {
      entry: './src/index.ts',
      name: 'Annotorious',
      formats: ['umd'],
      fileName: () => 'annotorious-openseadragon.js',
    },
    rollupOptions: {
      external: ['openseadragon'], // 'pixi.js'], 
      output: {
        assetFileNames: 'annotorious-openseadragon.[ext]',
        globals: {
          'openseadragon': 'OpenSeadragon'
          // 'pixi.js': 'PIXI'
        }
      }
    }
  }
});
