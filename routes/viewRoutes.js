const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/verifyEmail/success', viewsController.renderUserStatus);
router.get('/login', viewsController.getLoginForm);
router.get('/signup', viewsController.getSignUpForm);
router.get('/forgotPassword', viewsController.getForgotPasswordForm);
router.get('/resetPassword/:resetToken', viewsController.getResetPasswordForm);

router.get(
  '/myPosts',
  authController.protect,
  authController.restrictTo('lessor'),
  viewsController.getMyPosts
);

router.get(
  '/createPost',
  authController.protect,
  authController.restrictTo('lessor'),
  viewsController.getCreatePostForm
);
router.get('/post/:postId', authController.isLoggedIn, viewsController.getPost);

router.get(
  '/editPost/:postId',
  authController.protect,
  authController.restrictTo('lessor', 'admin'),
  viewsController.getEditPostForm
);
router.get(
  '/deletePost/:postId',
  authController.protect,
  authController.restrictTo('lessor', 'admin'),
  viewsController.deletePostForm
);

router.get(
  '/allUsers',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getAllUsers
);

router.get(
  '/editUser/:userId',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getEditUserForm
);

router.get(
  '/deleteUser/:userId',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getDeleteUserStatus
);

router.get('/messages', authController.protect, viewsController.getChatBox);

router.get(
  '/messages/:conversationId',
  authController.protect,
  viewsController.getMessagesPage
);

router.get(
  '/videoCall/:roomId',
  authController.protect,
  viewsController.joinVideoCall
);

router.get(
  '/checkChatBox/:lessorId',
  authController.protect,
  viewsController.checkChatBox
);

module.exports = router;
