'use strict';

// Strapi 4.26 adds unique constraints to the relation and component join tables, which fail
// on the duplicate rows that Strapi 4.4 allowed. This keeps the oldest row of each duplicate.
// Strapi hands migrations a plain connection without its configured schema, and production and
// staging share one database, so every table name here is qualified with that schema.
const columnsOf = async (knex, schema, suffix) => {
  const rows = await knex('information_schema.columns')
    .select('table_name', 'column_name')
    .where('table_schema', schema)
    .andWhere('table_name', 'like', `%\\_${suffix}`);
  const columnsByTable = new Map();
  for (const { table_name, column_name } of rows) {
    columnsByTable.set(table_name, [...(columnsByTable.get(table_name) ?? []), column_name]);
  }
  return columnsByTable;
};

const removeDuplicates = async (knex, schema, table, uniqueColumns) => {
  const partition = uniqueColumns.map(() => '??').join(', ');
  await knex.raw(
    `DELETE FROM ?? WHERE id IN (
      SELECT id FROM (SELECT id, row_number() OVER (PARTITION BY ${partition} ORDER BY id) AS n FROM ??) numbered
      WHERE n > 1
    )`,
    [`${schema}.${table}`, ...uniqueColumns, `${schema}.${table}`]
  );
};

module.exports = {
  async up(knex) {
    const schema = strapi.db.getSchemaName() ?? 'public';
    for (const [table, columns] of await columnsOf(knex, schema, 'links')) {
      const joinColumns = columns.filter(column => column !== 'id' && column.endsWith('_id'));
      if (joinColumns.length === 2) {
        await removeDuplicates(knex, schema, table, joinColumns);
      }
    }
    for (const [table, columns] of await columnsOf(knex, schema, 'components')) {
      const uniqueColumns = ['entity_id', 'component_id', 'field', 'component_type'];
      if (uniqueColumns.every(column => columns.includes(column))) {
        await removeDuplicates(knex, schema, table, uniqueColumns);
      }
    }
  },
};
