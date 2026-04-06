import Itinerary from '../models/itinerary.model.js';
import Trip from '../models/trip.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const setTripId = (req, res, next) => {
  if (!req.body.trip) req.body.trip = req.params.tripId;
  next();
};

export const verifyTripAccess = catchAsync(async (req, res, next) => {
  const trip = await Trip.findById(req.body.trip || req.params.tripId);
  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }
  if (trip.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized for this trip', 403));
  }
  next();
});

export const getAllItineraries = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tripId) filter = { trip: req.params.tripId };

  const itineraries = await Itinerary.find(filter).sort({ dayNumber: 1 });

  res.status(200).json({
    status: 'success',
    results: itineraries.length,
    data: {
      itineraries
    }
  });
});

export const createItinerary = catchAsync(async (req, res, next) => {
  const newItinerary = await Itinerary.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      itinerary: newItinerary
    }
  });
});

export const updateItinerary = catchAsync(async (req, res, next) => {
  const itinerary = await Itinerary.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!itinerary) {
    return next(new AppError('No itinerary found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      itinerary
    }
  });
});

export const deleteItinerary = catchAsync(async (req, res, next) => {
  const itinerary = await Itinerary.findByIdAndDelete(req.params.id);

  if (!itinerary) {
    return next(new AppError('No itinerary found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

