/* eslint-disable no-unused-vars */
module.exports = ({ env }) => ({
  // disable i18n (all content is explicitly german as it's a german photo archive)
  i18n: false,
  // https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/optional/plugins.html#graphql-configuration
  graphql: {
    enabled: true,
    config: {
      endpoint: "/graphql",
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
  "bulk-import": {
    enabled: true,
    resolve: "./src/plugins/bulk-import",
  },
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
    },
  },
  sentry: {
    enabled: !!env("SENTRY_DSN"),
    config: {
      dsn: env("SENTRY_DSN"),
    },
  },
  email: {
    config: {
      provider: env("EMAIL_PROVIDER"),
      providerOptions: {
        host: env("EMAIL_SMTP_HOST"),
        port: env("EMAIL_SMTP_PORT"),
        auth: {
          user: env("EMAIL_SMTP_USER"),
          pass: env("EMAIL_SMTP_PASS"),
        },
      },
      settings: {
        defaultFrom: env("EMAIL_ADDRESS_FROM"),
        defaultReplyTo: env("EMAIL_ADDRESS_REPLY"),
        testAddress: env("TEST_ADDRESS"),
      },
    },
  },
});
