const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mongoose = require('mongoose');
const Post = require('../models/postModel');
const Purchase = require('../models/purchaseModel');
const catchAsync = require('../Utils/catchAsync');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postID);

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?post=${
      req.params.postID
    }&user=${req.user.id}&price=${post.price}&lessor=${post.lessor.id}`,
    cancel_url: `${req.protocol}://${req.get('host')}/post/${post.id}`,
    customer_email: req.user.email,
    client_reference_id: req.params.postID,
    line_items: [
      {
        price_data: {
          unit_amount: post.price * 100,
          currency: 'usd',
          product_data: {
            name: `${post.title} Product`,
            description: post.description,
            images: [post.imageCover],
          },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  });
  //3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createProductCheckout = catchAsync(async (req, res, next) => {
  const { post, user, price, lessor } = req.query;

  if (!post && !user && !price && !lessor) return next();

  await Purchase.create({ post, user, price, lessor });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.getSalesMonthly = catchAsync(async (req, res, next) => {
  const date = new Date();
  const curYear = date.getFullYear();
  const data = await Purchase.aggregate([
    {
      $match: {
        post: new mongoose.Types.ObjectId(req.params.postId),
      },
    },
    {
      //The $project function in MongoDB passes along the documents with only the specified fields to the next stage in the pipeline.
      $project: {
        month: { $month: '$createdAt' },
        year: { $year: '$createdAt' },
        price: '$price',
      },
    },
    {
      $match: {
        year: curYear,
      },
    },
    {
      $group: {
        _id: '$month',
        sale: { $sum: '$price' },
      },
    },
    {
      $project: {
        _id: 0,
        Month: '$_id',
        sale: 1,
      },
    },
    {
      $sort: { Month: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data,
  });
});
