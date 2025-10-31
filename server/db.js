require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false,
  }
);

const connectWithRetry = async (retries = 10, delay = 5000) => {
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      console.log('✅ MySQL connection established!');
      await sequelize.sync({ alter: true });
      console.log('✅ Database synced successfully');
      return;
    } catch (err) {
      console.log(`⏳ Waiting for MySQL... Retries left: ${retries}`);
      retries -= 1;
      await new Promise(res => setTimeout(res, delay));
    }
  }
  console.error('❌ Could not connect to MySQL after multiple attempts.');
  process.exit(1);
};

connectWithRetry();

module.exports = sequelize;
