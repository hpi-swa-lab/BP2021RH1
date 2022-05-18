module.exports = {
  apps: [
    {
      name: 'BP-Gallery Strapi',
      script: 'yarn start',
      instances: 1,
      autorestart: true,
      max_restarts: 50,
    }
  ],
  deploy: {
    production: {
      key: 'deploy.key',
      user: 'github',
      ref: 'origin/main',
      host: 'bp.bad-harzburg-stiftung.de',
      path: '/home/dev/production',
      repo: 'https://github.com/hpi-swa-lab/BP2021RH1',
      'post-deploy': 'yarn install && yarn build:prod && pm2 reload ecosystem.config.js --env production && pm2 save && git checkout yarn.lock'
    }
  }
}
