module.exports = {
  apps: [
    {
      name: "Bad-Harzburg Archive Strapi Instance",
      script: "yarn start",
      append_env_to_name: true,
      instances: 1,
      autorestart: true,
      max_restarts: 50,
    },
  ],
  deploy: {
    production: {
      key: "deploy_rsa",
      user: process.env.REMOTE_USER,
      ref: "origin/466-setup-strapi-for-aws",
      host: process.env.REMOTE_HOST,
      ssh_options: "StrictHostKeyChecking=no",
      path: "/home/github/harz-history",
      repo: "https://github.com/hpi-swa-lab/BP2021RH1",
      "post-deploy":
        'export PATH="$PATH:~/.npm-global/bin/" && cd projects/bp-strapi && yarn install --frozen-lockfile && yarn build:prod && yarn pm2 reload ecosystem.aws.config.js --env production && yarn pm2 save',
    },
    staging: {
      key: "deploy.key",
      user: process.env.REMOTE_USER,
      ref: "origin/466-setup-strapi-for-aws",
      host: process.env.REMOTE_HOST,
      path: "/home/github/harz-history-staging",
      repo: "https://github.com/hpi-swa-lab/BP2021RH1",
      "post-deploy":
        "cd projects/bp-strapi && yarn install --frozen-lockfile && yarn build && yarn pm2 reload ecosystem.aws.config.js --env staging && yarn pm2 save",
    },
  },
};
