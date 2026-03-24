import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const navClass = ({ isActive }) =>
    `h-[35px] m-2 rounded-md p-1 flex items-center gap-2 mt-3 font-bold
     ${isActive ? "text-black bg-white" : "text-white hover:text-black hover:bg-white"}`;

  return (
    <header className="bg-black h-[70px] flex justify-around items-center">
      
      <Link to="/" className="flex items-center gap-2">
        <img
          className="w-[40px] h-[40px]"
          src="https://res.cloudinary.com/dceeihrlp/image/upload/v1758276250/airplane-mode_zm32ob.png"
          alt="logo"
        />
        <h1 className="font-bold text-2xl text-white">TravelPlanner</h1>
      </Link>

      {/* Navigation */}
      <nav className="flex">
        <NavLink to="/" className={navClass}>
          <img
            className="w-[20px] h-[20px]"
            src="https://res.cloudinary.com/dceeihrlp/image/upload/v1758277365/home_hriost.png"
            alt="home"
          />
          Home
        </NavLink>

        <NavLink to="/mytrips" className={navClass}>
          <img
            className="w-[20px] h-[20px]"
            src="https://res.cloudinary.com/dceeihrlp/image/upload/v1758277868/map_psb4tc.png"
            alt="trips"
          />
          My Trips
        </NavLink>

        <NavLink to="/plantrip" className={navClass}>
          <img
            className="w-[20px] h-[20px]"
            src="https://res.cloudinary.com/dceeihrlp/image/upload/v1758277945/add_w3p8hi.png"
            alt="plan"
          />
          Plan Trip
        </NavLink>
      </nav>

      {/* Logout */}
      <button 
        onClick={handleLogout}
        className="text-black font-bold bg-white px-4 py-2 rounded-md hover:bg-gray-200 transition"
      >
        Logout
      </button>

    </header>
  );
}

export default Navbar;
