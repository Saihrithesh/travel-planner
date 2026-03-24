import User from '../models/user.model.js';
import Trip from '../models/trip.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

export const addFavoriteDestination = catchAsync(async (req, res, next) => {
  const { destination } = req.body;

  if (!destination) {
    return next(new AppError('Please provide a destination name', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { favorites: destination } }, // prevents duplicates
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      favorites: user.favorites
    }
  });
});

export const getHistory = catchAsync(async (req, res, next) => {
  // Trips whose end date is in the past
  const pastTrips = await Trip.find({
    user: req.user.id,
    endDate: { $lt: new Date() }
  }).sort({ endDate: -1 });

  res.status(200).json({
    status: 'success',
    results: pastTrips.length,
    data: {
      history: pastTrips
    }
  });
});
