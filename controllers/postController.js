const multer = require('multer');
const sharp = require('sharp');
const Post = require('./../models/postModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../Utils/catchAsync');
const AppError = require('../Utils/appError');

exports.setUserId = (req, res, next) => {
  //set user id for nested routes
  if (!req.body.lessor) {
    req.body.lessor = req.user.id;
  }
  next();
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPostImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  {
    name: 'images',
    maxCount: 3,
  },
]);

exports.resizePostImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover) return next();
  //1) Image Cover
  req.body.imageCover = `post-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/posts/${req.body.imageCover}`);

  // //2) Images
  if (!req.files.images) return next();
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `post-${req.user.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/posts/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.createPost = factory.createOne(Post);

exports.editPost = factory.updateOne(Post);

exports.deletePost = factory.deleteOne(Post);
