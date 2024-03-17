'use strict';

/**
 * dictionaries service
 */

module.exports = () => ({
	getConterparties: async () => {
		return await strapi.entityService.findMany('api::counterpartie.counterpartie', {
			  filters: {
					blocked: false
				},
        populate: {
					cargos: { fields: ['id', 'name'] },
					loading_points: { fields: ['id', 'name'] },
					unloading_points: { fields: ['id', 'name'] },
				},
      })
	},

	getLoadingPoints: async () => {
		return await strapi.entityService.findMany('api::loading-point.loading-point', {
			filters: {
					blocked: false
				}
		});
	},

	getUnLoadingPoints: async () => {
		return await strapi.entityService.findMany('api::unloading-point.unloading-point', {
			filters: {
					blocked: false
				}
		});
	},

	getMyApplications: async (userId) => {
		return await strapi.entityService.findMany('api::application.application', {
			populate: {
				counterpartie: { fields: ['id', 'name'] },
				loading_point: { fields: ['id', 'name'] },
				unloading_point: { fields: ['id', 'name'] },
				cargo: { fields: ['id', 'name'] },
				auto_park: { fields: ['GarageNumber', 'StateNumber', 'id'] },
			},
			filters: {
				users_permissions_user: { id: userId }
			},
			sort: { createdAt: 'DESC' }, limit: 30 }
		);
	},

	getAutoPark: async () => {
		return await strapi.entityService.findMany('api::auto-park.auto-park', {
			filters: {
					blocked: false
				}
		});
	},

	getCargo: async () => {
		return await strapi.entityService.findMany('api::cargo.cargo', {
			filters: {
					blocked: false
				}
		});
	},

	updateUserDeviceInfo: async (id, device_id) => {
		return await strapi.entityService.update('plugin::users-permissions.user', id, {
      data: { device_id },
    });
	}
});
