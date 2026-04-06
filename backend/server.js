import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import AppError from './utils/appError.js';
import globalErrorHandler from './middlewares/error.middleware.js';
import routes from './routes/index.js';

/**
 * 🛠️ INITIAL SETUP
 * Load environment variables and initialize our Express app.
 */
dotenv.config();
const app = express();

/**
 * 🛡️ MIDDLEWARES
 * Middlewares are functions that run before our routes. 
 * They help with security, logging, and parsing data.
 */

// Allow our frontend (on a different port) to talk to this backend
app.use(cors());

// Add security headers to protect our app from common web attacks
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for easier local development
}));

// Log every request to the console (useful for debugging)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Help Express understand JSON data sent in the request body
app.use(express.json({ limit: '10kb' }));
// Help Express understand URL-encoded data (like from standard HTML forms)
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/**
 * 🏥 HEALTH CHECK & STATIC FILES
 */
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running 🚀'
  });
});

// Serve files in the 'uploads' folder (like trip images) so they are accessible via URL
app.use('/uploads', express.static('uploads'));

/**
 * 🗺️ ROUTES
 * This is where we hand off the request to our actual application logic.
 */
app.use('/api/v1', routes);

/**
 * 🚧 ERROR HANDLING
 */

// If we reached here, it means no route matched the URL the user requested
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// This central function handles every single error in the app
app.use(globalErrorHandler);

/**
 * 💾 DATABASE & SERVER START
 */
const DB = process.env.MONGODB_URL;

if (!DB) {
  console.error('❌ MONGODB_URL is missing in environment variables');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
// We start listening for requests immediately
const server = app.listen(PORT, () => {
    console.log(`🚀 App running on port ${PORT}`);
});

// Then we connect to MongoDB in the background
mongoose.connect(DB)
  .then(() => {
    console.log('✅ DB connection successful!');
  })
  .catch(err => {
    console.error('❌ DB connection failed:', err.message);
  });

/**
 * ⚠️ SAFETY NET
 * Catch any errors that weren't caught by our standard error handlers
 */
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});