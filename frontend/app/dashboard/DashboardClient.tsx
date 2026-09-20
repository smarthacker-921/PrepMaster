"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

/* =========================================================
   TYPES
========================================================= */

type DashboardGoal = {
  id: string;
  type: string;
  option: string | null;
  subjects: string[];
};

type DashboardClientProps = {
  user: {
    name: string;
    email: string;
  };
  goal: DashboardGoal | null;
};

type RawStudyTask = {
  id?: string;
  subject?: string | null;
  topic?: string | null;
  title?: string | null;
  taskTitle?: string | null;
  progress?: number | null;
  completionPercentage?: number | null;
  completed?: boolean | null;
  status?: string | null;
  type?: string | null;
  taskType?: string | null;
  date?: string | null;
  scheduledDate?: string | null;
  dueDate?: string | null;
  [key: string]: unknown;
};

type StudyPlanData = {
  id?: string;
  userId?: string;
  tasks?: RawStudyTask[];
  [key: string]: unknown;
};

type DashboardStudyTask = {
  id: string;
  subject: string;
  topic: string;
  progress: number;
  status: string;
  color: string;
};

/* =========================================================
   STATIC DATA
   These sections are intentionally kept unchanged.
========================================================= */

const upcomingTests = [
  {
    subject: "DBMS",
    topic: "ER Model & Relational Model",
    date: "28 Aug",
    questions: 20,
    duration: "20 min",
  },
  {
    subject: "Operating System",
    topic: "Process Scheduling",
    date: "31 Aug",
    questions: 15,
    duration: "15 min",
  },
  {
    subject: "DSA",
    topic: "Linked List",
    date: "03 Sep",
    questions: 25,
    duration: "25 min",
  },
];

const subjects = [
  {
    name: "Database Management System",
    short: "DBMS",
    progress: 68,
    topics: "17 / 25 Topics",
    color: "indigo",
  },
  {
    name: "Operating System",
    short: "OS",
    progress: 52,
    topics: "13 / 25 Topics",
    color: "violet",
  },
  {
    name: "Data Structures & Algorithms",
    short: "DSA",
    progress: 41,
    topics: "8 / 20 Topics",
    color: "cyan",
  },
  {
    name: "Computer Networks",
    short: "CN",
    progress: 35,
    topics: "7 / 20 Topics",
    color: "emerald",
  },
];

const weekData = [
  { day: "Mon", completed: 3, total: 4 },
  { day: "Tue", completed: 4, total: 4 },
  { day: "Wed", completed: 2, total: 4 },
  { day: "Thu", completed: 4, total: 4 },
  { day: "Fri", completed: 3, total: 4 },
  { day: "Sat", completed: 1, total: 3 },
  { day: "Sun", completed: 0, total: 3 },
];

const calendarDays = [
  { day: 1, status: "done" },
  { day: 2, status: "done" },
  { day: 3, status: "done" },
  { day: 4, status: "done" },
  { day: 5, status: "done" },
  { day: 6, status: "done" },
  { day: 7, status: "done" },
  { day: 8, status: "done" },
  { day: 9, status: "done" },
  { day: 10, status: "done" },
  { day: 11, status: "done" },
  { day: 12, status: "done" },
  { day: 13, status: "done" },
  { day: 14, status: "done" },
  { day: 15, status: "done" },
  { day: 16, status: "done" },
  { day: 17, status: "done" },
  { day: 18, status: "done" },
  { day: 19, status: "done" },
  { day: 20, status: "done" },
  { day: 21, status: "done" },
  { day: 22, status: "done" },
  { day: 23, status: "done" },
  { day: 24, status: "today" },
  { day: 25, status: "upcoming" },
  { day: 26, status: "upcoming" },
  { day: 27, status: "upcoming" },
  { day: 28, status: "upcoming" },
  { day: 29, status: "upcoming" },
  { day: 30, status: "upcoming" },
  { day: 31, status: "upcoming" },
];

