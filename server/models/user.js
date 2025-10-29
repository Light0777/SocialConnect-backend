// const { DataTypes } = require('sequelize');
// const sequelize = require('../db');
// const bcrypt = require('bcryptjs');

// const User = sequelize.define('User', {
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//     validate: { isEmail: true }
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false
//   }
// }, {
//   hooks: {
//     beforeCreate: async (user) => {
//       const salt = await bcrypt.genSalt(12);
//       user.password = await bcrypt.hash(user.password, salt);
//     }
//   }
// });

// module.exports = User;

// models/user.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  bio: { type: DataTypes.TEXT, defaultValue: "" },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  profileImg: { type: DataTypes.STRING, defaultValue: "" },
  bgColor: { type: DataTypes.STRING, defaultValue: "#ffffff" },
  bgImage: { type: DataTypes.STRING, allowNull: true },
  links: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  social: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
}, {
  timestamps: true,
});

module.exports = User;
