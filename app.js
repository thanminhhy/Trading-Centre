const express = require('express');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const AppError = require('./Utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const postRouter = require('./routes/postRoutes');
const conversationRouter = require('./routes/conversationRoutes');
const messageRouter = require('./routes/messageRoutes');
const purchaseRouter = require('./routes/purchaseRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET',
  })
);

require('./controllers/authController');

app.use(passport.initialize());
app.use(passport.session());

// 1) Global middleware
//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Set security HTTP headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:'],
        scriptSrc: [
          "'unsafe-inline'",
          "'unsafe-hashes'",
          "'self'",
          'https:',
          'http:',
          'blob:',
          'https://*.peerjs.com',
          'https://unpkg.com/peerjs@1.4.7/dist/peerjs.min.js',
          'https://*.mapbox.com',
          'https://js.stripe.com',
          'https://m.stripe.network',
          'https://*.cloudflare.com',
          'https://cdnjs.cloudflare.com/ajax/libs/axios/0.25.0/axios.js',
        ],
        frameSrc: [
          "'self'",
          'https://js.stripe.com',
          'https://accounts.google.com/',
        ],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        workerSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://*.peerjs.com',
          'https://*.tiles.mapbox.com',
          'https://api.mapbox.com',
          'https://events.mapbox.com',
          'https://m.stripe.network',
        ],
        childSrc: ["'self'", 'blob:'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        formAction: ["'self'"],
        // connectSrc: [
        //   "'self'",
        //   "'unsafe-inline'",
        //   'data:',
        //   'blob:',
        //   'https://*.peerjs.com',
        //   'https://*.stripe.com',
        //   'https://*.mapbox.com',
        //   'https://*.cloudflare.com/',
        // ],
        upgradeInsecureRequests: [],
      },
    },
  })
);

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
// Parser data from cookies on web browsers
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// 2) Routes

app.use('/', viewRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/conversation', conversationRouter);
app.use('/api/message', messageRouter);
app.use('/api/purchase', purchaseRouter);
app.use('/api/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404);
});

// app.rawListeners();
app.use(globalErrorHandler);

module.exports = app;
