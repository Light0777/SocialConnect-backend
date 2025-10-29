const { Sequelize } = require('sequelize');

// Use your MySQL credentials here
const sequelize = new Sequelize('SocialConnect', 'Admin', '7502922716@SocialConnect', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

// Automatically sync models and update tables
sequelize.sync({ alter: true })
  .then(() => console.log("Database synced successfully"))
  .catch(err => console.error("Error syncing database:", err));

module.exports = sequelize;
