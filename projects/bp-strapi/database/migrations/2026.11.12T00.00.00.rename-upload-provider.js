'use strict';

// Strapi deletes and replaces a file in S3 only when the file's provider is the configured one.
// The official S3 provider builds the same object keys as strapi-provider-upload-aws-s3-advanced.
// Table names carry the schema (see remove-duplicate-relation-rows).
module.exports = {
  async up(knex) {
    const schema = strapi.db.getSchemaName() ?? 'public';
    if (!(await knex.schema.withSchema(schema).hasTable('files'))) return;
    await knex(`${schema}.files`)
      .where({ provider: 'strapi-provider-upload-aws-s3-advanced' })
      .update({ provider: 'aws-s3' });
  },
};
