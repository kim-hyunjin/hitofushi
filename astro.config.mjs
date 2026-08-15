import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://kim-hyunjin.github.io',
  base: '/hitofushi',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
