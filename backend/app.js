import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import appError from './utils/appError.js';
import globalErrorHandler from './middlewares/error.middleware.js';
import routes from './routes/index.js';

const app = express();

// 1) GLOBAL MIDDLEWARES
// Implement CORS (Must be at top so errors get headers)
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Serving static files (for uploaded images)
app.use('/uploads', express.static('uploads'));

// 2) ROUTES
app.use('/api/v1', routes);

// Handle undefined Routes
app.use((req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;
