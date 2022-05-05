'use strict';

const {
  mergeSourceCollectionIntoTargetCollection,
  resolveCollectionThumbnail
} = require('./api/collection/services/custom-resolver');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const extensionService = strapi.plugin('graphql').service('extension');

    const extension = (gqlExtensions) => ({
      types: [
        gqlExtensions.nexus.mutationField('mergeCollections', {
          type: 'ID',
          args: {
            sourceId: 'ID',
            targetId: 'ID',
          },
          async resolve(_, { sourceId, targetId }) {
            return mergeSourceCollectionIntoTargetCollection(gqlExtensions.strapi, sourceId, targetId);
          },
        }),
      ],
      resolversConfig: {
        Mutation: {
          mergeCollections: {
            auth: {
              scope: [
                'api::collection.collection.update',
              ],
            },
          },
        },
        'Collection.thumbnail': {
          middlewares: [
            async (_, parent) => {
              return resolveCollectionThumbnail(gqlExtensions.strapi, parent.id, []);
            },
          ],
          auth: {
            scope: [
              'api::collection.collection.find',
              'api::collection.collection.findOne',
              'api::picture.picture.find',
              'api::picture.picture.findOne',
            ],
          },
        },
      },
    });

    extensionService.use(extension);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
