"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* =========================================================
   DATA
========================================================= */

const studyTasks = [
  {
    subject: "Database Management System",
    topic: "ER Model",
    progress: 60,
    status: "In Progress",
    color: "indigo",
  },
  {
    subject: "Operating System",
    topic: "Process Scheduling",
    progress: 0,
    status: "Pending",
    color: "violet",
  },
  {
    subject: "Data Structures & Algorithms",
    topic: "Linked List",
    progress: 0,
    status: "Pending",
    color: "cyan",
  },
];

const upcomingTests = [
  {
    date: "26",
    month: "AUG",
    title: "DBMS — ER Model Test",
    details: "15 Questions • 20 min",
  },
  {
    date: "28",
    month: "AUG",
    title: "OS — Process Scheduling Test",
    details: "20 Questions • 25 min",
  },
  {
    date: "30",
    month: "AUG",
    title: "DSA — Linked List Test",
    details: "20 Questions • 25 min",
  },
];

const subjects = [
  {
    name: "Database Management",
    completed: 15,
    total: 20,
    progress: 75,
    icon: "📚",
  },
  {
    name: "Operating System",
    completed: 8,
    total: 20,
    progress: 40,
    icon: "💻",
  },
  {
    name: "Data Structures",
    completed: 10,
    total: 20,
    progress: 50,
    icon: "⌘",
  },
  {
    name: "Computer Networks",
    completed: 12,
    total: 20,
    progress: 60,
    icon: "🌐",
  },
  {
    name: "Discrete Mathematics",
    completed: 6,
    total: 20,
    progress: 30,
    icon: "∑",
  },
];

const weekData = [
  { day: "Mon", planned: 6, completed: 5 },
  { day: "Tue", planned: 7, completed: 6 },
  { day: "Wed", planned: 6, completed: 5 },
  { day: "Thu", planned: 8, completed: 6 },
  { day: "Fri", planned: 7, completed: 7 },
  { day: "Sat", planned: 5, completed: 3 },
  { day: "Sun", planned: 4, completed: 4 },
];

