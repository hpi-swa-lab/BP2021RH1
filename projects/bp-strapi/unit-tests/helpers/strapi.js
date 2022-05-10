const Strapi = require('@strapi/strapi');
const http = require('http');

let instance;

async function setupStrapi() {
  if (!instance) {
    await Strapi().start();
    instance = strapi;
  }
  return instance;
}
module.exports = { setupStrapi };
