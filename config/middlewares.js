module.exports = [
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'strapiadmin.storage.yandexcloud.net',
            'cloud-api.yandex.net',
            'disk.yandex.ru',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'strapiadmin.storage.yandexcloud.net',
            'disk.yandex.ru',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  { resolve: './src/middlewares/admin-redirect' },
];
