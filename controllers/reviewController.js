// const AppError = require('../Utils/appError');
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
  const fiveStar = await Review.aggregate([
    {
      $match: { rating: 5 },
    },
    {
      $group: {
        _id: '$post',
        num: { $sum: 1 },
      },
    },
  ]);
  const fourStar = await Review.aggregate([
    {
      $match: { rating: 4 },
    },
    {
      $group: {
        _id: '$post',
        num: { $sum: 1 },
      },
    },
  ]);
  const threeStar = await Review.aggregate([
    {
      $match: { rating: 3 },
    },
    {
      $group: {
        _id: '$post',
        num: { $sum: 1 },
      },
    },
  ]);
  const twoStar = await Review.aggregate([
    {
      $match: { rating: 2 },
    },
    {
      $group: {
        _id: '$post',
        num: { $sum: 1 },
      },
    },
  ]);
  const oneStar = await Review.aggregate([
    {
      $match: { rating: 1 },
    },
    {
      $group: {
        _id: '$post',
        num: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      fiveStar,
      fourStar,
      threeStar,
      twoStar,
      oneStar,
    },
  });
});