const calendarDays = [
  { day: 27, type: "muted" },
  { day: 28, type: "muted" },
  { day: 29, type: "muted" },
  { day: 30, type: "muted" },
  { day: 31, type: "muted" },
  { day: 1, type: "done" },
  { day: 2, type: "done" },

  { day: 3, type: "done" },
  { day: 4, type: "done" },
  { day: 5, type: "done" },
  { day: 6, type: "missed" },
  { day: 7, type: "done" },
  { day: 8, type: "done" },
  { day: 9, type: "done" },

  { day: 10, type: "done" },
  { day: 11, type: "done" },
  { day: 12, type: "done" },
  { day: 13, type: "done" },
  { day: 14, type: "done" },
  { day: 15, type: "done" },
  { day: 16, type: "done" },

  { day: 17, type: "done" },
  { day: 18, type: "done" },
  { day: 19, type: "done" },
  { day: 20, type: "done" },
  { day: 21, type: "done" },
  { day: 22, type: "done" },
  { day: 23, type: "done" },

  { day: 24, type: "today" },
  { day: 25, type: "normal" },
  { day: 26, type: "normal" },
  { day: 27, type: "normal" },
  { day: 28, type: "normal" },
  { day: 29, type: "normal" },
  { day: 30, type: "normal" },

  { day: 31, type: "normal" },
  { day: 1, type: "muted" },
  { day: 2, type: "muted" },
  { day: 3, type: "muted" },
  { day: 4, type: "muted" },
  { day: 5, type: "muted" },
  { day: 6, type: "muted" },
];

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(24);
  const [greeting, setGreeting] = useState("Good Morning");

  const studentName = "Student";

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();

      if (hour >= 5 && hour < 12) {
        setGreeting("Good Morning");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };

    updateGreeting();

    const timer = setInterval(updateGreeting, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#050617] text-white selection:bg-violet-500/30">

      {/* =====================================================
          PREMIUM ANIMATED BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        <div className="absolute left-[-180px] top-[-170px] h-[520px] w-[520px] rounded-full bg-indigo-600/[0.10] blur-[140px] animate-orb-one" />

        <div className="absolute right-[-180px] top-[25%] h-[500px] w-[500px] rounded-full bg-violet-600/[0.08] blur-[140px] animate-orb-two" />

        <div className="absolute bottom-[-200px] left-[25%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.055] blur-[140px] animate-orb-three" />

        <div className="absolute left-[45%] top-[40%] h-[260px] w-[260px] rounded-full bg-indigo-400/[0.025] blur-[100px] animate-orb-four" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.035),transparent_40%)]" />

        <div className="absolute inset-0 opacity-[0.018] bg-grid" />

      </div>

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[250px] flex-col border-r border-white/[0.07] bg-[#080a1a]/95 shadow-2xl shadow-black/30 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >

        {/* LOGO */}

        <div className="group relative flex h-[72px] shrink-0 items-center border-b border-white/[0.07] px-6">

          <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

          <Link
            href="/"
            className="flex items-center gap-3 transition-all duration-500 group-hover:translate-x-0.5"
          >

            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 shadow-lg shadow-violet-500/20 transition-all duration-500 group-hover:rotate-3 group-hover:scale-105 group-hover:shadow-violet-500/40">

              <div className="absolute -inset-5 animate-logo-glow rounded-full bg-violet-400/20 blur-xl" />

              <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <span className="relative z-10 text-lg font-black text-white">
                P
              </span>

            </div>

            <div className="leading-none">

              <p className="text-xl font-black tracking-tight">

                <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  Prep Master
                </span>

              </p>

              <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                Smart Study
              </p>

            </div>

          </Link>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">

          <SidebarItem
            href="/dashboard"
            icon="⌂"
            label="Dashboard"
            active
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            href="/study-plan"
            icon="▣"
            label="Study Plan"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            href="/subjects"
            icon="▤"
            label="Subjects"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            href="/tests"
            icon="✓"
            label="Tests"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            href="/progress"
            icon="↗"
            label="Progress"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            href="/ai-assistant"
            icon="✦"
            label="AI Assistant"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            href="/achievements"
            icon="♛"
            label="Achievements"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            href="/reminders"
            icon="♧"
            label="Reminders"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            href="/settings"
            icon="⚙"
            label="Settings"
            onClick={() => setSidebarOpen(false)}
          />

        </nav>

        {/* REMINDER CARD */}

        <div className="m-4 shrink-0 rounded-2xl border border-white/[0.07] bg-gradient-to-br from-indigo-500/[0.07] via-white/[0.025] to-cyan-500/[0.035] p-4 transition-all duration-500 hover:-translate-y-1 hover:border-violet-400/20 hover:shadow-xl hover:shadow-violet-500/[0.06]">

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="animate-bell">🔔</span>
            Next Reminder
          </div>

          <h3 className="mt-3 text-sm font-bold">
            DBMS Lecture
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            ER Model
          </p>

          <p className="mt-3 text-xs text-orange-300">
            Today, 6:00 PM
          </p>

          <Link
            href="/reminders"
            className="mt-4 block rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-xs font-semibold text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-300"
          >
            View Reminders
          </Link>

        </div>

      </aside>

      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <div className="relative z-10 min-h-screen min-w-0 lg:ml-[250px]">

        {/* ===================================================
            TOP BAR
        ==================================================== */}

        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-white/[0.06] bg-[#050617]/80 px-4 backdrop-blur-2xl transition-all duration-300 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-slate-300 transition-all duration-300 hover:scale-105 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-300 active:scale-95 lg:hidden"
            >
              ☰
            </button>

            <div className="hidden rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2 text-sm text-slate-500 transition-all duration-300 hover:border-violet-400/20 hover:bg-white/[0.04] sm:block sm:w-72">
              🔍 Search topics, lectures...
            </div>

          </div>

          <div className="flex items-center gap-4">

            {/* STREAK */}

            <div className="hidden items-center gap-2 rounded-xl border border-orange-400/10 bg-orange-400/[0.04] px-3 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/25 hover:bg-orange-400/[0.08] sm:flex">

              <span className="transition-transform duration-300 hover:scale-125">
                🔥
              </span>

              <div>

                <p className="text-sm font-bold text-orange-300">
                  7
                </p>

                <p className="text-[10px] text-slate-500">
                  Day Streak
                </p>

              </div>

            </div>

            {/* NOTIFICATION */}

            <button className="relative rounded-xl border border-white/10 bg-white/[0.04] p-2.5 transition-all duration-300 hover:scale-105 hover:border-violet-400/25 hover:bg-violet-500/10 active:scale-95">
              🔔

              <span className="absolute right-1 top-1 h-2 w-2 animate-ping rounded-full bg-violet-400" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-violet-400" />
            </button>

            {/* USER */}

            <div className="hidden cursor-pointer items-center gap-3 rounded-xl px-2 py-1 transition-all duration-300 hover:bg-white/[0.04] sm:flex">

              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 font-black text-white shadow-lg shadow-violet-500/20 transition-transform duration-300 hover:scale-110">
                {studentName.charAt(0)}
              </div>

              <div>

                <p className="text-sm font-semibold">
                  {studentName}
                </p>

                <p className="text-[11px] text-slate-500">
                  GATE CSE
                </p>

              </div>

              <span className="text-slate-500 transition-transform duration-300 hover:translate-y-0.5">
                ▾
              </span>

            </div>

          </div>

        </header>

        {/* ===================================================
            CONTENT
        ==================================================== */}

        <section className="mx-auto w-full max-w-[1450px] px-4 py-6 sm:px-6 lg:px-8">

          {/* =================================================
              WELCOME + PROGRESS
          ================================================== */}

          <div className="grid w-full items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">

            {/* WELCOME CARD */}

            <div
              className="dashboard-enter group relative flex min-h-[290px] flex-col justify-center overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-indigo-500/[0.045] via-white/[0.025] to-cyan-500/[0.025] p-6 shadow-2xl shadow-black/10 transition-all duration-500 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.04] hover:shadow-violet-500/[0.04] sm:p-7"
              style={{ animationDelay: "80ms" }}
            >

              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/[0.06] blur-3xl transition-all duration-700 group-hover:scale-125 group-hover:bg-violet-500/[0.10]" />

              <div className="pointer-events-none absolute bottom-[-80px] left-[40%] h-44 w-44 rounded-full bg-cyan-500/[0.04] blur-3xl transition-all duration-700 group-hover:scale-125" />

              <div className="relative z-10">

                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">

                  <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">

                    {greeting},{" "}

                    <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent animate-gradient">
                      {studentName}
                    </span>

                  </span>

                  <span className="ml-2 inline-block transition-transform duration-500 group-hover:rotate-12">
                    👋
                  </span>

                </h1>

                <p className="mt-2 text-sm text-slate-400">
                  Let&apos;s make today productive.
                </p>

                <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">

                  <InfoCard
                    icon="🎯"
                    title="Goal"
                    value="GATE CSE"
                  />

                  <InfoCard
                    icon="📅"
                    title="Target Date"
                    value="12 May 2027"
                  />

                  <InfoCard
                    icon="📚"
                    title="Syllabus Ends"
                    value="07 May 2027"
                  />

                  <InfoCard
                    icon="↻"
                    title="Revision"
                    value="08 May 2027"
                  />

                </div>

              </div>

            </div>

            {/* OVERALL PROGRESS */}

            <div
              className="dashboard-enter group flex min-h-[290px] w-full flex-col rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.035] to-indigo-500/[0.025] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.045]"
              style={{ animationDelay: "180ms" }}
            >

              <p className="text-sm font-semibold transition-colors duration-300 group-hover:text-violet-300">
                Overall Progress
              </p>

              <div className="flex flex-1 items-center justify-center">

                <div className="relative mt-2 h-[155px] w-[240px] transition-transform duration-500 group-hover:scale-[1.04]">

                  <svg
                    viewBox="0 0 240 140"
                    className="absolute inset-0 h-full w-full overflow-visible"
                  >

                    <path
                      d="M 30 120 A 90 90 0 0 1 210 120"
                      fill="none"
                      stroke="rgb(30 32 55)"
                      strokeWidth="18"
                      strokeLinecap="round"
                    />

                    <path
                      d="M 30 120 A 90 90 0 0 1 210 120"
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="18"
                      strokeLinecap="round"
                      pathLength="100"
                      strokeDasharray="100"
                      strokeDashoffset="58"
                      className="progress-draw"
                    />

                    <defs>
                      <linearGradient
                        id="progressGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>

                  </svg>

                  <div className="absolute inset-x-0 bottom-2 flex flex-col items-center">

                    <p className="text-4xl font-black leading-none transition-transform duration-300 group-hover:scale-110">
                      42%
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Syllabus Completed
                    </p>

                  </div>

                </div>

              </div>

              <p className="text-center text-xs text-slate-500">
                38 / 90 Topics
              </p>

            </div>

          </div>

          {/* =================================================
              TODAY + CALENDAR
          ================================================== */}

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">

            {/* TODAY */}

            <div
              className="dashboard-enter rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 transition-all duration-500 hover:border-indigo-400/15 hover:bg-white/[0.035] sm:p-6"
              style={{ animationDelay: "260ms" }}
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs uppercase tracking-widest text-violet-400">
                    Today
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Today&apos;s Study Plan
                  </h2>

                </div>

                <Link
                  href="/study-plan"
                  className="group rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/25 hover:bg-violet-500/10 hover:text-violet-300"
                >
                  View Full Plan
                  <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

              </div>

              <div className="mt-5 space-y-3">

                {studyTasks.map((task, index) => (
                  <div
                    key={task.subject}
                    className="dashboard-enter"
                    style={{
                      animationDelay: `${330 + index * 80}ms`,
                    }}
                  >
                    <StudyTask {...task} />
                  </div>
                ))}

              </div>

              <div className="mt-5">

                <div className="flex items-center justify-between text-xs">

                  <span className="text-slate-400">
                    Daily Goal Progress
                  </span>

                  <span className="font-semibold text-violet-400">
                    1 / 3 Completed
                  </span>

                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800/80">

                  <div className="progress-bar h-full w-[33%] rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 shadow-sm shadow-violet-500/30" />

                </div>

              </div>

            </div>

            {/* CALENDAR */}

            <div
              className="dashboard-enter rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 transition-all duration-500 hover:border-indigo-400/15 hover:bg-white/[0.035] sm:p-6"
              style={{ animationDelay: "320ms" }}
            >

              <div className="flex items-center justify-between">

                <h2 className="text-xl font-bold">
                  Study Calendar
                </h2>

                <div className="flex items-center gap-4 text-sm">

                  <button className="transition-all duration-300 hover:scale-125 hover:text-violet-400">
                    ‹
                  </button>

                  <span className="font-semibold">
                    August 2026
                  </span>

                  <button className="transition-all duration-300 hover:scale-125 hover:text-violet-400">
                    ›
                  </button>

                </div>

              </div>

              <div className="mt-6 grid grid-cols-7 gap-y-3 text-center">

                {[
                  "Sun",
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                ].map((day) => (

                  <span
                    key={day}
                    className="text-[11px] font-medium text-slate-600"
                  >
                    {day}
                  </span>

                ))}

                {calendarDays.map((item, index) => (

                  <button
                    key={index}
                    onClick={() => setSelectedDate(item.day)}
                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold transition-all duration-300 hover:scale-110 active:scale-90 ${
                      item.type === "done"
                        ? "bg-indigo-500/80 text-white hover:bg-indigo-400 hover:shadow-lg hover:shadow-indigo-500/25"
                        : item.type === "missed"
                          ? "bg-red-500 text-white hover:bg-red-400 hover:shadow-lg hover:shadow-red-500/20"
                          : item.type === "today"
                            ? "border-2 border-violet-400 bg-violet-400/10 text-violet-300 hover:bg-violet-400/20 hover:shadow-lg hover:shadow-violet-500/10"
                            : item.type === "muted"
                              ? "text-slate-700"
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                    } ${
                      selectedDate === item.day &&
                      item.type === "normal"
                        ? "ring-2 ring-violet-400/50 ring-offset-2 ring-offset-[#050617]"
                        : ""
                    }`}
                  >
                    {item.day}
                  </button>

                ))}

              </div>

              <div className="mt-6 flex flex-wrap gap-4 border-t border-white/5 pt-4 text-[11px] text-slate-500">

                <Legend
                  color="bg-indigo-500"
                  text="Completed"
                />

                <Legend
                  color="bg-red-500"
                  text="Missed"
                />

                <Legend
                  color="border border-slate-600"
                  text="Planned"
                />

              </div>

            </div>

          </div>

          {/* =================================================
              STATS
          ================================================== */}

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">

            <StatCard
              icon="📚"
              title="Topics Completed"
              value="38"
              suffix="/ 90"
              progress={42}
            />

            <StatCard
              icon="📝"
              title="Tests Completed"
              value="24"
              suffix="/ 60"
              progress={40}
            />

            <StatCard
              icon="🎯"
              title="Average Score"
              value="68%"
              suffix=""
              progress={68}
            />

            <StatCard
              icon="🔥"
              title="Current Streak"
              value="7"
              suffix=" Days"
              progress={70}
            />

          </div>

          {/* =================================================
              TIMELINE + WEEKLY
          ================================================== */}

          <div className="mt-5 grid gap-5 lg:grid-cols-2">

            {/* TIMELINE */}

            <div className="dashboard-enter rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 transition-all duration-500 hover:border-indigo-400/15 hover:bg-white/[0.035]">

              <h2 className="text-xl font-bold">
                Preparation Timeline
              </h2>

              <div className="mt-8 flex items-center">

                <TimelineItem
                  icon="🚀"
                  title="Start"
                  date="09 Jan 2026"
                  active
                />

                <div className="h-1 flex-1 bg-gradient-to-r from-indigo-500 to-violet-400 transition-all duration-700" />

                <TimelineItem
                  icon="📚"
                  title="Syllabus Ends"
                  date="07 May 2027"
                  active
                />

                <div className="h-1 flex-1 bg-gradient-to-r from-violet-400 to-cyan-400" />

                <TimelineItem
                  icon="↻"
                  title="Revision"
                  date="08–12 May"
                  active
                />

                <div className="h-1 flex-1 bg-gradient-to-r from-cyan-400 to-red-400" />

                <TimelineItem
                  icon="🏆"
                  title="Exam"
                  date="12 May 2027"
                  active
                />

              </div>

              <div className="mt-8 h-2 overflow-hidden rounded-full bg-slate-800">

                <div className="progress-bar h-full w-[42%] rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

              </div>

              <div className="mt-3 flex justify-between text-xs text-slate-500">

                <span>
                  Preparation in progress
                </span>

                <span>
                  42% Completed
                </span>

              </div>

              <div className="mt-5 rounded-2xl border border-orange-400/10 bg-orange-400/5 p-4 transition-all duration-300 hover:border-orange-400/20 hover:bg-orange-400/10">

                <p className="text-sm font-semibold text-orange-300">
                  🔄 Revision Phase
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Your complete syllabus is planned to finish 5 days before
                  the target date. The final 5 days are reserved for revision.
                </p>

              </div>

            </div>

            {/* WEEKLY GRAPH */}

            <div className="dashboard-enter rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 transition-all duration-500 hover:border-indigo-400/15 hover:bg-white/[0.035]">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-bold">
                    Weekly Study Overview
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Planned vs completed tasks
                  </p>

                </div>

                <button className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-400 transition-all duration-300 hover:border-violet-400/25 hover:bg-violet-500/10 hover:text-violet-300">
                  This Week ▾
                </button>

              </div>

              <div className="mt-8 flex h-52 items-end justify-between gap-2">

                {weekData.map((item, index) => (

                  <div
                    key={item.day}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >

                    <div className="flex h-full items-end gap-1">

                      <div
                        className="bar-animation w-2 rounded-t-md bg-slate-700 transition-all duration-300 hover:bg-slate-600 sm:w-3"
                        style={{
                          height: `${item.planned * 10}%`,
                          animationDelay: `${index * 100}ms`,
                        }}
                      />

                      <div
                        className="bar-animation w-2 rounded-t-md bg-gradient-to-t from-indigo-500 to-cyan-400 shadow-sm shadow-indigo-500/20 transition-all duration-300 hover:brightness-125 sm:w-3"
                        style={{
                          height: `${item.completed * 10}%`,
                          animationDelay: `${index * 100 + 80}ms`,
                        }}
                      />

                    </div>

                    <span className="text-[10px] text-slate-500 transition-colors duration-300 hover:text-white">
                      {item.day}
                    </span>

                  </div>

                ))}

              </div>

              <div className="mt-5 flex gap-5 text-xs text-slate-500">

                <Legend
                  color="bg-slate-700"
                  text="Planned"
                />

                <Legend
                  color="bg-violet-500"
                  text="Completed"
                />

              </div>

            </div>

          </div>

          {/* =================================================
              UPCOMING TESTS
          ================================================== */}

          <div className="dashboard-enter mt-5 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 transition-all duration-500 hover:border-indigo-400/15 hover:bg-white/[0.035]">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-widest text-cyan-400">
                  Keep testing yourself
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Upcoming Tests
                </h2>

              </div>

              <Link
                href="/tests"
                className="text-sm font-semibold text-cyan-400 transition-all duration-300 hover:translate-x-1 hover:text-cyan-300"
              >
                View All →
              </Link>

            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">

              {upcomingTests.map((test, index) => (

                <div
                  key={test.title}
                  className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-white/[0.06] bg-slate-950/50 p-4 transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.04] hover:shadow-xl hover:shadow-cyan-500/[0.04]"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >

                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-cyan-500/15">

                    <span className="text-lg font-black text-cyan-300">
                      {test.date}
                    </span>

                    <span className="text-[9px] text-slate-500">
                      {test.month}
                    </span>

                  </div>

                  <div className="min-w-0 flex-1">

                    <h3 className="truncate text-sm font-bold">
                      {test.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {test.details}
                    </p>

                  </div>

                  <span className="rounded-lg bg-cyan-500/10 px-2 py-1 text-[10px] font-semibold text-cyan-300 transition-all duration-300 group-hover:bg-cyan-500/20">
                    Scheduled
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* =================================================
              SUBJECT PROGRESS
          ================================================== */}

          <div className="dashboard-enter mt-5 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 transition-all duration-500 hover:border-indigo-400/15 hover:bg-white/[0.035]">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-widest text-violet-400">
                  Your preparation
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Subject Progress
                </h2>

              </div>

              <Link
                href="/subjects"
                className="text-sm font-semibold text-cyan-400 transition-all duration-300 hover:translate-x-1 hover:text-cyan-300"
              >
                View All →
              </Link>

            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

              {subjects.map((subject, index) => (

                <div
                  key={subject.name}
                  className="dashboard-enter"
                  style={{
                    animationDelay: `${index * 80}ms`,
                  }}
                >
                  <SubjectCard {...subject} />
                </div>

              ))}

            </div>

          </div>

          {/* =================================================
              MOTIVATION
          ================================================== */}

          <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-2xl border border-violet-400/10 bg-gradient-to-r from-indigo-500/[0.05] via-violet-500/[0.04] to-cyan-500/[0.04] px-5 py-4 text-center transition-all duration-500 hover:border-violet-400/20 hover:bg-violet-400/[0.07] sm:flex-row sm:text-left">

            <p className="text-sm text-slate-300">
              💡 Consistency today builds confidence for tomorrow.
            </p>

            <p className="font-pulse text-sm font-semibold text-violet-400">
              Keep going! 💪
            </p>

          </div>

        </section>

      </div>

      {/* =====================================================
          GLOBAL ANIMATION CSS
      ====================================================== */}

      <style jsx global>{`

        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 92, 246, 0.25) transparent;
        }

        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.25);
          border-radius: 999px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.45);
        }

        @keyframes dashboardEnter {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.985);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .dashboard-enter {
          animation: dashboardEnter 0.7s cubic-bezier(.22,1,.36,1) both;
        }

        @keyframes progressDraw {
          from {
            stroke-dashoffset: 100;
          }

          to {
            stroke-dashoffset: 58;
          }
        }

        .progress-draw {
          animation: progressDraw 1.8s cubic-bezier(.22,1,.36,1) forwards;
        }

        @keyframes progressFill {
          from {
            transform: scaleX(0);
            transform-origin: left;
          }

          to {
            transform: scaleX(1);
            transform-origin: left;
          }
        }

        .progress-bar {
          animation: progressFill 1.4s cubic-bezier(.22,1,.36,1) both;
        }

        @keyframes barGrow {
          from {
            transform: scaleY(0);
            transform-origin: bottom;
            opacity: 0;
          }

          to {
            transform: scaleY(1);
            transform-origin: bottom;
            opacity: 1;
          }
        }

        .bar-animation {
          animation: barGrow 0.9s cubic-bezier(.22,1,.36,1) both;
        }

        @keyframes floatGlow {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(20px, -15px, 0) scale(1.05);
          }
        }

        @keyframes orbOne {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(70px, 45px, 0) scale(1.12);
          }
        }

        @keyframes orbTwo {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-55px, -35px, 0) scale(1.1);
          }
        }

        @keyframes orbThree {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(45px, -45px, 0) scale(1.08);
          }
        }

        @keyframes orbFour {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.5;
          }

          50% {
            transform: translate3d(-30px, 25px, 0);
            opacity: 1;
          }
        }

        .animate-orb-one {
          animation: orbOne 13s ease-in-out infinite;
        }

        .animate-orb-two {
          animation: orbTwo 15s ease-in-out infinite;
        }

        .animate-orb-three {
          animation: orbThree 17s ease-in-out infinite;
        }

        .animate-orb-four {
          animation: orbFour 10s ease-in-out infinite alternate;
        }

        @keyframes logoGlow {
          0%,
          100% {
            opacity: 0.15;
            transform: scale(0.9);
          }

          50% {
            opacity: 0.4;
            transform: scale(1.15);
          }
        }

        .animate-logo-glow {
          animation: logoGlow 3s ease-in-out infinite;
        }

        @keyframes bellShake {
          0%,
          100% {
            transform: rotate(0deg);
          }

          10% {
            transform: rotate(12deg);
          }

          20% {
            transform: rotate(-10deg);
          }

          30% {
            transform: rotate(7deg);
          }

          40% {
            transform: rotate(-5deg);
          }

          50% {
            transform: rotate(0deg);
          }
        }

        .animate-bell {
          display: inline-block;
          animation: bellShake 4s ease-in-out infinite;
          transform-origin: top center;
        }

        @keyframes softPulse {
          0%,
          100% {
            opacity: 0.65;
          }

          50% {
            opacity: 1;
          }
        }

        .font-pulse {
          animation: softPulse 2.5s ease-in-out infinite;
        }

        @keyframes gradientMove {
          0%,
          100% {
            background-position: 0% 50%;
          }

          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 5s ease infinite;
        }

        .bg-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 45px 45px;
          mask-image: linear-gradient(to bottom, black, transparent 80%);
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

      `}</style>

    </main>
  );
}

/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  href,
  icon,
  label,
  active = false,
  onClick,
}: {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-indigo-500/15 via-violet-500/10 to-transparent text-white shadow-lg shadow-indigo-500/[0.04]"
          : "text-slate-400 hover:translate-x-1 hover:bg-white/[0.04] hover:text-white"
      }`}
    >

      {active && (
        <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-indigo-400 via-violet-400 to-cyan-400 shadow-lg shadow-violet-500/30" />
      )}

      <span
        className={`flex h-7 w-7 items-center justify-center rounded-lg text-base transition-all duration-300 ${
          active
            ? "bg-violet-400/10 text-violet-300 group-hover:scale-110 group-hover:rotate-3"
            : "text-slate-500 group-hover:scale-110 group-hover:text-violet-300"
        }`}
      >
        {icon}
      </span>

      {label}

      <span className="ml-auto translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        →
      </span>

    </Link>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-slate-950/40 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-violet-400/[0.035] hover:shadow-lg hover:shadow-violet-500/[0.03]">

      <div className="flex items-center gap-2">

        <span className="text-sm transition-transform duration-300 group-hover:scale-125">
          {icon}
        </span>

        <span className="text-[10px] uppercase tracking-wider text-slate-600 transition-colors duration-300 group-hover:text-slate-400">
          {title}
        </span>

      </div>

      <p className="mt-2 truncate text-xs font-bold text-slate-200">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   STUDY TASK
