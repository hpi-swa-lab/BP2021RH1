set -e
export PATH="$HOME/.nvm/versions/node/v22.23.4/bin:$PATH"
npm install --global "$(node -p "require('./package.json').packageManager")"
# pnpm doesn't replace a node_modules folder that yarn made
for project in . ../bp-graphql; do
  [ ! -f $project/node_modules/.yarn-integrity ] || rm -rf $project/node_modules
done
(cd ../bp-graphql && pnpm install --frozen-lockfile && pnpm build)
pnpm install --frozen-lockfile
rm -rf dist && cp -r /home/github/harz-history/strapi-dist dist
pnpm pm2 reload ecosystem.aws.config.js --env production --update-env
./wait-for-start.sh production
pnpm pm2 save
