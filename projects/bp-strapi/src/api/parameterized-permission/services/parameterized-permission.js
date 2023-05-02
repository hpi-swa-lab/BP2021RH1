'use strict';

/**
 *  parameterized-permission service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::parameterized-permission.parameterized-permission');
