# 🗺️ Travel Planner: Project Guide for Beginners

Welcome to the **Travel Planner** project! This guide will help you understand how the code is organized and how the different parts work together.

---

## 🏗️ The Big Picture

This is a **Full-Stack Application** which means it has two main parts:
1.  **Frontend (The Visuals):** What you see in the browser. Built with **React**.
2.  **Backend (The Brains):** The server that talks to the database. Built with **Node.js & Express**.

---

## 📁 Folder Structure Reference

### **Frontend (`/frontend`)**
*   `src/api.js`: The "messenger" that sends requests to the backend.
*   `src/App.jsx`: The main entry point where all pages (routes) are defined.
*   `src/components/`: Individual pages like `HomePage`, `MyTrips`, and `PlanTrip`.

### **Backend (`/backend`)**
*   `server.js`: The starting point of the server.
*   `models/`: Defines what the data (Users, Trips) looks like in the database.
*   `routes/`: Defines the URLs (like `/api/v1/trips`) the frontend can call.
*   `controllers/`: The actual logic that runs when a route is called.
*   `middlewares/`: Helper functions that run "in the middle" (e.g., checking if a user is logged in).

---

## ⚙️ How Data Flows

When you click "Save Trip" on the website, here is what happens:

1.  **Frontend Component (`PlanTrip.jsx`):** Collects the name and date you typed.
2.  **The Messenger (`api.js`):** Sends that data across the internet to the backend.
3.  **The Router (`routes/trip.routes.js`):** Receives the request and says, "Aha! Someone wants to create a trip."
4.  **The Controller (`controllers/trip.controller.js`):** Validates the data and tells the database to save it.
5.  **The Database (MongoDB):** Safely stores the trip forever.

---

## 🗝️ Key Concepts to Know

### 1. **JWT (Security Tokens)**
Instead of sending your password every time, the backend gives the frontend a "Ticket" (Token) after you log in. The frontend shows this ticket every time it asks for data.

### 2. **async/await**
Talking to a database takes a little bit of time. We use `async` and `await` to tell JavaScript: *"Hold on a second, wait for the database to finish before moving to the next line."*

### 3. **Interceptors**
Think of these as "Automatic Helpers" in `api.js`. They automatically add your security token to every request so you don't have to do it manually in every single component.

---

## 🚀 How to Add a New Feature

If you want to add something new (like a "Notes" section for trips):
1.  **Backend Model**: Add `notes: String` to `models/trip.model.js`.
2.  **Frontend Component**: Add a textarea in `PlanTrip.jsx` to collect the notes.
3.  **Frontend API**: Make sure the `handleSubmit` function in `PlanTrip.jsx` sends the `notes` to the backend.

---

## 🧪 Testing the API

If you want to see the backend in action without using the browser:
1.  Open **Postman**.
2.  Click **Import** and select `backend/travel-planner.postman_collection.json`.
3.  This collection already has all the requests (Login, Create Trip, etc.) ready for you to try!

Happy Coding! 🎒✈️

