import express from 'express';
import authRouter from './auth.routes.js';
import userRouter from './user.routes.js';
import tripRouter from './trip.routes.js';
import destinationRouter from './destination.routes.js';
import { getWeather, getAIItinerary } from '../controllers/destination.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/trips', tripRouter);
router.use('/destinations', destinationRouter);

// Add top-level routes for weather and ai-planner as used by frontend
router.get('/weather', protect, getWeather);
router.post('/ai-planner', protect, getAIItinerary);

export default router;
