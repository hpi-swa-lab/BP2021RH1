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
      key: "deploy_key",
      user: process.env.REMOTE_USER,
      ref: "origin/main",
      host: process.env.REMOTE_HOST,
      path: "/home/github/harz-history",
      repo: "https://github.com/hpi-swa-lab/BP2021RH1",
      "post-deploy": "cd projects/bp-strapi && ./postdeploy.sh",
    },
    staging: {
      key: "deploy_key",
      user: process.env.REMOTE_USER,
      ref: "origin/staging",
      host: process.env.REMOTE_HOST,
      path: "/home/github/harz-history-staging",
      repo: "https://github.com/hpi-swa-lab/BP2021RH1",
      "post-deploy": "cd projects/bp-strapi && ./postdeploy.staging.sh",
    },
  },
};
