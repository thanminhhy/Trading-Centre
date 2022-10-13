const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Category must have category name'],
  },
  description: String,
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
