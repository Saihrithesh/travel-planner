import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      
      // Store token and user details on successful login
      const token = response.data.token;
      const user = response.data.data.user;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Route user to the home page or dashboard
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
    <div>
      <div className="text-black text-center flex flex-col items-center justify-center mt-8">
        <div className="flex flex-row justify-between">
          <img
            className="w-[40px] h-[40px]"
            src="https://res.cloudinary.com/dceeihrlp/image/upload/v1758276368/airplane-black_itafbq.png"
            alt="logo"
          />
          <h1 className="font-bold text-2xl mt-1 ml-1">TravelPlanner</h1>
        </div>
        <p>Start your travel journey today!!</p>
        <div className="border-black border-3 rounded-xl w-[450px] mt-8">
          <h1 className="mt-3 text-2xl">Welcome Back</h1>
          <p>Sign in to your account to continue</p>
          <form
            onSubmit={handleLogin}
            className="flex flex-col p-3 justify-center items-start"
          >
            {error && (
              <p className="w-full text-red-500 font-bold text-center mt-2">{error}</p>
            )}

            <label htmlFor="email" className="text-left m-2 font-bold mt-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-[400px] flex flex-center m-3 mt-0 ml-2 p-2 rounded-md border-2"
              placeholder="Enter your email"
            />
            
            <label htmlFor="password" className="text-left m-2 font-bold mt-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-[400px] flex flex-center m-3 mt-0 ml-2 p-2 rounded-md border-2"
              placeholder="Enter your password"
            />

            <div>
              <button
                disabled={loading}
                type="submit"
                className="w-[405px] m-3 mt-1 ml-2 p-2 rounded-md border-2 bg-black text-white text-center font-bold disabled:bg-gray-400"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="font-bold underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
