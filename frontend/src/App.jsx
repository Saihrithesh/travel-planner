import { useState } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import HomePage from "./components/HomePage";
import PlanTrip from "./components/PlanTrip";
import MyTrips from "./components/MyTrips";
import StatsPage from "./components/StatsPage";
import ExplorePage from "./components/ExplorePage";
import Navbar from "./components/Navbar";
import InitialLoader from "./components/InitialLoader";
import CursorTrail from "./components/CursorTrail";

function App() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [isAppLoading, setIsAppLoading] = useState(true);

  const hideNavbarRoutes = ["/signin", "/signup"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);



  // Helper to protect routes
  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/signin" />;
  };

  // Helper to prevent logged-in users from seeing login/signup
  const AuthRoute = ({ children }) => {
    return token ? <Navigate to="/" /> : children;
  };

  return (
    <>
      <CursorTrail />
      <AnimatePresence mode="wait">
        {isAppLoading && (
          <InitialLoader onComplete={() => setIsAppLoading(false)} />
        )}
      </AnimatePresence>
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <AuthRoute>
              <RegisterPage />
            </AuthRoute>
          } 
        />
        <Route 
          path="/signin" 
          element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          } 
        />

        <Route 
          path="/plantrip" 
          element={
            <ProtectedRoute>
              <PlanTrip />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edittrip/:id" 
          element={
            <ProtectedRoute>
              <PlanTrip />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mytrips" 
          element={
            <ProtectedRoute>
              <MyTrips />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/stats" 
          element={
            <ProtectedRoute>
              <StatsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/explore" 
          element={
            <ProtectedRoute>
              <ExplorePage />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}


export default App;


