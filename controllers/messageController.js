const Message = require('../models/messageModel');
const catchAsync = require('./../Utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../Utils/appError');

exports.createMessage = factory.createOne(Message);

exports.getMessages = catchAsync(async (req, res) => {
  const messages = await Message.find({
    conversationId: req.params.conversationId,
  });

  if (!messages) return new AppError('There is no match messages!', 404);

  res.status(200).json(messages);
});
