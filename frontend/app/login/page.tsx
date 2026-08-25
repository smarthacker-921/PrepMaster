"use client";

import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-[-180px] left-[-150px] w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-180px] right-[-150px] w-[400px] h-[400px] bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 py-6">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight"
        >
          <span className="text-white">Prep</span>
          <span className="bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
            Master
          </span>
        </Link>

        <Link
          href="/"
          className="text-sm text-slate-400 hover:text-white transition"
        >
          ← Back to Home
        </Link>
      </nav>

      {/* Login Card */}
      <div className="relative w-full max-w-[500px]">

        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-blue-500/20 to-green-500/20 rounded-[28px] blur-xl" />

        <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-8 md:p-10 shadow-2xl">

          {/* Heading */}
          <div className="text-center mb-8">

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 mb-5">
              ✨ Welcome Back
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold">
              Login to{" "}
              <span className="bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
                PrepMaster
              </span>
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              Continue your preparation and stay on track.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3.5 text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs text-blue-400 hover:text-blue-300 transition"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3.5 pr-12 text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-bold shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/40"
            >
              <span className="relative z-10">
                Login to PrepMaster →
              </span>
            </button>
          </form>

          {/* Signup */}
          <p className="text-center text-sm text-slate-400 mt-7">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-blue-400 hover:text-blue-300 transition"
            >
              Create Account
            </Link>
          </p>

          {/* Security */}
          <div className="mt-7 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-slate-500">
              🔒 Your account and study data are protected.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}