'use strict';

module.exports = {
  // Important in order to make these routes accessible to the User-Permissions-Plugin.
  type: 'content-api',
  // Note that these routes will be prefixed with '/api', which applies to all routes related to content-types.
  routes: [
    {
      method: 'GET',
      path: '/',
      handler: 'bulkImport.index',
    },
    {
      method: 'POST',
      path: '/import',
      handler: 'bulkImport.import',
    },
    {
      method: 'POST',
      path: '/add-time-ranges',
      handler: 'bulkImport.addTimeRanges',
    },
    {
      method: 'POST',
      path: '/fill-category-tags',
      handler: 'bulkImport.fillCategoryTags',
    },
    {
      method: 'POST',
      path: '/import-comments',
      handler: 'bulkImport.importComments',
    },
    {
      method: 'POST',
      path: '/import-draft-comments',
      handler: 'bulkImport.importDraftComments',
    },
    {
      method: 'POST',
      path: '/migrate-titles',
      handler: 'titleMigration.migrateTitles',
    },
    {
      method: 'POST',
      path: '/migrate-collections',
      handler: 'collectionMigration.migrateCollections',
    },
  ]
};
