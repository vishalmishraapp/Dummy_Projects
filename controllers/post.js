const { user, post, following } = require('../model/index');
const commonService = require('../service/common');
const { successRes, errorRes } = require('../service/response');

const createPostController = async (req, res) => {
  // assuming that req.body has actual username
  try {
    console.log(req);
    const decoded = req.decoded;
    if (!decoded) {
      return res.send(errorRes(401, "Can't upload, User is not logged in :("));
    }

    const postInfo = await post.findOne({ order: [['createdAt', 'DESC']] });
    const data = {
      uploader: decoded.email,
      content: req.body?.content || "asdf",
      media: req.body?.desc || "asdf",
      image: req?.file?.path || "asdfh"
    };

    console.log(data);

    const updatedData = await post.create(data)
    console.log(updatedData);
    return res.send( updatedData);

  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const viewPostController = async (req, res) => {
  try {
    const decoded = req.decoded;
    if (!decoded) {
      return res.send(errorRes(401, "Can't see posts , User is not logged in :("));
    }
    const userInfo = await commonService.getDataOne(user, { 'email': decoded.email });

    if (userInfo.type === '0') {
      const condition = {
        'uploader': userInfo.email
      };
      const data = await commonService.getDataAll1(post, condition, ['post_id', 'content', 'media', 'image']);
      if (!data) {
        return res.send(errorRes(400, 'Error while fetching posts!'));
      }
      return res.send(successRes(200, 'Successfully view data.', data));
    }
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};


const deleteOnePost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const decoded = req.decoded;
    if (!decoded) {
      return res.send(errorRes(401, "Can't see posts , User is not logged in :("));
    }
    const postInfo = await commonService.getDataOne(post, { post_id });
    if (!postInfo) {
      return res.send(errorRes(404, 'Post does not exists'));
    }
    if (postInfo.uploader !== decoded.email) {
      return res.send(errorRes(401, "can't delete post, You have no rights to delete posts by others"));
    }
    const isDeleted = await post.destroy({ where: { post_id } });
    if (!isDeleted) {
      return res.send(errorRes(401, 'Error while deleting posts'));
    }
    return res.send(successRes(200, `Successfully deleted(SOFT) post with postId: ${post_id}!`, isDeleted));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const viewOnePost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const decoded = req.decoded;
    if (!decoded) {
      return res.send(errorRes(401, "Can't see posts , User is not logged in :("));
    }
    const postInfo = await commonService.getDataOne(post, { post_id });
    if (!postInfo) {
      return res.send(errorRes(404, 'Post does not exists'));
    }
    if (postInfo.uploader !== decoded.email) {
      return res.send(errorRes(401, "can't delete post, You have no rights to delete posts by others"));
    }
    return res.send(successRes(200, `Successfully reterieved post with postId: ${post_id} .`, postInfo));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

module.exports = {
  createPostController,
  viewPostController,
  deleteOnePost,
  viewOnePost
};
