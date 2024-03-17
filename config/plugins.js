module.exports = ({ env }) => ({
  'phone-input': {
    enabled: true,
    resolve: './src/plugins/phone-input'
  },
  'input-mask': {
    enabled: true,
    resolve: './src/plugins/input-mask'
  },
  'users-permissions': {
    enabled: true,
    resolve: './src/plugins/users-permissions'
  },
  'data-to-excel': {
    enabled: true,
    resolve: './src/plugins/data-to-excel'
  }
});
