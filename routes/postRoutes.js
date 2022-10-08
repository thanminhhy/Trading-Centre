const express = require('express');
const postController = require('./../controllers/postController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

router.use('/:postId/reviews', reviewRouter);

router
  .route('/')
  .get(authController.protect, postController.getAllPost)
  .post(
    authController.protect,
    authController.restrictTo('lessor'),
    postController.uploadPostImages,
    postController.resizePostImages,
    postController.setUserId,
    postController.createPost
  );

router
  .route('/:id')
  .get(authController.protect, postController.getPost)
  .patch(
    authController.protect,
    authController.restrictTo('lessor', 'admin'),
    postController.uploadPostImages,
    postController.resizePostImages,
    postController.editPost
  )
  .delete(
    authController.protect,
    authController.restrictTo('lessor', 'admin'),
    postController.deletePost
  );

module.exports = router;
