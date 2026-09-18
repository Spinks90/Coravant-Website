// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

/**
 * /work is marked noindex while it has nothing on it, so it must stay out of
 * the sitemap too. Read the collection here rather than hard-coding, so
 * publishing the first case study fixes both at once.
 */
const hasPublishedCase = (() => {
  try {
    return readdirSync('src/content/cases').some(
      (file) =>
        file.endsWith('.md') &&
        !/^draft:\s*true\s*$/m.test(readFileSync(`src/content/cases/${file}`, 'utf8')),
    );
  } catch {
    return false;
  }
})();

// https://astro.build/config
export default defineConfig({
  site: 'https://www.coravant.co.uk',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    sitemap({
      filter: (page) => hasPublishedCase || !/\/work$/.test(page.replace(/\/$/, '')),
    }),
    icon({ iconDir: 'src/icons' }),
  ],
  vite: { plugins: [tailwindcss()] },
});
