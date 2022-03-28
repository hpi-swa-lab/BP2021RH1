'use strict';

const adminInterfaceRoutes = require('./admin');
const backendRoutes = require('./content-api');

module.exports = {
  admin: adminInterfaceRoutes,
  // Important in order to make these routes accessible to the User-Permissions-Plugin.
  'content-api': backendRoutes,
};
