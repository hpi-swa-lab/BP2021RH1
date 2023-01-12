import react from '@vitejs/plugin-react-swc';
import { defineConfig, PluginOption } from 'vite';

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
});
