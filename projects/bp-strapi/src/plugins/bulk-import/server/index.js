'use strict';

const bootstrap = require('./bootstrap');
const controllers = require('./controllers');
const routes = require('./routes');
const services = require('./services');

module.exports = {
  bootstrap,
  routes,
  controllers,
  services,
};
