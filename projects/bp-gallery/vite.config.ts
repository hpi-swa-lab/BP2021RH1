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
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-router-dom', 'react-dom'],
          apollo: ['@apollo/client'],
          mui: ['@mui/icons-material', '@mui/material', '@mui/x-data-grid'],
          'react-date-range': ['react-date-range'],
          'react-image-editor': ['@toast-ui/react-image-editor'],
          'jodit-react': ['jodit-react'],
        },
      },
    },
  },
});
