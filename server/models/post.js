const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./user"); // ✅ import User model here

const Post = sequelize.define("Post", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  image: { type: DataTypes.STRING },
  bgImage: { type: DataTypes.STRING },
  links: { type: DataTypes.JSON, defaultValue: [] },
  social: { type: DataTypes.JSON, defaultValue: [] },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  userName: { type: DataTypes.STRING },
  bio: { type: DataTypes.TEXT },
  bgColor: { type: DataTypes.STRING },
});

// ✅ define relation *after* model definition, before exporting
Post.belongsTo(User, { foreignKey: "userId" });

module.exports = Post;
