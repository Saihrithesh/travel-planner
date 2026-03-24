import React, { useEffect, useState } from "react";
import { Plane, Globe, Clock, DollarSign, Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import api from "../api";

function StatsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: 0,
    countriesVisited: 0,
    avgTripLength: 0,
    totalBudget: 0,
  });

  const [monthlyData, setMonthlyData] = useState([
    { name: "Jan", trips: 0 },
    { name: "Feb", trips: 0 },
    { name: "Mar", trips: 0 },
    { name: "Apr", trips: 0 },
    { name: "May", trips: 0 },
    { name: "Jun", trips: 0 },
    { name: "Jul", trips: 0 },
    { name: "Aug", trips: 0 },
    { name: "Sep", trips: 0 },
    { name: "Oct", trips: 0 },
    { name: "Nov", trips: 0 },
    { name: "Dec", trips: 0 },
  ]);

  const [budgetData, setBudgetData] = useState([
    { name: "Accommodation", value: 36 },
    { name: "Transportation", value: 24 },
    { name: "Activities", value: 12 },
    { name: "Food & Dining", value: 18 },
    { name: "Options", value: 10 },
  ]);

  const formatBudget = (budget) => {
    if (budget >= 1000) {
      return `$${(budget / 1000).toFixed(1)}k`;
    }
    return `$${budget}`;
  };

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get("/trips");
        const trips = response.data.data.trips || [];

        let totalBudget = 0;
        let totalDays = 0;
        let countries = new Set();
        let monthCounts = new Array(12).fill(0);

        trips.forEach((trip) => {
          totalBudget += Number(trip.budget) || 0;

          if (trip.destinations && trip.destinations.length > 0) {
            trip.destinations.forEach((d) => countries.add(d.name));
          } else if (trip.title) {
            countries.add(trip.title); // fallback
          }

          if (trip.startDate && trip.endDate) {
            const start = new Date(trip.startDate);
            const end = new Date(trip.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            totalDays += diffDays;

            // month counts
            const month = start.getMonth();
            monthCounts[month] += 1;
          }
        });

        setStats({
          totalTrips: trips.length,
          countriesVisited: countries.size,
          avgTripLength: trips.length > 0 ? Math.round(totalDays / trips.length) : 0,
          totalBudget,
        });

        // Set monthly chart data
        setMonthlyData((prev) =>
          prev.map((item, index) => ({
            ...item,
            trips: monthCounts[index],
          }))
        );

        // Optional: dynamic budget based on totalBudget, but percentage logic usually stays fixed
        // or derived from real itinerary data which isn't fully structured yet natively.
      } catch (error) {
        console.error("Failed to fetch trips for stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const COLORS = ["#000000", "#333333", "#666666", "#999999", "#CCCCCC"];

  if (loading) {
    return <div className="text-center mt-20 text-xl font-bold">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 mt-5">
      {/* Header section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-black mb-2">Travel Statistics</h1>
        <p className="text-gray-600 text-lg">Your travel journey by the numbers</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-black text-white p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">
              Total Trips
            </p>
            <h2 className="text-4xl font-bold">{stats.totalTrips}</h2>
          </div>
          <Plane className="w-8 h-8 opacity-80" />
        </div>

        <div className="bg-white text-black p-6 rounded-2xl flex items-center justify-between border-2 border-black shadow-sm">
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
              Countries Visited
            </p>
            <h2 className="text-4xl font-bold">{stats.countriesVisited}</h2>
          </div>
          <Globe className="w-8 h-8 opacity-80" />
        </div>

        <div className="bg-black text-white p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">
              Avg Trip Length
            </p>
            <h2 className="text-4xl font-bold">
              {stats.avgTripLength} <span className="text-sm font-normal text-gray-300">days</span>
            </h2>
          </div>
          <Clock className="w-8 h-8 opacity-80" />
        </div>

        <div className="bg-white text-black p-6 rounded-2xl flex items-center justify-between border-2 border-black shadow-sm">
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
              Total Budget
            </p>
            <h2 className="text-4xl font-bold">{formatBudget(stats.totalBudget)}</h2>
          </div>
          <DollarSign className="w-8 h-8 opacity-80" />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart Container */}
        <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-sm flex flex-col items-start h-[400px]">
          <div className="flex flex-col items-start justify-center gap-1 mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Trips by Month
            </h3>
            <p className="text-sm text-gray-500">
              Your travel activity throughout the year
            </p>
          </div>
          <div className="w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: "#f3f4f6" }} />
                <Bar dataKey="trips" fill="#000000" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart Container */}
        <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-sm flex flex-col items-start h-[400px]">
          <div className="flex flex-col items-start justify-center gap-1 mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Budget Breakdown
            </h3>
            <p className="text-sm text-gray-500">How you spend your travel budget</p>
          </div>
          <div className="w-full flex-grow flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="none"
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
