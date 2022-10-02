const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A Product must have title!'],
  },
  description: String,
  price: Number,
  imageCover: String,
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  lessor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },

  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
  },
});

postSchema.pre(/^find/, function (next) {
  this.populate({ path: 'lessor', select: 'name' });
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
