'use strict';

const { mergeSourceTagIntoTargetTag } = require('./api/custom-tag-resolver');

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
  if (response.pictures[0] && response.pictures[0].media.formats) {
    const formats = response.pictures[0].media.formats;
    const targetFormat = formats.medium || formats.small || formats.thumbnail;
    return targetFormat ? targetFormat.url : null;
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
      // TODO: there will be merge conflicts with the collection overview branch here,
      // remember to re-generate the APIConnector + schema.json after rebasing
      types: [
        gqlExtensions.nexus.mutationField('mergeKeywordTags', {
          type: 'ID',
          args: {
            sourceId: 'ID',
            targetId: 'ID',
          },
          async resolve(_, { sourceId, targetId }) {
            return mergeSourceTagIntoTargetTag(gqlExtensions.strapi, 'keyword-tag', sourceId, targetId);
          },
        }),
        gqlExtensions.nexus.mutationField('mergeLocationTags', {
          type: 'ID',
          args: {
            sourceId: 'ID',
            targetId: 'ID',
          },
          async resolve(_, { sourceId, targetId }) {
            return mergeSourceTagIntoTargetTag(gqlExtensions.strapi, 'location-tag', sourceId, targetId);
          },
        }),
        gqlExtensions.nexus.mutationField('mergePersonTags', {
          type: 'ID',
          args: {
            sourceId: 'ID',
            targetId: 'ID',
          },
          async resolve(_, { sourceId, targetId }) {
            return mergeSourceTagIntoTargetTag(gqlExtensions.strapi, 'person-tag', sourceId, targetId);
          },
        }),
      ],
      resolversConfig: {
        Mutation: {
          mergeKeywordTags: {
            auth: {
              scope: [
                'api::keyword-tag.keyword-tag.update',
              ],
            },
          },
          mergeLocationTags: {
            auth: {
              scope: [
                'api::location-tag.location-tag.update',
              ],
            },
          },
          mergePersonTags: {
            auth: {
              scope: [
                'api::person-tag.person-tag.update',
              ],
            },
          },
        },
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
