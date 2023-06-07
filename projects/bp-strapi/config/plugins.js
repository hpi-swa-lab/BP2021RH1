/* eslint-disable no-unused-vars */

const dateToTimeStamp = (date) => {
  return Date.parse(date) / 1000;
};

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
  meilisearch:
    env("MEILISEARCH_ENABLED", "false") === "true"
      ? {
          config: {
            host: "localhost:7700",
            apiKey: "",
            picture: {
              transformEntry({ entry }) {
                const transformedEntry = {
                  id: entry.id,
                  likes: entry.likes,
                  descriptions: entry.descriptions.map(
                    (description) => description.text
                  ),
                  comments: entry.comments.map((comment) => comment.text),
                  keyword_tags: entry.keyword_tags
                    .map((tag) => tag.name)
                    .concat(entry.verified_keyword_tags.map((tag) => tag.name)),
                  person_tags: entry.person_tags
                    .map((tag) => tag.name)
                    .concat(entry.verified_person_tags.map((tag) => tag.name)),
                  location_tags: entry.location_tags
                    .map((tag) => tag.name)
                    .concat(
                      entry.verified_location_tags.map((tag) => tag.name)
                    ),
                  face_tags: entry.face_tags.map((tag) => tag.name),
                  collections: entry.collections.map((tag) => tag.name),
                  archive_tag: entry.archive_tag,
                  time_range_tag_start: entry?.time_range_tag
                    ? dateToTimeStamp(entry.time_range_tag.start)
                    : entry.verified_time_range_tag
                    ? dateToTimeStamp(entry.verified_time_range_tag.start)
                    : null,
                  time_range_tag_end: entry?.time_range_tag
                    ? dateToTimeStamp(entry.time_range_tag.end)
                    : entry.verified_time_range_tag
                    ? dateToTimeStamp(entry.verified_time_range_tag.end)
                    : null,
                };

                return transformedEntry;
              },
              settings: {
                filterableAttributes: [
                  "keyword_tags",
                  "location_tags",
                  "time_range_tag_start",
                  "time_range_tag_end",
                  "face_tags",
                  "person_tags",
                  "descriptions",
                  "comments",
                  "collections",
                  "archive_tag",
                  "is_text",
                ],
                sortableAttributes: [
                  "time_range_tag_start",
                  "time_range_tag_end",
                  "likes",
                ],
                displayedAttributes: ["id"],
                // the order of the attributes in searchableAttributes determines the priotization
                // of search results i.e. a match in the first searchable attribute will always outrank a match in any other searchable attribute
                searchableAttributes: [
                  "keyword_tags",
                  "location_tags",
                  "time_range_tag_start",
                  "time_range_tag_end",
                  "face_tags",
                  "person_tags",
                  "descriptions",
                  "comments",
                  "collections",
                  "archive_tag",
                ],
                typoTolerance: {
                  enabled: true,
                  minWordSizeForTypos: { oneTypo: 3, twoTypos: 4 },
                  disableOnWords: [],
                  disableOnAttributes: [],
                },
              },
            },
          },
        }
      : null,
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
              },
              baseUrl: env("CDN_BASE_URL"), // e.g. "https://cdn.example.com", this is stored in strapi's database to point to the file
              prefix: env("BUCKET_PREFIX"), // e.g. "strapi-assets". If BUCKET_PREFIX contains leading or trailing slashes, they are removed internally to construct the URL safely
            },
          },
        }
      : undefined,
});
