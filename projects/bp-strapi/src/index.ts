'use strict';

import { Variables } from 'bp-graphql/build';
import { archivePictureCountsType } from './api/archive-tag/content-types/archive-tag/custom-type';
import { addArchiveTag, removeArchiveTag } from './api/archive-tag/services/custom-update';
import {
  mergeSourceCollectionIntoTargetCollection,
  resolveCollectionThumbnail,
} from './api/collection/services/custom-resolver';
import { contact } from './api/contact/services/contact';
import { mergeSourceTagIntoTargetTag } from './api/custom-tag-resolver';
import {
  getAllLocationTags,
  getLocationTagsWithThumbnail,
} from './api/location-tag/services/custom-resolver';
import {
  addPermission,
  addUser,
  preventPublicUserFromCreatingArchive,
  removeUser,
} from './api/parameterized-permission/services/custom-update';
import {
  archivePictureCounts,
  bulkEdit,
  findPicturesByAllSearch,
  like,
  updatePictureWithTagCleanup,
} from './api/picture/services/custom-resolver';
import { incNotAPlaceCount } from './api/picture/services/custom-update';
import { updateMe } from './extensions/users-permissions/content-types/user/custom-update';
import {
  canRunOperation,
  canRunWithSomeVariables,
} from './parameterizedPermissions/canRunOperation';
import { initializeEmailSettings } from './parameterizedPermissions/initializeUsersPermissionsSettings';
import { parseOperationSource } from './parameterizedPermissions/parseOperation';
import { GqlExtension, StrapiExtended } from './types';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: StrapiExtended }) {
    const gqlExtensionService = strapi.plugin('graphql').service('extension');
    const gqlExtension = (extensionArgs: GqlExtension) => {
      const { list, mutationField, queryField, objectType } = extensionArgs.nexus;
      return {
        types: [
          mutationField('mergeKeywordTags', {
            type: 'ID',
            args: {
              sourceId: 'ID',
              targetId: 'ID',
            },
            async resolve(_, { sourceId, targetId }) {
              return mergeSourceTagIntoTargetTag(
                extensionArgs.strapi,
                'keyword-tag',
                sourceId,
                targetId
              );
            },
          }),
          mutationField('mergeLocationTags', {
            type: 'ID',
            args: {
              sourceId: 'ID',
              targetId: 'ID',
            },
            async resolve(_, { sourceId, targetId }) {
              return mergeSourceTagIntoTargetTag(
                extensionArgs.strapi,
                'location-tag',
                sourceId,
                targetId
              );
            },
          }),
          mutationField('mergePersonTags', {
            type: 'ID',
            args: {
              sourceId: 'ID',
              targetId: 'ID',
            },
            async resolve(_, { sourceId, targetId }) {
              return mergeSourceTagIntoTargetTag(
                extensionArgs.strapi,
                'person-tag',
                sourceId,
                targetId
              );
            },
          }),
          mutationField('mergeCollections', {
            type: 'ID',
            args: {
              sourceId: 'ID',
              targetId: 'ID',
            },
            async resolve(_, { sourceId, targetId }) {
              return mergeSourceCollectionIntoTargetCollection(
                extensionArgs.strapi,
                sourceId,
                targetId
              );
            },
          }),
          queryField('getAllLocationTags', {
            type: 'JSON',
            args: {},
            resolve() {
              return getAllLocationTags(strapi as StrapiExtended);
            },
          }),
          queryField('getLocationTagsWithThumbnail', {
            type: 'JSON',
            args: {
              filters: 'LocationTagFiltersInput',
              thumbnailFilters: 'PictureFiltersInput',
              pagination: 'PaginationArg',
              sortBy: list('String'),
            },
            resolve(_, { filters = {}, thumbnailFilters = {}, pagination, sortBy }) {
              return getLocationTagsWithThumbnail(
                strapi as StrapiExtended,
                filters,
                thumbnailFilters,
                pagination,
                sortBy
              );
            },
          }),
          mutationField('updatePictureWithTagCleanup', {
            type: 'ID',
            args: {
              id: 'ID',
              data: 'JSON',
            },
            async resolve(_, { id, data }) {
              return updatePictureWithTagCleanup(id, data);
            },
          }),
          queryField('findPicturesByAllSearch', {
            type: list('PictureEntity'),
            args: {
              searchTerms: list('String'),
              // Additional search-time tuples (plain search term, parsed start, parsed end)
              searchTimes: list(list('String')),
              textFilter: 'String',
              pagination: 'PaginationArg',
            },
            async resolve(_, { searchTerms, searchTimes, textFilter, pagination }) {
              const knexEngine = extensionArgs.strapi.db.connection;
              return findPicturesByAllSearch(
                knexEngine,
                searchTerms,
                searchTimes,
                textFilter,
                pagination
              );
            },
          }),
          queryField('archivePictureCounts', {
            type: archivePictureCountsType(extensionArgs.nexus),
            async resolve(_) {
              const knexEngine = extensionArgs.strapi.db.connection;
              return archivePictureCounts(knexEngine);
            },
          }),
          queryField('canRunOperation', {
            type: list('Boolean'),
            args: {
              operation: 'String',
              variableSets: list('JSON'),
              withSomeVariables: 'Boolean',
            },
            async resolve(
              _,
              {
                operation,
                variableSets,
                withSomeVariables,
              }: { operation: string; variableSets: Variables[]; withSomeVariables: true },
              context
            ) {
              const parsedOperation = parseOperationSource(operation, 'unknown');
              if (withSomeVariables) {
                return [
                  await canRunOperation(
                    context.state.auth,
                    parsedOperation,
                    canRunWithSomeVariables
                  ),
                ];
              }
              return Promise.all(
                variableSets.map(variables =>
                  canRunOperation(context.state.auth, parsedOperation, variables)
                )
              );
            },
          }),
          mutationField('doBulkEdit', {
            type: 'Int',
            args: {
              ids: list('ID'),
              data: 'JSON',
            },
            async resolve(_, { ids, data }) {
              const knexEngine = extensionArgs.strapi.db.connection;
              return bulkEdit(knexEngine, ids, data);
            },
          }),
          mutationField('doLike', {
            type: 'Int',
            args: {
              pictureId: 'ID',
              dislike: 'Boolean',
            },
            async resolve(_, { pictureId, dislike }) {
              const knexEngine = extensionArgs.strapi.db.connection;
              return like(knexEngine, pictureId, dislike);
            },
          }),
          mutationField('increaseNotAPlaceCount', {
            type: 'Int',
            args: {
              id: 'ID',
            },
            async resolve(_, { id }) {
              const knexEngine = extensionArgs.strapi.db.connection;
              return incNotAPlaceCount(knexEngine, id);
            },
          }),
          mutationField('addArchiveTag', {
            type: 'Int',
            args: {
              name: 'String',
            },
            async resolve(_, { name }, context) {
              const user = context.state.auth.credentials;
              if (!user) {
                preventPublicUserFromCreatingArchive();
              }
              return addArchiveTag(user, name);
            },
          }),
          mutationField('removeArchiveTag', {
            type: 'Int',
            args: {
              id: 'ID',
            },
            async resolve(_, { id }) {
              return removeArchiveTag(id);
            },
          }),
          mutationField('updateMe', {
            type: 'Int',
            args: {
              username: 'String',
              email: 'String',
            },
            async resolve(_, { username, email }, context) {
              const user = context.state.auth.credentials;
              return updateMe(user, username, email);
            },
          }),
          mutationField('addUser', {
            type: 'Int',
            args: {
              username: 'String',
              email: 'String',
            },
            async resolve(_, { username, email }, context) {
              return addUser(context, username, email);
            },
          }),
          mutationField('removeUser', {
            type: 'Int',
            args: {
              id: 'ID',
            },
            async resolve(_, { id }) {
              return removeUser(id);
            },
          }),
          mutationField('addPermission', {
            type: 'Int',
            args: {
              user_id: 'ID',
              operation_name: 'String',
              archive_tag: 'ID',
              on_other_users: 'Boolean',
            },
            async resolve(_, args) {
              return addPermission(args);
            },
          }),
          mutationField('contact', {
            type: 'Int',
            args: {
              recipient: 'String',
              sender_name: 'String',
              reply_email: 'String',
              subject: 'String',
              message: 'String',
            },
            async resolve(_, args) {
              return contact(args);
            },
          }),
        ],
        resolversConfig: {
          Query: {
            findPicturesByAllSearch: {
              auth: {
                scope: ['api::picture.picture.find'],
              },
            },
            archivePictureCounts: {
              auth: {
                scope: ['api::picture.picture.find'],
              },
            },
          },
          Mutation: {
            mergeKeywordTags: {
              auth: {
                scope: ['api::keyword-tag.keyword-tag.update'],
              },
            },
            mergeLocationTags: {
              auth: {
                scope: ['api::location-tag.location-tag.update'],
              },
            },
            mergePersonTags: {
              auth: {
                scope: ['api::person-tag.person-tag.update'],
              },
            },
            mergeCollections: {
              auth: {
                scope: ['api::collection.collection.update'],
              },
            },
            updatePictureWithTagCleanup: {
              auth: {
                scope: ['api::picture.picture.update'],
              },
            },
            doBulkEdit: {
              auth: {
                scope: ['api::picture.picture.update'],
              },
            },
            doLike: {
              auth: {
                scope: ['api::picture.picture.find'],
              },
            },
            increaseNotAPlaceCount: {
              auth: {
                scope: ['api::picture.picture.find'],
              },
            },
          },
          Collection: {
            thumbnail: {
              middlewares: [
                async (_: any, parent: any) => {
                  // The parent here is the actual collection, of which the thumbnail was requested.
                  // More on the arguments of a resolver can be found for example on:
                  // https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments
                  return resolveCollectionThumbnail(extensionArgs.strapi, parent.id, []);
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
  async bootstrap(args: { strapi: StrapiExtended }) {
    await initializeEmailSettings(args);
  },
};
