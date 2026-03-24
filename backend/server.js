import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import AppError from './utils/appError.js';
import globalErrorHandler from './middlewares/error.middleware.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();

// ✅ MIDDLEWARES
app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ✅ ROOT ROUTE (Render health check)
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running 🚀'
  });
});

// Static files
app.use('/uploads', express.static('uploads'));

// ROUTES
app.use('/api/v1', routes);

// Handle undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

// ✅ IMPORTANT: DB CONNECTION (MUST be Atlas URL)
const DB = process.env.MONGODB_URL;

if (!DB) {
  console.error('❌ MONGODB_URL is missing in environment variables');
  process.exit(1);
}

// ✅ Connect DB FIRST, then start server
mongoose.connect(DB)
  .then(() => {
    console.log('✅ DB connection successful!');

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 App running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  });