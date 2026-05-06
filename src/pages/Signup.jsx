import { useState } from "react";
import {
  CpuChipIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    // Validation
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost/ComputerArchitectureToolkitAPI/api/auth/register", {
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

      if (response.ok) {
        // Registration successful
        setSuccessMessage(data.message || "Account created successfully!");
        
        // Clear form
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        // Registration failed
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
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
          Create Account
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Join us and start learning today
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSignup}>
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
                placeholder="Enter your password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-black outline-none w-full text-sm"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="text-sm text-gray-700">Confirm Password</label>
            <div className="flex items-center border rounded-lg px-3 py-2 mt-1 bg-gray-50 focus-within:border-blue-900">
              <span className="text-gray-400 mr-2">
                <LockClosedIcon className="h-5 w-5" />
              </span>
              <input
                type="password"
                placeholder="Enter your password again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-900 font-medium cursor-pointer hover:underline"
          >
            Login
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