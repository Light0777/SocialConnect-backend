require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
  logging: false,
});

const connectWithRetry = async (retries = 10, delay = 5000) => {
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      console.log('✅ PostgreSQL connection established!');
      await sequelize.sync({ alter: true });
      console.log('✅ Database synced successfully');
      return;
    } catch (err) {
      console.error(`⏳ Waiting for PostgreSQL... Retries left: ${retries}`);
      retries -= 1;
      await new Promise(res => setTimeout(res, delay));
    }
  }
  console.error('❌ Could not connect to PostgreSQL after multiple attempts.');
  process.exit(1);
};

connectWithRetry();

module.exports = sequelize;
