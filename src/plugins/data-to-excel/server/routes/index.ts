export default [
  {
    method: 'POST',
    path: '/getContent',
    handler: 'myController.getContent',
    config: {
      policies: [],
    },
  },
];
