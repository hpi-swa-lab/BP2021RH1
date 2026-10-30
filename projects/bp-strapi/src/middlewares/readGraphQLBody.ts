import bodyParser from 'koa-bodyparser';
import { StrapiContext, StrapiExtended } from '../types';

// Apollo reads the body only after authentication, so a save the browser aborts by leaving the page is lost.
export default (_config: unknown, { strapi }: { strapi: StrapiExtended }) => {
  const graphQLEndpoint: string = strapi.plugin('graphql').config('endpoint');
  const parseJson = bodyParser({ enableTypes: ['json'] });

  return async (context: StrapiContext, next: () => Promise<unknown>) => {
    if (context.path === graphQLEndpoint && context.request.is('application/json')) {
      return parseJson(context, next);
    }
    return next();
  };
};
