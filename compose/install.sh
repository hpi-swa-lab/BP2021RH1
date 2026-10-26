#!/bin/sh
# Installs the dependencies of all three projects inside the node:18 container.
set -e

# bp-graphql is a file dependency, so yarn keeps a copy in node_modules that it
# doesn't update on later installs. `yarn upgrade bp-graphql` would also bump
# unrelated packages in yarn.lock, so copy the fresh build instead.
refresh_bp_graphql() {
  rm -rf node_modules/bp-graphql/build
  cp -r ../bp-graphql/build node_modules/bp-graphql/build
}

cd /repo/projects/bp-graphql
yarn install --frozen-lockfile
yarn build

cd /repo/projects/bp-strapi
yarn install --frozen-lockfile
refresh_bp_graphql
mkdir -p public/uploads
tar -xf e2e/uploads.tar.gz --skip-old-files -C public/uploads

cd /repo/projects/bp-gallery
yarn install --frozen-lockfile
refresh_bp_graphql
