import React, { useState, useEffect } from "react";
import { Search, Filter, Star, Clock, MapPin, Users, Sun } from "lucide-react";
import { Link } from "react-router-dom";

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-5">
      {/* Header section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-black mb-2">Popular Destinations</h1>
        <p className="text-gray-600 text-lg">
          Discover amazing places around the world and plan your next adventure
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-grow flex items-center border-2 border-black rounded-lg px-3 py-2 bg-white hover:border-gray-600 transition-colors">
          <Search className="w-5 h-5 text-black mr-2 opacity-70" />
          <input 
            type="text" 
            placeholder="Search destinations..." 
            className="w-full outline-none bg-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 border-2 border-black rounded-lg px-6 py-2 font-bold hover:bg-gray-100 active:scale-95 transition-all">
          <Filter className="w-5 h-5" />
          More Filters
        </button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`px-4 py-2 rounded-lg border-2 font-bold transition-all active:scale-95 ${
              activeCategory === cat.name
                ? "bg-black text-white border-black"
                : "bg-white text-black border-black hover:bg-gray-100"
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {displayDestinations.length === 0 ? (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20">
            <h2 className="text-2xl font-bold text-gray-500 mb-2">
              {isSearching ? "Searching the globe..." : "No destinations found"}
            </h2>
            <p className="text-gray-400">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          displayDestinations.map((dest) => (
            <div key={dest.id} className="border-2 border-black rounded-2xl overflow-hidden flex flex-col bg-white hover:shadow-xl transition-shadow duration-300">
              {/* Image Section */}
              <div className="h-56 w-full relative">
                <img src={dest.image} alt={dest.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-bold border-2 border-black shadow-sm">
                  From ${dest.price}/day
                </div>
                <div className="absolute bottom-3 left-3 text-white flex items-center gap-1 font-bold drop-shadow-md">
                  <Star className="w-4 h-4 fill-white" />
                  {dest.rating} <span className="font-normal text-sm opacity-90">({dest.reviews})</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{dest.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 gap-1 font-medium mt-1">
                    <Clock className="w-4 h-4" />
                    {dest.duration} days
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {dest.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                  {dest.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs font-bold border-2 border-black px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link 
                    to="/plantrip" 
                    state={{ 
                      destination: dest.title, 
                      durationDays: parseInt(dest.duration, 10) || 5,
                      budget: dest.price * (parseInt(dest.duration, 10) || 5)
                    }}
                    className="flex-grow"
                  >
                    <button className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-95 transition-all">
                      <MapPin className="w-4 h-4" />
                      Plan Trip
                    </button>
                  </Link>
                  <button 
                    onClick={() => alert(`Invite link for ${dest.title} copied to clipboard! 📋`)}
                    className="border-2 border-black p-2 rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
                  >
                    <Users className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Travel Tips Section */}
      <div className="border-2 border-black rounded-2xl p-6 bg-white mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sun className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          Travel Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-bold mb-2">Best Time to Book</h4>
            <p className="text-sm text-gray-600">
              Book international flights 2-3 months in advance for the best deals
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Travel Insurance</h4>
            <p className="text-sm text-gray-600">
              Always get travel insurance, especially for adventure destinations
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Local Currency</h4>
            <p className="text-sm text-gray-600">
              Research local payment methods and exchange rates before traveling
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExplorePage;
