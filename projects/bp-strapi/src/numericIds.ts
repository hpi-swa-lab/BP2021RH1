import type { GqlExtension, StrapiExtended } from './types';

type Resolve = (parent: unknown, args: object, context: unknown, info: unknown) => unknown;

const contentTypesWithIds = (strapi: StrapiExtended) =>
  Object.values(strapi.contentTypes).filter(
    contentType =>
      contentType.kind === 'collectionType' &&
      (contentType.uid.startsWith('api::') || contentType.uid === 'plugin::users-permissions.user')
  );

// A documentId is a cuid2, which starts with a letter, so a documentId of digits only is an id.
// Strapi's relation inputs tell the two apart the same way.
const documentIdFromId =
  (strapi: StrapiExtended, uid: string) =>
  async (
    resolve: Resolve,
    parent: unknown,
    args: { documentId?: unknown },
    context: unknown,
    info: unknown
  ) => {
    if (typeof args.documentId === 'string' && /^\d+$/.test(args.documentId)) {
      const row = await strapi.db
        .query(uid as 'api::picture.picture')
        .findOne({ select: ['documentId'], where: { id: Number(args.documentId) } });
      // An unknown id stays as it is and, like an unknown documentId, matches nothing
      args = { ...args, documentId: row?.documentId ?? args.documentId };
    }
    return resolve(parent, args, context, info);
  };

/**
 * The gallery identifies entries by their numeric id: in URLs, permission checks, SQL and the
 * search index. Strapi 5's GraphQL schema has no id filter, and its single queries, updates and
 * deletes take a documentId. This adds the filter and lets those arguments take an id.
 */
export const numericIds = ({ strapi, nexus }: GqlExtension) => {
  const naming = strapi.plugin('graphql').service('utils').naming;
  const contentTypes = contentTypesWithIds(strapi);
  const resolversConfig: Record<string, { middlewares: unknown[] }> = {};
  for (const contentType of contentTypes) {
    const middlewares = [documentIdFromId(strapi, contentType.uid)];
    resolversConfig[`Query.${naming.getFindOneQueryName(contentType)}`] = { middlewares };
    // The users-permissions plugin replaces the user's update and delete with mutations that take an id
    if (contentType.uid === 'plugin::users-permissions.user') continue;
    resolversConfig[`Mutation.${naming.getUpdateMutationTypeName(contentType)}`] = { middlewares };
    resolversConfig[`Mutation.${naming.getDeleteMutationTypeName(contentType)}`] = { middlewares };
  }
  return {
    types: contentTypes.map(contentType =>
      nexus.extendInputType({
        type: naming.getFiltersInputTypeName(contentType),
        definition(t) {
          t.field('id', { type: 'IDFilterInput' });
        },
      })
    ),
    resolversConfig,
  };
};
