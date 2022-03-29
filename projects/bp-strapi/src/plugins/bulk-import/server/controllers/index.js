'use strict';

const bulkImport = require('./bulk-import');
const titleMigration = require('./title-migration');
const collectionMigration = require('./collection-migration');

module.exports = {
  bulkImport,
  titleMigration,
  collectionMigration,
};
