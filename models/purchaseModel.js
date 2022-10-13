const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: [true, 'Purchase must belong to a product'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Purchase must belong to a User'],
  },
  price: {
    type: Number,
    required: [true, 'Purchase must have a price'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

purchaseSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'post',
    select: 'title',
  });
  next();
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