========================================================= */

function StudyTask({
  subject,
  topic,
  progress,
  status,
  color,
}: {
  subject: string;
  topic: string;
  progress: number;
  status: string;
  color: string;
}) {

  const colors: Record<string, string> = {
    indigo: "bg-indigo-400",
    violet: "bg-violet-400",
    cyan: "bg-cyan-400",
  };

  const iconColors: Record<string, string> = {
    indigo: "bg-indigo-400/15 text-indigo-300",
    violet: "bg-violet-400/15 text-violet-300",
    cyan: "bg-cyan-400/15 text-cyan-300",
  };

  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-slate-950/50 p-4 transition-all duration-500 hover:-translate-y-1 hover:border-violet-400/15 hover:bg-white/[0.035] hover:shadow-xl hover:shadow-black/20">

      <div className="flex items-center gap-4">

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${iconColors[color]}`}
        >
          ▶
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">

              <h3 className="truncate text-sm font-bold">
                {subject}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {topic}
              </p>

            </div>

            <span
              className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold transition-all duration-300 ${
                status === "In Progress"
                  ? "bg-orange-400/10 text-orange-300 group-hover:bg-orange-400/20"
                  : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
              }`}
            >
              {status}
            </span>

          </div>

          <div className="mt-3 flex items-center gap-3">

            <div className="flex gap-3 text-[10px] text-slate-500">

              <span className="transition-colors hover:text-white">
                ▣ Lecture
              </span>

              <span className="transition-colors hover:text-white">
                ✎ Practice
              </span>

              <span className="transition-colors hover:text-white">
                ✓ Test
              </span>

            </div>

            <span className="ml-auto text-xs font-bold text-slate-400">
              {progress}%
            </span>

          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">

            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${colors[color]}`}
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  title,
  value,
  suffix,
  progress,
}: {
  icon: string;
  title: string;
  value: string;
  suffix: string;
  progress: number;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition-all duration-500 hover:-translate-y-1 hover:border-violet-400/15 hover:bg-white/[0.045] hover:shadow-xl hover:shadow-violet-500/[0.025]">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 transition-all duration-300 group-hover:scale-110 group-hover:bg-violet-400/10">
          {icon}
        </div>

        <span className="text-[10px] text-slate-500">
          {title}
        </span>

      </div>

      <div className="mt-4">

        <span className="text-2xl font-black">
          {value}
        </span>

        <span className="text-xs text-slate-500">
          {suffix}
        </span>

      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">

        <div
          className="progress-bar h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </div>
  );
}

/* =========================================================
   TIMELINE ITEM
========================================================= */

function TimelineItem({
  icon,
  title,
  date,
  active,
}: {
  icon: string;
  title: string;
  date: string;
  active?: boolean;
}) {
  return (
    <div className="group relative flex min-w-0 flex-col items-center">

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 ${
          active
            ? "bg-violet-400/15 text-violet-300 group-hover:bg-violet-400/25 group-hover:shadow-lg group-hover:shadow-violet-400/10"
            : "bg-slate-800 text-slate-500"
        }`}
      >
        {icon}
      </div>

      <p className="mt-2 text-center text-[10px] font-bold transition-colors duration-300 group-hover:text-violet-300">
        {title}
      </p>

      <p className="mt-1 text-center text-[8px] text-slate-600">
        {date}
      </p>

    </div>
  );
}

