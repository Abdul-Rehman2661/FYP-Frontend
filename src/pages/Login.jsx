import { useState } from "react";
import {
  CpuChipIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      
      // DEBUG: Log the full API response
      console.log("=== API RESPONSE ===");
      console.log("Full response:", data);
      console.log("User object:", data.user);
      console.log("Role from API:", data.user?.Role); // Note: Capital R
      console.log("===================");

      if (response.ok) {
        // FIXED: Use the correct property names (capital letters)
        const userData = {
          userID: data.user.UserID,  // Changed from userID to UserID
          email: data.user.Email,     // Changed from email to Email
          role: data.user.Role        // Changed from role to Role
        };
        
        // Store in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");
        
        // DEBUG: Log what was stored
        console.log("=== STORED IN LOCALSTORAGE ===");
        console.log("User data stored:", userData);
        console.log("Role stored:", userData.role);
        console.log("==============================");
        
        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      {/* Top Icon */}
      <div className="bg-blue-900 p-4 rounded-xl shadow-md mb-4">
        <CpuChipIcon className="h-8 w-8 text-white" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-blue-900">
        Computer Architecture Tool Kit
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Learn computer architecture concepts interactively
      </p>

      {/* Card */}
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Sign in to continue your learning journey
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-700">Email Address</label>
            <div className="flex items-center border rounded-lg px-3 py-2 mt-1 bg-gray-50 focus-within:border-blue-900">
              <span className="text-gray-400 mr-2">
                <EnvelopeIcon className="h-5 w-5" />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-black outline-none w-full text-sm"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-sm text-gray-700">Password</label>
            <div className="flex items-center border rounded-lg px-3 py-2 mt-1 bg-gray-50 focus-within:border-blue-900">
              <span className="text-gray-400 mr-2">
                <LockClosedIcon className="h-5 w-5" />
              </span>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-black outline-none w-full text-sm"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg font-medium shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-900 font-medium cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-6">
        Educational Tool for Computer Architecture Students
      </p>
    </div>
  );
}