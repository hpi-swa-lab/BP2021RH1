import type * as Nexus from "nexus";
import { Strapi } from "@strapi/strapi";
import { knex } from "knex";

export type KnexEngine = typeof knex & ReturnType<typeof knex>;

export type GqlExtension = {
  strapi: Strapi & { db: { connection: KnexEngine } };
  nexus: typeof Nexus;
};
