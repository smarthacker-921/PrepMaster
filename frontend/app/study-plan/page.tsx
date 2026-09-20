"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type StudyTask = {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  type: string;
  scheduledDate: string;
  durationMin: number;
  status: string;
};

type StudyPlan = {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  tasks: StudyTask[];
};

export default function StudyPlanPage() {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchStudyPlan = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/study-plan", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load study plan."
          );
        }

        if (!cancelled) {
          setStudyPlan(data.studyPlan);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load study plan."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStudyPlan();

    return () => {
      cancelled = true;
    };
  }, []);

  const tasks = studyPlan?.tasks ?? [];

  const completedTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.status.toLowerCase() === "completed"
    ).length;
  }, [tasks]);

  const progress =
    tasks.length > 0
      ? Math.round(
          (completedTasks / tasks.length) * 100
        )
      : 0;

  const groupedTasks = useMemo(() => {
    const groups = new Map<string, StudyTask[]>();

    for (const task of tasks) {
      const date = new Date(task.scheduledDate);

      const key = date.toISOString().split("T")[0];

      const existing = groups.get(key);

      if (existing) {
        existing.push(task);
      } else {
        groups.set(key, [task]);
      }
    }

    return Array.from(groups.entries());
  }, [tasks]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050617] text-white">

      {/* Background */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      {/* Header */}

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050617]/85 backdrop-blur-xl">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-4">

            <Link
              href="/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/[0.06] hover:text-white"
            >
              ←
            </Link>

            <div>
              <h1 className="text-lg font-bold sm:text-xl">
                Study Plan
              </h1>

              <p className="text-[11px] text-white/40">
                Your personalized preparation plan
              </p>
            </div>

          </div>

          <Link
            href="/dashboard"
            className="hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/60 transition hover:bg-white/[0.06] hover:text-white sm:block"
          >
            Dashboard
          </Link>

        </div>
      </header>

      {/* Content */}

      <div className="relative mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* Loading */}

        {loading && (
          <>
            <div className="h-44 animate-pulse rounded-3xl border border-white/10 bg-white/[0.025]" />

            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-3xl border border-white/10 bg-white/[0.025]"
                />
              ))}
            </div>
          </>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="rounded-3xl border border-red-400/20 bg-red-400/5 p-8 text-center">

            <div className="text-3xl">
              ⚠️
            </div>

            <h2 className="mt-4 text-lg font-semibold">
              Unable to load study plan
            </h2>

            <p className="mt-2 text-sm text-white/40">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium transition hover:bg-indigo-400"
            >
              Try Again
            </button>

          </div>
        )}

        {/* No Plan */}

        {!loading &&
          !error &&
          !studyPlan && (
            <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center">

              <div className="text-4xl">
                📚
              </div>

              <h2 className="mt-4 text-lg font-semibold">
                No Study Plan Found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-white/40">
                Generate your personalized study plan first
                to see your tasks here.
              </p>

              <Link
                href="/goals"
                className="mt-6 inline-block rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium transition hover:bg-indigo-400"
              >
                Set Goal
              </Link>

            </div>
          )}

        {/* Plan */}

        {!loading &&
          !error &&
          studyPlan && (
            <>
              {/* Overview */}

              <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-cyan-500/5 p-6 sm:p-8">

                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl" />

                <div className="relative">

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                      <div className="mb-2 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-emerald-300">
                        {studyPlan.status}
                      </div>

                      <h2 className="text-2xl font-bold sm:text-3xl">
                        Your Preparation Plan
                      </h2>

                      <p className="mt-2 text-sm text-white/45">
                        Complete your scheduled tasks consistently
                        to stay on track.
                      </p>

                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                      <SummaryCard
                        label="Total Tasks"
                        value={tasks.length}
                      />

                      <SummaryCard
                        label="Completed"
                        value={completedTasks}
                      />

                      <SummaryCard
                        label="Progress"
                        value={`${progress}%`}
                      />

                    </div>

                  </div>

                  {/* Progress */}

                  <div className="mt-8">

                    <div className="mb-2 flex items-center justify-between text-xs">

                      <span className="text-white/40">
                        Overall Progress
                      </span>

                      <span className="font-medium text-indigo-300">
                        {progress}%
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/5">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                        style={{
                          width: `${progress}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>
              </section>

              {/* Date Range */}

              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <InfoBox
                  label="Plan Starts"
                  value={formatDate(studyPlan.startDate)}
                />

                <InfoBox
                  label="Preparation Ends"
                  value={formatDate(studyPlan.endDate)}
                />

              </section>

              {/* Tasks */}

              <section>

                <div className="mb-5">

                  <h2 className="text-lg font-semibold">
                    Scheduled Tasks
                  </h2>

                  <p className="mt-1 text-xs text-white/40">
                    All tasks generated for your preparation
                  </p>

                </div>

                {tasks.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center">

                    <div className="text-3xl">
                      📝
                    </div>

                    <p className="mt-3 text-sm text-white/40">
                      No tasks have been generated yet.
                    </p>

                  </div>
                ) : (
                  <div className="space-y-5">

                    {groupedTasks.map(
                      ([date, dateTasks]) => (
                        <div
                          key={date}
                          className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-6"
                        >

                          {/* Date */}

                          <div className="mb-5 flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                              📅
                            </div>

                            <div>
                              <div className="text-sm font-semibold">
                                {formatDate(date)}
                              </div>

                              <div className="mt-0.5 text-[11px] text-white/35">
                                {dateTasks.length}{" "}
                                {dateTasks.length === 1
                                  ? "task"
                                  : "tasks"}
                              </div>
                            </div>

                          </div>

                          {/* Tasks */}

                          <div className="space-y-3">

                            {dateTasks.map(
                              (task) => (
                                <TaskCard
                                  key={task.id}
                                  task={task}
                                />
                              )
                            )}

                          </div>

                        </div>
                      )
                    )}

                  </div>
                )}

              </section>
            </>
          )}

      </div>

      <style jsx global>{`
        @keyframes fadeUp {
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

    </main>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">

      <div className="text-[10px] uppercase tracking-wider text-white/35">
        {label}
      </div>

      <div className="mt-1 text-xl font-bold">
        {value}
      </div>

    </div>
  );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

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
   TASK CARD
========================================================= */

function TaskCard({
  task,
}: {
  task: StudyTask;
}) {
  const completed =
    task.status.toLowerCase() === "completed";

  const inProgress =
    task.status.toLowerCase() === "in progress";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-4 transition hover:bg-white/[0.035] sm:p-5">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

        {/* Icon */}

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            completed
              ? "bg-emerald-500/10 text-emerald-300"
              : inProgress
              ? "bg-indigo-500/10 text-indigo-300"
              : "bg-violet-500/10 text-violet-300"
          }`}
        >
          {completed ? "✓" : "📖"}
        </div>

        {/* Main */}

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <span className="text-[10px] uppercase tracking-wider text-indigo-300">
              {task.subject}
            </span>

            <span className="text-white/15">
              •
            </span>

            <span className="text-[10px] uppercase tracking-wider text-white/30">
              {task.type}
            </span>

          </div>

          <h3 className="mt-1 text-sm font-semibold sm:text-base">
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/35">
              {task.description}
            </p>
          )}

        </div>

        {/* Right side */}

        <div className="flex items-center gap-3 sm:flex-col sm:items-end">

          <div className="text-xs font-medium text-white/60">
            ⏱ {task.durationMin} min
          </div>

          {completed ? (
            <StatusBadge status="COMPLETED" />
          ) : (
            <Link
              href={`/study-plan/task/${task.id}`}
              className="rounded-xl bg-indigo-500 px-4 py-2 text-xs font-medium text-white transition hover:bg-indigo-400"
            >
              Start Lecture
            </Link>
          )}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized = status.toLowerCase();

  const completed =
    normalized === "completed";

  const progress =
    normalized === "in progress";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] ${
        completed
          ? "bg-emerald-500/10 text-emerald-300"
          : progress
          ? "bg-indigo-500/10 text-indigo-300"
          : "bg-white/[0.05] text-white/40"
      }`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}