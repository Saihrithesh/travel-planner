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

app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false,
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running 🚀'
  });
});

app.use('/uploads', express.static('uploads'));

app.use('/api/v1', routes);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

const DB = process.env.MONGODB_URL;

if (!DB) {
  console.error('❌ MONGODB_URL is missing in environment variables');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 App running on port ${PORT}`);
});

mongoose.connect(DB)
  .then(() => {
    console.log('✅ DB connection successful!');
  })
  .catch(err => {
    console.error('❌ DB connection failed:', err.message);
  });

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});