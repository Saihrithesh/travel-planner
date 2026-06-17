import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Calendar, MapPin, DollarSign, Edit3, Compass } from "lucide-react";
import api from "../api";

const staticImages = {
  "santorini": "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=600&q=80",
  "swiss alps": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80",
  "tokyo": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80",
  "serengeti": "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80",
  "reykjavik": "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=600&q=80",
  "jaipur": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/960px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg",
  "kerala": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/House_Boat_DSW.jpg/960px-House_Boat_DSW.jpg",
  "manali": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Manali_City.jpg/960px-Manali_City.jpg",
  "agra": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/960px-Taj_Mahal_%28Edited%29.jpeg",
  "goa": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/BeachFun.jpg/960px-BeachFun.jpg",
  "varanasi": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Varanasi%2C_India%2C_Ghats%2C_Cremation_ceremony_in_progress.jpg/960px-Varanasi%2C_India%2C_Ghats%2C_Cremation_ceremony_in_progress.jpg",
  "udaipur": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Udaipur_City_Palace.jpg/960px-Udaipur_City_Palace.jpg",
  "munnar": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Munnar_Overview.jpg/960px-Munnar_Overview.jpg",
  "leh ladakh": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Road_Padum_Zanskar_Range_Jun24_A7CR_00818.jpg/960px-Road_Padum_Zanskar_Range_Jun24_A7CR_00818.jpg",
  "andaman": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Andaman_Islands.PNG",
  "rishikesh": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Trayambakeshwar_Temple_VK.jpg/960px-Trayambakeshwar_Temple_VK.jpg",
  "hampi": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg/960px-Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg",
  "darjeeling": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/DarjeelingTrainFruitshop_%282%29.jpg/960px-DarjeelingTrainFruitshop_%282%29.jpg"
};

const MyTrips = () => {
  const [myTrips, setMyTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all trips on load
  const fetchTrips = async () => {
    try {
      const response = await api.get("/trips");
      setMyTrips(response.data.data.trips || []);
    } catch (error) {
      console.error("Failed to fetch trips", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Handle Delete Trip
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    
    try {
      await api.delete(`/trips/${id}`);
      setMyTrips((prev) => prev.filter(trip => trip._id !== id));
    } catch (error) {
      console.error("Failed to delete trip", error);
    }
  };

  const getTripStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { label: "Upcoming", style: "bg-white/10 text-white border-white/20" };
    } else if (now > end) {
      return { label: "Completed", style: "bg-neutral-900/60 text-neutral-400 border-neutral-800" };
    } else {
      return { label: "Active", style: "bg-white text-black border-white" };
    }
  };

  const getTripImage = (image, destinationName) => {
    // If image is default or missing, try to resolve it from the destination name
    if (!image || image === 'default-trip.jpg') {
      const destLower = (destinationName || "").toLowerCase();
      const matchedKey = Object.keys(staticImages).find(key => 
        destLower.includes(key)
      );
      if (matchedKey) {
        return staticImages[matchedKey];
      }
      return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80";
    }
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const origin = new URL(apiUrl).origin;
      return `${origin}/${image}`;
    } catch (e) {
      return `http://localhost:5000/${image}`;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
        <p className="text-slate-400 font-bold">Loading your journeys...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } }
  };

  if (myTrips.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg rounded-3xl bg-glass border-glass p-8 md:p-12 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
          
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white mb-6 shadow-inner border border-white/25">
            <Compass className="h-8 w-8" />
          </div>
          
          <h2 className="text-2xl font-black text-white mb-3">No adventures planned yet</h2>
          <p className="text-slate-400 font-medium mb-8 leading-relaxed max-w-sm mx-auto">
            Embark on a new voyage! Start planning your next dream destination and draft beautiful memories.
          </p>
          
          <Link to="/plantrip">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-black shadow-lg shadow-white/5 hover:bg-neutral-200 transition-all"
            >
              <Plus className="h-5 w-5" />
              <span>Plan your first trip</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-white">My Trips</h1>
          <p className="text-sm text-slate-400 font-medium">
            You have <span className="text-white font-bold">{myTrips.length}</span> journey{myTrips.length === 1 ? "" : "s"} locked in.
          </p>
        </div>

        <Link to="/plantrip">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-white/5 hover:bg-neutral-200 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Plan New Trip</span>
          </motion.button>
        </Link>
      </div>

      <hr className="border-white/5" />

      {/* Grid of Results */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 card-wrapper"
      >
        <AnimatePresence>
          {myTrips.map((trip) => {
            const destinationName = trip.destinations?.[0]?.name || trip.title?.replace('Trip to ', '');
            const startDateStr = new Date(trip.startDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
            const endDateStr = new Date(trip.endDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
            const status = getTripStatus(trip.startDate, trip.endDate);

            return (
              <motion.div
                key={trip._id}
                variants={cardVariants}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -6 }}
                className="trip-card flex flex-col justify-between rounded-2xl bg-glass border-glass overflow-hidden shadow-xl relative transition-all duration-300"
              >
                {/* Image section */}
                <div className="h-44 w-full relative overflow-hidden group shrink-0">
                  <img 
                    src={getTripImage(trip.image, destinationName)} 
                    alt={destinationName} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  {/* Status Overlay */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border backdrop-blur-md ${status.style}`}>
                      {status.label}
                    </span>
                  </div>
                  {/* Created date overlay */}
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold border border-white/10 text-slate-400 shadow-md">
                    Created {new Date(trip.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="absolute top-44 -right-12 w-28 h-28 bg-white/5 rounded-full blur-xl pointer-events-none" />

                <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-xl text-white flex items-center gap-1.5 leading-tight">
                        <MapPin className="text-white h-5 w-5 shrink-0" />
                        <span className="truncate">{destinationName}</span>
                      </h3>
                    </div>

                    {/* Dates & Budget Details */}
                    <div className="space-y-2 rounded-xl bg-slate-950/30 border border-white/5 p-3 text-sm text-slate-300 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-neutral-400 shrink-0" />
                        <span>{startDateStr} - {endDateStr}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-neutral-400 shrink-0" />
                        <span className="text-white font-semibold">Budget: ${trip.budget}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-white/5 flex gap-3">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/edittrip/${trip._id}`, { state: { trip } })}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 py-2 px-3 text-sm font-bold text-slate-200 transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit</span>
                    </motion.button>
                    
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDelete(trip._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-red-500/20 hover:border-red-500/40 bg-red-500/10 hover:bg-red-500/20 py-2 px-3 text-sm font-bold text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MyTrips;
