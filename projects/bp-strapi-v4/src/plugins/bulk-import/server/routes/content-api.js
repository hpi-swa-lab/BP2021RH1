'use strict';

module.exports = {
  type: 'content-api', // important damit die Routen im Permissions-Plugin berücksichtigt werden
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
  ]
};
