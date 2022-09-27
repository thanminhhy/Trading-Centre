const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversationId: String,
    sender: { type: mongoose.Schema.ObjectId, ref: 'User' },
    message: String,
    // timestamp: {
    //   type: Date,
    //   default: Date.now(),
    // },
  },
  { timestamps: true }
);

messageSchema.pre(/^find/, function (next) {
  this.populate({ path: 'sender', select: 'name photo' });
  next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
