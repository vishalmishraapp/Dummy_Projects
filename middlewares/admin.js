const { errorRes } = require('../service/response');
const commonService = require('../service/common');
const { user } = require('./../model/index')

const isAdmin = (req, res, next) => {
  try {
    if (req.found.type !== '1') {
      return res.send(errorRes(401, `You cant login to Admin's portal as you are not an ADMIN !!`));
    }
    return next();
  } catch (err) {
    return res.send(errorRes(500, err.message, err));
  }
};

const userExist = async (req, res, next) => {
    try {
      let email = '';
      if (req.body.email) {
          email = req.body.email;
      } else {
          email = req.decoded.email;
      }
      const data = await commonService.getDataOne(user, { email });
      if (!data) {
        return res.send(errorRes(404, 'User Does Not Exists'));
    }
      req.found = data;
      return next();
    } catch (err) {
        res.send(errorRes(500, err.message, err));
    }
};

module.exports = {
  isAdmin, 
  userExist
};