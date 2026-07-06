# 🌍 TripWise: Your AI-Powered Travel Companion

TripWise is a comprehensive full-stack travel planning application designed to simplify your journey from discovery to execution. It combines modern web technologies with AI and global databases to help travelers plan, track, and enjoy their adventures.

---

## 🚀 Key Features

- **🔐 Secure Authentication**: JWT-based user authentication and protected routing.
- **📍 Smart Exploration**: Discover global destinations through an interactive Explore page with live Wikipedia search integration and categorized filters.
- **📅 AI Itinerary Generation**: Automatically generate detailed, day-by-day travel plans using OpenAI.
- **📊 Travel Analytics**: Visualize your travel history and budget trends through a sleek statistics dashboard.
- **✈️ Trip Management**: Create, view, and manage your upcoming and past journeys with ease.
- **🤖 Roamy AI Chatbot**: Meet Roamy, your dedicated travel AI co-pilot. Chat with Roamy via the full dashboard or the global floating widget in the bottom-right corner. Roamy generates extremely concise summaries, itineraries, packing suggestions, and budget tables while filter-blocking non-travel questions.
- **☁️ Real-time Weather**: Get localized weather insights for your destinations via the Open-Meteo API.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **State & Animations**: Framer Motion (for chat slide-ins and toggles)
- **Icons**: Lucide-React
- **Charts**: Recharts
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **AI Integrations**: Gemini API
- **Security**: JSON Web Tokens (JWT), Bcrypt, Helmet
- **Validation**: Joi

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Saihrithesh/travel-planner.git
cd travel-planner
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
OPENAI_API_KEY=your_openai_or_gemini_api_key
```
*(Note: If your key starts with `sk-`, the backend automatically initiates the OpenAI client using `gpt-4o-mini`. If your key is a Google Gemini key starting with `AIzaSy` or `AQ.`, it will automatically route queries to the Google Gemini API with `gemini-2.5-flash`.)*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

---

## 🏃 Running the Application

Open two separate terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173` (Frontend) and `http://localhost:5000` (Backend API).

---
*Created with ❤️ by Saihrithesh*
