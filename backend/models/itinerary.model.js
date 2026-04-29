import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.ObjectId,
      ref: 'Trip',
      required: [true, 'Itinerary must belong to a trip.']
    },
    dayNumber: {
      type: Number,
      required: [true, 'An itinerary day must have a number.']
    },
    activities: [
      {
        time: String,
        description: {
          type: String,
          required: [true, 'Activity description is required.']
        },
        location: String
      }
    ],
    notes: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);


itinerarySchema.index({ trip: 1, dayNumber: 1 }, { unique: true });

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;
