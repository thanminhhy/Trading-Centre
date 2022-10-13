const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Post = require('../models/postModel');
const Purchase = require('../models/purchaseModel');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postID);

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?post=${
      req.params.postID
    }&user=${req.user.id}&price=${post.price}`,
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
  const { post, user, price } = req.query;

  if (!post && !user && !price) return next();

  await Purchase.create({ post, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});
