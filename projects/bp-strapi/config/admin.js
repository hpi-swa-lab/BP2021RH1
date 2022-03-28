module.exports = ({ env }) => ({
  auth: {
    // Note that the JWT_SECRET and API_TOKEN_SALT environment variables
    // are auto-generated and auto-appended to the specified .env file on server start,
    // if those were not set manually beforehand.
    secret: env('JWT_SECRET'),
  },
  autoOpen: false,
  url: env('URL') + 'admin',
});
