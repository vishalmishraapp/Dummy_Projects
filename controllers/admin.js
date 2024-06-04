const { user, post, like, comment, share, follower} = require('../model/index');
const { jwtExpiresIn, saltRounds } = require('../util/constant');
const { successRes, errorRes } = require('../service/response');
const commonService = require('../service/common');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { generateOTP, generateAuth } = require('../util/helper');
const transporter = require('../service/mailSender')

const loginController = async (req, res) => {
  try {
    const found = req.found;
    const { email, password } = req.body;
    const isPasswordMatch = bcrypt.compareSync(password, found.password);
    if (isPasswordMatch) {
      const payload = { id: found.id, email, type: 'login' };
      const token = generateAuth({ expiresIn: jwtExpiresIn, ...payload }) || "";
      const resData = { userName: found.name, userType: found.type, token };
      const isUpdated = await commonService.updateData(user, { email }, { token });
      if (!isUpdated[0]) {
        return res.send(errorRes(400, 'Error while updating user !'));
      }
      return res.send(successRes(200, 'Successful , login :)', resData));
    } else {
      return res.send(errorRes(404, 'Wrong Password!'));
    }
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const sendOTPController = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTP(6);
    const payload = { email, otp, type: 'otp' };
    const token = generateAuth({ expiresIn: jwtExpiresIn, ...payload });
    const isUpdated = await commonService.updateData(user, { email }, { token, otp });

    const mailOptions = {
      // to: "vishalappventurez@yopmail.com",
      to: email,
      subject: 'OTP for verification',
      text: `Hey user the OTP for verification is ${otp}.`
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.log(err.mesasge);
    }

    if (!isUpdated[0]) {
      return res.send(errorRes(400, 'Error while updating user !'));
    }
    return res.send(successRes(200, 'Otp Send successfully', { payload, token }));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const verifyOTPController = async (req, res) => {
  try {
    const decoded = req.decoded;
    const userInfo = req.found;
    const { otp } = req.body;
    if (decoded.type !== 'otp') {
      return res.send(errorRes(400, 'WRONG TOKEN!'));
    }
    if (decoded.otp !== otp) {
      return res.send(errorRes(400, 'Wrong otp :('));
    } else {
      const isUpdated = await commonService.updateData(user, { email: userInfo.email }, { token: null, is_email_verified: true });
      
      if (!isUpdated[0]) {
        return res.send(errorRes(400, 'error while updating data'));
      }
      return res.send(successRes(200, 'Succesfully verified'));
    }
  } catch (err) {
    return res.send(errorRes(500, err.message, err));
  }
};


const forgotPasswordController = async (req, res) => {
  try {
    const { otp, password } = req.body;
    const found = req.found;
    // Check if otp and newPassword are provided
    if (!otp || !password) {
      return res.status(400).send(errorRes(400, 'OTP and new Password are required'));
    }
    if(otp != found.otp){
      return res.status(400).send(errorRes(400, 'Invalid OTP'));
    }
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // Update user's password in the database
    const isUpdated = await commonService.updateData(user, { email: found.email }, { 'password': hashedPassword });

    return res.send(successRes(200, 'Password Updated Successfully.'));
  } catch (err) {
    return res.status(500).send(errorRes(500, err.message, err));
  }
};

const changePasswordController = async (req, res) => {
  try {
    const decoded = req.decoded;
    const userInfo = req.found;
    if (decoded.type !== 'login') {
      return res.send(errorRes(400, 'WRONG TOKEN'));
    }
    const { password, newPassword, reNewPassword } = req.body;
    const isPasswordMatch = bcrypt.compareSync(password, userInfo.password);
    if (!isPasswordMatch) {
      return res.send(errorRes(400, 'WRONG PASSWORD CANT UPDATE YOUR PASSWORD'));
    }
    if (newPassword !== reNewPassword) {
      return res.send(errorRes(400, 'new password and re-new passwordare not same CANT UPDATE YOUR PASSWORD'));
    }
    const isOldPasswordSame = bcrypt.compareSync(newPassword, userInfo.password);
    if (isOldPasswordSame) {
      return res.send(errorRes(400, "Can't update password, as this password has been previously used."));
    }
    const isUpdated = await commonService.updateData(user, { email: userInfo.email }, { password: bcrypt.hashSync(newPassword, saltRounds) });
    if (!isUpdated[0]) {
      return res.send(errorRes(400, 'error while updating data'));
    }
    return res.send(successRes(200, 'Succesfully changed password'));
  } catch (err) {
    return res.send(errorRes(500, err.message, err));
  }
};

const getAllUser = async (req, res) => {
  try {
    const orderBy = req.query.orderBy || 'email';
    const orderSeq = req.query.orderSeq || 'DESC';
    const users = await user.findAll({
      order: [[orderBy, orderSeq]],
      attributes: ['id', 'email', 'name', 'status', 'type'],
    });
    if (!users[0]) {
      return res.send(errorRes(400, 'error while fetching users'));
    }
    return res.send(successRes(200, 'Successfully fetched details of users!', users));
  } catch (err) {
    return res.send(errorRes(500, err.message, err));
  }
};

module.exports = {
  loginController,
  sendOTPController,
  verifyOTPController,
  forgotPasswordController,
  changePasswordController,
  getAllUser
};



