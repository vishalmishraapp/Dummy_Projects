const express = require('express');
const { userExist, checkBearer } = require('../../middlewares/auth');
const { createComment, getAllComments, getCommentsByPost, updateComment, deleteComment } = require('../../controllers/comments');
const router = express.Router();

router.post('/comments', createComment);
router.get('/comments', getAllComments);
router.get('/comments/post/:postId', getCommentsByPost);
router.put('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);

module.exports = router;
