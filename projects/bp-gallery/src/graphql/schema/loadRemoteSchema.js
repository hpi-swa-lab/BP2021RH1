const fs = require('fs');
const { buildClientSchema, getIntrospectionQuery } = require('graphql');
const fetch = require('node-fetch');

/**
 * Custom implementation of running an introspection query on the given remote endpoint.
 * Necessary because we want to fallback to a local schema file instead of exiting the whole
 * codegen-process, if the remote server is unavailable.
 *
 * @see https://www.graphql-code-generator.com/docs/config-reference/schema-field#custom-schema-loader
 * @see https://gist.github.com/craigbeck/b90915d49fda19d5b2b17ead14dcd6da#gistcomment-3204270
 */
module.exports = async remoteUrl => {
  const introspectionQuery = getIntrospectionQuery();

  if (process.env.REACT_APP_API_BASE) {
    remoteUrl = `${process.env.REACT_APP_API_BASE}/graphql`;
  }

  const response = await fetch(remoteUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: introspectionQuery }),
  }).catch(() => Promise.resolve(null));

  if (!response || !response.ok) {
    // Custom logic for our use-case is here: just return without throwing errors.
    console.warn(
      `
      Remote server unavailable for schema introspection.
      Continuing with local schema file.
      `
    );
    return;
  }

  const { data } = await response.json();

  // Generate fallback schema file
  await fs.promises.writeFile('./src/graphql/schema/schema.json', JSON.stringify(data, null, 2));

  return buildClientSchema(data);
};
