const { DataTypes } = require('sequelize');
const sequelize = require('../util/database').sequelize;
const user = require('./user');

const post = sequelize.define('post', {

    post_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },

    content: {
      type: DataTypes.TEXT,
      allowNull: false
  },

    media: {
      type: DataTypes.STRING,
      allowNull: true
  },

  uploader: {
    type: DataTypes.STRING(30),
    allowNull: false
  },

  image: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
  
 }, {
  timestamps: true
});


module.exports = post;
