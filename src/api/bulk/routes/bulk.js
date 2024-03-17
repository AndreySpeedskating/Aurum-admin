'use strict';

module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/bulk/:model/update',
     handler: 'bulk.bulkUpdate',
     config: {
      middlewares: [],
      policies: [],
    },
    },
  ],
};
