import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A trip must have a title'],
      trim: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A trip must belong to a user']
    },
    destinations: [
      {
        name: {
          type: String,
          required: [true, 'Destination name is required']
        },
        location: {
          type: String // We can store lat/lng or formatted address
        }
      }
    ],
    startDate: {
      type: Date,
      required: [true, 'A trip must have a start date']
    },
    endDate: {
      type: Date,
      required: [true, 'A trip must have an end date']
    },
    budget: {
      type: Number,
      default: 0
    },
    preferences: {
      type: [String],
      enum: ['adventure', 'luxury', 'culture', 'nature', 'relaxation', 'food'],
      default: ['relaxation']
    },
    image: {
      type: String, // Store image URL/Filename
      default: 'default-trip.jpg'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

// Virtual populate for itineraries
tripSchema.virtual('itineraries', {
  ref: 'Itinerary',
  foreignField: 'trip',
  localField: '_id'
});

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
