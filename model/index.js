const user = require('./user');
const post = require('./post'); 
const like = require('./like');
const comment = require('./comment');
const share = require('./share');
const following = require('./follower');


module.exports = {
 post,
 user,
 like,
 comment,
 share,
 following
};