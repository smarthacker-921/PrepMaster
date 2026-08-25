"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background Glow */}
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
          href="/login"
          className="text-sm text-slate-400 hover:text-white transition"
        >
          ← Back to Login
        </Link>
      </nav>

      {/* Card */}
      <div className="relative w-full max-w-[600px]">

        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-blue-500/20 to-green-500/20 rounded-[28px] blur-xl" />

        <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-8 md:p-10 shadow-2xl">

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div className="text-center mb-8">

                <div className="text-4xl mb-4">🔐</div>

                <h1 className="text-3xl font-extrabold">
                  Forgot Password?
                </h1>

                <p className="mt-3 text-sm text-slate-400">
                  Enter your registered email and we'll send you a
                  verification code.
                </p>

              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(2);
                }}
                className="space-y-5"
              >
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

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-bold shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  Send Verification Code →
                </button>
              </form>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="text-center mb-8">

                <div className="text-4xl mb-4">📩</div>

                <h1 className="text-3xl font-extrabold">
                  Verify Your Email
                </h1>

                <p className="mt-3 text-sm text-slate-400">
                  Enter the 6-digit code sent to your email.
                </p>

              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(3);
                }}
                className="space-y-5"
              >
                <input
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="000000"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-4 text-white text-center text-2xl tracking-[0.5em] placeholder:text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-bold transition-all duration-300 hover:scale-[1.02]"
                >
                  Verify Code →
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-sm text-slate-400 hover:text-white transition"
                >
                  ← Change Email
                </button>
              </form>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <div className="text-center mb-8">

                <div className="text-4xl mb-4">🔑</div>

                <h1 className="text-3xl font-extrabold">
                  Create New Password
                </h1>

                <p className="mt-3 text-sm text-slate-400">
                  Choose a strong password for your PrepMaster account.
                </p>

              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(4);
                }}
                className="space-y-5"
              >

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3.5 pr-12 text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* Confirm */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3.5 pr-12 text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showConfirm ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-bold shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  Reset Password →
                </button>

              </form>
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="text-center">

              <div className="text-6xl mb-5">✅</div>

              <h1 className="text-3xl font-extrabold">
                Password Updated!
              </h1>

              <p className="mt-3 text-slate-400">
                Your password has been successfully changed.
              </p>

              <Link
                href="/login"
                className="mt-7 block w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-bold transition-all hover:scale-[1.02]"
              >
                Login to PrepMaster →
              </Link>

            </div>
          )}

          {/* Footer */}
          <div className="mt-7 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-slate-500">
              🔒 Your password and account data are protected.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}