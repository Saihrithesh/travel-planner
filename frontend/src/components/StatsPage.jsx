import React, { useEffect, useState } from "react";
import { Plane, Globe, Clock, DollarSign, Calendar, Sparkles } from "lucide-react";
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
import { motion } from "framer-motion";
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

  const budgetData = [
    { name: "Accommodation", value: 36 },
    { name: "Transportation", value: 24 },
    { name: "Activities", value: 12 },
    { name: "Food & Dining", value: 18 },
    { name: "Options", value: 10 },
  ];

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
            countries.add(trip.title);
          }

          if (trip.startDate && trip.endDate) {
            const start = new Date(trip.startDate);
            const end = new Date(trip.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            totalDays += diffDays;

            const month = start.getMonth();
            monthCounts[month] += 1;
          }
        });

        setStats({
          totalTrips: trips.length,
          countriesVisited: countries.size,
          avgTripLength:
            trips.length > 0 ? Math.round(totalDays / trips.length) : 0,
          totalBudget,
        });

        setMonthlyData((prev) =>
          prev.map((item, index) => ({
            ...item,
            trips: monthCounts[index],
          })),
        );
      } catch (error) {
        console.error("Failed to fetch trips for stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const COLORS = ["#ffffff", "#e5e5e5", "#a3a3a3", "#525252", "#262626"];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
        <p className="text-slate-400 font-bold">Assembling analytics...</p>
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } }
  };

  const statItems = [
    {
      label: "Total Trips",
      value: stats.totalTrips,
      icon: Plane,
      color: "text-white bg-white/10 border-white/20",
    },
    {
      label: "Countries Visited",
      value: stats.countriesVisited,
      icon: Globe,
      color: "text-white bg-white/10 border-white/20",
    },
    {
      label: "Avg Trip Length",
      value: `${stats.avgTripLength} days`,
      icon: Clock,
      color: "text-white bg-white/10 border-white/20",
    },
    {
      label: "Total Budget",
      value: formatBudget(stats.totalBudget),
      icon: DollarSign,
      color: "text-white bg-white/10 border-white/20",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* Header section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-white" />
          <span>Travel Statistics</span>
        </h1>
        <p className="text-slate-400 font-medium max-w-md mx-auto text-lg">
          Your travel journey mapped by the numbers
        </p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-glass border-glass p-6 rounded-2xl flex items-center justify-between shadow-xl relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
              <div className="space-y-1">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {item.label}
                </p>
                <h2 className="text-3xl font-extrabold text-white">{item.value}</h2>
              </div>
              <div className={`p-3 rounded-xl border ${item.color} shadow-inner`}>
                <Icon className="w-6 h-6" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Bar Chart Container */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-glass border-glass rounded-2xl p-6 shadow-xl flex flex-col h-[420px]"
        >
          <div className="space-y-1 mb-6">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-white" />
              <span>Trips by Month</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Your travel activity throughout the calendar year
            </p>
          </div>
          <div className="w-full flex-grow text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={0.15} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8" }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#000000", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }} 
                  cursor={{ fill: "rgba(255,255,255,0.02)" }} 
                />
                <Bar
                  dataKey="trips"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart Container */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-glass border-glass rounded-2xl p-6 shadow-xl flex flex-col h-[420px]"
        >
          <div className="space-y-1 mb-6">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-white" />
              <span>Budget Allocation</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Standard expenditure allocations for travel
            </p>
          </div>
          <div className="w-full flex-grow flex items-center justify-center text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={105}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="rgba(0, 0, 0, 0.8)"
                  strokeWidth={2}
                >
                  {budgetData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#000000", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default StatsPage;
