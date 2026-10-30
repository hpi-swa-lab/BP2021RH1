#!/bin/sh
# Installs the dependencies of the given projects (default: all three, in this
# order) inside the node:22 container.
set -e

pnpm=$(node -p "require('/repo/projects/bp-gallery/package.json').packageManager")
[ "pnpm@$(pnpm --version 2> /dev/null)" = "$pnpm" ] || npm install --global --prefix /pnpm "$pnpm"

for project in ${*:-bp-graphql bp-strapi bp-gallery}; do
  cd /repo/projects/$project
  pnpm install --frozen-lockfile
  case $project in
    bp-graphql) pnpm build ;;
    bp-strapi)
      mkdir -p public/uploads
      tar -xf e2e/uploads.tar.gz --skip-old-files -C public/uploads
      ;;
  esac
done
