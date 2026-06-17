import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle, Calendar, Compass, BarChart3, ArrowRight, Sparkles, MapPin } from "lucide-react";

function HomePage() {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed?.name) {
          setUserName(parsed.name);
        }
      } catch (err) {
        console.error("Failed to parse user data", err);
      }
    } else {
      setUserName("Guest");
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const actionCards = [
    {
      to: "/plantrip",
      title: "Plan a Trip",
      description: "Start planning your next adventure",
      icon: PlusCircle,
      gradient: "from-neutral-950/60 to-neutral-900/60 hover:shadow-white/5 border-white/10 hover:border-white/30",
      iconColor: "text-neutral-200"
    },
    {
      to: "/mytrips",
      title: "View My Trips",
      description: "See all your planned journeys",
      icon: Calendar,
      gradient: "from-neutral-950/60 to-neutral-900/60 hover:shadow-white/5 border-white/10 hover:border-white/30",
      iconColor: "text-neutral-200"
    },
    {
      to: "/explore",
      title: "Explore Hub",
      description: "Discover stunning destinations",
      icon: Compass,
      gradient: "from-neutral-950/60 to-neutral-900/60 hover:shadow-white/5 border-white/10 hover:border-white/30",
      iconColor: "text-neutral-200"
    },
    {
      to: "/stats",
      title: "Travel Stats",
      description: "Track your travel progress",
      icon: BarChart3,
      gradient: "from-neutral-950/60 to-neutral-900/60 hover:shadow-white/5 border-white/10 hover:border-white/30",
      iconColor: "text-neutral-200"
    }
  ];

  const popularDestinations = [
    {
      title: "Urban Explorer",
      category: "Cities",
      tagline: "Discover vibrant cities & cultural hotspots",
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Nature Adventure",
      category: "Nature",
      tagline: "Explore mountains, forests & natural wonders",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Coastal Escape",
      category: "Beaches",
      tagline: "Relax on pristine beaches and islands",
      image: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      {/* Welcome Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-glass border-glass p-8 md:p-12 shadow-2xl backdrop-blur-xl"
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-neutral-300 text-xs font-semibold">
              <Sparkles className="h-3 w-3" />
              <span>Welcome back, {userName}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Plan Your Next <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">Adventure</span>. Seamlessly.
            </h1>
            
            <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed max-w-xl">
              The ultimate planner for modern travelers. Curate detailed itineraries, monitor budgets with precision, and uncover global destinations in real-time.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/plantrip">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-black shadow-lg shadow-white/5 hover:bg-neutral-200 transition-all text-sm"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Get Started - Plan Trip</span>
                </motion.button>
              </Link>
              
              <Link to="/explore">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-3 font-bold text-slate-300 hover:text-white transition-all text-sm"
                >
                  <Compass className="h-4 w-4" />
                  <span>Explore Hub</span>
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Mockup Illustration */}
          <div className="lg:col-span-5 relative flex justify-center w-full">
            <motion.div 
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full max-w-[360px] aspect-square rounded-full border border-white/10 bg-neutral-950/40 p-2 shadow-2xl overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <motion.img 
                src="/travel_planner_hero_ui.png" 
                alt="Travel Planner Interface Screenshot" 
                className="rounded-full w-full h-full object-cover shadow-inner"
                animate={{ rotate: 360 }}
                whileHover={{ scale: 1.03 }}
                transition={{ 
                  rotate: { duration: 30, ease: "linear", repeat: Infinity },
                  scale: { duration: 0.4, ease: "easeOut" }
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid Actions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Quick Actions</h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {actionCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-col justify-between rounded-2xl bg-gradient-to-br ${card.gradient} border p-6 shadow-lg backdrop-blur-md transition-shadow duration-300`}
              >
                <div className="space-y-4">
                  <div className={`inline-flex p-3 rounded-xl bg-slate-900/60 border border-white/5 ${card.iconColor} shadow-md`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-white">{card.title}</h3>
                    <p className="text-sm text-slate-400 font-medium leading-normal">{card.description}</p>
                  </div>
                </div>
                
                <Link to={card.to} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-neutral-400 hover:text-white transition-colors group">
                  <span>Open</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Popular Destinations section */}
      <div className="space-y-8 pb-10">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Popular Destinations</h2>
            <p className="text-sm text-slate-400 font-medium">Curated wanderlists for the curious traveller</p>
          </div>
          <Link to="/explore" className="text-neutral-400 hover:text-white text-sm font-bold flex items-center gap-1.5 transition-colors">
            <span>View all</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularDestinations.map((dest, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * idx, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-2xl bg-glass border-glass flex flex-col shadow-xl"
            >
              <div className="h-48 w-full relative overflow-hidden">
                <img 
                  src={dest.image} 
                  alt={dest.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-5">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-bold mb-1 uppercase tracking-wider">
                    <MapPin className="h-3.5 w-3.5 text-white" />
                    {dest.category}
                  </div>
                  <h3 className="text-white font-extrabold text-xl">{dest.title}</h3>
                </div>
              </div>
              
              <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                  {dest.tagline}
                </p>
                <Link to="/explore" className="mt-auto">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full border border-white/20 bg-white hover:bg-transparent text-black hover:text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all duration-300 shadow-md"
                  >
                    Explore
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
