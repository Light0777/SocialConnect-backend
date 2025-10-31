require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'Admin',
    password: process.env.DB_PASS || '7502922716@SocialConnect',
    database: process.env.DB_NAME || 'SocialConnect',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME + '_test',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectOptions: {
      // add SSL / other options for cloud DB if needed
    }
  }
};
