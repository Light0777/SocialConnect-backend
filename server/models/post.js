const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Post = sequelize.define("Post", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  image: { type: DataTypes.STRING },      // profile image
  bgImage: { type: DataTypes.STRING },    // background image
  links: { type: DataTypes.JSON },        // array of links
  social: { type: DataTypes.JSON },       // array of social icons
});

module.exports = Post;

