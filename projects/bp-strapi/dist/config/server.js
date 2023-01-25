module.exports = ({ env }) => ({
    host: env('HOST'),
    port: env.int('PORT'),
    url: env('URL'),
    proxy: true,
});
