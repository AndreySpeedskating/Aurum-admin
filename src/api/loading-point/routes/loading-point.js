'use strict';

/**
 * loading-point router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::loading-point.loading-point');
