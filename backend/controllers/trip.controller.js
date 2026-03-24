import Trip from '../models/trip.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const setUserId = (req, res, next) => {
  // Allow nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

export const getAllTrips = catchAsync(async (req, res, next) => {
  // Add pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  // By default, showing user's own trips
  const filter = { user: req.user.id };

  const trips = await Trip.find(filter)
    .populate('itineraries')
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: 'success',
    results: trips.length,
    data: {
      trips
    }
  });
});

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

export const createTrip = catchAsync(async (req, res, next) => {
  // multer provides req.file if uploaded
  if (req.file) {
    req.body.image = req.file.path.replace(/\\/g, '/');
  }

  const newTrip = await Trip.create({
    ...req.body,
    user: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: {
      trip: newTrip
    }
  });
});

export const updateTrip = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.path.replace(/\\/g, '/');
  }

  const trip = await Trip.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true, runValidators: true }
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

export const deleteTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user.id });

  if (!trip) {
    return next(new AppError('No trip found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
