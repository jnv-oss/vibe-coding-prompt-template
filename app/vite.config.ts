/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this project as https://<owner>.github.io/<repo>/, not
// at a domain root, so asset URLs need that repo-name prefix. The deploy
// workflow sets GITHUB_PAGES=true only for the build it uploads to Pages;
// local dev and `vite build` outside CI keep the root base.
const base = process.env.GITHUB_PAGES === 'true' ? '/vibe-coding-prompt-template/' : '/';

export default defineConfig({
  base,
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
