const { user } = require('../model/index');
const bcrypt = require('bcrypt');
const { saltRounds, jwtExpiresIn } = require('../util/constant');
const { successRes, errorRes } = require('../service/response')
const commonService = require('../service/common');
const { Module } = require('module');
const { generateOTP, generateAuth } = require('../util/helper');
const transporter = require('../service/mailSender');


//////......Signup Api Used..////////
const signupController = async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      const userData = { name, email, phone, 'password': hashedPassword };
      const updateUser = await commonService.createData(user, userData);
      if (!updateUser) {
        return res.send(errorRes(400, 'Error while updating user !'));
      }
      delete updateUser.password;
      return res.send(successRes(200, 'Successfully Added user', updateUser));
    } catch (err) {
      return res.send(errorRes(500, err.message, err));
    }
  };

  //////......Login Api Used..////////
  const loginController = async (req, res) => {
    try {
      const { password } = req.body;
      // does user Exists middleware is providing user row information in req.body
      const found = req.found;
      const doesPasswordMatch = bcrypt.compareSync(password, found.password);
      if (doesPasswordMatch) {
        const payload = { id: found.id, email: found.email, type: 'login' };
        const token = generateAuth({ expiresIn: jwtExpiresIn, ...payload });
        const resData = { userName: found.name, userType: found.type, token };
        const data = await commonService.updateData(user, { email: found.email }, { token });
        console.log(data);
        return res.send(successRes(200, 'Successfully , login :)', resData));
      } else {
        res.send(errorRes(404, 'Wrong Password'));
      }
    } catch (err) {
      res.send(errorRes(500, err.message, err));
    }
  };

  ////....Send Otp API used...///////
  const sendOTPController = async (req, res) => {
    try {
      const reqObj = req.body;
      const otp = generateOTP(6);
      const payload = { email: reqObj.email, otp, type: 'otp' };
      const token = generateAuth({ expiresIn: jwtExpiresIn, ...payload });
      const updateUser = await commonService.updateData(user, { email: reqObj.email }, { token });
      // does user Exists middleware is providing user row information in req.found
      const userInfo = req.found;
      if (!updateUser) {
        return res.send(errorRes(401, 'Error while Updating Data'));
      }
      const mailOptions = {
        // to: "vishalappventurez@yopmail.com",
        to: reqObj.email,
        subject: 'OTP for verification',
        text: `Hey user the OTP for verification is ${otp}.`
      };
      await transporter.sendMail(mailOptions);
      return res.send(successRes(200, 'successfully send OTP', { otp, token }));
    } catch (err) {
      res.send(errorRes(500, err.message, err));
    }
  };
  

  ////....Verify Otp API used...///////
  const verifyOTPController = async (req, res) => {
    try {
      if (req.decoded.type === 'login') {
        return res.send(errorRes(400, 'wrong token!'));
      }
      const reqObj = req.body;
      // does user Exists middleware is providing user row information in req.found
      // verify jwt middleware is providing user row information in req.decoded
      const dataOfUser = req.found;
      const decoded = req.decoded;
      if (reqObj.otp === decoded.otp) {
        const isUpdated = await commonService.updateData(user, { email: dataOfUser.email }, { token: null, verify: "true"});
        console.log(isUpdated);
        if (!isUpdated) {
          return res.send(errorRes(400, 'error while updating data'));
        }
        return res.send(successRes(200, 'Succesfully verified user'));
      } else {
        return res.send(errorRes(401, 'Wrong OTP'));
      }
    } catch (err) {
      res.send(errorRes(500, err.message, err));
    }
  };

  const forgotPasswordController = async (req, res) => {
    try {
      const { otp, password } = req.body;
      const found = req.found;
      // Check if otp and Password are provided
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


const resetPasswordController = async (req, res) => {
  try {
    const { password, newPassword, reNewPassword } = req.body;
    // check bearer token middleware is providing user token decoded information in request.decoded
    // does user Exists middleware is providing user row information in req.found
    const found = req.found;
    const isPasswordMatch = bcrypt.compareSync(password, found.password);
    if (!isPasswordMatch) {
      return res.send(errorRes(400, 'WRONG PASSWORD!'));
    }
    if (newPassword !== reNewPassword) {
      return res.send(errorRes(400, "new password and re-enter new Password are not same , Can't update password."));
    }
    const isOldPasswordSame = bcrypt.compareSync(newPassword, found.password);
    if (isOldPasswordSame) {
      return res.send(errorRes(400, "Can't update password, as this password has been previously used."));
    }
    await commonService.updateData(user, { email: found.email }, { 'password': bcrypt.hashSync(newPassword, saltRounds) });
    return res.send(successRes(200, 'Password has been successfully updated'));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};


const getAllUsers = async (req, res) => {
  try {
    const data = await commonService.getDataAll1(user, condition, ['id', 'name', 'email', 'status']);
    if (!data) {
      return res.send(errorRes(400, 'Error while reteriving data'));
    }
    return res.send(successRes(200, 'Successfully reterived data', data));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

 module.exports = {
    signupController,
    loginController,
    sendOTPController,
    verifyOTPController,
    forgotPasswordController,
    resetPasswordController,
    getAllUsers
 } 