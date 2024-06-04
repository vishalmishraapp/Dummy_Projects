const express = require('express');
const { upload } = require('../../service/multer');
const {
  requestValidator
} = require('../../middlewares/requestValidators');

const {
  createPostController,
  viewPostController,
  deleteOnePost,
  viewOnePost

} = require('../../controllers/post');

const { userExist } = require('../../middlewares/auth');

const { 
  checkBearer
} = require('../../middlewares/post');

const schema = require('./schema');
const postRoute = express.Router();

postRoute.post('/post', 
upload.single('myFile'), 
requestValidator(schema.postSchema), 
checkBearer, userExist, 
createPostController);

postRoute.get('/viewPost',
checkBearer, 
viewPostController);

postRoute.delete('/deleteOne/:post_id', 
checkBearer, userExist, 
deleteOnePost);

postRoute.get('/viewOne/:post_id', 
checkBearer, userExist, 
viewOnePost);



module.exports = postRoute;
