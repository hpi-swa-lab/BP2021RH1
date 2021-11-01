module.exports = ({ env }) => ({
    host: env('HOST'),
    port: env.int('PORT'),
    url: env('URL'),
    proxy: true,
    admin: {
      url: env('URL') + 'admin',
      auth: {
          secret: env('ADMIN_JWT_SECRET'),
      },
      autoOpen: false,
    },
});