/* =========================================================
   SUBJECT CARD
========================================================= */

function SubjectCard({
  name,
  completed,
  total,
  progress,
  icon,
}: {
  name: string;
  completed: number;
  total: number;
  progress: number;
  icon: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-slate-950/40 p-4 transition-all duration-500 hover:-translate-y-2 hover:border-violet-400/20 hover:bg-white/[0.035] hover:shadow-xl hover:shadow-violet-500/[0.04]">

      <div className="flex items-start gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 transition-all duration-300 group-hover:scale-110 group-hover:bg-violet-400/10">
          {icon}
        </div>

        <h3 className="text-xs font-semibold leading-4 text-slate-300">
          {name}
        </h3>

      </div>

      <div className="relative mx-auto mt-5 flex h-20 w-20 items-center justify-center rounded-full border-[7px] border-slate-800 transition-all duration-500 group-hover:border-violet-400/20">

        <div
          className="absolute inset-[-7px] rounded-full border-[7px] border-transparent border-t-indigo-400 border-r-violet-400 transition-transform duration-700 group-hover:rotate-180"
          style={{
            transform: `rotate(${progress * 3.6}deg)`,
          }}
        />

        <div className="text-center">

          <p className="text-lg font-black transition-transform duration-300 group-hover:scale-110">
            {progress}%
          </p>

        </div>

      </div>

      <p className="mt-4 text-center text-[10px] text-slate-500">
        {completed} / {total} Topics
      </p>

    </div>
  );
}

/* =========================================================
   LEGEND
========================================================= */

function Legend({
  color,
  text,
}: {
  color: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 transition-colors duration-300 hover:text-slate-300">

      <span
        className={`h-2.5 w-2.5 rounded-full transition-transform duration-300 hover:scale-125 ${color}`}
      />

      <span>
        {text}
      </span>

    </div>
  );
}