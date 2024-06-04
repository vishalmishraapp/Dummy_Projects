const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/database.js');
const user = require('./user.js');
const post = require('./post.js');

const follower = sequelize.define('follower', {
    follower_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: user,
          key: 'id'
        }
      },

    following_id: {
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

// user.hasMany(follower, { foreignKey: 'userId' });
// post.hasMany(follower, { foreignKey: 'postId' });
// like.belongsTo(user, { foreignKey: 'userId' });
// like.belongsTo(post, { foreignKey: 'postId' });

module.exports = follower;