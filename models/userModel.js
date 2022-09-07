const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name!'],
  },

  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please a valid email!'],
  },

  photo: {
    type: String,
    default: 'default.jpg',
  },

  role: {
    type: String,
    enum: ['user', 'lessor', 'admin'],
    default: 'user',
  },

  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      //This validator only return true or false. if false, it will cause the error
      //This only works on CREATE and SAVE!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,

  passwordResetToken: String,

  passwordResetExpires: Date,

  active: {
    type: Boolean,
    default: true,
    select: false,
  },

  dateOfBirth: Date,

  phoneNumber: Number,

  city: String,

  address: String,

  gender: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
