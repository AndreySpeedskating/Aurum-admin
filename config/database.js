const path = require('path');

module.exports = ({ env }) => ({
  connection: {
    client: 'mysql2',
    connection: {
      host: env("DATABASE_HOST", "localhost"),
      port: env("DATABASE_PORT", 3306),
      database: env("DATABASE_NAME", "aurum_db"),
      user: env("DATABASE_USERNAME", "admin"),
      password: env("DATABASE_PASSWORD", ""),
    },
    useNullAsDefault: true,
  },
});
