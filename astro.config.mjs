import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://notes.curtisbarnard.com',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'catppuccin-frappe',
      wrap: true,
    }
  }
});
