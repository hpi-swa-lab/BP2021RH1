'use strict';

/**
 * person-tag service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::person-tag.person-tag');
