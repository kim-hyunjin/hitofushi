import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

const base = process.env.PUBLIC_BASE_PATH ?? '/';
const site = process.env.PUBLIC_SITE_URL;

export default defineConfig({
  integrations: [preact()],
  output: 'static',
  base,
  site,
  trailingSlash: 'always',
});
