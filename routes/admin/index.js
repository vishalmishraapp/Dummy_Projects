const express = require('express');
const { userExist } = require('../../middlewares/admin')
const { checkBearer } = require('../../middlewares/auth')

const adminRoute = express.Router();
const {
  requestValidator
} = require('../../middlewares/requestValidators');

const {
  isAdmin
} = require('../../middlewares/admin');

const schema = require('./schema');

const {
  loginController,
  sendOTPController,
  verifyOTPController,
  changePasswordController,
  getAllUser,
  forgotPasswordController,
  // getUserDetails


} = require('../../controllers/admin');

adminRoute.patch('/login', 
requestValidator(schema.loginSchema),
 userExist, 
 loginController);

 adminRoute.patch('/sendotp',
  requestValidator(schema.sendOTPSchema), 
  userExist,  
  sendOTPController);

 adminRoute.patch('/verifyotp',
  requestValidator(schema.verifyOTPSchema), 
   checkBearer, 
   userExist, 
   verifyOTPController);

   adminRoute.patch('/changePassword',
   requestValidator(schema.resetPasswordSchema), 
   checkBearer, 
   userExist, 
   changePasswordController);

   adminRoute.get('/getAllUser', 
   checkBearer, 
   userExist, 
   getAllUser);

  //  adminRoute.get('/getUserInfo/:id', 
  //  checkBearer, 
  //  userExist, 
  //  getUserDetails
  // );

   adminRoute.patch('/forgotPassword', 
   checkBearer,
   userExist, 
   forgotPasswordController);  

module.exports = adminRoute;
