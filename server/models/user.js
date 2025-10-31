const { DataTypes } = require("sequelize");
const db = require("../db");

const User = db.define("User", {
  clerkId: {
    type: DataTypes.STRING,
    unique: true,
  },
  username: DataTypes.STRING,
  bio: DataTypes.STRING(500),
  profileImg: DataTypes.STRING,
  bgImage: DataTypes.STRING,
  bgColor: DataTypes.STRING,
  links: {
    type: DataTypes.JSON, // ✅ Important
    defaultValue: [],
  },
  social: {
    type: DataTypes.JSON, // ✅ Important
    defaultValue: [],
  }
});

module.exports = User;
