import { Strapi } from "@strapi/strapi";
import { knex } from "knex";
import { Context } from "koa";
import type * as Nexus from "nexus";

export type KnexEngine = typeof knex & ReturnType<typeof knex>;

export type GqlExtension = {
  strapi: Strapi & { db: { connection: KnexEngine } };
  nexus: typeof Nexus;
};

// See https://koajs.com/#context and https://github.com/jeffijoe/koa-respond
export type StrapiContext = Context & {
  send: (statusCode: number, body: string | Object) => StrapiContext;
} & Record<
    | "created"
    | "noContent"
    | "badRequest"
    | "unauthorized"
    | "forbidden"
    | "notFound"
    | "locked"
    | "internalServerError"
    | "notImplemented",
    (body: string | Object) => StrapiContext
  >;
