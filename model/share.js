const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/database.js');
const user = require('./user.js');
const post = require('./post.js');



const share = sequelize.define('share', {
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: user,
          key: 'id'
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

// user.hasMany(share, { foreignKey: 'userId' });
// post.hasMany(share, { foreignKey: 'postId' });
// like.belongsTo(user, { foreignKey: 'userId' });
// like.belongsTo(post, { foreignKey: 'postId' });

module.exports = share;