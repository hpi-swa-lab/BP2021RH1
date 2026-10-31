'use strict';

// Turning draft & publish off (a later release) deletes every row whose published_at is null, so
// this copies that state into fields of their own first and then marks every row as published.
// Migrations run before Strapi creates tables and columns, hence the hasTable checks and the
// column added here. Table names carry the schema (see remove-duplicate-relation-rows).
const flags = [
  { table: 'collections', column: 'visible', value: 'published_at IS NOT NULL' },
  { table: 'comments', column: 'accepted', value: 'published_at IS NOT NULL' },
  { table: 'pictures', column: 'deleted', value: 'published_at IS NULL' },
  { table: 'archive_tags', column: 'deleted', value: 'published_at IS NULL' },
];

const publishedTables = [
  'archive_tags',
  'browse_root_collections',
  'collections',
  'comments',
  'descriptions',
  'exhibition_pictures',
  'exhibition_sections',
  'exhibitions',
  'picture_sequences',
  'pictures',
];

module.exports = {
  async up(knex) {
    const schema = strapi.db.getSchemaName() ?? 'public';
    const tableSchema = () => knex.schema.withSchema(schema);
    const rows = table => knex(`${schema}.${table}`);

    for (const { table, column, value } of flags) {
      if (!(await tableSchema().hasTable(table))) continue;
      if (!(await tableSchema().hasColumn(table, column))) {
        await tableSchema().alterTable(table, t => t.boolean(column));
      }
      await rows(table).update({ [column]: knex.raw(value) });
    }
    for (const table of publishedTables) {
      if (!(await tableSchema().hasTable(table))) continue;
      await rows(table)
        .whereNull('published_at')
        .update({ published_at: knex.ref('created_at') });
    }
  },
};
