import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, DollarSign, Notebook, ArrowLeft, Send, Sparkles } from "lucide-react";
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

function PlanTrip() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = location.state || {};
  const isEditing = Boolean(prefill.trip);
  const tripId = isEditing ? prefill.trip._id : null;

  const [savedStatus, setSavedStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [destination, setDestination] = useState(
    isEditing ? (prefill.trip.destinations?.[0]?.name || prefill.trip.title?.replace('Trip to ', '')) : prefill.destination || ""
  );

  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const ignoreSearchRef = useRef(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search on Wikipedia API (similar to ExplorePage)
  useEffect(() => {
    if (ignoreSearchRef.current) {
      ignoreSearchRef.current = false;
      return;
    }

    if (destination.trim().length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages|extracts&generator=prefixsearch&gpssearch=${encodeURIComponent(
            destination
          )}&gpslimit=4&pithumbsize=600&exsentences=1&exlimit=max&exintro=1&explaintext=1`
        );
        const data = await res.json();

        if (data.query && data.query.pages) {
          const pages = data.query.pages;
          const mapped = Object.values(pages).map((page) => ({
            id: page.pageid,
            title: page.title,
            image: page.thumbnail?.source || "https://picsum.photos/seed/search/600/400"
          }));
          setSearchResults(mapped);
          setShowDropdown(true);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Wiki search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [destination]);

  const handleSelectDestination = (dest) => {
    ignoreSearchRef.current = true;
    setDestination(dest.title);
    setSelectedImage(dest.image);
    setSearchResults([]);
    setShowDropdown(false);
  };

  const formatToDateStr = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const getLocalDateString = (addDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + addDays);
    return d.toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState(
    isEditing ? formatToDateStr(prefill.trip.startDate) : (prefill.durationDays ? getLocalDateString(0) : "")
  );
  const [endDate, setEndDate] = useState(
    isEditing ? formatToDateStr(prefill.trip.endDate) : (prefill.durationDays ? getLocalDateString(prefill.durationDays) : "")
  );
  const [budget, setBudget] = useState(isEditing ? prefill.trip.budget : (prefill.budget || 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const matchedKey = Object.keys(staticImages).find(key => 
        destination.toLowerCase().includes(key)
      );
      
      const originalDestination = isEditing ? (prefill.trip.destinations?.[0]?.name || prefill.trip.title?.replace('Trip to ', '')) : "";
      const destinationChanged = isEditing && 
        destination.trim().toLowerCase() !== originalDestination.trim().toLowerCase();

      const tripImage = (isEditing && !destinationChanged)
        ? prefill.trip.image 
        : (selectedImage || prefill.image || (matchedKey ? staticImages[matchedKey] : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80"));

      const newTripData = {
        title: `Trip to ${destination}`,
        startDate,
        endDate,
        budget: Number(budget),
        destinations: [{ name: destination }],
        image: tripImage
      };

      if (isEditing) {
        await api.patch(`/trips/${tripId}`, newTripData);
        setSavedStatus("Trip updated! 😎");
      } else {
        await api.post("/trips", newTripData);
        setSavedStatus("Trip saved successfully! 😎");
      }
      
      setTimeout(() => {
        navigate("/mytrips");
      }, 1200);
      
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Network Error: Could not reach the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getPreviewImage = () => {
    if (selectedImage) return selectedImage;
    const matchedKey = Object.keys(staticImages).find(key => 
      destination.toLowerCase().includes(key)
    );
    return prefill.image || (matchedKey ? staticImages[matchedKey] : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80");
  };

  const getFormattedDateRange = () => {
    if (!startDate && !endDate) return "Select date range";
    const startStr = startDate ? new Date(startDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "Start Date";
    const endStr = endDate ? new Date(endDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "End Date";
    return `${startStr} - ${endStr}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col items-center space-y-10">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full text-center space-y-2"
      >
        <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
          {isEditing ? "Modify Your Adventure" : "Map Your Next Adventure"}
        </h1>
        <p className="text-slate-400 font-medium max-w-md mx-auto">
          {isEditing 
            ? "Update details to refine your upcoming voyage" 
            : "Plan your travel requirements, define your budgets, and let the journey unfold"}
        </p>
      </motion.div>

      {/* Main Grid Wrapper */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Glassmorphic Form Editor */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 w-full rounded-3xl bg-glass border-glass p-6 md:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/5 rounded-full blur-2xl" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm font-semibold text-red-400"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-white/5 pb-2">Trip Specifications</h2>

              {/* Destination input */}
              <div ref={dropdownRef} className="space-y-2 relative">
                <label className="text-sm font-bold text-slate-300">Destination *</label>
                <div className="relative group">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-white transition-colors" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                    placeholder="Where would you like to go?"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] py-3 pl-11 pr-4 text-white placeholder-neutral-500 outline-none transition-all duration-300 focus:border-white focus:bg-white/[0.08] focus:ring-1 focus:ring-white/20"
                    onFocus={() => {
                      if (searchResults.length > 0) setShowDropdown(true);
                    }}
                  />
                  {isSearching && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </div>
                  )}
                </div>

                {/* Dropdown results */}
                <AnimatePresence>
                  {showDropdown && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 top-full mt-2 rounded-xl border border-white/10 bg-neutral-950/90 backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
                    >
                      <ul className="divide-y divide-white/5 max-h-60 overflow-y-auto">
                        {searchResults.map((result) => (
                          <li key={result.id}>
                            <button
                              type="button"
                              onClick={() => handleSelectDestination(result)}
                              className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center justify-between transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-neutral-400 group-hover:text-white transition-colors" />
                                <span className="text-sm font-semibold text-neutral-300 group-hover:text-white transition-colors">
                                  {result.title}
                                </span>
                              </div>
                              {result.image && (
                                <img
                                  src={result.image}
                                  alt=""
                                  className="h-8 w-12 rounded object-cover border border-white/10 group-hover:border-white/30 transition-colors"
                                />
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Start and End Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300">Start Date *</label>
                  <div className="relative group">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-white transition-colors pointer-events-none" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] py-3 pl-11 pr-4 text-white placeholder-neutral-500 outline-none transition-all duration-300 focus:border-white focus:bg-white/[0.08] focus:ring-1 focus:ring-white/20 [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300">End Date *</label>
                  <div className="relative group">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-white transition-colors pointer-events-none" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] py-3 pl-11 pr-4 text-white placeholder-neutral-500 outline-none transition-all duration-300 focus:border-white focus:bg-white/[0.08] focus:ring-1 focus:ring-white/20 [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              {/* Budget input */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300">Budget (USD) *</label>
                <div className="relative group">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-white transition-colors" />
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                    min="0"
                    placeholder="Enter your budget"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] py-3 pl-11 pr-4 text-white placeholder-neutral-500 outline-none transition-all duration-300 focus:border-white focus:bg-white/[0.08] focus:ring-1 focus:ring-white/20"
                  />
                </div>
              </div>

              {/* Notes area */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300">Notes (Optional)</label>
                <div className="relative group">
                  <Notebook className="absolute left-3.5 top-3 h-5 w-5 text-slate-500 group-focus-within:text-white transition-colors pointer-events-none" />
                  <textarea
                    placeholder="Write down lodging, flights, sights to see, or custom preferences..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] py-3 pl-11 pr-4 h-28 text-white placeholder-neutral-500 outline-none transition-all duration-300 focus:border-white focus:bg-white/[0.08] focus:ring-1 focus:ring-white/20 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 py-3 text-sm font-bold text-slate-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Cancel</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-black shadow-lg shadow-white/5 transition-all hover:bg-neutral-200 disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>{isEditing ? "Update Trip" : "Save Trip Plan"}</span>
                  </>
                )}
              </motion.button>
            </div>

            <AnimatePresence>
              {savedStatus && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center font-bold text-neutral-200 text-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  {savedStatus}
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Right Column: Live Creator Studio Card Preview */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-5 w-full flex flex-col items-center space-y-4 lg:sticky lg:top-28"
        >
          <div className="w-full flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Live Preview</span>
            <span className="text-[10px] font-bold text-slate-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">Draft Mode</span>
          </div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="trip-card w-full flex flex-col justify-between rounded-2xl bg-glass border-glass overflow-hidden shadow-2xl relative transition-all duration-300"
          >
            {/* Image section */}
            <div className="h-44 w-full relative overflow-hidden group shrink-0 bg-slate-900/50">
              <AnimatePresence mode="popLayout">
                <motion.img 
                  key={getPreviewImage()}
                  initial={{ opacity: 0, scale: 1.15 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  src={getPreviewImage()} 
                  alt="Destination Preview" 
                  className="w-full h-full object-cover" 
                />
              </AnimatePresence>
              
              {/* Status Overlay */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border backdrop-blur-md bg-white/10 text-white border-white/20">
                  Upcoming
                </span>
              </div>
              
              {/* Draft badge overlay */}
              <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold border border-white/10 text-slate-400 shadow-md">
                Pre-visualized
              </div>
            </div>

            <div className="absolute top-44 -right-12 w-28 h-28 bg-white/5 rounded-full blur-xl pointer-events-none" />

            <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-xl text-white flex items-center gap-1.5 leading-tight">
                    <MapPin className="text-white h-5 w-5 shrink-0" />
                    <span className="truncate">{destination || "Destination Name"}</span>
                  </h3>
                </div>

                {/* Dates & Budget Details */}
                <div className="space-y-2 rounded-xl bg-slate-950/30 border border-white/5 p-3 text-sm text-slate-300 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-neutral-400 shrink-0" />
                    <span>{getFormattedDateRange()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-neutral-400 shrink-0" />
                    <span className="text-white font-semibold">Budget: ${budget || 0}</span>
                  </div>
                </div>
              </div>

              {/* Card Actions (Simulated) */}
              <div className="pt-4 border-t border-white/5 flex gap-3 opacity-40 select-none">
                <div className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 px-3 text-sm font-bold text-slate-400">
                  <span>Edit</span>
                </div>
                <div className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 px-3 text-sm font-bold text-slate-400">
                  <span>Delete</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}

export default PlanTrip;
