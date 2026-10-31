// Deleted pictures and archives stay in the database so they can be restored in the admin panel.
// GraphQL hides them through these middlewares and batchRelationLoads; custom SQL, the location
// thumbnails and the search index filter `deleted` themselves.
const deletableUIDs = new Set(['api::picture.picture', 'api::archive-tag.archive-tag']);

const notDeleted = { deleted: { eq: false } };

export const withoutDeleted = <Args extends { filters?: unknown }>(uid: string, args: Args): Args =>
  deletableUIDs.has(uid)
    ? { ...args, filters: args.filters ? { and: [args.filters, notDeleted] } : notDeleted }
    : args;

type Resolve = (parent: unknown, args: any, context: unknown, info: unknown) => any;

const filterCollection =
  (uid: string) =>
  (resolve: Resolve, parent: unknown, args: any, ...rest: [unknown, unknown]) =>
    resolve(parent, withoutDeleted(uid, args), ...rest);

const hideSingle = async (resolve: Resolve, ...args: Parameters<Resolve>) => {
  const response = await resolve(...args);
  const value = await response?.value;
  return { ...response, value: value?.deleted ? null : value };
};

// Flat keys, since plugin-graphql registers its auth config for these queries under flat keys,
// which lodash's get prefers over a nested `Query: { pictures }`
export const deletedEntriesResolversConfig = {
  'Query.pictures': { middlewares: [filterCollection('api::picture.picture')] },
  'Query.archiveTags': { middlewares: [filterCollection('api::archive-tag.archive-tag')] },
  'Query.picture': { middlewares: [hideSingle] },
  'Query.archiveTag': { middlewares: [hideSingle] },
};
