// const Comment = require('../model/comment.js');
// const user = require('../model/user.js');
// const post = require('../model/post.js');
const { user, post, following, comment } = require('../model/index');
const commonService = require('../service/common');

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { userId, postId, content } = req.body;

    const userDetails = await user.findByPk(userId);
    const postDetails = await post.findByPk(postId);

    if (!userDetails || !postDetails) {
      return res.status(404).json({ error: 'User or Post not found' });
    }

    const isCommentAdded = await comment.create({ userId, postId, content });
    res.status(201).json(isCommentAdded);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await comment.findAll();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get comments for a specific post
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await comment.findAll({ where: { postId } });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.content = content;
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await comment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// module.exports = {
//     createComment,
//     getAllComments,
//     getCommentsByPost,
//     updateComment,
//     deleteComment
//   };
