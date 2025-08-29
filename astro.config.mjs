// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://mi-ecommerce.com',
  integrations: [react(), sitemap()],
  output: 'static',
  build: {
    inlineStylesheets: 'never'
  }
});