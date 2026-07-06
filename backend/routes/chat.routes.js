import express from 'express';
import { sendMessage } from '../controllers/chat.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', sendMessage);

export default router;
