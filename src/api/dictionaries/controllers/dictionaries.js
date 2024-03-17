'use strict';

/**
 * A set of functions called "actions" for `dictionaries`
 */

module.exports = {
  getConterparties: async (ctx, next) => {
    try {
      return await strapi.service('api::dictionaries.dictionaries').getConterparties();
    } catch (err) {
      return err;
    }
  },

  getLoadingPoints: async (ctx, next) => {
    try {
      return await strapi.service('api::dictionaries.dictionaries').getLoadingPoints();
    } catch (err) {
      return err;
    }
  },

  getUnLoadingPoints: async (ctx, next) => {
    try {
      return await strapi.service('api::dictionaries.dictionaries').getUnLoadingPoints();
    } catch (err) {
      return err;
    }
  },

  getMyApplications: async (ctx, next) => {
    const { userId } = ctx.params;
    try {
      return await strapi.service('api::dictionaries.dictionaries').getMyApplications(userId);
    } catch (err) {
      return err;
    }
  },
  getAutoPark: async (ctx, next) => {
    try {
      return await strapi.service('api::dictionaries.dictionaries').getAutoPark();
    } catch (err) {
      return err;
    }
  },

  getCargo: async (ctx, next) => {
    try {
      return await strapi.service('api::dictionaries.dictionaries').getCargo();
    } catch (err) {
      return err;
    }
  },

  updateUserDeviceInfo: async (ctx, next) => {
    const { id } = ctx.params;
    const { body } = ctx.request;
    try {
      return await strapi.service('api::dictionaries.dictionaries').updateUserDeviceInfo(id, body.device_id);
    } catch (err) {
      return err;
    }
  }
};
