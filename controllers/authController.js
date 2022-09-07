const createSendToken = require('./../Utils/createSendToken');
const User = require('./../models/userModel');
const catchAsync = require('./../Utils/catchAsync');
const AppError = require('./../Utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    dateOfBirth: req.body.dateOfBirth,
    phoneNumber: req.body.phoneNumber,
    city: req.body.city,
    address: req.body.address,
    gender: req.body.gender,
  });

  createSendToken(newUser, 201, res);
});
