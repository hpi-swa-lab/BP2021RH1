const {
  apolloPlugin: apolloParameterizedPermissionsPlugin,
} = require('../src/parameterizedPermissions/apolloServerPlugin');

/* eslint-disable no-unused-vars */

const dateToTimeStamp = date => {
  return Date.parse(date) / 1000;
};

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
        plugins: [apolloParameterizedPermissionsPlugin],
      },
    },
  },
  'bulk-import': {
    enabled: true,
    resolve: './src/plugins/bulk-import',
  },
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
      resetPasswordTokenExpirationTimeMilliseconds:
        Number(env('RESET_PASSWORD_TOKEN_EXPIRATION_TIME_MILLISECONDS')) ||
        // default: 1 day
        24 * 60 * 60 * 1000,
    },
  },
  sentry: {
    enabled: !!env('SENTRY_DSN'),
    config: {
      dsn: env('SENTRY_DSN'),
    },
  },
  email: {
    config: {
      provider: env('EMAIL_PROVIDER'),
      providerOptions:
        env('EMAIL_PROVIDER') === 'amazon-ses'
          ? {
              key: env('AWS_SES_ACCESS_KEY_ID'),
              secret: env('AWS_SES_ACCESS_SECRET'),
              amazon: env('AWS_SES_REGION_URL'),
            }
          : {
              host: env('EMAIL_SMTP_HOST'),
              port: env('EMAIL_SMTP_PORT'),
              auth: {
                user: env('EMAIL_SMTP_USER'),
                pass: env('EMAIL_SMTP_PASS'),
              },
            },
      settings: {
        defaultFrom: env('EMAIL_ADDRESS_FROM'),
        defaultReplyTo: env('EMAIL_ADDRESS_REPLY'),
        testAddress: env('TEST_ADDRESS'),
      },
    },
  },
  meilisearch:
    env('MEILISEARCH_ENABLED', 'false') === 'true'
      ? {
          config: {
            host: env('MEILISEARCH_HOST'),
            apiKey: env('MEILISEARCH_API_KEY'),
            picture: {
              transformEntry({ entry }) {
                const transformedEntry = {
                  id: entry?.id,
                  is_text: entry?.is_text,
                  likes: entry?.likes,
                  descriptions: entry?.descriptions.map(description => description.text),
                  comments: entry?.comments.map(comment => comment.text),
                  keyword_tags: entry?.keyword_tags
                    .map(tag => tag.name)
                    .concat(entry?.verified_keyword_tags.map(tag => tag.name)),
                  person_tags: entry?.person_tags
                    .map(tag => tag.name)
                    .concat(entry?.verified_person_tags.map(tag => tag.name)),
                  location_tags: entry?.location_tags
                    .map(tag => tag.name)
                    .concat(entry?.verified_location_tags.map(tag => tag.name)),
                  face_tags: entry?.face_tags.map(tag => tag.name),
                  collections: entry?.collections.map(tag => tag.name),
                  archive_tag: entry?.archive_tag.name,
                  time_range_tag_start: entry?.time_range_tag
                    ? dateToTimeStamp(entry?.time_range_tag.start)
                    : entry?.verified_time_range_tag
                    ? dateToTimeStamp(entry?.verified_time_range_tag.start)
                    : null,
                  time_range_tag_end: entry?.time_range_tag
                    ? dateToTimeStamp(entry?.time_range_tag.end)
                    : entry?.verified_time_range_tag
                    ? dateToTimeStamp(entry?.verified_time_range_tag.end)
                    : null,
                };

                return transformedEntry;
              },
              settings: {
                //for reference: https://www.meilisearch.com/docs/reference/api/settings
                displayedAttributes: ['id'],
                // the order of the attributes in searchableAttributes determines the priorization
                // of search results i.e. a match in the first searchable attribute will always outrank a match in any other searchable attribute
                searchableAttributes: [
                  'descriptions',
                  'location_tags',
                  'keyword_tags',
                  'face_tags',
                  'person_tags',
                  'time_range_tag_start',
                  'time_range_tag_end',
                  'collections',
                  'archive_tag',
                ],
                filterableAttributes: [
                  'keyword_tags',
                  'location_tags',
                  'time_range_tag_start',
                  'time_range_tag_end',
                  'face_tags',
                  'person_tags',
                  'descriptions',
                  'collections',
                  'archive_tag',
                  'is_text',
                ],
                sortableAttributes: ['time_range_tag_start', 'time_range_tag_end', 'likes'],
                rankingRules: ['words', 'typo', 'proximity', 'attribute', 'exactness', 'sort'],
                // words that are ignored during searches, useful for common words
                //  that do not carry a meaning on their own like articles, pronomina etc.
                // we do not use this setting, since our data on user searchers suggests, that
                // users only search for proper names, people, locations and nouns in general
                stopWords: [],
                synonyms: {},
                // returned documents will always be unigue in this attribute
                distinctAttribute: null,
                typoTolerance: {
                  enabled: true,
                  minWordSizeForTypos: { oneTypo: 3, twoTypos: 50 },
                  disableOnWords: [],
                  disableOnAttributes: [],
                },
                // faceting is currently not in use
                faceting: {
                  maxValuesPerFacet: 100,
                },
                // maxtotalHits determines the maximal possible amount
                // of search results and overrides any other settings
                // like the result_limit of the search settings in this regard
                pagination: {
                  maxTotalHits: 1000,
                },
              },
            },
            comment: {
              transformEntry({ entry }) {
                const transformedEntry = {
                  id: entry?.id,
                  pictureId: entry?.picture.id,
                  author: entry?.author,
                  text: entry?.text,
                  date: entry?.date ? dateToTimeStamp(entry?.date) : null,
                  pinned: entry?.pinned,
                  hasChildComments: !!entry?.childComments,
                  hasParentComments: !!entry?.parentComments,
                };
                return transformedEntry;
              },
              settings: {
                //for reference: https://www.meilisearch.com/docs/reference/api/settings
                displayedAttributes: [
                  'author',
                  'text',
                  'date',
                  'pictureId',
                  'pinned',
                  'hasChildComments',
                  'hasParentComments',
                ],
                // the order of the attributes in searchableAttributes determines the priorization
                // of search results i.e. a match in the first searchable attribute will always outrank a match in any other searchable attribute
                searchableAttributes: ['text', 'author', 'date'],
                filterableAttributes: [
                  'author',
                  'text',
                  'date',
                  'pictureId',
                  'pinned',
                  'hasChildComments',
                  'hasParentComments',
                ],
                sortableAttributes: ['date'],
                rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
                // words that are ignored during searches, useful for common words
                //  that do not carry a meaning on their own like articles, pronomina etc.
                // we do not use this setting, since our data on user searchers suggests, that
                // users only search for proper names, people, locations and nouns in general
                stopWords: [],
                synonyms: {},
                // returned documents will always be unigue in this attribute
                distinctAttribute: null,
                typoTolerance: {
                  enabled: true,
                  minWordSizeForTypos: { oneTypo: 3, twoTypos: 50 },
                  disableOnWords: [],
                  disableOnAttributes: [],
                },
                faceting: {
                  maxValuesPerFacet: 100,
                },
                pagination: {
                  maxTotalHits: 1000,
                },
              },
            },
          },
        }
      : null,
  upload:
    env('AWS_ENABLED', 'false') === 'true'
      ? {
          config: {
            provider: 'strapi-provider-upload-aws-s3-advanced',
            providerOptions: {
              accessKeyId: env('AWS_ACCESS_KEY_ID'),
              secretAccessKey: env('AWS_ACCESS_SECRET'),
              region: env('AWS_REGION'),
              params: {
                bucket: env('AWS_BUCKET_NAME'),
              },
              baseUrl: env('CDN_BASE_URL'), // e.g. "https://cdn.example.com", this is stored in strapi's database to point to the file
              prefix: env('BUCKET_PREFIX'), // e.g. "strapi-assets". If BUCKET_PREFIX contains leading or trailing slashes, they are removed internally to construct the URL safely
            },
          },
        }
      : undefined,
});
