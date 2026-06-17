import React, { useState, useEffect } from "react";
import { Search, Filter, Star, Clock, MapPin, Users, Sun, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const destinations = [
  {
    id: 1,
    title: "Santorini, Greece",
    price: 89,
    rating: 4.9,
    reviews: 2047,
    duration: "5-7",
    description: "Stunning sunsets, white-washed buildings, and crystal-clear waters",
    tags: ["Sunset Views", "Historic Architecture", "Wine Tasting"],
    category: "Beach & Islands",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Swiss Alps, Switzerland",
    price: 145,
    rating: 4.8,
    reviews: 1934,
    duration: "7-10",
    description: "Breathtaking peaks, alpine lakes, and charming mountain villages",
    tags: ["Skiing", "Hiking Trails", "Mountain Railways"],
    category: "Mountains",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Tokyo, Japan",
    price: 120,
    rating: 4.7,
    reviews: 3521,
    duration: "5-8",
    description: "Modern metropolis blending tradition with cutting-edge technology",
    tags: ["Cultural Sites", "Street Food", "Technology"],
    category: "Cities",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "Serengeti, Tanzania",
    price: 220,
    rating: 4.9,
    reviews: 892,
    duration: "7-12",
    description: "Epic wildlife safari with the Great Migration spectacle",
    tags: ["Big Five Safari", "Great Migration", "Maasai Culture"],
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    title: "Reykjavik, Iceland",
    price: 135,
    rating: 4.6,
    reviews: 1456,
    duration: "4-6",
    description: "Northern Lights, geysers, and dramatic landscapes",
    tags: ["Northern Lights", "Blue Lagoon", "Volcanic Landscapes"],
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    title: "World Explorer Package",
    price: 180,
    rating: 4.8,
    reviews: 567,
    duration: "30+",
    description: "Multi-continent journey covering 15+ countries",
    tags: ["Multiple Countries", "Cultural Immersion", "Group Travel"],
    category: "All Destinations",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Equal-Earth-Physical-No-Type_%28cropped%29.jpg/960px-Equal-Earth-Physical-No-Type_%28cropped%29.jpg"
  },
  {
    id: 7,
    title: "Jaipur, India",
    price: 55,
    rating: 4.8,
    reviews: 3125,
    duration: "4-6",
    description: "The magnificent Pink City known for its royal palaces and majestic forts",
    tags: ["Historic Forts", "Royal Palaces", "Local Markets"],
    category: "Cities",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/960px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg"
  },
  {
    id: 8,
    title: "Kerala, India",
    price: 65,
    rating: 4.9,
    reviews: 2840,
    duration: "5-7",
    description: "Serene houseboat cruises floating through emerald, palm-fringed waterways",
    tags: ["Houseboats", "Nature Walks", "Ayurvedic Spa"],
    category: "Beach & Islands",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/House_Boat_DSW.jpg/960px-House_Boat_DSW.jpg"
  },
  {
    id: 9,
    title: "Manali, India",
    price: 45,
    rating: 4.7,
    reviews: 4210,
    duration: "4-7",
    description: "Snow-capped Himalayan peaks, lush pine forests, and mountain adventures",
    tags: ["Snow Sports", "Trekking", "Mountain Views"],
    category: "Mountains",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Manali_City.jpg/960px-Manali_City.jpg"
  },
  {
    id: 10,
    title: "Agra, India",
    price: 40,
    rating: 4.8,
    reviews: 5120,
    duration: "2-3",
    description: "Home to the iconic Taj Mahal, showcasing exquisite Mughal architecture and history.",
    tags: ["Taj Mahal", "History", "Mughal Architecture"],
    category: "Cities",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/960px-Taj_Mahal_%28Edited%29.jpeg"
  },
  {
    id: 11,
    title: "Goa, India",
    price: 50,
    rating: 4.7,
    reviews: 4321,
    duration: "4-6",
    description: "Sun-kissed beaches, vibrant nightlife, and Portuguese-influenced coastal scenery.",
    tags: ["Beaches", "Nightlife", "Seafood"],
    category: "Beach & Islands",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/BeachFun.jpg/960px-BeachFun.jpg"
  },
  {
    id: 12,
    title: "Varanasi, India",
    price: 35,
    rating: 4.6,
    reviews: 2900,
    duration: "3-5",
    description: "One of the world's oldest living cities, offering profound spiritual experiences along the Ganges.",
    tags: ["Spiritual", "Ganges River", "Culture"],
    category: "Cities",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Varanasi%2C_India%2C_Ghats%2C_Cremation_ceremony_in_progress.jpg/960px-Varanasi%2C_India%2C_Ghats%2C_Cremation_ceremony_in_progress.jpg"
  },
  {
    id: 13,
    title: "Udaipur, India",
    price: 60,
    rating: 4.9,
    reviews: 3450,
    duration: "3-5",
    description: "The City of Lakes featuring majestic floating palaces and romantic sunset views.",
    tags: ["Lakes", "Palaces", "Romantic"],
    category: "Cities",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Udaipur_City_Palace.jpg/960px-Udaipur_City_Palace.jpg"
  },
  {
    id: 14,
    title: "Munnar, India",
    price: 45,
    rating: 4.8,
    reviews: 2780,
    duration: "4-5",
    description: "Lush green tea plantations spread across rolling hills and misty mountain peaks.",
    tags: ["Tea Gardens", "Nature", "Hills"],
    category: "Mountains",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Munnar_Overview.jpg/960px-Munnar_Overview.jpg"
  },
  {
    id: 15,
    title: "Leh Ladakh, India",
    price: 70,
    rating: 4.9,
    reviews: 1980,
    duration: "6-9",
    description: "High-altitude desert landscapes, ancient monasteries, and thrilling mountain passes.",
    tags: ["Road Trips", "Monasteries", "High Altitude"],
    category: "Mountains",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Road_Padum_Zanskar_Range_Jun24_A7CR_00818.jpg/960px-Road_Padum_Zanskar_Range_Jun24_A7CR_00818.jpg"
  },
  {
    id: 16,
    title: "Andaman Islands, India",
    price: 80,
    rating: 4.8,
    reviews: 1650,
    duration: "5-8",
    description: "Pristine white-sand beaches, crystal clear waters, and world-class scuba diving.",
    tags: ["Scuba Diving", "White Sand", "Coral Reefs"],
    category: "Beach & Islands",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Andaman_Islands.PNG"
  },
  {
    id: 17,
    title: "Rishikesh, India",
    price: 40,
    rating: 4.7,
    reviews: 3100,
    duration: "3-6",
    description: "The Yoga Capital of the World, featuring white-water rafting and spiritual ashrams.",
    tags: ["Yoga", "River Rafting", "Ashrams"],
    category: "Adventure",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Trayambakeshwar_Temple_VK.jpg/960px-Trayambakeshwar_Temple_VK.jpg"
  },
  {
    id: 18,
    title: "Hampi, India",
    price: 35,
    rating: 4.8,
    reviews: 2200,
    duration: "2-4",
    description: "An ancient village filled with magnificent ruined temple complexes of the Vijayanagara Empire.",
    tags: ["Ancient Ruins", "Temples", "Bouldering"],
    category: "Cities",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg/960px-Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg"
  },
  {
    id: 19,
    title: "Darjeeling, India",
    price: 50,
    rating: 4.6,
    reviews: 2450,
    duration: "4-6",
    description: "A Himalayan city known for its toy train, spectacular sunrise views, and world-famous tea.",
    tags: ["Toy Train", "Tea Estates", "Himalayas"],
    category: "Mountains",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/DarjeelingTrainFruitshop_%282%29.jpg/960px-DarjeelingTrainFruitshop_%282%29.jpg"
  }
];

function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("All Destinations");
  const [searchQuery, setSearchQuery] = useState("");
  const [apiResults, setApiResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const categories = [
    { name: "All Destinations", count: destinations.length },
    { name: "Beach & Islands", count: destinations.filter(d => d.category === "Beach & Islands").length },
    { name: "Mountains", count: destinations.filter(d => d.category === "Mountains").length },
    { name: "Cities", count: destinations.filter(d => d.category === "Cities").length },
    { name: "Adventure", count: destinations.filter(d => d.category === "Adventure").length }
  ];

  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setApiResults([]);
      setIsSearching(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages|extracts&generator=prefixsearch&gpssearch=${encodeURIComponent(
            searchQuery
          )}&gpslimit=3&pithumbsize=600&exsentences=2&exlimit=max&exintro=1&explaintext=1`
        );
        const data = await res.json();

        if (data.query && data.query.pages) {
          const pages = data.query.pages;
          const mapped = Object.values(pages).map((page) => ({
            id: `api-${page.pageid}`,
            title: page.title,
            price: Math.floor(Math.random() * 150) + 50,
            rating: (Math.random() * 1 + 4).toFixed(1),
            reviews: Math.floor(Math.random() * 5000) + 100,
            duration: "3-7",
            description: page.extract || "Discover amazing places and plan your adventure here.",
            tags: ["Global", "Exploration", "Travel"],
            category: "Search Results",
            image:
              page.thumbnail?.source ||
              "https://picsum.photos/seed/search/600/400",
          }));
          setApiResults(mapped);
        } else {
          setApiResults([]);
        }
      } catch (err) {
        console.error("Wikipedia API fetch error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const localDestinations = destinations.filter((dest) => {
    // Check Category
    const matchesCategory =
      activeCategory === "All Destinations" || dest.category === activeCategory;

    // Check Search Query for local cache
    const matchesSearch =
      dest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const displayDestinations = searchQuery.trim() 
    ? (searchQuery.trim().length >= 3 ? apiResults : localDestinations).slice(0, 1)
    : localDestinations;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
      {/* Header section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-neutral-200" />
          <span>Popular Destinations</span>
        </h1>
        <p className="text-slate-400 font-medium max-w-xl mx-auto text-lg leading-relaxed">
          Discover incredible regions across the globe and draft your perfect custom itinerary.
        </p>
      </motion.div>

      {/* Search and Filters Console */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow flex items-center bg-glass border-glass rounded-xl px-4 py-3 group focus-within:ring-2 focus-within:ring-white/10 transition-all">
          <Search className="w-5 h-5 text-slate-500 mr-3 shrink-0 group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            placeholder="Search destinations (e.g. Santorini, Jaipur, Tokyo...)" 
            className="w-full bg-transparent text-white placeholder-slate-500 outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button className="flex items-center justify-center gap-2 rounded-xl bg-glass border-glass px-6 py-3 font-bold text-slate-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all text-sm shrink-0">
          <Filter className="w-4 h-4" />
          <span>More Filters</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2.5 pb-2">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95 duration-300 ${
              activeCategory === cat.name
                ? "bg-white border-white text-black shadow-lg shadow-white/5"
                : "bg-glass border-glass text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* Grid of Results */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 card-wrapper"
      >
        <AnimatePresence mode="popLayout">
          {displayDestinations.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-20 bg-glass border-glass rounded-3xl"
            >
              <h2 className="text-xl font-bold text-slate-300 mb-2">
                {isSearching ? "Scouring the globe..." : "No destinations found"}
              </h2>
              <p className="text-slate-500 text-sm">Try tweaking your search phrase or choosing another filter category.</p>
            </motion.div>
          ) : (
            displayDestinations.map((dest) => (
              <motion.div 
                key={dest.id} 
                variants={cardVariants}
                layout
                whileHover={{ y: -6 }}
                className="trip-card flex flex-col justify-between rounded-2xl bg-glass border-glass overflow-hidden shadow-xl"
              >
                {/* Image section */}
                <div className="h-52 w-full relative overflow-hidden group">
                  <img 
                    src={dest.image} 
                    alt={dest.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold border border-white/10 text-white shadow-md">
                    From ${dest.price}/day
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold border border-white/10 text-white shadow-md">
                    <Star className="w-3.5 h-3.5 fill-white text-white shrink-0" />
                    <span>{dest.rating}</span>
                    <span className="text-slate-400 font-medium">({dest.reviews})</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-lg font-extrabold text-white leading-tight truncate">{dest.title}</h3>
                      <div className="flex items-center text-xs text-slate-400 font-bold shrink-0 gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{dest.duration} days</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-300 font-medium leading-relaxed line-clamp-2">
                      {dest.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {dest.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-bold bg-white/5 border border-white/10 text-neutral-300 px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Link 
                      to="/plantrip" 
                      state={{ 
                        destination: dest.title, 
                        durationDays: parseInt(dest.duration, 10) || 5,
                        budget: dest.price * (parseInt(dest.duration, 10) || 5),
                        image: dest.image
                      }}
                      className="flex-grow"
                    >
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-white text-black font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-200 shadow-lg shadow-white/5 text-sm transition-all"
                      >
                        <MapPin className="w-4 h-4 text-black" />
                        <span>Plan Trip</span>
                      </motion.button>
                    </Link>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => alert(`Invite link for ${dest.title} copied to clipboard! 📋`)}
                      className="border border-white/10 rounded-xl p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors shrink-0"
                    >
                      <Users className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Travel Tips Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl bg-glass border-glass p-6 md:p-8 shadow-xl"
      >
        <h2 className="text-xl font-extrabold text-white mb-6 flex items-center gap-2">
          <Sun className="w-5 h-5 text-white fill-white/10" />
          <span>Intelligent Travel Tips</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/40 border border-white/5">
            <h4 className="font-bold text-white text-sm">Best Time to Book</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Secure international flights 2-3 months prior for standard pricing. Use Wikipedia Search to explore destinations.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/40 border border-white/5">
            <h4 className="font-bold text-white text-sm">Travel Insurance</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Always request insurance options when locking budget bounds, especially when hiking or doing snow sports.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/40 border border-white/5">
            <h4 className="font-bold text-white text-sm">Local Currency</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Review standard payments, tipping customs, and current exchange rates before touching down.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ExplorePage;
