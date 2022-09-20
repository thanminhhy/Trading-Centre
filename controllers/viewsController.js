/* eslint-disable*/
const Post = require('../models/postModel');
const AppError = require('../Utils/appError');
const catchAsync = require('../Utils/catchAsync');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

exports.getSignUpForm = (req, res, next) => {
  if (req.cookies.jwt) {
    return res.redirect('/');
  }

  res.status(200).render('signup', {
    title: 'Sign up your account',
  });
};

exports.getLoginForm = (req, res) => {
  if (req.cookies.jwt) {
    return res.redirect('/');
  }

  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getOverview = catchAsync(async (req, res) => {
  const posts = await Post.find();
  console.log(posts);
  res.status(200).render('overview', {
    title: 'Home Page',
    posts,
  });
});

exports.getMyPosts = catchAsync(async (req, res, next) => {
  //get token from cookies
  const token = req.cookies.jwt;

  //decode the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const posts = await Post.find({ lessor: decoded.id });

  res.status(200).render('myPosts', {
    title: 'My Posts',
    posts,
  });
});

exports.renderUserStatus = (req, res) => {
  res.status(200).render('verifyUserStatus', {
    title: 'Home Page',
    content: 'Email Verification Success!',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'My Profile',
    moment: require('moment'),
  });
};

exports.getForgotPasswordForm = (req, res) => {
  if (req.cookies.jwt) {
    return res.redirect('/');
  }

  res.status(200).render('forgotPassword', {
    title: 'Forget Password',
  });
};

exports.getResetPasswordForm = (req, res) => {
  if (req.cookies.jwt) {
    return res.redirect('/');
  }

  const resetToken = req.params.resetToken;
  console.log(resetToken);
  res.status(200).render('resetPassword', {
    title: 'Reset Password',
    resetToken,
  });
};

exports.getCreatePostForm = (req, res) => {
  res.status(200).render('createPost', {
    title: 'Create New Post',
  });
};

exports.getPost = catchAsync(async (req, res, next) => {
  //Get the data
  const post = await Post.findOne({ _id: req.params.postId });

  if (!post) {
    return next(new AppError('There is no post with that id.', 404));
  }

  //Render template
  res.status(200).render('post', {
    title: `${post.title}`,
    post,
  });
});

exports.getEditPostForm = catchAsync(async (req, res, next) => {
  //Get the data
  const post = await Post.findOne({ _id: req.params.postId });

  if (!post) {
    return next(new AppError('There is no post with that id.', 404));
  }

  //Render template
  res.status(200).render('editPost', {
    title: `${post.title}`,
    post,
  });
});

exports.deletePostForm = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params.postId });

  if (!post) {
    return next(new AppError('There is no post with that id.', 404));
  }

  res.status(200).render('deletePost', {
    title: `Delete ${post.title}`,
    post,
  });
});
