/* eslint-disable*/
const Post = require('../models/postModel');
const User = require('../models/userModel');
const Purchase = require('../models/purchaseModel');
const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
const AppError = require('../Utils/appError');
const catchAsync = require('../Utils/catchAsync');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const pug = require('pug');
const Review = require('../models/reviewModel');

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
  const posts = await Post.find({ lessor: req.user._id });

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
  const post = await Post.findOne({ _id: req.params.postId }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!post) {
    return next(new AppError('There is no post with that id.', 404));
  }

  if (!req.user) {
    res.status(200).render('post', {
      title: `${post.title}`,
      post,
    });
  }

  const userId = req.user.id;
  const purchases = await Purchase.find({ user: req.user.id });
  let isReview = false;
  let isPay = false;

  purchases.forEach((purchase) => {
    if (
      purchase.post.id === post.id &&
      purchase.user._id.toString() === userId
    ) {
      isPay = true;
    }
  });

  post.reviews.forEach((review) => {
    if (
      review.user.id === userId &&
      review.post.toString() === post.id.toString()
    ) {
      isReview = true;
    }
  });
  console.log(post.reviews);
  //Render template
  res.status(200).render('post', {
    title: `${post.title}`,
    post,
    isReview,
    isPay,
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
    return next(new AppError('There is no video call with the ID', 404));
  }
  res.render(`${__dirname}/../views/chatbox/baseVideo.pug`, {
    roomId: req.params.room,
  });
});

exports.checkChatBox = catchAsync(async (req, res, next) => {
  const curUserId = req.user.id;
  const lessorId = req.params.lessorId;
  const myArray = [curUserId, lessorId];
  let existConversation = true;
  const conversations = await Conversation.find();
  let curConversation;

  const checkExistConversation = function (exist) {
    conversations.forEach((conversation) => {
      ////Solution 1
      ////Using indexOf, it will return -1 if it found nothing match condition from the array
      // if (
      //   conversation.participants.length === myArray.length &&
      //   conversation.participants.every((el) => myArray.indexOf(el) > -1)
      // ) {
      //   console.log('pass');
      // }

      //Solution 2
      existConversation = myArray.every((userId) => {
        return conversation.participants.includes(userId);
      });
      if (exist) {
        if (existConversation) {
          curConversation = conversation;
        }
      }
    });
  };

  checkExistConversation(false);

  if (!existConversation || conversations.length === 0) {
    const conversation = await Conversation.create({
      participants: [lessorId, curUserId],
    });
    if (conversation) return res.redirect(`/messages/${conversation.id}`);
  }

  checkExistConversation(true);

  res.redirect(`/messages/${curConversation._id}`);
});

exports.getLessorPostsPage = catchAsync(async (req, res, next) => {
  const posts = await Post.find({ lessor: req.params.lessorId });
  const lessor = await User.findById(req.params.lessorId);

  res.status(200).render('lessorPosts', {
    title: `${lessor.name} Page`,
    posts,
  });
});

exports.getOrders = catchAsync(async (req, res, next) => {
  const purchases = await Purchase.find({ user: req.user.id });
  const user = req.user;

  console.log(purchases);
  if (user.role === 'lessor') {
    const purchases = await Purchase.find({ lessor: user.id });

    return res.status(200).render('Orders', {
      title: 'Orders',
      purchases,
      user,
      moment: require('moment'),
    });
  }

  res.status(200).render('Orders', {
    title: 'Orders',
    purchases,
    user,
    moment: require('moment'),
  });
});

exports.getAddReviewForm = catchAsync(async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user.id;

  res.status(200).render('addReview', {
    title: 'Add Review',
    postId,
    userId,
  });
});

exports.getEditReviewForm = catchAsync(async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const postId = req.params.postId;
  const userId = req.user.id;
  const review = await Review.findOne({ _id: reviewId });

  res.status(200).render('editReview', {
    title: 'Edit Review',
    review,
    reviewId,
  });
});
