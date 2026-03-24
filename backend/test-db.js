import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log("Testing DB logic...");
const MONGODB_URL = "mongodb+srv://travelplanner:tp0900@travelplanner.s5qyrl3.mongodb.net/?appName=travelplanner";

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log('DB connection successful!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('DB connection error:', err);
    process.exit(1);
  });
