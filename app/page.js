"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // OTP state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // Step tracking

  const router = useRouter();
  const { data: session } = useSession(); // Get session data

  // Redirect if already authenticated
  if (session) {
    router.push(`/${session.user.id}`);
  }

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("data: ", data);
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      setOtpSent(true); // Move to OTP step
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      const result = await signIn("credentials", { redirect: false, email, password });

      if (result.ok) {
        router.push(`/${result.id}`);
      } else {
        throw new Error(result.error || "Invalid email or password");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg bg-gray-200 p-6 rounded-lg shadow-lg mt-3 border">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        
        {!otpSent ? (
          <form onSubmit={handleSendOtp}>
            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className={`w-1/3 py-2 px-4 rounded-md text-white ${
                  loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            {/* OTP Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                type="text"
                placeholder="6-digit OTP"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className={`w-1/3 py-2 px-4 rounded-md text-white ${
                  loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
