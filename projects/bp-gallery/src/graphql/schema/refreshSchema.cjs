const fs = require('fs');
const { getIntrospectionQuery } = require('graphql');

const url = `${process.env.VITE_REACT_APP_API_BASE ?? 'http://localhost:9000'}/graphql`;

(async () => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: getIntrospectionQuery() }),
  });
  const { data, errors } = await response.json();
  if (!response.ok || errors) {
    throw new Error(`Introspection at ${url} failed: ${JSON.stringify(errors ?? response.status)}`);
  }
  await fs.promises.writeFile(`${__dirname}/schema.json`, JSON.stringify(data, null, 2));
})();
