/* eslint-disable*/

const AppError = require('../Utils/appError');

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

exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'Home Page',
  });
};

exports.renderUserStatus = (req, res) => {
  res.status(200).render('overview', {
    title: 'Home Page',
    content: 'Email Verification Success!',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'My Profile',
  });
};
