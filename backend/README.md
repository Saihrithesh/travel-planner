# Travel Planner Backend

A production-ready RESTful API for a Travel Planner web application, built using **Node.js, Express.js, and MongoDB (Mongoose)**. It follows an MVC-like clean architecture, incorporates secure JWT-based authentication, and provides functionalities to manage trips and itineraries.

## Core Features
- User Authentication (Signup / Login with JWT)
- Trip Management (CRUD for user's trips)
- Itinerary Management (Structured daily itinerary with nested routes)
- Profile/Favorites Tracking (Add destinations to user's favorites)
- AI Auto-Planner via OpenAI API
- External Open-Meteo Weather API integration
- Secure by default: helmet headers, rate limiting, and inputs sanitized/validated via Joi.

## Folder Structure
```text
/config        # Configuration files
/controllers   # Route controllers (Auth, Trip, User, Itinerary, External)
/middlewares   # Custom express middlewares (auth, validation, error handler, multer upload)
/models        # Mongoose database models (User, Trip, Itinerary)
/routes        # Express routers defining endpoints
/services      # External service calls (OpenAI, Weather API)
/utils         # Helpers (AppError, catchAsync, Validators)
/uploads       # Uploaded trip images
```

## Setup & Running Locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Rename `.env.sample` to `.env` and fill in necessary keys. 
   Optionally adjust PORT, MongoDB URI, and OpenAI API Key.

3. **Start the API Server**
   ```bash
   # Development (with nodemon)
   npm run dev

   # Production
   npm start
   ```

4. **Testing the API**
   - You can find the Postman collection `travel-planner.postman_collection.json` in this directory. Just import it into Postman and set the `{{baseUrl}}` variable to `http://localhost:3000/api/v1` and `{{token}}` variable whenever you login.
