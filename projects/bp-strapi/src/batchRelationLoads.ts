import { transformParamsToQuery } from '@strapi/strapi/lib/services/entity-service/params';
import DataLoader from 'dataloader';
import { StrapiExtended } from './types';

type Id = number | string;
type Attribute = { target: string; relation: string; multiple?: boolean };
type TransformedArgs = { start?: number; limit?: number } & Record<string, unknown>;
type Resolver = (parent: { id: Id }, args: object, context: object, info: unknown) => unknown;
type AssociationOptions = { contentTypeUID: string; attributeName: string };
type Database = {
  query(uid: string): { findMany(params: object): Promise<Record<string, unknown>[]> };
};

/**
 * Strapi's GraphQL plugin loads each relation of each result row with its own query
 * (two SQL queries per row and relation, about 1000 for a page of 100 pictures).
 * This replaces its relation resolver with one that collects the rows of a request that need
 * the same relation with the same arguments and loads the relation for all of them at once.
 * Polymorphic and paginated relations keep Strapi's resolver. A `maxLimit` in the GraphQL
 * plugin config makes every relation paginated and so turns the batching off.
 */
export const batchRelationLoads = (strapi: StrapiExtended) => {
  const graphql = strapi.plugin('graphql');
  const { isMorphRelation, isMedia } = graphql.service('utils').attributes;
  const { toEntityResponse, toEntityResponseCollection } = graphql.service('format').returnTypes;
  const builders = graphql.service('builders');
  const { transformArgs } = builders.utils;

  const loadersByRequest = new WeakMap<object, Map<string, DataLoader<Id, unknown>>>();

  const loadRelation = async (
    uid: string,
    attributeName: string,
    params: object,
    ids: readonly Id[]
  ) => {
    const entries = await (strapi.db as unknown as Database).query(uid).findMany({
      select: ['id'],
      where: { id: { $in: ids } },
      populate: { [attributeName]: params },
    });
    const relationById = new Map(entries.map(entry => [String(entry.id), entry[attributeName]]));
    return ids.map(id => (relationById.has(String(id)) ? relationById.get(String(id)) : null));
  };

  const loaderFor = (
    context: object,
    uid: string,
    attributeName: string,
    paramsUID: string,
    args: TransformedArgs
  ) => {
    let loaders = loadersByRequest.get(context);
    if (!loaders) {
      loaders = new Map();
      loadersByRequest.set(context, loaders);
    }
    const key = JSON.stringify([uid, attributeName, args]);
    let loader = loaders.get(key);
    if (!loader) {
      const params = transformParamsToQuery(paramsUID, args);
      loader = new DataLoader(ids => loadRelation(uid, attributeName, params, ids), {
        cache: false,
      });
      loaders.set(key, loader);
    }
    return loader;
  };

  const createBuilders = builders.new;
  builders.new = (name: string, registry: unknown) => {
    const created = createBuilders(name, registry);
    const buildAssociationResolver: (options: AssociationOptions) => Resolver =
      created.buildAssociationResolver;

    created.buildAssociationResolver = (options: AssociationOptions): Resolver => {
      const strapiResolver = buildAssociationResolver(options);
      const { contentTypeUID, attributeName } = options;
      const attribute: Attribute = strapi.getModel(contentTypeUID).attributes[attributeName];
      if (isMorphRelation(attribute)) {
        return strapiResolver;
      }
      const isMediaAttribute = isMedia(attribute);
      // Strapi's resolver uses 'plugins::upload.file' here and 'plugin::upload.file' for the query.
      const targetUID = isMediaAttribute ? 'plugins::upload.file' : attribute.target;
      const paramsUID = isMediaAttribute ? 'plugin::upload.file' : attribute.target;
      const isToMany = isMediaAttribute ? attribute.multiple : attribute.relation.endsWith('Many');
      const targetContentType = strapi.getModel(targetUID);

      return async (parent, args = {}, context, info) => {
        const transformedArgs: TransformedArgs = transformArgs(args, {
          contentType: targetContentType,
          usePagination: true,
        });
        if (transformedArgs.start || transformedArgs.limit !== -1) {
          return strapiResolver(parent, args, context, info);
        }
        const data = await loaderFor(
          context,
          contentTypeUID,
          attributeName,
          paramsUID,
          transformedArgs
        ).load(parent.id);
        const responseInfo = { args: transformedArgs, resourceUID: targetUID };
        return isToMany
          ? toEntityResponseCollection(data, responseInfo)
          : toEntityResponse(data, responseInfo);
      };
    };
    return created;
  };
};
