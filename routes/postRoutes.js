const express = require('express');
const postController = require('./../controllers/postController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(
    authController.protect,
    postController.uploadPostImages,
    postController.resizePostImages,
    postController.setUserId,
    postController.createPost
  );

router
  .route('/:id')
  .patch(
    authController.protect,
    postController.uploadPostImages,
    postController.resizePostImages,
    postController.editPost
  )
  .delete(authController.protect, postController.deletePost);

module.exports = router;
