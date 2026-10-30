import type { Attribute, Common, Strapi } from '@strapi/strapi';
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

export type StrapiExtended = Omit<Strapi, 'entityService'> & {
  db: { connection: KnexEngine };
  entityService: EntityService;
};

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

type ResponseAttributes<T extends Common.UID.ContentType> =
  | null
  | (Partial<{
      [K in keyof Attribute.GetAll<T>]: DefaultType<T, K>;
    }> & { id: number });

type PopulateType<T extends Common.UID.ContentType> = {
  [K in keyof Attribute.GetAll<T> as Attribute.GetAll<T>[K] extends Attribute.OfType<
    'relation' | 'component' | 'dynamiczone'
  >
    ? K
    : never]: Attribute.GetAll<T>[K];
};

type PopulateParameter<T extends Common.UID.ContentType> =
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

type Params<T extends Common.UID.ContentType> = Partial<{
  fields: (keyof Attribute.GetAll<T>)[];
  populate: PopulateParameter<T>;
}>;

type FindManyParams<T extends Common.UID.ContentType> = Partial<
  Params<T> & {
    filters: FilterParameters;
    start: Number;
    limit: Number;
    sort: OrderByParameter;
    publicationState: PublicationStateParameter;
  }
>;

type DefaultType<
  T extends Common.UID.ContentType,
  L extends keyof Attribute.GetAll<T>
> = Attribute.GetAll<T>[L] extends Attribute.Any
  ? Attribute.GetValue<Attribute.GetAll<T>[L]> extends boolean
    ? boolean
    : Attribute.GetValue<Attribute.GetAll<T>[L]>
  : any;

type MutateParams<T extends Common.UID.ContentType> = Params<T> & {
  data: Partial<{ [K in keyof Attribute.GetAll<T>]: DefaultType<T, K> }>;
};

export interface EntityService {
  findOne: <T extends Common.UID.ContentType>(
    uid: T,
    id: number,
    parameters: Params<T>
  ) => Promise<ResponseAttributes<T>>;
  findMany: <T extends Common.UID.ContentType, K extends FindManyParams<T>>(
    uid: T,
    parameters: K
  ) => Promise<ResponseAttributes<T>[]>;
  create: <T extends Common.UID.ContentType>(
    uid: T,
    parameters: Params<T> & { data: Object }
  ) => Promise<Object>;
  update: <T extends Common.UID.ContentType>(
    uid: T,
    parameters: MutateParams<T>
  ) => Promise<Object>;
  delete: <T extends Common.UID.ContentType>(
    uid: T,
    id: number,
    parameters: Params<T>
  ) => Promise<Object>;
}

export type ParameterizedPermissionsAuth = {
  ability: ParameterizedPermission[];
  credentials: UsersPermissionsUser | null;
};
