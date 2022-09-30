/* eslint-disable*/
const Post = require('../models/postModel');
const User = require('../models/userModel');
const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
const AppError = require('../Utils/appError');
const catchAsync = require('../Utils/catchAsync');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const pug = require('pug');

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

  res.status(200).render('deleteForm', {
    title: `Delete ${post.title}`,
    post,
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('+status');

  res.status(200).render('userManagement', {
    title: 'All Users',
    users,
  });
});

exports.getEditUserForm = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.userId }).select('+status');
  const userId = req.params.userId;
  console.log(user);
  res.status(200).render('editUser', {
    title: 'Edit User',
    user,
    userId,
  });
});

exports.getDeleteUserStatus = catchAsync(async (req, res, next) => {
  const userForDelete = await User.findOne({ _id: req.params.userId });
  if (!userForDelete) return new AppError('There is no user with that ID!');

  const userForDeleteId = req.params.userId;

  res.status(200).render('deleteForm', {
    title: `Delete ${userForDelete.name} Profile`,
    userForDelete,
    userForDeleteId,
  });
});

exports.getChatBox = catchAsync(async (req, res, next) => {
  const userId = req.user._id.toString();
  const conversations = await Conversation.find();
  const curConversations = [];
  const allUserIds = [];
  const allUsers = [];

  conversations.forEach((conversation) => {
    conversation.participants.some((userid) => {
      if (userid === userId) curConversations.push(conversation);
    });
  });
  curConversations.forEach((conversation) => {
    conversation.participants.forEach((userid) => {
      if (userid !== userId) allUserIds.push(userid);
    });
  });

  await Promise.all(
    allUserIds.map(async (userid, i) => {
      const user = await User.findOne({ _id: userid }, { name: 1, photo: 1 });
      const data = { conversationId: curConversations[i]._id, user };
      allUsers.push(data);
    })
  );

  res.status(200).render(`${__dirname}/../views/chatbox/baseIndex.pug`, {
    receivers: allUsers,
    title: 'Messages',
    moment: require('moment'),
  });
});

exports.getMessagesPage = catchAsync(async (req, res, next) => {
  const userId = req.user._id.toString();
  const conversations = await Conversation.find();
  const curConversations = [];
  const allUserIds = [];
  const allUsers = [];

  conversations.forEach((conversation) => {
    conversation.participants.some((userid) => {
      if (userid === userId) curConversations.push(conversation);
    });
  });
  curConversations.forEach((conversation) => {
    conversation.participants.forEach((userid) => {
      if (userid !== userId) allUserIds.push(userid);
    });
  });

  await Promise.all(
    allUserIds.map(async (userid, i) => {
      const user = await User.findOne({ _id: userid }, { name: 1, photo: 1 });
      const data = { conversationId: curConversations[i]._id, user };
      allUsers.push(data);
    })
  );

  const conversationId = req.params.conversationId;
  const messages = await Message.find({ conversationId });

  const conversation = await Conversation.findOne({ _id: conversationId });

  if (!conversation.participants.includes(userId)) {
    return next(new AppError('There is no messages with the ID', 404));
  }

  const receiverId = conversation.participants.find((user) => user !== userId);
  const receiver = await User.findOne({ _id: receiverId });

  res.status(200).render(`${__dirname}/../views/chatbox/baseChat.pug`, {
    title: 'Messages',
    messages,
    moment: require('moment'),
    conversationId,
    receiver,
    receivers: allUsers,
  });
});

exports.joinVideoCall = catchAsync(async (req, res, next) => {
  conversationId = req.params.roomId;
  const userId = req.user._id.toString();

  const conversation = await Conversation.findOne({ _id: conversationId });

  if (!conversation.participants.includes(userId)) {
    return next(new AppError('There is no video with the ID', 404));
  }
  res.render(`${__dirname}/../views/chatbox/baseVideo.pug`, {
    roomId: req.params.room,
  });
});
