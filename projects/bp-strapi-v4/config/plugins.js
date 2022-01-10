/* eslint-disable no-unused-vars */
module.exports = ({ env }) => ({
  // disable i18n (all content is explicitly german as it's a german photo archive)
  i18n: false,
  // https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/optional/plugins.html#graphql-configuration
  graphql: {
    enabled: true,
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      defaultLimit: -1,
      maxLimit: -1,
      apolloServer: {
        tracing: false,
        // https://www.apollographql.com/docs/apollo-server/api/apollo-server/#introspection
        introspection: true,
      },
    },
  },
  'bulk-import': {
    enabled: true,
    resolve: './src/plugins/bulk-import',
  },
});
