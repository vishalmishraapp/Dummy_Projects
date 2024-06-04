// const Like = require('../models/like.js');
// const user = require('../models/user.js');
// const post = require('../models/post.js');
const { user, post, following, comment, like } = require('../model/index');

// Create a new like
exports.createLike = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    const user = await user.findByPk(userId);
    const post = await post.findByPk(postId);

    if (!user || !post) {
      return res.status(404).json({ error: 'User or Post not found' });
    }

    const isLikeAdded = await like.create({ userId, postId });
    res.status(201).json(isLikeAdded);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all likes
exports.getAllLikes = async (req, res) => {
  try {
    const likes = await like.findAll();
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get likes for a specific post
exports.getLikesByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const likes = await like.findAll({ where: { postId } });
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a like
exports.deleteLike = async (req, res) => {
  try {
    const { id } = req.params;
    const like = await like.findByPk(id);
    if (!like) {
      return res.status(404).json({ error: 'Like not found' });
    }

    await like.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
