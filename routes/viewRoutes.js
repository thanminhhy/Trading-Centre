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
<<<<<<< HEAD
router.get(
  '/createPost',
  authController.protect,
  viewsController.getCreatePostForm
);
router.get('/post/:postId', authController.protect, viewsController.getPost);
router.get(
  '/editPost/:postId',
  authController.protect,
  viewsController.getEditPostForm
);
router.get(
  '/deletePost/:postId',
  authController.protect,
  viewsController.deletePostForm
);
=======
>>>>>>> df74eb81f7f4de925b391fe776b850793fa90d66

module.exports = router;
