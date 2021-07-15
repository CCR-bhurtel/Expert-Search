const express = require('express');
const User = require('../../Model/User');
const AppError = require('../../Utils/appError');
const { createSendToken } = require('./auth');
const catchAsync = require('../../Utils/catchAsync');
const router = express.Router();
const adminProtect = require('../../Middlewares/adminProtect');
const authProtect = require('../../Middlewares/authProtect');
const { userIndex } = require('../../algolia');

router.post(
  '/',
  catchAsync(async (req, res, next) => {
    //   Return the json web token as a cookie
    const { email, name, password, passwordConfirm } = req.body;
    if (!email || !name || !password || !passwordConfirm)
      return next(new AppError('Please input all fields', 400));

    req.body.approved = false;
    req.body.admin = false;

    const user = await User.create(req.body);

    createSendToken(user, res, 201);
  })
);
router.get(
  '/getUnapproved',
  authProtect,
  adminProtect,
  catchAsync(async (req, res, next) => {
    const users = await User.find({ approved: false });
    res.status(200).json({
      users,
    });
  })
);

router.put(
  '/approve',
  authProtect,
  adminProtect,
  catchAsync(async (req, res) => {
    const user = await User.findById(req.body.id);
    await userIndex.saveObject({
      name: user.name,
      email: user.email,
      objectID: user._id,
    });

    await User.findByIdAndUpdate(req.body.id, { approved: true });
    res.status(200).json({
      user,
    });
  })
);

router.put(
  '/deleteUser',
  authProtect,
  adminProtect,
  catchAsync(async (req, res) => {
    console.log(req.body.id);
    const user = await User.findByIdAndDelete(req.body.id);
    await userIndex.deleteObject(req.body.id);

    res.status(204).json({
      user: '',
    });
  })
);

module.exports = router;
