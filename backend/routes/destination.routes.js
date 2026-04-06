import express from 'express';
import {
  getWeather,
  getAIItinerary
} from '../controllers/destination.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/weather', getWeather);
router.post('/ai-planner', getAIItinerary);

export default router;
