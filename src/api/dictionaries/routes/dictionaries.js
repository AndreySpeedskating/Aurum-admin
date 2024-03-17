module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/dictionaries/conterparties',
     handler: 'dictionaries.getConterparties',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
     method: 'GET',
     path: '/dictionaries/loading-points',
     handler: 'dictionaries.getLoadingPoints',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
     method: 'GET',
     path: '/dictionaries/unloading-points',
     handler: 'dictionaries.getUnLoadingPoints',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
     method: 'GET',
     path: '/dictionaries/my-applications/:userId',
     handler: 'dictionaries.getMyApplications',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
     method: 'GET',
     path: '/dictionaries/autopark',
     handler: 'dictionaries.getAutoPark',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
     method: 'GET',
     path: '/dictionaries/cargo',
     handler: 'dictionaries.getCargo',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
      method: 'POST',
      path: '/dictionaries/update-device-id/:id',
      handler: 'dictionaries.updateUserDeviceInfo',
      config: {
       policies: [],
       middlewares: [],
     },
    }
  ],
};
