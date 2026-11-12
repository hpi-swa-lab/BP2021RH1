import type { Core } from '@strapi/strapi';
import { ParameterizedPermission, UsersPermissionsUser } from 'bp-graphql/build/db-types';
import type { knex } from 'knex';
import type { ParameterizedContext } from 'koa';
import type * as Nexus from 'nexus';

export type KnexEngine = typeof knex & ReturnType<typeof knex>;

export type QueryBuilder = ReturnType<KnexEngine['select']>;

export type GqlExtension = {
  strapi: StrapiExtended;
  nexus: typeof Nexus;
};

type ContextState = {
  user: UsersPermissionsUser;
};

// See https://koajs.com/#context and https://github.com/jeffijoe/koa-respond
type Context = {
  send: (statusCode: number, body: string | Object) => StrapiContext;
  request: { body: unknown };
} & Record<
  | 'created'
  | 'noContent'
  | 'badRequest'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'locked'
  | 'internalServerError'
  | 'notImplemented',
  (body: string | Object) => StrapiContext
>;

export type StrapiContext = ParameterizedContext<ContextState, Context>;

export type StrapiGqlContext = {
  state: ContextState;
  koaContext: StrapiContext;
};

export type StrapiExtended = Omit<Core.Strapi, 'db'> & {
  db: Omit<Core.Strapi['db'], 'connection'> & { connection: KnexEngine };
};

export type ParameterizedPermissionsAuth = {
  ability: ParameterizedPermission[];
  credentials: UsersPermissionsUser | null;
};
