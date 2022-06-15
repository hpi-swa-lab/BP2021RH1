module.exports = {
  apps: [
    {
      name: 'Bad-Harzburg Archive Strapi Instance',
      script: 'yarn start',
      instances: 1,
      autorestart: true,
      max_restarts: 50,
    }
  ],
  deploy: {
    production: {
      key: 'deploy.key',
      user: process.env.REMOTE_USER,
      ref: 'origin/main',
      host: process.env.REMOTE_HOST,
      path: '/home/github/BP2021RH1',
      repo: 'https://github.com/hpi-swa-lab/BP2021RH1',
      'post-deploy': 'cd projects/bp-strapi && yarn install --frozen-lockfile && yarn build:prod && yarn pm2 reload ecosystem.config.js --env production && yarn pm2 save'
    },
    staging: {
      key: 'deploy.key',
      user: process.env.REMOTE_USER,
      ref: 'origin/staging',
      host: process.env.REMOTE_HOST,
      path: '/home/github/BP2021RH1-staging',
      repo: 'https://github.com/hpi-swa-lab/BP2021RH1',
      'post-deploy': 'cd projects/bp-strapi && yarn install --frozen-lockfile && yarn build && yarn pm2 reload ecosystem.config.js --env staging && yarn pm2 save'
    }
  }
}
