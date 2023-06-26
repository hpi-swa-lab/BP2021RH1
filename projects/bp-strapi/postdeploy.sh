set -e
export PATH="$PATH:~/.nvm/versions/node/v18.16.0/bin/"
(cd ../bp-graphql && yarn install --frozen-lockfile && yarn build)
yarn install --frozen-lockfile
yarn upgrade bp-graphql
yarn build:prod
yarn pm2 reload ecosystem.aws.config.js --env production
yarn pm2 save
