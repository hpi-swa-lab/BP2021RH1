"use strict";

const { mergeSourceTagIntoTargetTag } = require("./api/custom-tag-resolver");
const {
  mergeSourceCollectionIntoTargetCollection,
  resolveCollectionThumbnail,
} = require("./api/collection/services/custom-resolver");
const {
  findPicturesByAllSearch,
  updatePictureWithTagCleanup,
} = require("./api/picture/services/custom-resolver")

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const gqlExtensionService = strapi.plugin("graphql").service("extension");

    const gqlExtension = (extensionArgs) => {
      const { list, mutationField, queryField } = extensionArgs.nexus;

      return {
        types: [
          mutationField("mergeKeywordTags", {
            type: "ID",
            args: {
              sourceId: "ID",
              targetId: "ID",
            },
            async resolve(_, { sourceId, targetId }) {
              return mergeSourceTagIntoTargetTag(
                extensionArgs.strapi,
                "keyword-tag",
                sourceId,
                targetId
              );
            },
          }),
          mutationField("mergeLocationTags", {
            type: "ID",
            args: {
              sourceId: "ID",
              targetId: "ID",
            },
            async resolve(_, { sourceId, targetId }) {
              return mergeSourceTagIntoTargetTag(
                extensionArgs.strapi,
                "location-tag",
                sourceId,
                targetId
              );
            },
          }),
          mutationField("mergePersonTags", {
            type: "ID",
            args: {
              sourceId: "ID",
              targetId: "ID",
            },
            async resolve(_, { sourceId, targetId }) {
              return mergeSourceTagIntoTargetTag(
                extensionArgs.strapi,
                "person-tag",
                sourceId,
                targetId
              );
            },
          }),
          mutationField("mergeCollections", {
            type: "ID",
            args: {
              sourceId: "ID",
              targetId: "ID",
            },
            async resolve(_, { sourceId, targetId }) {
              return mergeSourceCollectionIntoTargetCollection(
                extensionArgs.strapi,
                sourceId,
                targetId
              );
            },
          }),
          mutationField("updatePictureWithTagCleanup", {
            type: "ID",
            args: {
              id: "ID",
              data: "JSON",
            },
            async resolve(_, { id, data }) {
              return updatePictureWithTagCleanup(id, data);
            },
          }),
          queryField("findPicturesByAllSearch", {
            type: list("PictureEntity"),
            args: {
              searchTerms: list("String"),
              // Additional search-time tuples (plain search term, parsed start, parsed end)
              searchTimes: list(list("String")),
              pagination: "PaginationArg",
            },
            async resolve(_, { searchTerms, searchTimes, pagination }) {
              const knexEngine = extensionArgs.strapi.db.connection;
              return findPicturesByAllSearch(knexEngine, searchTerms, searchTimes, pagination);
            },
          }),
        ],
        resolversConfig: {
          Query: {
            findPicturesByAllSearch: {
              auth: {
                scope: ["api::picture.picture.find"],
              },
            },
          },
          Mutation: {
            mergeKeywordTags: {
              auth: {
                scope: ["api::keyword-tag.keyword-tag.update"],
              },
            },
            mergeLocationTags: {
              auth: {
                scope: ["api::location-tag.location-tag.update"],
              },
            },
            mergePersonTags: {
              auth: {
                scope: ["api::person-tag.person-tag.update"],
              },
            },
            mergeCollections: {
              auth: {
                scope: ["api::collection.collection.update"],
              },
            },
            updatePictureWithTagCleanup: {
              auth: {
                scope: ["api::picture.picture.update"],
              },
            },
          },
          Collection: {
            thumbnail: {
              middlewares: [
                async (_, parent) => {
                  // The parent here is the actual collection, of which the thumbnail was requested.
                  // More on the arguments of a resolver can be found for example on:
                  // https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments
                  return resolveCollectionThumbnail(
                    extensionArgs.strapi,
                    parent.id,
                    []
                  );
                },
              ],
              auth: {
                scope: [
                  "api::collection.collection.find",
                  "api::collection.collection.findOne",
                  "api::picture.picture.find",
                  "api::picture.picture.findOne",
                ],
              },
            },
          },
        },
      };
    };

    gqlExtensionService.use(gqlExtension);
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
