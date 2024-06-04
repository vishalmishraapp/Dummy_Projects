const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/database.js');
const user = require('./user.js');
const post = require('./post.js');

const like = sequelize.define('like', {
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: post,
          key: 'post_id'
        }
      },

    userId: {
       type: DataTypes.INTEGER,
       allowNull: false,
       references: {
         model: user,
         key: 'id'
        }
      }
 
}, {
  timestamps: true
});

// user.hasMany(like, { foreignKey: 'userId' });
// post.hasMany(like, { foreignKey: 'postId' });
// like.belongsTo(user, { foreignKey: 'userId' });
// like.belongsTo(post, { foreignKey: 'postId' });

module.exports = like;
