require('dotenv').config();

const secretKey = process.env.SECRET_KEY;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
const saltRounds = parseInt(process.env.SALT_ROUNDS);

module.exports = {
  secretKey,
  jwtExpiresIn,
  saltRounds
};