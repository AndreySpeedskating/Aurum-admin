import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  async getContent({
    content,
    startDate,
    endDate,
  }: {
    content: string;
    startDate: string;
    endDate?: string;
  }) {
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
