import React from "react";
import { User, Mail, Lock } from "lucide-react"; // Importing modern icons

export default function SignUpPage() {
  return (
    // Fullscreen centered container with gradient background
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-200 px-4">
      {/* Main card container with padding, rounded corners, and shadow */}
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">

        {/* Decorative glowing circle for modern AI look */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>

        {/* Page heading */}
        <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
          Create Your AI Account
        </h2>

        {/* Signup form */}
        <form className="space-y-5">

          {/* Full Name input with icon */}
          <div className="relative">
            <label className="block mb-1 text-sm font-semibold text-gray-700">Full Name</label>
            <div className="flex items-center border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <div className="px-3 text-gray-400">
                <User size={20} />
              </div>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-3 py-2 outline-none"
              />
            </div>
          </div>

          {/* Email input with icon */}
          <div className="relative">
            <label className="block mb-1 text-sm font-semibold text-gray-700">Email</label>
            <div className="flex items-center border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <div className="px-3 text-gray-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 outline-none"
              />
            </div>
          </div>

          {/* Password input with icon */}
          <div className="relative">
            <label className="block mb-1 text-sm font-semibold text-gray-700">Password</label>
            <div className="flex items-center border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <div className="px-3 text-gray-400">
                <Lock size={20} />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 outline-none"
              />
            </div>
          </div>

          {/* Submit button with gradient and hover effect */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Link to log in if the user already has an account */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <a href="#" className="text-blue-600 hover:underline">Log In</a>
        </p>
      </div>
    </div>
  );
}
