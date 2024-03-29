import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.customFields.register({
    name: 'phone-field',
    plugin: 'phone-input',
    type: 'text',
  });
};
