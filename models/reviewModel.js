const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Please provide your review!'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: [true, 'Review must belong to a Post'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user'],
  },
});
reviewSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: 'user',
      select: 'name photo role',
    },
  ]);

  next();
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
