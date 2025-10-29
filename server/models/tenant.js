const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Tenant = sequelize.define('Tenant', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  domain: { // optional, for email-based assignment
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  }
});

module.exports = Tenant;
