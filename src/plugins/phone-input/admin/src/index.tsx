import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginId from './pluginId';
import PluginIcon from './components/PluginIcon';
import getTrad from './utils/getTrad';

export default {
  register(app: any) {
    app.customFields.register({
      name: 'phone-field',
      pluginId: 'phone-input',
      type: 'string',
      icon: PluginIcon,
      intlLabel: {
        id: 'content-manager.containers.ListPage.table-headers.phone',
        defaultMessage: 'phone',
      },
      intlDescription: {
        id: getTrad('phone-input.description'),
        defaultMessage: 'Введите телефон',
      },
      components: {
        Input: async () => import(/* webpackChunkName: "input-component" */ './components/Input'),
      },
      options: {
        base: [],
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: 'form.attribute.item.requiredField',
                  defaultMessage: 'Required field',
                },
                description: {
                  id: 'form.attribute.item.requiredField.description',
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
              {
                name: 'private',
                type: 'checkbox',
                intlLabel: {
                  id: 'form.attribute.item.privateField',
                  defaultMessage: 'Private field',
                },
                description: {
                  id: 'form.attribute.item.privateField.description',
                  defaultMessage: 'This field will not show up in the API response',
                },
              },
            ],
          },
        ],
      },
    });
  },

  bootstrap(app: any) {},

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      (locales as any[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
