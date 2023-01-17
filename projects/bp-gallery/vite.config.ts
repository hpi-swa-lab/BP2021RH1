import react from '@vitejs/plugin-react-swc';
import { defineConfig, PluginOption } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()] as PluginOption[],
  optimizeDeps: {
    include: ['@mui/material', 'tui-image-editor', '@mui/icons-material'],
  },
  envDir: 'environments',
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
});
