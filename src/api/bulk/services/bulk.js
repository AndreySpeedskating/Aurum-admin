'use strict';

module.exports = () => ({
	async updateMany(entities, uid, attribute, value) {
    if (!entities.length) {
      return null;
    }

    const entitiesToUpdate = entities
      .filter((entity) => entity[attribute] !== value)
      .map((entity) => entity.id);

    const filters = { id: { $in: entitiesToUpdate } };
    const data = { [attribute]: value };

    const updatedEntitiesCount = await strapi.db.query(uid).updateMany({
      where: filters,
      data,
    });

    return updatedEntitiesCount;
  },
});
