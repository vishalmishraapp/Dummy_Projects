const express = require('express');

const {
  requestValidator
} = require('../../middlewares/requestValidators');

const { userExist, checkBearer, isUser, emailPhoneExists } = require('../../middlewares/auth');

const {
  signupController,
  sendOTPController,
  verifyOTPController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  getAllUsers


} = require('../../controllers/auth');


const schema = require('./schema');
const authRoute = express.Router();

authRoute.post('/signup', 
requestValidator(schema.signUpSchema), 
emailPhoneExists,
signupController);

 authRoute.patch('/login',
 requestValidator(schema.loginSchema), 
  userExist, isUser, 
  loginController);

 authRoute.patch('/sendOTP', 
 requestValidator(schema.sendOTPSchema),
  userExist, isUser,
  sendOTPController);

 authRoute.patch('/verifyOTP', 
 requestValidator(schema.verifyOTPSchema), 
 checkBearer, userExist, isUser, 
 verifyOTPController);

 authRoute.patch('/forgotPassword', 
 requestValidator(schema.forgotPasswordSchema), 
 userExist, isUser, 
 forgotPasswordController);

 authRoute.patch('/resetPassword', 
 checkBearer, requestValidator(schema.resetPasswordSchema), 
 userExist, isUser, 
 resetPasswordController);

 authRoute.get('/getAll',
 getAllUsers); // without login

module.exports = authRoute;
