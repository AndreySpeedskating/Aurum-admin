import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  async getContent(ctx) {
    const { content, startDate, endDate } = ctx.request.body;
    try {
      return await strapi
        .plugin('data-to-excel')
        .service('myService')
        .getContent({ content, startDate, endDate });
    } catch (err) {
      ctx.trow(500, err);
    }
  },
});
