import express from 'express';
import authRouter from './auth.routes.js';
import userRouter from './user.routes.js';
import tripRouter from './trip.routes.js';
import destinationRouter from './destination.routes.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/trips', tripRouter);
router.use('/destinations', destinationRouter);

export default router;
