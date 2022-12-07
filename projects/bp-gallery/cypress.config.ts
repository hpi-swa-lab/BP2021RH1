import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
<<<<<<< HEAD
      // eslint-disable-next-line @typescript-eslint/no-var-requires
=======
      "// eslint-disable-next-line @typescript-eslint/no-var-requires"
>>>>>>> 827815b (Move lintignore to comment in cypress.config.ts)
      return require('./cypress/plugins/index.ts')(on, config)
    },
    baseUrl: 'http://localhost:3000',
  },
})