/* =========================================================
   HELPERS
========================================================= */

function clampProgress(value: unknown): number {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(numberValue)));
}

function getTaskProgress(task: RawStudyTask): number {
  if (task.completed === true) {
    return 100;
  }

  if (task.progress !== null && task.progress !== undefined) {
    return clampProgress(task.progress);
  }

  if (
    task.completionPercentage !== null &&
    task.completionPercentage !== undefined
  ) {
    return clampProgress(task.completionPercentage);
  }

  return 0;
}

function getTaskStatus(task: RawStudyTask, progress: number): string {
  if (task.status) {
    return String(task.status);
  }

  if (task.completed === true || progress >= 100) {
    return "Completed";
  }

  if (progress > 0) {
    return "In Progress";
  }

  return "Pending";
}

function getTaskSubject(task: RawStudyTask): string {
  return (
    String(task.subject ?? "").trim() ||
    "Study"
  );
}

function getTaskTopic(task: RawStudyTask): string {
  return (
    String(
      task.topic ??
        task.title ??
        task.taskTitle ??
        ""
    ).trim() ||
    "Today's Study Task"
  );
}

function getTaskColor(index: number): string {
  const colors = ["indigo", "violet", "cyan", "emerald"];

  return colors[index % colors.length];
}

function normalizeStudyTasks(
  tasks: RawStudyTask[]
): DashboardStudyTask[] {
  return tasks.map((task, index) => {
    const progress = getTaskProgress(task);

    return {
      id: String(task.id ?? `study-task-${index}`),
      subject: getTaskSubject(task),
      topic: getTaskTopic(task),
      progress,
      status: getTaskStatus(task, progress),
      color: getTaskColor(index),
    };
  });
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function DashboardClient({
  user,
  goal,
}: DashboardClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(24);
  const [greeting, setGreeting] = useState("Good Morning");

  /* -------------------------------------------------------
     REAL STUDY PLAN STATE
  ------------------------------------------------------- */

  const [studyPlan, setStudyPlan] =
    useState<StudyPlanData | null>(null);

  const [studyPlanLoading, setStudyPlanLoading] =
    useState(true);

  const [studyPlanError, setStudyPlanError] =
    useState("");

  /* -------------------------------------------------------
     GREETING
  ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     FETCH REAL STUDY PLAN
  ------------------------------------------------------- */

  useEffect(() => {
    let cancelled = false;

    const fetchStudyPlan = async () => {
      try {
        setStudyPlanLoading(true);
        setStudyPlanError("");

        const response = await fetch("/api/study-plan", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch study plan."
          );
        }

        if (!cancelled) {
          setStudyPlan(data.studyPlan ?? null);

          console.log(
            "REAL STUDY PLAN:",
            data.studyPlan
          );
        }
      } catch (error) {
        if (!cancelled) {
          setStudyPlanError(
            error instanceof Error
              ? error.message
              : "Failed to fetch study plan."
          );
        }
      } finally {
        if (!cancelled) {
          setStudyPlanLoading(false);
        }
      }
    };

    fetchStudyPlan();

    return () => {
      cancelled = true;
    };
  }, []);

  /* -------------------------------------------------------
     REAL TASKS
  ------------------------------------------------------- */

  const realStudyTasks = useMemo(() => {
    if (!studyPlan?.tasks) {
      return [];
    }

    return normalizeStudyTasks(studyPlan.tasks);
  }, [studyPlan]);

  /*
     Until API data loads, don't show fake tasks.
     This prevents old hardcoded data from being mistaken
     for database data.
  */
  const displayStudyTasks = realStudyTasks.slice(0, 3);

  /* -------------------------------------------------------
     REAL DAILY PROGRESS
  ------------------------------------------------------- */

  const completedTasks = useMemo(() => {
    return displayStudyTasks.filter(
      (task) =>
        task.progress >= 100 ||
        task.status.toLowerCase() === "completed"
    ).length;
  }, [displayStudyTasks]);

  const totalTasks = displayStudyTasks.length;

  const dailyProgress =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  /* -------------------------------------------------------
     REAL OVERALL PROGRESS
  ------------------------------------------------------- */

  const overallProgress = useMemo(() => {
    if (displayStudyTasks.length === 0) {
      return 0;
    }

    const total = displayStudyTasks.reduce(
      (sum, task) => sum + task.progress,
      0
    );

    return Math.round(
      total / displayStudyTasks.length
    );
  }, [displayStudyTasks]);

  const goalLabel = goal
    ? goal.option
      ? `${goal.type} ${goal.option}`
      : goal.type
    : "No Goal Set";

  const studentName = user.name;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#050617] text-white overflow-hidden">

      {/* =================================================
          BACKGROUND ORBS
      ================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-white/10 bg-[#07091c]/95 backdrop-blur-xl transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-20 items-center border-b border-white/10 px-6">
          <div>
            <div className="text-xl font-bold tracking-tight">
              Prep<span className="text-indigo-400">Master</span>
            </div>

            <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">
              Smart Study
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          <SidebarItem
            href="/dashboard"
            label="Dashboard"
            icon="⌂"
            active
          />

          <SidebarItem
            href="/study-plan"
            label="Study Plan"
            icon="◫"
          />

          <SidebarItem
            href="/subjects"
            label="Subjects"
            icon="▣"
          />

          <SidebarItem
            href="/tests"
            label="Tests"
            icon="✓"
          />

          <SidebarItem
            href="/progress"
            label="Progress"
            icon="◔"
          />

          <SidebarItem
            href="/ai-assistant"
            label="AI Assistant"
            icon="✦"
          />

          <SidebarItem
            href="/achievements"
            label="Achievements"
            icon="◆"
          />

          <SidebarItem
            href="/reminders"
            label="Reminders"
            icon="◷"
          />

          <SidebarItem
            href="/settings"
            label="Settings"
            icon="⚙"
          />
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-2 text-xs text-white/40">
              Current Goal
            </div>

            <div className="truncate text-sm font-semibold">
              {goalLabel}
            </div>

            <div className="mt-1 text-xs text-white/40">
              Keep going 🚀
            </div>
          </div>
        </div>
      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="relative min-h-screen lg:ml-64">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#050617]/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">

            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 lg:hidden"
              aria-label="Open sidebar"
            >
              ☰
            </button>

            <div className="hidden md:block">
              <div className="text-sm text-white/40">
                {greeting},
              </div>

              <div className="text-lg font-semibold">
                {studentName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <div className="hidden items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 sm:flex">
              <span>🔥</span>
              <span className="text-sm font-semibold text-orange-300">
                7 Day Streak
              </span>
            </div>

            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm font-bold">
              {studentName.charAt(0).toUpperCase()}
            </button>
          </div>
        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">

          {/* =================================================
              WELCOME CARD
          ================================================= */}

          <section className="dashboard-enter relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-cyan-500/5 p-6 sm:p-8">

            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative">

              <div className="mb-2 text-sm font-medium text-indigo-300">
                🎯 {goalLabel}
              </div>

              <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                {greeting}, {studentName}! 👋
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
                Stay consistent, complete today&apos;s tasks,
                and keep moving toward your exam goal.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

                <InfoCard
                  label="Target Date"
                  value="12 May 2027"
                />

                <InfoCard
                  label="Syllabus Ends"
                  value="07 May 2027"
                />

                <InfoCard
                  label="Revision"
                  value="08 May 2027"
                />

              </div>
            </div>
          </section>

          {/* =================================================
              PROGRESS OVERVIEW
          ================================================= */}

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 xl:col-span-1">

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">
                    Overall Progress
                  </h2>

                  <p className="mt-1 text-xs text-white/40">
                    Based on your generated study plan
                  </p>
                </div>

                <div className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
                  {overallProgress}%
                </div>
              </div>

              <div className="flex items-center justify-center py-4">

                <div className="relative h-44 w-44">

                  <svg
                    className="h-full w-full -rotate-90"
                    viewBox="0 0 120 120"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-white/5"
                    />

                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray="314"
                      strokeDashoffset={
                        314 -
                        (314 * overallProgress) / 100
                      }
                      className="text-indigo-400 transition-all duration-700"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold">
                      {overallProgress}%
                    </div>

                    <div className="text-xs text-white/40">
                      Completed
                    </div>
                  </div>

                </div>
              </div>

              <div className="mt-4 text-center text-sm text-white/40">
                {displayStudyTasks.length} study tasks loaded
              </div>
            </div>

            {/* =================================================
                TODAY STUDY PLAN
            ================================================= */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 xl:col-span-2">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <h2 className="font-semibold">
                    Today&apos;s Study Plan
                  </h2>

                  <p className="mt-1 text-xs text-white/40">
                    Your tasks from the generated study plan
                  </p>
                </div>

                <Link
                  href="/study-plan"
                  className="text-xs font-medium text-indigo-300 transition hover:text-indigo-200"
                >
                  View Plan →
                </Link>

              </div>

              {/* LOADING */}

              {studyPlanLoading && (
                <div className="space-y-3">

                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-24 animate-pulse rounded-2xl border border-white/5 bg-white/[0.03]"
                    />
                  ))}

                </div>
              )}

              {/* ERROR */}

              {!studyPlanLoading &&
                studyPlanError && (
                  <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5">

                    <div className="text-sm font-semibold text-red-300">
                      Unable to load study plan
                    </div>

                    <div className="mt-1 text-xs text-white/40">
                      {studyPlanError}
                    </div>

                  </div>
                )}

              {/* EMPTY */}

              {!studyPlanLoading &&
                !studyPlanError &&
                displayStudyTasks.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">

                    <div className="text-3xl">
                      📚
                    </div>

                    <div className="mt-3 text-sm font-semibold">
                      No study tasks found
                    </div>

                    <p className="mt-1 text-xs text-white/40">
                      Generate a study plan to see your tasks here.
                    </p>

                  </div>
                )}

              {/* REAL TASKS */}

              {!studyPlanLoading &&
                !studyPlanError &&
                displayStudyTasks.length > 0 && (
                  <div className="space-y-3">

                    {displayStudyTasks.map(
                      (task, index) => (
                        <div
                          key={task.id}
                          className="dashboard-enter"
                          style={{
                            animationDelay: `${
                              330 + index * 80
                            }ms`,
                          }}
                        >
                          <StudyTask {...task} />
                        </div>
                      )
                    )}

                  </div>
                )}

            </div>
          </section>

          {/* =================================================
              DAILY GOAL + CALENDAR
          ================================================= */}

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* DAILY GOAL */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="font-semibold">
                    Daily Goal Progress
                  </h2>

                  <p className="mt-1 text-xs text-white/40">
                    Today&apos;s study tasks
                  </p>
                </div>

                <div className="text-sm font-semibold text-indigo-300">
                  {completedTasks} / {totalTasks}
                </div>

              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/5">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                  style={{
                    width: `${dailyProgress}%`,
                  }}
                />

              </div>

              <div className="mt-3 flex justify-between text-xs text-white/40">

                <span>
                  {dailyProgress}% completed
                </span>

                <span>
                  {totalTasks > 0
                    ? "Keep going!"
                    : "No tasks yet"}
                </span>

              </div>
            </div>

            {/* CALENDAR */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 xl:col-span-2">

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <h2 className="font-semibold">
                    Study Calendar
                  </h2>

                  <p className="mt-1 text-xs text-white/40">
                    August 2026
                  </p>
                </div>

                <div className="flex gap-2 text-xs text-white/40">
                  <Legend
                    label="Completed"
                    type="done"
                  />

                  <Legend
                    label="Today"
                    type="today"
                  />
                </div>

              </div>

              <div className="grid grid-cols-7 gap-2">

                {[
                  "M",
                  "T",
                  "W",
                  "T",
                  "F",
                  "S",
                  "S",
                ].map((day, index) => (
                  <div
                    key={`${day}-${index}`}
                    className="pb-1 text-center text-[10px] font-medium text-white/30"
                  >
                    {day}
                  </div>
                ))}

                {calendarDays.map((item) => (
                  <button
                    key={item.day}
                    onClick={() =>
                      setSelectedDate(item.day)
                    }
                    className={`aspect-square rounded-lg text-xs transition ${
                      selectedDate === item.day
                        ? "bg-indigo-500 font-semibold text-white"
                        : item.status === "done"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : item.status === "today"
                        ? "border border-indigo-400/40 bg-indigo-500/10 text-indigo-300"
                        : "bg-white/[0.025] text-white/30 hover:bg-white/[0.05]"
                    }`}
                  >
                    {item.day}
                  </button>
                ))}

              </div>
            </div>
          </section>

          {/* =================================================
              STATS
          ================================================= */}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Topics Completed"
              value="38 / 90"
              progress={42}
              icon="📚"
            />

            <StatCard
              title="Tests Completed"
              value="24 / 60"
              progress={40}
              icon="✓"
            />

            <StatCard
              title="Average Score"
              value="68%"
              progress={68}
              icon="◔"
            />

            <StatCard
              title="Current Streak"
              value="7 Days"
              progress={70}
              icon="🔥"
            />

          </section>

          {/* =================================================
              TIMELINE
          ================================================= */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">

            <div className="mb-8">
              <h2 className="font-semibold">
                Preparation Timeline
              </h2>

              <p className="mt-1 text-xs text-white/40">
                Your journey toward the target exam
              </p>
            </div>

            <div className="relative space-y-8">

              <div className="absolute left-[9px] top-3 h-[calc(100%-24px)] w-px bg-white/10" />

              <TimelineItem
                title="Preparation Started"
                date="09 Jan 2026"
                description="Your preparation journey began."
                status="completed"
              />

              <TimelineItem
                title="Syllabus Ends"
                date="07 May 2027"
                description="Complete all planned syllabus topics."
                status="current"
              />

              <TimelineItem
                title="Revision"
                date="08–12 May 2027"
                description="Final revision and practice phase."
                status="upcoming"
              />

              <TimelineItem
                title="Exam"
                date="12 May 2027"
                description="Target exam date."
                status="upcoming"
              />

            </div>
          </section>

          {/* =================================================
              WEEKLY ACTIVITY
          ================================================= */}

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 xl:col-span-2">

              <div className="mb-8">

                <h2 className="font-semibold">
                  Weekly Study Activity
                </h2>

                <p className="mt-1 text-xs text-white/40">
                  Tasks completed during the week
                </p>

              </div>

              <div className="flex h-64 items-end justify-between gap-3">

                {weekData.map((item) => {

                  const percentage =
                    item.total > 0
                      ? (item.completed /
                          item.total) *
                        100
                      : 0;

                  return (
                    <div
                      key={item.day}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                    >
                      <div className="relative flex h-full w-full items-end justify-center">

                        <div
                          className="w-full max-w-10 rounded-t-xl bg-gradient-to-t from-indigo-500/60 to-cyan-400/70 transition-all"
                          style={{
                            height: `${Math.max(
                              percentage,
                              5
                            )}%`,
                          }}
                        />

                      </div>

                      <div className="text-[11px] text-white/40">
                        {item.day}
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>

            {/* MOTIVATION */}

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-indigo-500/5 p-6">

              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative">

                <div className="mb-5 text-3xl">
                  ✨
                </div>

                <h2 className="text-lg font-semibold">
                  Keep Going!
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/50">
                  Consistency is more powerful than
                  motivation. Complete today&apos;s tasks
                  and keep your streak alive.
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-sm italic leading-6 text-white/70">
                    &quot;Small progress every day adds up
                    to big results.&quot;
                  </p>
                </div>

              </div>
            </div>

          </section>

          {/* =================================================
              UPCOMING TESTS
          ================================================= */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="font-semibold">
                  Upcoming Tests
                </h2>

                <p className="mt-1 text-xs text-white/40">
                  Test yourself after completing lectures
                </p>
              </div>

              <Link
                href="/tests"
                className="text-xs text-indigo-300 hover:text-indigo-200"
              >
                View All →
              </Link>

            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

              {upcomingTests.map((test) => (
                <div
                  key={`${test.subject}-${test.topic}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:bg-white/[0.04]"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <div className="text-sm font-semibold">
                        {test.subject}
                      </div>

                      <div className="mt-1 text-xs leading-5 text-white/40">
                        {test.topic}
                      </div>
                    </div>

                    <div className="rounded-lg bg-indigo-500/10 px-2 py-1 text-[10px] text-indigo-300">
                      {test.date}
                    </div>

                  </div>

                  <div className="mt-5 flex items-center justify-between text-[11px] text-white/35">

                    <span>
                      {test.questions} Questions
                    </span>

                    <span>
                      {test.duration}
                    </span>

                  </div>

                </div>
              ))}

            </div>
          </section>

          {/* =================================================
              SUBJECT PROGRESS
          ================================================= */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">

            <div className="mb-6">

              <h2 className="font-semibold">
                Subject Progress
              </h2>

              <p className="mt-1 text-xs text-white/40">
                Track your progress across subjects
              </p>

            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.name}
                  {...subject}
                />
              ))}

            </div>
          </section>

        </div>
      </main>

      {/* =================================================
          GLOBAL ANIMATIONS
      ================================================= */}

      <style jsx global>{`
        .dashboard-enter {
          animation: dashboardEnter 0.55s ease-out both;
        }

        @keyframes dashboardEnter {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  href,
  label,
  icon,
  active = false,
}: {
  href: string;
  label: string;
  icon: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
        active
          ? "bg-indigo-500/10 text-indigo-300"
          : "text-white/50 hover:bg-white/[0.04] hover:text-white"
      }`}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm ${
          active
            ? "bg-indigo-500/15"
            : "bg-white/[0.03] group-hover:bg-white/[0.06]"
        }`}
      >
        {icon}
      </span>

      <span>{label}</span>
    </Link>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
      <div className="text-[10px] uppercase tracking-wider text-white/35">
        {label}
      </div>

      <div className="mt-2 text-sm font-semibold">
        {value}
      </div>
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
  const colorClasses: Record<
    string,
    {
      bg: string;
      text: string;
      progress: string;
    }
  > = {
    indigo: {
      bg: "bg-indigo-500/10",
      text: "text-indigo-300",
      progress: "bg-indigo-500",
    },
    violet: {
      bg: "bg-violet-500/10",
      text: "text-violet-300",
      progress: "bg-violet-500",
    },
    cyan: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-300",
      progress: "bg-cyan-500",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-300",
      progress: "bg-emerald-500",
    },
  };

  const selectedColor =
    colorClasses[color] ?? colorClasses.indigo;

  return (
    <div
      className="
        group rounded-2xl border border-white/10
        bg-white/[0.02] p-4
        transition-all duration-300
        hover:border-white/15
        hover:bg-white/[0.045]
      "
    >
      <div className="flex items-start gap-4">

        {/* ICON */}
        <div
          className={`
            flex h-11 w-11 shrink-0 items-center justify-center
            rounded-xl ${selectedColor.bg} ${selectedColor.text}
            transition-transform duration-300
            group-hover:scale-105
          `}
        >
          📖
        </div>

        <div className="min-w-0 flex-1">

          {/* SUBJECT + STATUS */}
          <div className="flex flex-wrap items-start justify-between gap-2">

            <div className="min-w-0">

              {/* SUBJECT */}
              <div
                className={`text-[11px] font-medium uppercase tracking-wide ${selectedColor.text}`}
              >
                {subject}
              </div>

              {/* TOPIC */}
              <div className="mt-1 text-sm font-semibold leading-5">
                {topic}
              </div>

              {/* LEARNING DESCRIPTION */}
              <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-white/35">
                <span>🎥</span>
                <span>Topic to study today</span>
              </div>

            </div>

            {/* STATUS */}
            <div
              className={`
                shrink-0 rounded-full px-2.5 py-1
                text-[10px] ${selectedColor.bg}
                ${selectedColor.text}
              `}
            >
              {status}
            </div>

          </div>

          {/* PROGRESS */}
          <div className="mt-4">

            <div className="mb-2 flex items-center justify-between text-[10px] text-white/35">
              <span>Learning Progress</span>
              <span>{progress}%</span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">

              <div
                className={`
                  h-full rounded-full
                  ${selectedColor.progress}
                  transition-all duration-700
                `}
                style={{
                  width: `${Math.min(
                    Math.max(progress, 0),
                    100
                  )}%`,
                }}
              />

            </div>
          </div>

          {/* STUDY FLOW */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-white/30">

            <span
              className={
                progress > 0
                  ? "text-white/55"
                  : ""
              }
            >
              🎥 Lecture
            </span>

            <span>→</span>

            <span>📝 Quiz</span>

            <span>→</span>

            <span>✓ Complete</span>

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
  title,
  value,
  progress,
  icon,
}: {
  title: string;
  value: string;
  progress: number;
  icon: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">

      <div className="flex items-start justify-between">

        <div>
          <div className="text-xs text-white/40">
            {title}
          </div>

          <div className="mt-2 text-xl font-bold">
            {value}
          </div>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
          {icon}
        </div>

      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/5">

        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
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
  title,
  date,
  description,
  status,
}: {
  title: string;
  date: string;
  description: string;
  status: "completed" | "current" | "upcoming";
}) {
  const statusClass =
    status === "completed"
      ? "bg-emerald-400"
      : status === "current"
      ? "bg-indigo-400"
      : "bg-white/20";

  return (
    <div className="relative flex gap-5">

      <div
        className={`relative z-10 mt-1 h-5 w-5 shrink-0 rounded-full border-4 border-[#050617] ${statusClass}`}
      />

      <div className="flex-1">

        <div className="flex flex-wrap items-center justify-between gap-2">

          <div className="text-sm font-semibold">
            {title}
          </div>

          <div className="text-xs text-white/35">
            {date}
          </div>

        </div>

        <p className="mt-1 text-xs leading-5 text-white/40">
          {description}
        </p>

      </div>
    </div>
  );
}

/* =========================================================
   SUBJECT CARD
========================================================= */

function SubjectCard({
  name,
  short,
  progress,
  topics,
  color,
}: {
  name: string;
  short: string;
  progress: number;
  topics: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    indigo: "bg-indigo-500",
    violet: "bg-violet-500",
    cyan: "bg-cyan-500",
    emerald: "bg-emerald-500",
  };

  const progressColor =
    colorClasses[color] ?? colorClasses.indigo;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] text-xs font-bold">
          {short}
        </div>

        <div className="min-w-0 flex-1">

          <div className="truncate text-sm font-semibold">
            {name}
          </div>

          <div className="mt-1 text-xs text-white/35">
            {topics}
          </div>

        </div>

        <div className="text-sm font-semibold">
          {progress}%
        </div>

      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">

        <div
          className={`h-full rounded-full ${progressColor}`}
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </div>
  );
}

/* =========================================================
   LEGEND
========================================================= */

function Legend({
  label,
  type,
}: {
  label: string;
  type: "done" | "today";
}) {
  return (
    <div className="flex items-center gap-1.5">

      <span
        className={`h-2 w-2 rounded-full ${
          type === "done"
            ? "bg-emerald-400"
            : "bg-indigo-400"
        }`}
      />

      <span>{label}</span>

    </div>
  );
}