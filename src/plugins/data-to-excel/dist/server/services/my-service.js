"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async getContent({ content, startDate, endDate, }) {
        const payload = endDate
            ? {
                $and: [
                    {
                        ...(content === 'api::application.application' ? { approved: true } : {}),
                        createdAt: { $gte: startDate },
                    },
                    {
                        createdAt: { $lte: endDate },
                    },
                ],
            }
            : {
                approved: true,
                createdAt: { $gte: startDate },
            };
        return await strapi.db
            .query(content)
            .findMany({
            populate: [
                'auto_park',
                'cargo',
                'counterpartie',
                'loading_point',
                'unloading_point',
                'users_permissions_user',
            ],
            where: payload,
        })
            .then((response) => response)
            .catch((error) => {
            return error;
        });
    },
});
