// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Fetch a page when its link is hovered/touched, so the click doesn't wait on the network.
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  // work/iris.html instead of work/iris/index.html: Netlify then serves /work/iris directly instead of 301-ing to /work/iris/.
  build: { format: "file" },
  vite: {
    plugins: [tailwindcss()]
  }
});