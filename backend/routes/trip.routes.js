import express from 'express';
import {
  getAllTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  setUserId
} from '../controllers/trip.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { uploadTripImage } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { tripSchema } from '../utils/validators.js';
import itineraryRouter from './itinerary.routes.js';

const router = express.Router();

// Nested route
// POST /trips/:tripId/itineraries
// GET  /trips/:tripId/itineraries
router.use('/:tripId/itineraries', itineraryRouter);

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getAllTrips)
  .post(uploadTripImage, setUserId, validate(tripSchema), createTrip);

router
  .route('/:id')
  .get(getTrip)
  .patch(uploadTripImage, validate(tripSchema), updateTrip)
  .delete(deleteTrip);

export default router;
