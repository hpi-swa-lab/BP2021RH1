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
  upload:
    env("AWS_ENABLED", "false") === "true"
      ? {
          config: {
            provider: "strapi-provider-upload-aws-s3-advanced",
            providerOptions: {
              accessKeyId: env("AWS_ACCESS_KEY_ID"),
              secretAccessKey: env("AWS_ACCESS_SECRET"),
              region: env("AWS_REGION"),
              params: {
                bucket: env("AWS_BUCKET_NAME"),
                // acl: env("AWS_BUCKET_ACL"),
              },
              baseUrl: env("CDN_BASE_URL"), // e.g. "https://cdn.example.com", this is stored in strapi's database to point to the file
              // prefix: env("BUCKET_PREFIX"), // e.g. "strapi-assets". If BUCKET_PREFIX contains leading or trailing slashes, they are removed internally to construct the URL safely
            },
            // These parameters could solve issues with ACL public-read access — see [this issue](https://github.com/strapi/strapi/issues/5868) for details
            actionOptions: {
              upload: {
                ACL: null,
              },
              uploadStream: {
                ACL: null,
              },
            },
          },
        }
      : undefined,
});
