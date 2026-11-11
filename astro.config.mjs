import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://onnebr.com',
  build: { format: 'directory' },
  trailingSlash: 'always',
});
