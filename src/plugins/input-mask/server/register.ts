import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.customFields.register({
    name: 'input-mask',
    plugin: 'input-mask',
    type: 'text',
  });
};
