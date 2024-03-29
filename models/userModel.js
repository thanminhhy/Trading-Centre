const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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

  serviceProvider: {
    type: String,
    default: 'Trading Centre',
  },

  photo: {
    type: String,
    default: 'default.jpg',
  },

  status: {
    type: String,
    enum: ['Pending', 'Active', 'InActive'],
    default: 'Pending',
    select: false,
  },

  confirmationCode: {
    type: String,
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

  dateOfBirth: Date,

  phoneNumber: Number,

  city: String,

  address: String,

  gender: {
    type: String,
    enum: ['Male', 'Female'],
  },
});

userSchema.pre('save', async function (next) {
  //Get out of this middleware if the password was modified
  if (!this.isModified('password')) return next();

  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createConfirmationCode = function () {
  const hashedCode = crypto.randomBytes(32).toString('hex');

  this.confirmationCode = crypto
    .createHash('sha256')
    .update(hashedCode)
    .digest('hex');

  return hashedCode;
};
userSchema.methods.changedPasswordAfter = function (JWTtimesamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTtimesamp < changedTimestamp; // 100<200
  }
  //Password not change
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 5 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
