import react from '@vitejs/plugin-react-swc';
import type { Plugin, PluginBuild } from 'esbuild';
import path from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

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

const apiProxy = {
  '/api': {
    target: 'http://127.0.0.1:9000',
    rewrite: (path: string) => path.replace(/^\/api/, ''),
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({ plugins: reactPlugins }),
    ...(mode === 'test' ? [] : [eslint({ cache: false })]),
  ],
  envDir: 'environments',
  server: {
    port: 3000,
    proxy: apiProxy,
  },
  // vite preview serves the build of the e2e tests (environments/.env.test, docs/e2e.md)
  preview: {
    proxy: {
      ...apiProxy,
      '/meilisearch': {
        target: 'http://meilisearch:7700',
        rewrite: path => path.replace(/^\/meilisearch/, ''),
      },
      // Lets the tests read the stack's emails
      '/mailpit': {
        target: 'http://mailpit:8025',
        rewrite: path => path.replace(/^\/mailpit/, ''),
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: { plugins: [splitPackagesPlugin] },
    // bp-graphql is linked from outside node_modules, so Vite would otherwise not convert it from CommonJS
    include: ['bp-graphql'],
  },
  build: {
    outDir: 'build',
    reportCompressedSize: mode !== 'test',
    commonjsOptions: { include: [/bp-graphql/, /node_modules/] },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-router-dom', 'react-dom'],
          apollo: ['@apollo/client'],
          mui: ['@mui/icons-material', '@mui/material'],
          'mui-x-data-grid': ['@mui/x-data-grid'],
          'react-date-range': ['react-date-range'],
          'tui-image-editor': ['tui-image-editor'],
          'jodit-react': ['jodit-react'],
        },
      },
    },
  },
}));
