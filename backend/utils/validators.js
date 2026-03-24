import Joi from 'joi';

export const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('user', 'admin').optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const tripSchema = Joi.object({
  title: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).required(),
  budget: Joi.number().min(0).optional(),
  preferences: Joi.array()
    .items(Joi.string().valid('adventure', 'luxury', 'culture', 'nature', 'relaxation', 'food'))
    .optional(),
  destinations: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        location: Joi.string().optional()
      })
    )
    .optional()
});

export const itinerarySchema = Joi.object({
  dayNumber: Joi.number().integer().min(1).required(),
  activities: Joi.array()
    .items(
      Joi.object({
        time: Joi.string().optional(),
        description: Joi.string().required(),
        location: Joi.string().optional()
      })
    )
    .required(),
  notes: Joi.string().optional()
});
