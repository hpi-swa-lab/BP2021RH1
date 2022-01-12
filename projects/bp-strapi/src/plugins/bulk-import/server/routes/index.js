'use strict';

const adminInterfaceRoutes = require('./admin');
const backendRoutes = require('./content-api');

module.exports = {
  admin: adminInterfaceRoutes,
  'content-api': backendRoutes, // important damit die Routen im Permissions-Plugin berücksichtigt werden
};
