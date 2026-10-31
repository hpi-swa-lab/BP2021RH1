module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST'),
      port: env.int('DATABASE_PORT'),
      database: env('DATABASE_NAME'),
      user: env('DATABASE_USERNAME'),
      password: env('DATABASE_PASSWORD'),
      schema: env('DATABASE_SCHEMA'),
    },
    // Production and staging share one database, so SQL that names a table without its schema
    // must not fall back to production's public schema.
    searchPath: [env('DATABASE_SCHEMA')],
    debug: false,
  },
});
