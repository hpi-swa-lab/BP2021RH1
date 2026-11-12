# Strapi

The backend in `projects/bp-strapi` is Strapi 5. The gallery talks to it only through GraphQL, with the operations in `projects/bp-graphql`. Much of our code hooks into Strapi's internals. This page lists what goes wrong easily there.

## GraphQL schema

- The GraphQL plugin runs with `v4CompatibilityMode`. Lists and to-many relations keep the `data`/`attributes` shape only under `<field>_connection` (`pictures_connection`), so the operations ask for those fields under the old names with aliases (`pictures: pictures_connection`).
- Apollo's cache in the gallery keys fields by their names, not by the aliases. The field policies in `src/components/App.tsx` therefore name `pictures_connection` and so on. A policy under the alias does nothing, and loading more entries into a list then breaks.
- The gallery identifies entries by their numeric `id`: in URLs, in permissions, in raw SQL and in the search index. Strapi's single queries, updates and deletes take a `documentId`. `src/numericIds.ts` adds an `id` filter and lets a `documentId` argument also take an `id`.
- `src/uploadMutations.ts` adds `multipleUpload` and `removeFile`, because Strapi 5's GraphQL plugin has no uploads. Apollo Server refuses multipart requests without the `apollo-require-preflight` header, so the gallery's upload link sends it.

## GraphQL extensions

- Strapi merges the `resolversConfig` of the extensions registered with `extensionService.use` with lodash `merge`. Two `middlewares` lists for the same resolver are merged by index, so one middleware replaces the other without an error. Put all `middlewares` for a resolver into one extension (see the `mergeWith` in `src/index.ts`).
- The gallery sends its permission checks (`canRunOperation`) as batched requests. Apollo Server refuses them unless `allowBatchedHttpRequests` is on (`config/plugins.js`). The generated permission hooks treat a failed check as allowed, so a refused request shows visitors the curators' buttons without any error on the page.

## Search index

- The Meilisearch plugin updates the index only after changes made through the Document Service (`strapi.documents`). Code that writes with raw SQL or `strapi.db.query` (most of `src/api/picture/services/custom-update.ts`) calls `reindexPictures` afterwards.
- The plugin builds its document ids from `documentId` (`picture-<documentId>`), so the `transformEntry` functions in `config/plugins.js` must keep `documentId` in what they return.

## Database

- The link tables of relations end in `_lnk` (`pictures_linked_pictures_lnk`). Strapi shortens long table and column names and hashes those over 55 characters. Read the real name from the database before writing raw SQL against a new relation.
- Raw SQL must not name a schema, and must work in the schema `dev` too (see AGENTS.md).
