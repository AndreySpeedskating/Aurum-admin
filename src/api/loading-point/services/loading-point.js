'use strict';

/**
 * loading-point service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::loading-point.loading-point');
