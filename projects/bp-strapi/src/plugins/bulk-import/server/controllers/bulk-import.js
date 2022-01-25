'use strict';

module.exports = ({ strapi }) => ({
  _getService() {
    return strapi.plugin('bulk-import').service('bulkImport');
  },

  index(ctx) {
    ctx.send(this._getService().getIndexMessage());
  },

  async import(ctx) {
    const { files } = ctx.request;
    const pictureBuffer = await this._getService().importAllButCommentsAndTimeRanges(files['jsondata'].path, files['jsondata2'].path);
    ctx.send(pictureBuffer);
  },

  async fillCategoryTags(ctx) {
    const categoryTagImportResult = await this._getService().fillCategoryTags(ctx.request.files['jsondata'].path);
    ctx.send(categoryTagImportResult);
  },

  async importComments(ctx) {
    const commentsImportResult = await this._getService().importComments(ctx.request.files['jsondata'].path);
    ctx.send(commentsImportResult);
  },

  async importDraftComments(ctx) {
    const draftCommentsImportResult = await this._getService().importDraftComments(ctx.request.files['jsondata'].path);
    ctx.send(draftCommentsImportResult);
  },

  async addTimeRanges(ctx) {
    const timeRangeBuffer = await this._getService().addTimeRanges();
    ctx.send(timeRangeBuffer);
  },
});
