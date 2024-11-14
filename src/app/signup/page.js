"use client";
import { useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../redux/store"; // Adjust path as necessary

const Signup = () => {
  const { setUser } = useGlobalContext(); 
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle Sign-Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("/api/users/signup", {
        username,
        email,
        password,
      });
      setUser(response.data.savedUser);
      setMessage("Check your email for the verification code.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Error during sign-up.");
    }
  };

  // Handle Email Verification
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await axios.post("/api/users/verifyemail", { email, verificationCode });
      setMessage("Email verified successfully!");
      window.location.href = "/"; // Redirect to home or dashboard
    } catch (err) {
      setError(err.response?.data?.error || "Error during verification.");
    }
  };

  return (
    <div className="container mx-auto p-6 flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {step === 1 ? "Sign Up" : "Verify Email"}
        </h2>

        {step === 1 && (
          <form onSubmit={handleSignUp} className="space-y-5">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {error && <p className="text-red-500 text-center">{error}</p>}
            {message && <p className="text-green-500 text-center">{message}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              Sign Up
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyEmail} className="space-y-5">
            <input
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {error && <p className="text-red-500 text-center">{error}</p>}
            {message && <p className="text-green-500 text-center">{message}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              Verify Email
            </button>
          </form>
        )}

        {/* Add "Sign In" link below the form */}
        {step === 1 && (
          <p className="text-center mt-4">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-500 hover:underline">
              Sign In
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Signup;
