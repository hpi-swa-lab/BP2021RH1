import { StrapiContext, StrapiExtended } from '../types';

// graphql-upload has no type declarations
const graphqlUploadKoa = require('graphql-upload/graphqlUploadKoa.js');

export default (_config: unknown, { strapi }: { strapi: StrapiExtended }) => {
  const graphQLEndpoint: string = strapi.plugin('graphql').config('endpoint');
  const parseUploads = graphqlUploadKoa();

  return async (context: StrapiContext, next: () => Promise<unknown>) =>
    context.path === graphQLEndpoint ? parseUploads(context, next) : next();
};
