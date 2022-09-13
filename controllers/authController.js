const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const createSendToken = require('./../Utils/createSendToken');
const User = require('./../models/userModel');
const catchAsync = require('./../Utils/catchAsync');
const AppError = require('./../Utils/appError');
const Email = require('../Utils/email');

const createConfirmationCode = catchAsync(async (req, res, next) => {
  //Get user from signup method
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with the email address!', 404));
  }

  //2) Generate the random reset token
  const confirmationCode = user.createConfirmationCode();
  await user.save({ validateBeforeSave: false });

  //3) Send it to user's email
  try {
    const verifyURL = `${req.protocol}://${req.get(
      'host'
    )}/api/users/verifyUser/${confirmationCode}`;

    await new Email(user, verifyURL).sendWelcome();

    res.status(200).json({
      status: 'success',
      message: 'Confirmation Code sent to email!',
    });
  } catch (err) {
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.verifyUser = catchAsync(async (req, res, next) => {
  //1) Get user based on the token
  const hashedCode = crypto
    .createHash('sha256')
    .update(req.params.confimrationCode)
    .digest('hex');

  const user = await User.findOne({
    confirmationCode: hashedCode,
  });

  if (!user) {
    return next(new AppError('Confirmation Code is invalid!', 400));
  }
  user.confirmationCode = undefined;
  user.status = 'Active';
  await user.save({ validateBeforeSave: false });

  res.redirect(301, 'http://127.0.0.1:3000/verifyEmail/success');
});

exports.signup = catchAsync(async (req, res, next) => {
  await User.create({
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

  createConfirmationCode(req, res, next);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  //1) Check if email and password exist
  if (!email || !password) {
    next(new AppError('Please provide email and password'), 400);
  }

  //2) Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password +status');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).send({
      message: 'Incorrect email or password!',
    });
  }
  //3) If user is pending, show the message notify
  if (user.status !== 'Active') {
    return res.status(401).send({
      message: 'Pending Account. Please Verify Your Email',
    });
  }

  //4) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //1) Getting token and check if it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not login! Please login to get access.', 401)
    );
  }
  //2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    );
  }
  //4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed password! Please login in again.',
        401
      )
    );
  }
  //Grant access to protected route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      //1) Verification token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      //2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      res.locals.user = currentUser;
      return next();
    }
  } catch (err) {
    return next();
  }
  next();
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  //Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  //check if current password and user is correct
  if (
    !user ||
    !(await user.correctPassword(req.body.currentPassword, user.password))
  ) {
    return next(
      new AppError('Your current password is wrong. Please try again!', 401)
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //Log user in and send JWT
  createSendToken(user, 200, res);
});
