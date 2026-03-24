import express from 'express';
import {
  getUser,
  getMe,
  addFavoriteDestination,
  getHistory
} from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/me', getMe, getUser);
router.get('/history', getHistory);
router.post('/favorites', addFavoriteDestination);

export default router;
