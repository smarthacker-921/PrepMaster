"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050816] text-white">

      {/* ================================================= */}
      {/* CURSOR GLOW */}
      {/* ================================================= */}

      <div
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-300"
        style={{
          background: `radial-gradient(
            500px circle at ${mouse.x}% ${mouse.y}%,
            rgba(59,130,246,0.13),
            transparent 70%
          )`,
        }}
      />

      {/* ================================================= */}
      {/* BACKGROUND GLOW */}
      {/* ================================================= */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="absolute right-[-100px] top-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-[-120px] left-1/3 h-80 w-80 rounded-full bg-green-500/10 blur-3xl" />

      </div>

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">

        {/* Logo */}

        <Link
          href="/"
          className="text-2xl font-black tracking-tight transition duration-300 hover:scale-105"
        >
          Prep<span className="text-blue-500">Master</span>
        </Link>

        {/* Navigation */}

        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">

          <Link
            href="/features"
            className="transition hover:text-white"
          >
            Features
          </Link>

          <a
            href="#how-it-works"
            className="transition hover:text-white"
          >
            How It Works
          </a>

          <Link
            href="/goals"
            className="transition hover:text-white"
          >
            Goals
          </Link>

          <Link
            href="/about"
            className="transition hover:text-white"
          >
            About
          </Link>

        </div>

        {/* Auth */}

        <div className="flex items-center gap-3">

          <Link
            href="/login"
            className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white sm:block"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/15"
          >
            Sign Up
          </Link>

        </div>

      </nav>

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative z-10 mx-auto flex min-h-[650px] max-w-6xl flex-col items-center justify-center px-6 pb-24 pt-16 text-center">

        {/* Badge */}

        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-5 py-2 text-sm text-blue-300 backdrop-blur-md">

          <span className="animate-pulse">
            ✦
          </span>

          AI-Powered Personal Study Manager

        </div>

        {/* Main Heading */}

        <h1 className="max-w-5xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">

          <span className="text-white">
            Welcome to{" "}
          </span>

          <span className="bg-gradient-to-r from-orange-500 via-white to-green-500 bg-clip-text text-transparent">
            PrepMaster
          </span>

        </h1>

        {/* Description */}

        <p className="mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg md:text-xl">
          Your intelligent study manager that plans what to study,
          recommends what to learn, tests what you learned and
          keeps you moving toward your goal.
        </p>

        {/* CTA */}

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">

          <Link
            href="/goals"
            className="group rounded-2xl bg-blue-600 px-8 py-4 font-bold shadow-xl shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-500"
          >
            Start Your Preparation

            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>

          <Link
            href="/features"
            className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-slate-200 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/10"
          >
            Explore Features
          </Link>

        </div>

        {/* ================================================= */}
        {/* THREE MAIN HIGHLIGHTS */}
        {/* ================================================= */}

        <div className="mt-20 grid w-full max-w-4xl gap-4 sm:grid-cols-3">

          <Highlight
            icon="📚"
            title="Smart Planning"
            text="Know what to study and what to do next."
          />

          <Highlight
            icon="🤖"
            title="AI Assistant"
            text="Get intelligent guidance throughout preparation."
          />

          <Highlight
            icon="📊"
            title="Track Progress"
            text="Learn, test and understand your progress."
          />

        </div>

      </section>

      {/* ================================================= */}
      {/* HOW IT WORKS */}
      {/* ================================================= */}

      <section
        id="how-it-works"
        className="relative z-10 border-t border-white/5 bg-white/[0.015] px-6 py-24"
      >

        <div className="mx-auto max-w-5xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            How It Works
          </p>

          <h2 className="mt-4 text-3xl font-black sm:text-4xl">
            You choose the goal. We organize the journey.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            PrepMaster transforms your goal into a structured
            preparation journey.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">

            <Step
              number="01"
              icon="🎯"
              title="Choose Your Goal"
              text="Select GATE, JEE, NEET, Coding or College Exam."
            />

            <Step
              number="02"
              icon="⚙️"
              title="Personalize"
              text="Provide your preparation level, target date and available study days."
            />

            <Step
              number="03"
              icon="🚀"
              title="Start Learning"
              text="Follow your personalized plan, complete tasks and track your progress."
            />

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* SHORT ABOUT */}
      {/* ================================================= */}

      <section
        id="about"
        className="relative z-10 border-t border-white/5 px-6 py-20"
      >

        <div className="mx-auto max-w-3xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            About PrepMaster
          </p>

          <h2 className="mt-4 text-3xl font-black sm:text-4xl">
            Study with a plan, not with confusion.
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
            PrepMaster is an AI-powered study manager that helps
            students organize their syllabus, follow a personalized
            preparation plan and improve through learning and testing.
          </p>

          <Link
            href="/about"
            className="mt-7 inline-flex rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:-translate-y-1 hover:bg-white/10"
          >
            Learn More About PrepMaster →
          </Link>

        </div>

      </section>

      {/* ================================================= */}
      {/* FINAL CTA */}
      {/* ================================================= */}

      <section className="relative z-10 px-6 py-24">

        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-white/[0.03] to-green-500/10 p-8 text-center backdrop-blur-xl sm:p-12">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            Start Today
          </p>

          <h2 className="mt-4 text-3xl font-black sm:text-4xl">
            Ready to prepare smarter?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Choose your goal and let PrepMaster turn your preparation
            into a clear and manageable journey.
          </p>

          <Link
            href="/goals"
            className="mt-8 inline-flex rounded-2xl bg-blue-600 px-8 py-4 font-bold shadow-xl shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-500"
          >
            Start Your Preparation →
          </Link>

        </div>

      </section>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <footer className="relative z-10 border-t border-white/5 px-6 py-8">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">

          <p>
            © {new Date().getFullYear()} PrepMaster. All rights reserved.
          </p>

          <div className="flex gap-5">

            <Link
              href="/privacy"
              className="transition hover:text-slate-300"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-slate-300"
            >
              Terms
            </Link>

            <Link
              href="/about"
              className="transition hover:text-slate-300"
            >
              Contact
            </Link>

          </div>

        </div>

      </footer>

    </main>
  );
}


/* ========================================================= */
/* HIGHLIGHT */
/* ========================================================= */

function Highlight({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-left backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-blue-400/30 hover:bg-white/[0.07]">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-2xl transition duration-300 group-hover:scale-110">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {text}
      </p>

    </div>
  );
}


/* ========================================================= */
/* STEP */
/* ========================================================= */

function Step({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 text-left backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:border-blue-400/20 hover:bg-white/[0.06]">

      <div className="flex items-center justify-between">

        <span className="text-sm font-black text-blue-400">
          {number}
        </span>

        <span className="text-2xl transition duration-300 group-hover:scale-110">
          {icon}
        </span>

      </div>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-400">
        {text}
      </p>

    </div>
  );
}