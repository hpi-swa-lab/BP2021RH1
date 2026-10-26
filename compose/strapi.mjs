// Starts Strapi with the given command, then has its Meilisearch plugin index pictures and comments
// unless they are indexed already. The healthcheck in docker-compose.yml waits for /tmp/ready.
import { spawn } from 'node:child_process';
import { rmSync, writeFileSync } from 'node:fs';

rmSync('/tmp/ready', { force: true });
const strapi = spawn(process.argv[2], process.argv.slice(3), { stdio: 'inherit' });
strapi.on('exit', code => process.exit(code ?? 1));
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => strapi.kill(signal));

const api = 'http://127.0.0.1:9000';
const request = (path, { token, body } = {}) =>
  fetch(api + path, {
    method: body ? 'POST' : 'GET',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(body && { 'Content-Type': 'application/json' }),
    },
    body: body && JSON.stringify(body),
  }).then(response => {
    if (!response.ok) throw new Error(`${path}: ${response.status}`);
    return response.json();
  });

while (!(await request('/admin/init').catch(() => false))) {
  await new Promise(resolve => setTimeout(resolve, 1000));
}

const { token } = (
  await request('/admin/login', { body: { email: 'dev@example.com', password: 'Dev12345' } })
).data;
const { contentTypes } = (await request('/meilisearch/content-type', { token })).data;
for (const contentType of ['api::picture.picture', 'api::comment.comment']) {
  if (contentTypes.some(type => type.contentType === contentType && type.indexed)) {
    console.log(`${contentType} is indexed already`);
  } else {
    await request('/meilisearch/content-type', { token, body: { contentType } });
    console.log(`indexing ${contentType}`);
  }
}

writeFileSync('/tmp/ready', '');
