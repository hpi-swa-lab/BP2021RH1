import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import type { Plugin, PluginBuild } from 'esbuild';
import path from 'path';

const splitPackages = ['@mui/icons-material', '@mui/material'];
const reactPlugins = [
  [
    '@swc/plugin-transform-imports',
    Object.fromEntries(
      splitPackages.map(splitPackages => [
        splitPackages,
        { transform: `${splitPackages}/{{member}}` },
      ])
    ),
  ],
] as [string, Record<string, any>][];

const splitPackagesPlugin: Plugin = {
  name: 'Split Packages',
  setup: function (build: PluginBuild): void | Promise<void> {
    const filter = new RegExp(`^(${splitPackages.join('|')})$`);
    build.onResolve({ filter }, args => {
      return args.importer.includes(path.resolve(__dirname, 'src')) ? { external: true } : null;
    });
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({ plugins: reactPlugins })],
  envDir: 'environments',
  server: {
    port: 3000,
  },
  optimizeDeps: {
    esbuildOptions: { plugins: [splitPackagesPlugin] },
  },
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-router-dom', 'react-dom'],
          apollo: ['@apollo/client'],
          mui: ['@mui/icons-material', '@mui/material'],
          'mui-x-data-grid': ['@mui/x-data-grid'],
          'react-date-range': ['react-date-range'],
          'react-image-editor': ['@toast-ui/react-image-editor'],
          'jodit-react': ['jodit-react'],
        },
      },
    },
  },
});