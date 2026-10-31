import { convertQueryParams, sanitize, validate } from '@strapi/utils';
import type { Common } from '@strapi/strapi';
import DataLoader from 'dataloader';
import { withoutDeleted } from './deletedEntries';
import { StrapiExtended } from './types';

const { transformParamsToQuery } = convertQueryParams;

type Id = number | string;
type Attribute = { target: string; relation: string; multiple?: boolean };
type TransformedArgs = { start?: number; limit?: number } & Record<string, unknown>;
type Batch = { sanitizedArgs: Promise<TransformedArgs>; loader: DataLoader<Id, unknown> };
type Context = { state: { auth: unknown } };
type Resolver = (parent: { id: Id }, args: object, context: Context, info: unknown) => unknown;
type AssociationOptions = { contentTypeUID: Common.UID.Schema; attributeName: string };
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

  const batchesByRequest = new WeakMap<object, Map<string, Batch>>();

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

  // Validates and sanitizes the arguments once per batch, as Strapi's resolver does for each row.
  const batchFor = (
    context: Context,
    uid: string,
    attributeName: string,
    targetUID: Common.UID.Schema,
    args: TransformedArgs
  ) => {
    let batches = batchesByRequest.get(context);
    if (!batches) {
      batches = new Map();
      batchesByRequest.set(context, batches);
    }
    const key = JSON.stringify([uid, attributeName, args]);
    let batch = batches.get(key);
    if (!batch) {
      const targetContentType = strapi.getModel(targetUID);
      const { auth } = context.state;
      const sanitizedArgs = (async (): Promise<TransformedArgs> => {
        await validate.contentAPI.query(args, targetContentType, { auth });
        return sanitize.contentAPI.query(args, targetContentType, { auth });
      })();
      const loader = new DataLoader<Id, unknown>(
        async ids => {
          const params = transformParamsToQuery(targetUID, await sanitizedArgs);
          return loadRelation(uid, attributeName, params, ids);
        },
        { cache: false }
      );
      batch = { sanitizedArgs, loader };
      batches.set(key, batch);
    }
    return batch;
  };

  const createBuilders = builders.new;
  builders.new = (name: string, registry: unknown) => {
    const created = createBuilders(name, registry);
    const buildAssociationResolver: (options: AssociationOptions) => Resolver =
      created.buildAssociationResolver;

    created.buildAssociationResolver = (options: AssociationOptions): Resolver => {
      const strapiResolver = buildAssociationResolver(options);
      const { contentTypeUID, attributeName } = options;
      const attribute = strapi.getModel(contentTypeUID).attributes[attributeName] as Attribute;
      if (isMorphRelation(attribute)) {
        return strapiResolver;
      }
      const isMediaAttribute = isMedia(attribute);
      const targetUID = (
        isMediaAttribute ? 'plugin::upload.file' : attribute.target
      ) as Common.UID.Schema;
      const isToMany = isMediaAttribute ? attribute.multiple : attribute.relation.endsWith('Many');
      const targetContentType = strapi.getModel(targetUID);

      return async (parent, requestedArgs = {}, context, info) => {
        const args = withoutDeleted(targetUID, requestedArgs);
        const transformedArgs: TransformedArgs = transformArgs(args, {
          contentType: targetContentType,
          usePagination: true,
        });
        if (transformedArgs.start || transformedArgs.limit !== -1) {
          return strapiResolver(parent, args, context, info);
        }
        const { sanitizedArgs, loader } = batchFor(
          context,
          contentTypeUID,
          attributeName,
          targetUID,
          transformedArgs
        );
        const data = await loader.load(parent.id);
        const responseInfo = { args: await sanitizedArgs, resourceUID: targetUID };
        return isToMany
          ? toEntityResponseCollection(data, responseInfo)
          : toEntityResponse(data, responseInfo);
      };
    };
    return created;
  };
};
