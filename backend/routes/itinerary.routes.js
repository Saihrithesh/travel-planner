import express from 'express';
import {
  getAllItineraries,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  setTripId,
  verifyTripAccess
} from '../controllers/itinerary.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { itinerarySchema } from '../utils/validators.js';

// mergeParams allows access to tripId from other routers
const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(verifyTripAccess); // Ensures user has access to trip

router
  .route('/')
  .get(getAllItineraries)
  .post(setTripId, validate(itinerarySchema), createItinerary);

router
  .route('/:id')
  .patch(validate(itinerarySchema), updateItinerary)
  .delete(deleteItinerary);

export default router;
