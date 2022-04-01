'use strict';

const resolveThumbnail = async (strapi, collectionId, alreadySeenIds) => {
  alreadySeenIds.push(collectionId);
  const collectionQuery = strapi.db.query('api::collection.collection');
  const response = await collectionQuery.findOne({
    where: {
      id: collectionId
    },
    select: ['id'],
    populate: {
      pictures: {
        select: ['id'],
        limit: 1,
        populate: {
          media: {
            select: ['formats']
          }
        },
      },
      child_collections: {
        select: ['id']
      }
    },
  });
  if (response.pictures[0] && response.pictures[0].media.formats.thumbnail.url) {
    return response.pictures[0].media.formats.thumbnail.url;
  } else {
    for (const child of response.child_collections) {
      if (alreadySeenIds.includes(child.id)) {continue; }
      const thumb = await resolveThumbnail(strapi, child.id, alreadySeenIds);
      if (thumb) {
        return thumb;
      }
    }
  }
  return null;
}

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
      resolversConfig: {
        'Collection.thumbnail': {
          middlewares: [
            async (_, parent) => {
              return await resolveThumbnail(gqlExtensions.strapi, parent.id, []);
            },
          ],
          auth: {
            scope: [
              'api::collection.collection.find',
              'api::collection.collection.findOne',
              'api::picture.picture.find',
              'api::picture.picture.findOne'
            ]
          }
        }
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
