const { successRes, errorRes } = require('../service/response');
const { Op } = require('sequelize');
const {
  user,
  following,
  post
} = require('../model/index');

const getFollowers = async (req, res) => {
  try {
    const decoded = req.decoded;
    if (!decoded) {
      return res.send(errorRes(401, "Can't upload, User is not logged in :("));
    }
    const userInfo = req.found;
    const orderBy = req.query.orderBy || 'email';
    const orderSeq = req.query.order || 'ASC';
    const search = req.query.search || '';
    const count = await following.count({
      where: { followedTo: userInfo.id }
    });
    const rows = await user.findAll({
      where: {
        status: '1',
        email: { [Op.iRegexp]: `^${search}` }
      },
      include: {
        model: following,
        as: 'followers',
        required: true,
        where: { followedTo: userInfo.id },
        attributes: []
      },
      attributes: ['id', 'name', 'email'],
      order: [[orderBy, orderSeq]],
      raw: true
    })

    const data = { 'Followers': count, 'users': rows };
    if (!data) {
      return res.send(errorRes(400, 'Error while geting follower'));
    }
    return res.send(successRes(200, 'successfully fetched all users.', data));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const getFollowing = async (req, res) => {
  try {
    const decoded = req.decoded;
    if (!decoded) {
      return res.send(errorRes(401, "Can't upload, User is not logged in :("));
    }
    const userInfo = req.found;
    const orderBy = req.query.orderBy || 'email';
    const orderSeq = req.query.order || 'ASC';
    const search = req.query.search || '';
    const count = await following.count({
      where: { followedBy: userInfo.id }
    });
    const rows = await user.findAndCountAll({
      where: {
        status: '1',
        email: { [Op.iRegexp]: `^${search}` }
      },
      include: {
        model: following,
        as: 'followingTo',
        required: true,
        where: { followedBy: userInfo.id },
        attributes: []
      },
      attributes: ['id', 'name', 'email'],
      order: [[orderBy, orderSeq]],
      raw: true
    });
    if (!rows) {
      return res.send(errorRes(400, 'Error while geting follower'));
    }
    const data = { 'Following': count, 'users': rows };
    return res.send(successRes(200, `successfully fetched all users.`, data));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const follow = async (req, res) => {
  try {
    const { email } = req.body;
    const decoded = req.decoded;
    const userToFollow = await user.findOne({ where: { email } });
    if (!userToFollow) {
      return res.send(errorRes(400, 'User you are trying to follow does not exists!'));
    }
    const followedByInfo = await user.findOne({ where: { email: decoded.email } });
    if (!followedByInfo) {
      return res.send(errorRes(400, 'Error while getting details of user'));
    }
    const alreadyFollow = await following.findOne({
      where: {
        followedTo: userToFollow.id,
        followedBy: followedByInfo.id
      }
    });
    if (alreadyFollow) {
      const isDeleted = following.destroy({ where: { followedTo: userToFollow.id, followedBy: followedByInfo.id } });
      if (!isDeleted) {
        return res.send(errorRes(400, 'Error while Unfollowing User!'));
      }
      return res.send(successRes(200, `SuccessFully unfollowed user ${email}.`));
    }
    const isUpdated = await following.create({ followedTo: userToFollow.id, followedBy: followedByInfo.id });
    if (!isUpdated) {
      return res.send(errorRes(400, 'Error while following User!'));
    }
    return res.send(successRes(200, `SuccessFully followed user ${email}.`));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

module.exports = {
  getFollowers,
  getFollowing,
  follow
};
