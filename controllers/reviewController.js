// const AppError = require('../Utils/appError');
const mongoose = require('mongoose');
const Review = require('./../models/reviewModel');
const catchAsync = require('./../Utils/catchAsync');
const factory = require('./handlerFactory');

exports.setPostUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

exports.getReviewStats = catchAsync(async (req, res, next) => {
  const data = await Review.aggregate([
    {
      $match: {
        post: new mongoose.Types.ObjectId(req.params.postId),
      },
    },
    {
      $project: {
        rating: '$rating',
      },
    },
    {
      $group: {
        _id: '$rating',
        num: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        rating: '$_id',
        amount: '$num',
      },
    },
    { $sort: { rating: 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data,
  });
});
