'use strict';

/**
 * A set of functions called "actions" for `bulk`
 */


module.exports = {
  async bulkUpdate(ctx) {
    const { userAbility } = ctx.state;
    const { model } = ctx.params;
    const { body } = ctx.request;
    const { ids, attribute, value } = body;

    const bulkManager = strapi.service('api::bulk.bulk');

    const entityPromises = ids.map((id) => strapi.entityService.findOne(model, id));
    const entities = await Promise.all(entityPromises);

    for (const entity of entities) {
      if (!entity) {
        return ctx.notFound();
      }
    }

    const { count } = await bulkManager.updateMany(entities, model, attribute, value);
    ctx.body = { count };
  },
};
