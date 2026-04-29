import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api";

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
      // Backend expects title and array of destinations per our tripSchema
      const newTripData = {
        title: `Trip to ${destination}`,
        startDate,
        endDate,
        budget: Number(budget),
        destinations: [{ name: destination }]
      };

      if (isEditing) {
        await api.patch(`/trips/${tripId}`, newTripData);
        setSavedStatus("Trip updated!😎");
      } else {
        await api.post("/trips", newTripData);
        setSavedStatus("Trip is saved!😎");
      }
      setTimeout(() => {
        navigate("/mytrips"); // Just navigate, MyTrips will fetch from DB now
      }, 1000);
      
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

  return (
    <div className="flex flex-col items-center mb-10">
      <div className="text-center">
        <h1 className="font-bold text-4xl pt-6">{isEditing ? "Edit Your Trip" : "Plan Your Trip"}</h1>
        <p className="text-xl pt-2">
          {isEditing ? "Update your travel details below" : "Fill in the details below to create your perfect travel plan"}
        </p>
      </div>
      <div className="text-left">
        <form
          onSubmit={handleSubmit}
          className="text-left flex flex-col justify-start border-2 m-6 p-6 rounded-2xl w-[650px] space-y-4"
        >
          <div className="flex flex-row gap-2 pt-2">
            <img
              className="w-[30px] h-[30px]"
              src="https://cdn-icons-png.flaticon.com/128/2838/2838912.png"
              alt="map"
            />
            <h1 className="text-2xl font-bold">Trip Details</h1>
          </div>
          <p className="pt-1">
            Tell us about your dream destination and travel preferences
          </p>
          
          {error && (
            <p className="w-full text-red-500 font-bold bg-red-100 p-2 rounded">{error}</p>
          )}

          <div className="flex flex-col">
            <label className="font-bold">Destination *</label>
            <input
              type="text"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              className="border-2 rounded-md px-2 py-1"
              placeholder="where would you like to go?"
              required
            />
          </div>

          <div className="flex flex-row justify-between items-center gap-4">
            <div className="flex flex-col w-[50%]">
              <label className="font-bold">Start Date *</label>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="border-2 px-2 py-1 rounded-md"
                required
              />
            </div>
            <div className="flex flex-col w-[50%]">
              <label className="font-bold">End Date *</label>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="border-2 px-2 py-1 rounded-md"
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-bold">Budget *</label>
            <input
              type="number"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              className="border-2 px-2 py-1 rounded-md"
              placeholder="enter your budget"
              required
              min="0"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold">Notes (Optional)</label>
            <textarea
              className="border-2 px-2 py-2 rounded-md h-24"
              placeholder="jot down your preferences"
            />
          </div>

          <div className="flex flex-row justify-center gap-6 pt-4">
            <button
              type="reset"
              onClick={() => navigate(-1)}
              className="border-2 rounded-md h-[40px] w-[150px] font-bold"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="border-2 bg-black text-white rounded-md h-[40px] w-[150px] font-bold disabled:bg-gray-400"
            >
              {loading ? "Saving..." : (isEditing ? "Update Trip" : "Save Trip Plan")}
            </button>
          </div>
          
          {savedStatus && (
            <p className="text-green-600 text-center font-bold text-xl mt-4">
              {savedStatus}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default PlanTrip;
