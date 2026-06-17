import Joi from 'joi';

export const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required().custom((value, helpers) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      return helpers.message('Please provide a valid email address structure (e.g. user@domain.com)');
    }
    const disposableDomains = [
      'tempmail.com', 'mailinator.com', 'yopmail.com', 'dispostable.com',
      'guerrillamail.com', 'sharklasers.com', '10minutemail.com',
      'trashmail.com', 'getairmail.com', 'temp-mail.org', 'tempmail.net',
      'mailinator.net', 'yopmail.net', 'fakeinbox.com', 'safetymail.info'
    ];
    const domain = value.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(domain)) {
      return helpers.message('Disposable or fake email addresses are not allowed');
    }
    return value;
  }),
  password: Joi.string().min(8).required().custom((value, helpers) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(value)) {
      return helpers.message('Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character');
    }
    return value;
  }),
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
