import Trip from '../models/trip.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

/**
 * 🛠️ UTILITY: Set User ID
 * This middleware ensures the trip being created is linked to the logged-in user.
 */
export const setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

/**
 * 📅 GET ALL TRIPS
 * Fetches all trips belonging to the logged-in user.
 * Supports "pagination" (showing a few at a time).
 */
export const getAllTrips = catchAsync(async (req, res, next) => {
  // 1. Setup pagination (default to page 1, 10 trips per page)
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  // 2. Filter to only show trips created by THIS user
  const filter = { user: req.user.id };

  // 3. Find trips in the database and "populate" their details
  const trips = await Trip.find(filter)
    .populate('itineraries')
    .skip(skip)
    .limit(limit);

  // 4. Send the result back to the frontend
  res.status(200).json({
    status: 'success',
    results: trips.length,
    data: {
      trips
    }
  });
});

/**
 * 🔍 GET ONE TRIP
 * Fetches the details of a specific trip by its ID.
 */
export const getTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user.id }).populate('itineraries');

  if (!trip) {
    return next(new AppError('No trip found with that ID for this user', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      trip
    }
  });
});

/**
 * ✨ CREATE NEW TRIP
 * Saves a new trip to the database.
 */
export const createTrip = catchAsync(async (req, res, next) => {
  // If a file was uploaded (like a cover photo), save its path
  if (req.file) {
    req.body.image = req.file.path.replace(/\\/g, '/');
  }

  // Create the trip using the data sent from the frontend
  const newTrip = await Trip.create({
    ...req.body,
    user: req.user.id // Link it to the user
  });

  res.status(201).json({
    status: 'success',
    data: {
      trip: newTrip
    }
  });
});

/**
 * 📝 UPDATE TRIP
 * Modifies an existing trip's details.
 */
export const updateTrip = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.path.replace(/\\/g, '/');
  }

  // Find the trip and update it with the new data (req.body)
  const trip = await Trip.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true, runValidators: true } // Return the updated trip and check rules
  );

  if (!trip) {
    return next(new AppError('No trip found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      trip
    }
  });
});

/**
 * 🗑️ DELETE TRIP
 * Permanently removes a trip from the database.
 */
export const deleteTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user.id });

  if (!trip) {
    return next(new AppError('No trip found with that ID', 404));
  }

  // 204 means "Success, but there's no content to send back"
  res.status(204).json({
    status: 'success',
    data: null
  });
});

