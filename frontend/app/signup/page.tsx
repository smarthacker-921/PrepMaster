"use client";

import Link from "next/link";
import { useState } from "react";

export default function Signup() {
const [showPassword, setShowPassword] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [code, setCode] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");
const [error, setError] = useState("");

// Send OTP
const handleVerify = async () => {
setError("");
setMessage("");

if (!name.trim()) {
  setError("Please enter your full name.");
  return;
}

if (!email.trim()) {
  setError("Please enter your email address.");
  return;
}

if (!password) {
  setError("Please enter your password.");
  return;
}

if (password.length < 8) {
  setError("Password must be at least 8 characters.");
  return;
}

if (password !== confirmPassword) {
  setError("Passwords do not match.");
  return;
}

try {
  setLoading(true);

  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    setError(data.error || "Unable to send verification code.");
    return;
  }

  setMessage(
    data.message || "Verification code sent to your email."
  );
} catch (error) {
  console.error("Signup request error:", error);
  setError("Unable to connect to the server. Please try again.");
} finally {
  setLoading(false);
}

};

// Verify OTP and create account
const handleSubmit = async (
e: React.FormEvent<HTMLFormElement>
) => {
e.preventDefault();

setError("");
setMessage("");

if (!name.trim()) {
  setError("Please enter your full name.");
  return;
}

if (!email.trim()) {
  setError("Please enter your email address.");
  return;
}

if (!code.trim()) {
  setError("Please enter the verification code.");
  return;
}

if (code.length !== 6) {
  setError("Verification code must be 6 digits.");
  return;
}

if (!password) {
  setError("Please enter your password.");
  return;
}

if (password.length < 8) {
  setError("Password must be at least 8 characters.");
  return;
}

if (password !== confirmPassword) {
  setError("Passwords do not match.");
  return;
}

try {
  setLoading(true);

  const response = await fetch("/api/auth/verify-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      code,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    setError(data.error || "Invalid verification code.");
    return;
  }

  setMessage(
    data.message || "Account created successfully!"
  );

  setTimeout(() => {
    window.location.href = "/login";
  }, 1000);
} catch (error) {
  console.error("Verification request error:", error);
  setError("Unable to connect to the server. Please try again.");
} finally {
  setLoading(false);
}

};

return (
<main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-20 relative overflow-hidden">

  {/* Background glow */}
  <div className="absolute top-[-180px] left-[-150px] w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl" />

  <div className="absolute bottom-[-180px] right-[-150px] w-[400px] h-[400px] bg-green-500/10 rounded-full blur-3xl" />

  <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

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

  {/* Signup Card */}
  <div className="relative w-full max-w-[500px] mt-6">

    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-blue-500/20 to-green-500/20 rounded-[28px] blur-xl" />

    <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-8 md:p-10 shadow-2xl">

      {/* Heading */}
      <div className="text-center mb-7">

        <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-500/10 px-4 py-2 text-sm text-green-300 mb-5">
          🚀 Start Your Journey
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold">

          <span className="bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
            Create Account
          </span>

        </h1>

        <p className="mt-3 text-sm text-slate-400">
          Build your personalized preparation journey.
        </p>

      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {/* Name */}
        <div>

          <label className="block text-sm font-medium text-slate-300 mb-2">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Your name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3.5 text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />

        </div>

        {/* Email */}
        <div>

          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email Address
          </label>

          <div className="flex gap-2">

            <input
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3.5 text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            <button
              type="button"
              onClick={handleVerify}
              disabled={loading}
              className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 text-sm font-semibold text-blue-400 hover:bg-blue-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Verify"}
            </button>

          </div>

        </div>

        {/* OTP */}
        <div>

          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email Verification Code
          </label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setCode(value);
            }}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3.5 text-white placeholder:text-slate-600 outline-none tracking-[0.3em] text-center transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
          />

          <p className="mt-2 text-xs text-slate-500">
            A verification code will be sent to your email.
          </p>

        </div>

        {/* Password */}
        <div>

          <label className="block text-sm font-medium text-slate-300 mb-2">
            Password
          </label>

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3.5 pr-12 text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>

          </div>

        </div>

        {/* Confirm Password */}
        <div>

          <label className="block text-sm font-medium text-slate-300 mb-2">
            Confirm Password
          </label>

          <div className="relative">

            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm your password"
              required
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3.5 pr-12 text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirm(!showConfirm)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
            >
              {showConfirm ? "🙈" : "👁️"}
            </button>

          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Success */}
        {message && (
          <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            {message}
          </div>
        )}

        {/* Create Account */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-bold shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading
            ? "Creating Account..."
            : "Create My PrepMaster Account →"}
        </button>

      </form>

      {/* Login */}
      <p className="text-center text-sm text-slate-400 mt-7">

        Already have an account?{" "}

        <Link
          href="/login"
          className="font-semibold text-blue-400 hover:text-blue-300 transition"
        >
          Login
        </Link>

      </p>

      {/* Privacy */}
      <div className="mt-6 pt-5 border-t border-white/10 text-center">

        <p className="text-xs text-slate-500">
          🔐 Your information stays private and secure.
        </p>

      </div>

    </div>

  </div>

</main>

);
}