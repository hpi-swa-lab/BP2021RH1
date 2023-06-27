module.exports = ({ env }) => ({
  // Note that the JWT_SECRET and API_TOKEN_SALT environment variables
  // are auto-generated and auto-appended to the specified .env file on server start,
  // if those were not set manually beforehand.
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  autoOpen: false,
  url: env('URL') + 'admin',
});
