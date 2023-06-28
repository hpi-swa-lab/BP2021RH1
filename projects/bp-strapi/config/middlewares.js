module.exports = ({ env }) => [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'dl.airtable.com', env('CDN_BASE_URL')],
          'media-src': ["'self'", 'data:', 'blob:', 'dl.airtable.com', env('CDN_BASE_URL')],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'anonymousId'],
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::favicon',
  'strapi::public',
  ...(env('GROWTHBOOK_APIHOST') && env('GROWTHBOOK_CLIENTKEY')
    ? ['global::growthbook-client']
    : []),
  'global::denyEndpoints',
];
