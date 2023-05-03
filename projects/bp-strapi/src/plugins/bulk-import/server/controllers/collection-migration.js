'use strict';

module.exports = ({ strapi }) => ({
  _getService() {
    return strapi.plugin('bulk-import').service('collectionMigration');
  },

  async migrateCollections(ctx) {
    const response = await this._getService().migrateCollections();
    ctx.send(response);
  },
});
