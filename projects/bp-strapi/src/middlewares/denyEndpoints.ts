import { authenticate as adminAuthenticate } from '@strapi/admin/server/strategies/admin';
import { errors } from '@strapi/utils';
import { StrapiContext, StrapiExtended } from '../types';

const { UnauthorizedError } = errors;

export default (_config: unknown, { strapi }: { strapi: StrapiExtended }) => {
  const graphQLEndpoint: string = strapi.plugin('graphql').config('endpoint');
  const serverStatusEndpoint = '/';
  const adminPanelPrefix = strapi.config.admin.path;

  const allowedEndpoints: ({ exact: string } | { startsWith: string })[] = [
    {
      exact: graphQLEndpoint,
    },
    {
      exact: serverStatusEndpoint,
    },
    {
      exact: adminPanelPrefix, // without trailing slash
    },
    {
      startsWith: adminPanelPrefix + '/',
    },
    {
      startsWith: '/assets/images/',
    },
    {
      startsWith: '/uploads/',
    },
    {
      exact: '/favicon.ico',
    },
  ];

  const match = (allowedEndpoint: typeof allowedEndpoints[number], route: string) => {
    if ('exact' in allowedEndpoint) {
      return route === allowedEndpoint.exact;
    }
    if ('startsWith' in allowedEndpoint) {
      return route.startsWith(allowedEndpoint.startsWith);
    }
  };

  return async (context: StrapiContext, next: () => Promise<unknown>) => {
    if (await isAdminUser(context)) {
      return next();
    }
    for (const allowedEndpoint of allowedEndpoints) {
      if (match(allowedEndpoint, context.url)) {
        return next();
      }
    }
    throw new UnauthorizedError();
  };
};

const isAdminUser = async (context: StrapiContext) => {
  const { authenticated = false } = await adminAuthenticate(context);
  return authenticated;
};
