const AppError = require('../Utils/appError');
const catchAsync = require('../Utils/catchAsync');

module.exports = adminProtect = catchAsync(async (req, res, next) => {
  if (!req.user.admin) {
    return next(
      new AppError('You are not authorized to access the route', 401)
    );
  }

  next();
});
