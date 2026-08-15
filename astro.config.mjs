import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const base = process.env.PUBLIC_BASE_PATH ?? '/';
const site = process.env.PUBLIC_SITE_URL;

export default defineConfig({
  integrations: [react()],
  output: 'static',
  base,
  site,
  trailingSlash: 'always',

  vite: {
    plugins: [tailwindcss()],
  },
});
