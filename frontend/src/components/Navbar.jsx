import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import { Compass, CalendarDays, PlusCircle, LogOut, BarChart3, Home, MessageSquare } from "lucide-react";

function Navbar() {
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/mytrips", label: "My Trips", icon: CalendarDays },
    { to: "/plantrip", label: "Plan Trip", icon: PlusCircle },
    { to: "/explore", label: "Explore", icon: Compass },
    { to: "/stats", label: "Stats", icon: BarChart3 },
    { to: "/chat", label: "Roamy", icon: MessageSquare },
  ];

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-4 z-50 mx-auto max-w-6xl px-4"
    >
      <div className="relative flex h-[72px] items-center justify-between rounded-2xl bg-glass border-glass px-6 shadow-xl backdrop-blur-md overflow-hidden">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black transition-all group-hover:rotate-12 group-hover:scale-110 shadow-lg shadow-white/10">
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              className="h-5 w-5"
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </motion.svg>
          </div>
          <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
            TravelPlanner
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl bg-neutral-900/40 p-1 border border-white/5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-300 z-10
                   ${isActive ? "text-black" : "text-neutral-400 hover:text-neutral-200"}`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-indicator"
                        className="absolute inset-0 rounded-lg bg-white shadow-md -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User profile / Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/20 text-neutral-200 font-bold text-sm">
              {initials}
            </div>
            <span className="hidden lg:inline text-sm font-semibold text-neutral-300 max-w-[120px] truncate">
              {user?.name || "User"}
            </span>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-black transition-all hover:bg-neutral-200 hover:shadow-lg"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>

        {/* Dynamic Scroll Progress Bar */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-white origin-left"
          style={{ scaleX: scrollYProgress }}
        />
      </div>
    </motion.header>
  );
}

export default Navbar;
