const AppError = require('../Utils/appError');
const catchAsync = require('../Utils/catchAsync');
const jwt = require('jsonwebtoken');
const util = require('util');
const User = require('../Model/User');

module.exports = authProtect = catchAsync(async (req, res, next) => {
  // Get token from the header
  const token = req.header('x-auth-token');

  console.log(token);

  //   Check if no token
  if (!token) return next(new AppError('No token, authorization denied', 401));

  //   Verify token
  const decodedPayload = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const currentUser = await User.findById(decodedPayload.id);
  if (!currentUser) return next(new AppError('The user doesnot exists', 401));
  if (!currentUser.approved) {
    return next(new AppError('You are not authorized yet', 401));
  }

  req.user = currentUser;
  next();
});
