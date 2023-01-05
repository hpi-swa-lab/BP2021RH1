import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import { PluginOption } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()] as PluginOption[],
  envDir: 'environments',
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/setupTests.ts'],
    },
  },
});
