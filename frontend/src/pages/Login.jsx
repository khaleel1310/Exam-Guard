import React from "react";

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="https://elearning.aum.edu.jo/pluginfile.php/1/core_admin/logo/0x200/1778666358/Uni-logo-3.png"
            alt="AUM Logo"
            className="h-24 object-contain"
          />
        </div>

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome Back
          </h1>
          <p className="text-slate-500 mt-2">
            Sign in using the exam room number
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Exam room number
            </label>
            <input
              type="text"
              placeholder="Enter the Exam room number"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex justify-end">
            <a
              href="#"
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white py-3 rounded-xl font-semibold transition duration-200 shadow-md hover:shadow-lg"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}