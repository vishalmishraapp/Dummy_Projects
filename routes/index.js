const express = require('express');
const authRoute = require('./auth');
const postRoute = require('./post');
const profileRute = require('./profile');
const adminRoute = require('./admin');
const likesRoute = require('./likes');
const commentsRoute = require('./comments');
const shareRoute = require('./shares');


const router = express.Router();
router.use('/auth', authRoute);
router.use('/post', postRoute);
router.use('/admin', adminRoute);
router.use('/profile', profileRute);
router.use('/likes', likesRoute);
router.use('/comments',commentsRoute);
// router.use('/shares', shareRoute);


module.exports = router;