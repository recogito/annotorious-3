import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';

import path from 'path';

export default defineConfig({ 
  test: {}, 
  plugins: [
    svelte({ preprocess: sveltePreprocess() })
  ], 
  resolve:{
    alias:{
      '@' : path.resolve(__dirname, './src')
    }
  },
})