'use strict';

module.exports = ({ strapi }) => ({
  _getService() {
    return strapi.plugin('bulk-import').service('titleMigration');
  },

  async migrateTitles(ctx) {
    const response = await this._getService().migrateTitles();
    ctx.send(response);
  },
});
