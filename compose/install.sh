#!/bin/sh
# Installs the dependencies of the given projects (default: all three, in this
# order) inside the node:18 container.
set -e

# bp-graphql is a file dependency, so yarn keeps a copy in node_modules that it
# doesn't update on later installs. `yarn upgrade bp-graphql` would also bump
# unrelated packages in yarn.lock, so copy the fresh build instead.
refresh_bp_graphql() {
  rm -rf node_modules/bp-graphql/build
  cp -r ../bp-graphql/build node_modules/bp-graphql/build
}

for project in ${*:-bp-graphql bp-strapi bp-gallery}; do
  cd /repo/projects/$project
  yarn install --frozen-lockfile
  case $project in
    bp-graphql) yarn build ;;
    bp-strapi)
      refresh_bp_graphql
      mkdir -p public/uploads
      tar -xf e2e/uploads.tar.gz --skip-old-files -C public/uploads
      ;;
    bp-gallery) refresh_bp_graphql ;;
  esac
done
