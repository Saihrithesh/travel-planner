import React, { useEffect, useState } from "react";
import { Link} from "react-router-dom";

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
      setUserName("Guest"); // Fallback for unauthenticated viewers
    }
  }, []);

  return (
    <div>
      <div className="ml-10 lg:ml-36">
        <h1 className="text-4xl font-bold mt-5">Welcome back, {userName}!</h1>
        <p className="mt-2">
          Ready to plan your next adventure? Let's make it memorable
        </p>
      </div>
      <div className="flex flex-wrap justify-center mt-6 gap-5">
        <Link to="/plantrip">
          <div className="flex flex-col justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg active:scale-95">
            <div className="flex flex-col justify-center items-center border-2 border-black bg-white rounded-xl p-5 w-[300px] h-[200px]">
              <img
                className="w-[70px] h-[70px]"
                src="https://res.cloudinary.com/dceeihrlp/image/upload/v1758277945/add_w3p8hi.png"
                alt="plan"
              />
              <h1 className="font-bold text-xl mt-4 text-black">Plan a trip</h1>
              <p className="text-gray-600">Start planning your next adventure</p>
            </div>
          </div>
        </Link>
        <Link to="/mytrips">
          <div className="flex flex-col justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg active:scale-95">
            <div className="flex flex-col justify-center items-center border-2 border-black bg-white rounded-xl p-5 w-[300px] h-[200px]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-[70px] h-[70px]">
                <path d="M576 112C576 100.9 570.3 90.6 560.8 84.8C551.3 79 539.6 78.4 529.7 83.4L413.5 141.5L234.1 81.6C226 78.9 217.3 79.5 209.7 83.3L81.7 147.3C70.8 152.8 64 163.9 64 176L64 528C64 539.1 69.7 549.4 79.2 555.2C88.7 561 100.4 561.6 110.3 556.6L226.4 498.5L405.8 558.3C413.9 561 422.6 560.4 430.2 556.6L558.2 492.6C569 487.2 575.9 476.1 575.9 464L575.9 112zM256 440.9L256 156.4L384 199.1L384 483.6L256 440.9z" />
              </svg>
              <h1 className="font-bold text-xl mt-4 text-black">View my trips</h1>
              <p className="text-gray-600">See all your planned journeys</p>
            </div>
          </div>
        </Link>
        <Link to="/explore">
          <div className="flex flex-col justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg active:scale-95">
            <div className="flex flex-col justify-center items-center border-2 border-black bg-white rounded-xl p-5 w-[300px] h-[200px]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-[70px] h-[70px]">
                <path d="M528 320C528 205.1 434.9 112 320 112C205.1 112 112 205.1 112 320C112 434.9 205.1 528 320 528C434.9 528 528 434.9 528 320zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM370.7 389.1L226.4 444.6C207 452.1 187.9 433 195.4 413.6L250.9 269.3C254.2 260.8 260.8 254.2 269.3 250.9L413.6 195.4C433 187.9 452.1 207 444.6 226.4L389.1 370.7C385.8 379.2 379.2 385.8 370.7 389.1zM352 320C352 302.3 337.7 288 320 288C302.3 288 288 302.3 288 320C288 337.7 302.3 352 320 352C337.7 352 352 337.7 352 320z" />
              </svg>
              <h1 className="font-bold text-xl mt-4 text-black">Explore</h1>
              <p className="text-gray-600">Discover new destinations</p>
            </div>
          </div>
        </Link>
        <Link to="/stats">
          <div className="flex flex-col justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="flex flex-col justify-center items-center border-2 border-black bg-white rounded-xl p-5 w-[300px] h-[200px]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-[70px] h-[70px]">
                <path d="M416 224C398.3 224 384 209.7 384 192C384 174.3 398.3 160 416 160L576 160C593.7 160 608 174.3 608 192L608 352C608 369.7 593.7 384 576 384C558.3 384 544 369.7 544 352L544 269.3L374.6 438.7C362.1 451.2 341.8 451.2 329.3 438.7L224 333.3L86.6 470.6C74.1 483.1 53.8 483.1 41.3 470.6C28.8 458.1 28.8 437.8 41.3 425.3L201.3 265.3C213.8 252.8 234.1 252.8 246.6 265.3L352 370.7L498.7 224L416 224z" />
              </svg>
              <h1 className="font-bold text-xl mt-4 text-black">Travel stats</h1>
              <p className="text-gray-600">Track your travel progress</p>
            </div>
          </div>
        </Link>
      </div>
      <div className="ml-10 lg:ml-36 mt-12 pb-10">
        <h1 className="font-bold text-2xl mb-5">Popular Destinations</h1>
        <div className="flex flex-wrap gap-10">
          <div className="w-[400px] h-[250px] border-2 rounded-md flex flex-col hover:shadow-lg transition">
            <div className="w-[100%] h-40 bg-[url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=400&q=80')] bg-cover relative rounded-t-md">
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-5 rounded-t-md">
                <p className="text-white font-bold text-lg text-left">
                  Urban Explorer
                </p>
              </div>
            </div>
            <p className="text-md mt-2 ml-4 text-left font-medium">
              Discover vibrant cities and cultural hotspots
            </p>
            <Link to="/explore" className="mt-auto mb-2 ml-4">
              <button className="border-1 text-center p-2 bg-black text-white font-bold rounded-md w-32 hover:bg-gray-800 active:scale-95 transition">
                Explore more
              </button>
            </Link>
          </div>
          <div className="w-[400px] h-[250px] border-2 rounded-md flex flex-col hover:shadow-lg transition">
            <div className="w-[100%] h-40 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80')] bg-cover relative rounded-t-md">
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-5 rounded-t-md">
                <p className="text-white font-bold text-lg text-left">
                  Nature Adventure
                </p>
              </div>
            </div>
            <p className="text-md mt-2 ml-4 text-left font-medium">
              Explore mountains, forests and natural wonders
            </p>
            <Link to="/explore" className="mt-auto mb-2 ml-4">
              <button className="border-1 text-center p-2 bg-black text-white font-bold rounded-md w-32 hover:bg-gray-800 active:scale-95 transition">
                Explore more
              </button>
            </Link>
          </div>
          <div className="w-[400px] h-[250px] border-2 rounded-md flex flex-col hover:shadow-lg transition">
            <div className="w-[100%] h-40 bg-[url('https://images.unsplash.com/photo-1471922694854-ff1b63b20054?auto=format&fit=crop&w=400&q=80')] bg-cover relative rounded-t-md">
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-5 rounded-t-md">
                <p className="text-white font-bold text-lg text-left">
                  Coastal Escape
                </p>
              </div>
            </div>
            <p className="text-md mt-2 ml-4 text-left font-medium">
              Relax on beautiful beaches and coastal areas
            </p>
            <Link to="/explore" className="mt-auto mb-2 ml-4">
              <button className="border-1 text-center p-2 bg-black text-white font-bold rounded-md w-32 hover:bg-gray-800 active:scale-95 transition">
                Explore more
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
