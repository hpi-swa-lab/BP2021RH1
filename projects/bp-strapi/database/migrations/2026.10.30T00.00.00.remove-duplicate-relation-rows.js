'use strict';

// Strapi 4.26 adds unique constraints to the relation and component join tables, which fail
// on the duplicate rows that Strapi 4.4 allowed. This keeps the oldest row of each duplicate.
const columnsOf = async (knex, suffix) => {
  const rows = await knex('information_schema.columns')
    .select('table_name', 'column_name')
    .where('table_schema', knex.raw('current_schema()'))
    .andWhere('table_name', 'like', `%\\_${suffix}`);
  const columnsByTable = new Map();
  for (const { table_name, column_name } of rows) {
    columnsByTable.set(table_name, [...(columnsByTable.get(table_name) ?? []), column_name]);
  }
  return columnsByTable;
};

const removeDuplicates = async (knex, table, uniqueColumns) => {
  const sameValues = uniqueColumns.map(() => `a.?? IS NOT DISTINCT FROM b.??`).join(' AND ');
  await knex.raw(`DELETE FROM ?? a USING ?? b WHERE a.id > b.id AND ${sameValues}`, [
    table,
    table,
    ...uniqueColumns.flatMap(column => [column, column]),
  ]);
};

module.exports = {
  async up(knex) {
    for (const [table, columns] of await columnsOf(knex, 'links')) {
      const joinColumns = columns.filter(column => column !== 'id' && column.endsWith('_id'));
      if (joinColumns.length === 2) {
        await removeDuplicates(knex, table, joinColumns);
      }
    }
    for (const [table, columns] of await columnsOf(knex, 'components')) {
      const uniqueColumns = ['entity_id', 'component_id', 'field', 'component_type'];
      if (uniqueColumns.every(column => columns.includes(column))) {
        await removeDuplicates(knex, table, uniqueColumns);
      }
    }
  },
};
