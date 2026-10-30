set -e
export PATH="$PATH:~/.nvm/versions/node/v18.16.0/bin/"
npm install --global "$(node -p "require('./package.json').packageManager")"
# pnpm doesn't replace a node_modules folder that yarn made
for project in . ../bp-graphql; do
  [ ! -f $project/node_modules/.yarn-integrity ] || rm -rf $project/node_modules
done
(cd ../bp-graphql && pnpm install --frozen-lockfile && pnpm build)
pnpm install --frozen-lockfile
rm -rf dist && cp -r /home/github/harz-history-staging/strapi-dist dist
pnpm pm2 reload ecosystem.aws.config.js --env staging
pnpm pm2 save
