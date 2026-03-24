import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CirclePlus, CircleX, Calendar, Trash2, SquarePen, MapPin } from "lucide-react";
import api from "../api";

const MyTrips = () => {
  const [myTrips, setMyTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all trips on load
  const fetchTrips = async () => {
    try {
      const response = await api.get("/trips");
      // The backend returns { status: 'success', results, data: { trips } }
      setMyTrips(response.data.data.trips);
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
      // Remove trip from UI directly without refetching for speed
      setMyTrips((prev) => prev.filter(trip => trip._id !== id));
    } catch (error) {
      console.error("Failed to delete trip", error);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-xl font-bold">Loading...</div>;
  }

  if (myTrips.length === 0) {
    return (
      <>
        <div className="flex justify-around mt-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">My Trips</h1>
            <p>You have 0 trips planned </p>
          </div>
          <Link to="/plantrip">
            <div className="flex items-center bg-black text-white rounded-md gap-2 w-[150px] h-[40px] p-2">
              <CirclePlus className="mt-1" />
              <button className="font-bold">Plan new trip</button>
            </div>
          </Link>
        </div>
        <div className="flex flex-col justify-center items-center mt-10">
          <div className="border-2 flex flex-col justify-center items-center rounded-xl w-[450px] h-[300px] text-center">
            <CircleX className="w-10 h-10" />
            <h2 className="text-xl font-bold m-2">No trips planned yet </h2>
            <p className="m-1">
              Start planning your next adventure and create memories!
            </p>
            <Link to="/plantrip">
              <div className="text-center bg-black text-white mt-2 p-1 rounded-md flex justify-center items-center h-[40px] px-3">
                <button className="font-bold">Plan your first trip</button>
              </div>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="px-10 lg:px-32 space-y-5 pb-10">
      <div className="flex justify-between mt-6 items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">My Trips</h1>
          <p>You have {myTrips.length} trips planned </p>
        </div>
        <Link to="/plantrip">
          <div className="flex items-center justify-center bg-black text-white rounded-md gap-2 w-[160px] h-[40px] p-2 hover:bg-gray-800 transition">
            <CirclePlus className="w-5 h-5" />
            <span className="font-bold">Plan new trip</span>
          </div>
        </Link>
      </div>

      <hr />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
        {myTrips.map((each) => {
          // Because API destinations is an array of objects
          const destinationName = each.destinations?.[0]?.name || each.title?.replace('Trip to ', '');
          const startDateStr = new Date(each.startDate).toLocaleDateString();
          const endDateStr = new Date(each.endDate).toLocaleDateString();

          return (
            <div
              key={each._id}
              className="trip-card transition-all duration-300 border-2 rounded-xl px-5 py-5 flex flex-col justify-between space-y-4 hover:shadow-lg"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h1 className="font-bold text-xl flex items-center gap-2">
                    <MapPin className="text-red-500 w-5 h-5" />
                    {destinationName}
                  </h1>
                </div>
                
                <div className="flex flex-col space-y-2 mt-2 text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Start: {startDateStr}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> End: {endDateStr}
                  </p>
                  <p className="font-semibold text-green-700">
                    Budget: ${each.budget}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-center gap-3 mb-4">
                  <button className="border-2 flex flex-1 items-center justify-center gap-2 px-2 py-2 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition">
                    <SquarePen className="h-4 w-4" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(each._id)}
                    className="border-2 flex flex-1 items-center justify-center gap-2 px-2 py-2 rounded-xl font-bold hover:bg-red-600 hover:text-white transition"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
                <hr />
                <p className="text-xs text-center text-gray-400 mt-2">
                  Created on {new Date(each.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyTrips;
