'use strict';

/**
 * auto-park service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::auto-park.auto-park');
