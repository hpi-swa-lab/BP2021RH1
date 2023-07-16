import type { Attribute, GetAttributeValue, GetAttributes, Strapi } from '@strapi/strapi';
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
  withGrowthBook?: (theCtx: StrapiGqlContext, f: any) => void;
};

// See https://koajs.com/#context and https://github.com/jeffijoe/koa-respond
type Context = {
  send: (statusCode: number, body: string | Object) => StrapiContext;
  req?: { headers?: { anonymousid?: string } };
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

export type StrapiExtended = Omit<Strapi, 'entityService'> & {
  db: { connection: KnexEngine };
  entityService: EntityService;
};

declare module '@strapi/strapi' {
  export interface Strapi {
    requestContext: {
      get(): { url: string };
    };
  }
}

type FilterParameters = Partial<
  Record<
    | '$and'
    | '$or'
    | '$not'
    | '$eq'
    | '$eqi'
    | '$ne'
    | '$in'
    | '$notIn'
    | '$lt'
    | '$lte'
    | '$gt'
    | '$gte'
    | '$between'
    | '$contains'
    | '$notContains'
    | '$containsi'
    | '$notContainsi'
    | '$startsWith'
    | '$endsWith'
    | '$null'
    | '$notNull',
    any
  >
>;

type OrderByParameter = string | string[] | { [key: string]: string } | { [key: string]: string }[];

type ResponseAttributes<T extends Strapi.ContentTypeUIDs> =
  | null
  | (Partial<{
      [K in keyof GetAttributes<T>]: DefaultType<T, K>;
    }> & { id: number });

type PopulateType<T extends Strapi.ContentTypeUIDs> = {
  [K in keyof GetAttributes<T> as GetAttributes<T>[K] extends Attribute<
    'relation' | 'component' | 'dynamiczone'
  >
    ? K
    : never]: GetAttributes<T>[K];
};

type PopulateParameter<T extends Strapi.ContentTypeUIDs> =
  | '*'
  | (keyof PopulateType<T>)[]
  | { [key: string]: boolean }
  | {
      [key: string]: {
        fields: string[];
        filters: FilterParameters;
        sort: string;
        populate: PopulateParameter<T>;
      };
    };

type PublicationStateParameter = 'live' | 'preview';

type Params<T extends Strapi.ContentTypeUIDs> = Partial<{
  fields: (keyof GetAttributes<T>)[];
  populate: PopulateParameter<T>;
}>;

type FindManyParams<T extends Strapi.ContentTypeUIDs> = Partial<
  Params<T> & {
    filters: FilterParameters;
    start: Number;
    limit: Number;
    sort: OrderByParameter;
    publicationState: PublicationStateParameter;
  }
>;

type DefaultType<
  T extends Strapi.ContentTypeUIDs,
  L extends keyof GetAttributes<T>
> = GetAttributes<T>[L] extends Attribute
  ? GetAttributeValue<GetAttributes<T>[L]> extends boolean
    ? boolean
    : GetAttributeValue<GetAttributes<T>[L]>
  : any;

type MutateParams<T extends Strapi.ContentTypeUIDs> = Params<T> & {
  data: Partial<{ [K in keyof GetAttributes<T>]: DefaultType<T, K> }>;
};

export interface EntityService {
  findOne: <T extends Strapi.ContentTypeUIDs>(
    uid: T,
    id: number,
    parameters: Params<T>
  ) => Promise<ResponseAttributes<T>>;
  findMany: <T extends Strapi.ContentTypeUIDs, K extends FindManyParams<T>>(
    uid: T,
    parameters: K
  ) => Promise<ResponseAttributes<T>[]>;
  create: <T extends Strapi.ContentTypeUIDs>(
    uid: T,
    parameters: Params<T> & { data: Object }
  ) => Promise<Object>;
  update: <T extends Strapi.ContentTypeUIDs>(
    uid: T,
    parameters: MutateParams<T>
  ) => Promise<Object>;
  delete: <T extends Strapi.ContentTypeUIDs>(
    uid: T,
    id: number,
    parameters: Params<T>
  ) => Promise<Object>;
}

export type ParameterizedPermissionsAuth = {
  ability: ParameterizedPermission[];
  credentials: UsersPermissionsUser | null;
};
