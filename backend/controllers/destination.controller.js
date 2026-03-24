import { fetchWeather, generateAItinerary } from '../services/externalApi.service.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getWeather = catchAsync(async (req, res, next) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return next(new AppError('Please provide latitude and longitude', 400));
  }

  const weather = await fetchWeather(lat, lon);

  res.status(200).json({
    status: 'success',
    data: {
      weather
    }
  });
});

export const getAIItinerary = catchAsync(async (req, res, next) => {
  const { destination, days = 3, preferences = 'general' } = req.body;

  if (!destination) {
    return next(new AppError('Please provide a destination', 400));
  }

  const generatedItinerary = await generateAItinerary(
    destination,
    days,
    preferences
  );

  res.status(200).json({
    status: 'success',
    data: {
      itinerary: generatedItinerary
    }
  });
});
