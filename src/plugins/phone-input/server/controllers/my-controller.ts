import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  index(ctx) {
    ctx.body = strapi.plugin('phone-input').service('myService').getWelcomeMessage();
  },
});
