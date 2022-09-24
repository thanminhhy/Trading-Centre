const Conversation = require('../models/conversationModel');
const catchAsync = require('./../Utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../Utils/appError');

exports.createConversation = factory.createOne(Conversation);

exports.getConversation = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.find({
    participants: { $in: [req.params.userId] },
  });

  if (!conversation) {
    return next(new AppError('No conversation found with that ID', 404));
  }

  res.status(200).json(conversation);
});
