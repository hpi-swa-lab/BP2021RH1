import { Attribute, DefaultOption, Strapi } from "@strapi/strapi";
import { knex } from "knex";
import type * as Nexus from "nexus";

export type KnexEngine = typeof knex & ReturnType<typeof knex>;

export type QueryBuilder = ReturnType<KnexEngine["select"]>;

export type GqlExtension = {
  strapi: StrapiExtended;
  nexus: typeof Nexus;
};

export type StrapiExtended = Omit<Strapi, "entityService"> & {
  db: { connection: KnexEngine };
  entityService: EntityService;
};

type FilterParameters = Partial<{
  $and: any;
  $or: any;
  $not: any;
  $eq: any;
  $eqi: any;
  $ne: any;
  $in: any;
  $notIn: any;
  $lt: any;
  $lte: any;
  $gt: any;
  $gte: any;
  $between: any;
  $contains: any;
  $notContains: any;
  $containsi: any;
  $notContainsi: any;
  $startsWith: any;
  $endsWith: any;
  $null: any;
  $notNull: any;
}>;

type OrderByParameter =
  | string
  | { [key: string]: string }
  | { [key: string]: string }[];

type TypeAttributes<T extends Strapi.ContentTypeUIDs> =
  Strapi.Schemas[T]["attributes"];

type ResponseAttributes<T extends Strapi.ContentTypeUIDs> =
  | null
  | (Partial<{
      [K in keyof TypeAttributes<T>]: DefaultType<T, K>;
    }> & { id: number });

type PopulateType<T extends Strapi.ContentTypeUIDs> = {
  [K in keyof TypeAttributes<T> as TypeAttributes<T>[K] extends Attribute<"relation">
    ? K
    : never]: TypeAttributes<T>[K];
};

type PopulateParameter<T extends Strapi.ContentTypeUIDs> =
  | "*"
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

type PublicationStateParameter = "live" | "preview";

type Params<T extends Strapi.ContentTypeUIDs> = Partial<{
  fields: (keyof TypeAttributes<T>)[];
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
  L extends keyof TypeAttributes<T>
> = TypeAttributes<T>[L] extends DefaultOption<any>
  ? TypeAttributes<T>[L]["default"]
  : TypeAttributes<T>[L];

type MutateParams<T extends Strapi.ContentTypeUIDs> = Params<T> & {
  data: Partial<{ [K in keyof TypeAttributes<T>]: DefaultType<T, K> }>;
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
