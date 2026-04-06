import { Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import HomePage from "./components/HomePage";
import PlanTrip from "./components/PlanTrip";
import MyTrips from "./components/MyTrips";
import StatsPage from "./components/StatsPage";
import ExplorePage from "./components/ExplorePage";
import Navbar from "./components/Navbar";

/**
 * 🏠 MAIN APP COMPONENT
 * This is where we define all the "Pages" of our application.
 */
function App() {
  const location = useLocation();

  // 🎒 NAVBAR LOGIC:
  // We don't want to show the top navigation bar when the user is logging in or signing up.
  const hideNavbarRoutes = ["/signin", "/signup"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {/* Show the Navbar only on certain pages */}
      {shouldShowNavbar && <Navbar />}

      {/* 🗺️ PAGE ROUTING: 
          Each Route connects a "Path" (URL) to a "Component" (Page).
      */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/plantrip" element={<PlanTrip />} />
        <Route path="/mytrips" element={<MyTrips />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/explore" element={<ExplorePage />} />
      </Routes>
    </>
  );
}

export default App;

