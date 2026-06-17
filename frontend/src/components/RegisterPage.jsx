import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, AlertCircle, Compass, ArrowRight } from "lucide-react";
import api from "../api";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    // Strict Email Format Verification
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return setError("Please enter a valid email address (e.g. user@domain.com).");
    }

    // Disposable/Fake Email Domain Verification
    const disposableDomains = [
      'tempmail.com', 'mailinator.com', 'yopmail.com', 'dispostable.com',
      'guerrillamail.com', 'sharklasers.com', '10minutemail.com',
      'trashmail.com', 'getairmail.com', 'temp-mail.org', 'tempmail.net',
      'mailinator.net', 'yopmail.net', 'fakeinbox.com', 'safetymail.info'
    ];
    const domain = email.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(domain)) {
      return setError("Disposable or fake email addresses are not allowed.");
    }

    // Strict Password Complexity Verification
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return setError(
        "Password must be at least 8 characters long and contain: 1 uppercase, 1 lowercase, 1 digit, and 1 special character."
      );
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/signup", { name, email, password });
      const token = response.data.token;
      const user = response.data.data.user;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/"); 
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
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[460px] rounded-3xl bg-glass border-glass p-8 md:p-10 shadow-2xl backdrop-blur-xl relative z-10"
      >
        {/* Brand/Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black mb-4 shadow-lg shadow-white/10">
            <Compass className="h-7 w-7 animate-spin-slow" style={{ animationDuration: '12s' }} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            TravelPlanner
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            Start your travel journey today
          </p>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-sm text-slate-400 mb-6">Join thousands of travellers worldwide</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm font-semibold text-red-400"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Full Name field */}
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-bold text-slate-300">
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-slate-900/40 py-3 pl-11 pr-4 text-white placeholder-slate-500 outline-none transition-all focus:border-white focus:bg-slate-900/60 focus:ring-2 focus:ring-white/10"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email field */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-bold text-slate-300">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-white transition-colors" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-slate-900/40 py-3 pl-11 pr-4 text-white placeholder-slate-500 outline-none transition-all focus:border-white focus:bg-slate-900/60 focus:ring-2 focus:ring-white/10"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-bold text-slate-300">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-white transition-colors" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-slate-900/40 py-3 pl-11 pr-4 text-white placeholder-slate-500 outline-none transition-all focus:border-white focus:bg-slate-900/60 focus:ring-2 focus:ring-white/10"
                placeholder="Create a password"
              />
            </div>
          </div>

          {/* Confirm Password field */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-sm font-bold text-slate-300">
              Confirm Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-white transition-colors" />
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-slate-900/40 py-3 pl-11 pr-4 text-white placeholder-slate-500 outline-none transition-all focus:border-white focus:bg-slate-900/60 focus:ring-2 focus:ring-white/10"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          {/* Submit button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
            type="submit"
            className="w-full relative flex items-center justify-center gap-2 rounded-xl bg-white py-3 px-4 text-sm font-bold text-black shadow-lg shadow-white/5 transition-all hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-950 disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>

          {/* Link to sign in */}
          <p className="text-center text-sm text-slate-400 pt-2">
            Already have an account?{" "}
            <Link to="/signin" className="font-bold text-neutral-300 hover:text-white transition-colors hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default RegisterPage;
