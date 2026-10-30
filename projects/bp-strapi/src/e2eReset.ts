import { StrapiExtended } from './types';

// Only for the e2e stacks (E2E_RESET in docker-compose.e2e.yml): POST /e2e/reset puts the database and the
// search index back to how they were at the first reset, which runs before the first test (e2e/test.ts)
const seed = 'e2e_seed';

type MeilisearchTask = { taskUid: number };

export const registerE2eReset = (strapi: StrapiExtended) => {
  // The reset overwrites every table without a login, so refuse to start anywhere but an e2e stack, whose
  // database is the Compose service postgres; the servers use other hosts
  if (process.env.DATABASE_HOST !== 'postgres' || process.env.NODE_ENV === 'production') {
    throw new Error('E2E_RESET is set outside an e2e stack; refusing to start with the e2e reset');
  }
  // Strapi sets up its database and plugins only after register
  const db = () => strapi.db.connection;
  const schema = () => strapi.db.getSchemaName() ?? 'public';
  const meilisearch = () => strapi.plugin('meilisearch');

  const tables = async () =>
    (
      (await db().raw('SELECT tablename FROM pg_tables WHERE schemaname = ? ORDER BY tablename', [
        schema(),
      ])) as { rows: { tablename: string }[] }
    ).rows.map(row => `"${row.tablename}"`);

  const hashesOf = (schema: string, names: string[]) =>
    names
      .map(
        name =>
          `SELECT '${name.replace(/'/g, "''")}' AS name,
            md5(coalesce(string_agg(t::text, ',' ORDER BY t::text), '')) AS hash FROM ${schema}.${name} t`
      )
      .join(' UNION ALL ');

  const takeSnapshot = async () => {
    const names = await tables();
    await db().transaction(async trx => {
      await trx.raw(`CREATE SCHEMA ${seed}`);
      for (const name of names) {
        await trx.raw(`CREATE TABLE ${seed}.${name} AS TABLE ${schema()}.${name}`);
      }
      await trx.raw(
        `CREATE TABLE ${seed}.e2e_sequences AS
          SELECT sequencename, last_value FROM pg_sequences WHERE schemaname = ?`,
        [schema()]
      );
      await trx.raw(`CREATE TABLE ${seed}.e2e_hashes AS ${hashesOf(schema(), names)}`);
    });
  };

  // Restores the tables that changed since the snapshot and tells whether there were any
  const restoreSnapshot = async () => {
    const names = await tables();
    const { rows } = (await db().raw(
      `SELECT now.name FROM (${hashesOf(schema(), names)}) now
        JOIN ${seed}.e2e_hashes seed USING (name) WHERE now.hash <> seed.hash`
    )) as { rows: { name: string }[] };
    await db().transaction(async trx => {
      // Skips the foreign key checks while the tables are refilled one after the other
      await trx.raw('SET LOCAL session_replication_role = replica');
      for (const { name } of rows) {
        await trx.raw(`DELETE FROM ${schema()}.${name}`);
        await trx.raw(`INSERT INTO ${schema()}.${name} SELECT * FROM ${seed}.${name}`);
      }
      // Also when no rows changed, since a test may have added a row and deleted it again
      await trx.raw(
        `SELECT setval(format('%I.%I', ?::text, sequencename), coalesce(last_value, 1), last_value IS NOT NULL)
          FROM ${seed}.e2e_sequences`,
        [schema()]
      );
    });
    return rows.length > 0;
  };

  const reindex = async () => {
    const store = meilisearch().service('store');
    const service = meilisearch().service('meilisearch');
    const { host, apiKey } = (await store.getCredentials()) as { host: string; apiKey: string };
    const request = async (path: string, method = 'GET') => {
      const response = await fetch(host + path, {
        method,
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!response.ok) throw new Error(`Meilisearch ${method} ${path}: ${response.status}`);
      return response.json() as Promise<Record<string, unknown>>;
    };
    const tasks: number[] = [];
    for (const contentType of (await store.getIndexedContentTypes()) as string[]) {
      const index = service.getIndexNameOfContentType({ contentType }) as string;
      tasks.push(
        ((await request(`/indexes/${index}/documents`, 'DELETE')) as MeilisearchTask).taskUid
      );
      await meilisearch()
        .service('contentType')
        .actionInBatches({
          contentType,
          entriesQuery: service.entriesQuery({ contentType }),
          callback: async ({ entries }: { entries: unknown[] }) => {
            const task = (await service.addEntriesToMeilisearch({
              contentType,
              entries,
            })) as MeilisearchTask;
            tasks.push(task.taskUid);
          },
        });
    }
    for (const task of tasks) {
      let status: string;
      while (
        ['enqueued', 'processing'].includes(
          (status = (await request(`/tasks/${task}`)).status as string)
        )
      ) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      if (status !== 'succeeded') throw new Error(`Meilisearch task ${task}: ${status}`);
    }
  };

  let running = Promise.resolve();
  // Stays set until a re-index succeeds, since a later reset finds the tables restored already
  let reindexPending = false;
  const reset = async () => {
    const { rows } = (await db().raw('SELECT 1 FROM pg_namespace WHERE nspname = ?', [seed])) as {
      rows: unknown[];
    };
    if (rows.length === 0) {
      await takeSnapshot();
    } else {
      if (await restoreSnapshot()) reindexPending = true;
      if (reindexPending) {
        await reindex();
        reindexPending = false;
      }
    }
  };

  // Plain Koa middleware: a Strapi route answers 401 here even with `auth: false`
  strapi.server.use(
    async (ctx: { method: string; path: string; status: number }, next: () => Promise<void>) => {
      if (ctx.method !== 'POST' || ctx.path !== '/e2e/reset') return next();
      running = running.then(reset, reset);
      await running;
      ctx.status = 204;
    }
  );
};
