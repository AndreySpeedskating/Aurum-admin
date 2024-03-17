module.exports = (_config, { strapi }) => {
  const redirects = ['/', '/admin', '/index.html'].map((path) => ({
    method: 'GET',
    path,
    handler: (ctx) => ctx.redirect('/admin/content-manager'),
    config: { auth: false },
  }));

  strapi.server.routes(redirects);
};
