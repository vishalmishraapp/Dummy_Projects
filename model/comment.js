const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/database.js');
const user = require('./user.js');
const post = require('./post.js');

const comment = sequelize.define('comment', {
  
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: user,
      key: 'id'
    }
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: post,
      key: 'post_id'
    }
  },

  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }

}, {
  timestamps: true
});

// user.hasMany(comment, { foreignKey: 'userId' });
// post.hasMany(comment, { foreignKey: 'postId' });
// comment.belongsTo(user, { foreignKey: 'userId' });
// comment.belongsTo(post, { foreignKey: 'postId' });

module.exports = comment;
