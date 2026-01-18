/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{js,ts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/tests/**', // Exclude Playwright test directory
      '**/*.e2e.spec.ts',
      '**/*.e2e.spec.js'
    ],
  },
});
