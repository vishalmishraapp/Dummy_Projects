const express = require('express');
const { createLike, getAllLikes, getLikesByPost, deleteLike } = require('../../controllers/likes');
const router = express.Router();

router.post('/likes', createLike);
router.get('/likes', getAllLikes);
router.get('/likes/post/:postId', getLikesByPost);
router.delete('/likes/:id', deleteLike);

module.exports = router;