export PATH="$PATH:~/.nvm/versions/node/v18.16.0/bin/"
yarn install --frozen-lockfile
yarn build
yarn pm2 reload ecosystem.aws.config.js --env staging
yarn pm2 save
