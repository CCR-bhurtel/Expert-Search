const express = require('express');
const authProtect = require('../../Middlewares/authProtect');
const User = require('../../Model/User');
const AppError = require('../../Utils/appError');
const catchAsync = require('../../Utils/catchAsync');
const jwt = require('jsonwebtoken');
const router = express.Router();

const signInToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, res, statusCode) => {
  const token = signInToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
// @route GET api/auth
// @desc get logged in user
// @access Public

router.get(
  '/',
  authProtect,
  catchAsync(async (req, res) => {
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user,
      },
    });
  })
);

// @route POST api/auth
// @desc Login in user
// @access Public

router.post(
  '/',
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Please provide both email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect Email or Password', 401));
    }

    if (!user.approved) {
      return next(new AppError('You are not authorized yet', 401));
    }
    createSendToken(user, res, 200);
  })
);
exports.authRouter = router;
exports.createSendToken = createSendToken;
