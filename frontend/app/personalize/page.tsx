"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const levels = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const jeeSubjects = [
  "Physics",
  "Chemistry",
  "Mathematics",
];

const neetSubjects = [
  "Physics",
  "Chemistry",
  "Botany",
  "Zoology",
];

export default function PersonalizePage() {
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const [level, setLevel] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);

  /* =====================================================
     LOAD GOAL FROM GOALS PAGE
     ===================================================== */

  useEffect(() => {
    const savedGoal = localStorage.getItem("prepMasterGoal");

    if (!savedGoal) {
      window.location.href = "/goals";
      return;
    }

    try {
      const data = JSON.parse(savedGoal);

      setSelectedGoal(data.goal || "");
      setSelectedOption(data.option || "");
    } catch (error) {
      console.error("Unable to read saved goal:", error);

      window.location.href = "/goals";
      return;
    }

    setLoading(false);
  }, []);

  /* =====================================================
     MINIMUM PREPARATION DAYS
     ===================================================== */

  const getMinimumDays = () => {
    if (
      selectedGoal === "GATE" ||
      selectedGoal === "JEE" ||
      selectedGoal === "NEET"
    ) {
      return 120;
    }

    if (selectedGoal === "Coding") {
      return 60;
    }

    if (selectedGoal === "College Exam") {
      return 25;
    }

    return 0;
  };

  /* =====================================================
     MINIMUM TARGET DATE
     ===================================================== */

  const getMinimumTargetDate = () => {
    const date = new Date();

    date.setHours(0, 0, 0, 0);

    date.setDate(
      date.getDate() + getMinimumDays()
    );

    return date.toISOString().split("T")[0];
  };

  /* =====================================================
     TOGGLE STUDY DAY
     ===================================================== */

  const toggleDay = (day: string) => {
    setSelectedDays((previous) =>
      previous.includes(day)
        ? previous.filter((item) => item !== day)
        : [...previous, day]
    );
  };

  /* =====================================================
     GOAL ICON
     ===================================================== */

  const goalIcon =
    selectedGoal === "JEE"
      ? "🚀"
      : selectedGoal === "NEET"
        ? "🩺"
        : selectedGoal === "GATE"
          ? "🎯"
          : selectedGoal === "Coding"
            ? "💻"
            : selectedGoal === "College Exam"
              ? "📚"
              : "🎯";

  /* =====================================================
     COMPULSORY SUBJECTS
     ===================================================== */

  const subjects =
    selectedGoal === "JEE"
      ? jeeSubjects
      : selectedGoal === "NEET"
        ? neetSubjects
        : [];

  /* =====================================================
     TARGET DATE VALIDATION
     ===================================================== */

  const isTargetDateValid =
    targetDate === "" ||
    targetDate >= getMinimumTargetDate();

  /* =====================================================
     FORM VALIDATION
     ===================================================== */

  const isComplete =
    selectedGoal !== "" &&
    level !== "" &&
    targetDate !== "" &&
    isTargetDateValid &&
    selectedDays.length > 0;

  /* =====================================================
     CREATE PLAN
     ===================================================== */

  const handleCreatePlan = () => {
    if (!isComplete) return;

    /*
      Final 5 days are reserved for revision.
      Therefore actual preparation ends 5 days
      before the target date.
    */

    const target = new Date(targetDate);

    target.setHours(0, 0, 0, 0);

    const preparationEnd = new Date(target);

    preparationEnd.setDate(
      preparationEnd.getDate() - 5
    );

    const preparationEndDate =
      preparationEnd.toISOString().split("T")[0];

    const studyPreferences = {
      goal: selectedGoal,
      option: selectedOption,

      level,

      targetDate,

      preparationEndDate,

      studyDays: selectedDays,

      syllabusFileName:
        syllabusFile?.name || null,

      planningRule: {
        minimumPreparationDays: getMinimumDays(),
        preparationCompletionDaysBeforeTarget: 5,
        revisionDays: 5,
      },
    };

    localStorage.setItem(
      "prepMasterPreferences",
      JSON.stringify(studyPreferences)
    );

    alert(
      "Your study preferences have been saved successfully!"
    );
  };

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="mt-4 text-sm text-slate-400">
            Loading your preparation...
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">

      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div className="pointer-events-none fixed -left-40 -top-40 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="pointer-events-none fixed -right-40 top-1/3 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />

      <div className="pointer-events-none fixed bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      {/* =====================================================
          NAVBAR
          ===================================================== */}

      <nav className="relative z-10 flex items-center justify-between px-4 py-5 sm:px-8 md:px-12">

        <Link
          href="/"
          className="text-2xl font-black tracking-tight transition duration-300 hover:scale-105"
        >
          <span className="text-orange-400">
            Prep
          </span>

          <span className="text-blue-400">
            Master
          </span>
        </Link>

        <Link
          href="/goals"
          className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-300 backdrop-blur transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"
        >
          ← Change Goal
        </Link>

      </nav>

      {/* =====================================================
          MAIN
          ===================================================== */}

      <section className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6 md:pt-10">

        {/* =====================================================
            HEADING
            ===================================================== */}

        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs text-slate-300 backdrop-blur sm:text-sm">

            ✨ Personalize your preparation

          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
             Build Your Study Plan
            </span>

          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base md:text-lg">

            Tell PrepMaster a little about your preparation and
            we&apos;ll organize your study journey around your goal.

          </p>

        </div>

        {/* =====================================================
            SELECTED GOAL
            ===================================================== */}

        <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-2xl backdrop-blur-xl sm:p-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs uppercase tracking-wider text-slate-500">
                Your Selected Goal
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3">

                <span className="text-3xl">
                  {goalIcon}
                </span>

                <h2 className="text-2xl font-bold">
                  {selectedGoal}
                </h2>

                {selectedOption && (
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                    {selectedOption}
                  </span>
                )}

              </div>

            </div>

            <Link
              href="/goals"
              className="text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              Change Goal →
            </Link>

          </div>

          {/* =====================================================
              JEE / NEET SUBJECTS
              ===================================================== */}

          {subjects.length > 0 && (
            <div className="mt-6 border-t border-slate-800 pt-5">

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <h3 className="font-semibold">
                    Compulsory Subjects
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    These subjects are automatically included in your plan.
                  </p>

                </div>

                <span className="w-fit rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                  Automatically Included
                </span>

              </div>

              <div className="mt-4 flex flex-wrap gap-2">

                {subjects.map((subject) => (
                  <span
                    key={subject}
                    className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-2 text-sm text-green-300"
                  >
                    ✓ {subject}
                  </span>
                ))}

              </div>

            </div>
          )}

        </div>

        {/* =====================================================
            PERSONALIZATION
            ===================================================== */}

        <div className="mt-6 space-y-6">

          {/* =====================================================
              STEP 1 - CURRENT LEVEL
              ===================================================== */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-xl backdrop-blur-xl sm:p-7">

            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Step 1
            </p>

            <h2 className="mt-2 text-xl font-bold sm:text-2xl">
              What is your current preparation level?
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              This helps PrepMaster decide how your preparation should begin.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">

              {levels.map((item) => {

                const selected =
                  level === item;

                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setLevel(item)}
                    className={`rounded-xl border px-4 py-4 text-sm font-semibold transition-all duration-300 ${
                      selected
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-300 shadow-lg"
                        : "border-slate-700 bg-slate-950/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
                    }`}
                  >

                    <span className="mr-2">
                      {selected ? "✓" : "○"}
                    </span>

                    {item}

                  </button>
                );
              })}

            </div>

          </div>

          {/* =====================================================
              STEP 2 - TARGET DATE
              ===================================================== */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-xl backdrop-blur-xl sm:p-7">

            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Step 2
            </p>

            <h2 className="mt-2 text-xl font-bold sm:text-2xl">
              When is your target date?
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              PrepMaster will calculate your preparation timeline
              from this date and make sure there is enough time
              to complete your preparation.
            </p>

            <div className="mt-5">

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Target / Exam Date
              </label>

              <input
                type="date"
                value={targetDate}
                min={getMinimumTargetDate()}
                onChange={(e) =>
                  setTargetDate(e.target.value)
                }
                className={`w-full max-w-sm rounded-xl border bg-slate-950/70 px-4 py-3.5 text-white outline-none transition focus:ring-2 focus:ring-cyan-400/10 ${
                  targetDate !== "" &&
                  !isTargetDateValid
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-700 focus:border-cyan-400"
                }`}
              />

            </div>

            {/* =====================================================
                MINIMUM DATE INFORMATION
                ===================================================== */}

            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">

              <div className="flex gap-3">

                <span className="text-xl">
                  📅
                </span>

                <div>

                  <h3 className="text-sm font-bold text-cyan-300">
                    Minimum Preparation Window
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-400">

                    For{" "}

                    <span className="font-semibold text-slate-300">
                      {selectedGoal}
                    </span>
                    , your target date must be at least{" "}

                    <span className="font-semibold text-slate-300">
                      {getMinimumDays()} days
                    </span>{" "}

                    from today.

                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">

                    Earliest allowed target date:{" "}

                    <span className="font-semibold text-slate-400">
                      {getMinimumTargetDate()}
                    </span>

                  </p>

                </div>

              </div>

            </div>

            {/* =====================================================
                PREPARATION + REVISION RULE
                ===================================================== */}

            <div className="mt-4 rounded-2xl border border-orange-400/20 bg-orange-400/5 p-4">

              <div className="flex gap-3">

                <span className="text-xl">
                  🔄
                </span>

                <div>

                  <h3 className="text-sm font-bold text-orange-300">
                    PrepMaster Planning Rule
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-400">

                    Your syllabus and preparation will be completed
                    <span className="font-semibold text-slate-300">
                      {" "}5 days before{" "}
                    </span>
                    the target date.

                    The final{" "}

                    <span className="font-semibold text-slate-300">
                      5 days
                    </span>{" "}

                    will be reserved for revision.

                  </p>

                </div>

              </div>

            </div>

            {/* INVALID DATE WARNING */}

            {targetDate !== "" &&
              !isTargetDateValid && (
                <p className="mt-3 text-sm font-medium text-red-400">
                  ⚠️ Please select a target date at least{" "}
                  {getMinimumDays()} days from today.
                </p>
              )}

          </div>

          {/* =====================================================
              STEP 3 - STUDY DAYS
              ===================================================== */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-xl backdrop-blur-xl sm:p-7">

            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Step 3
            </p>

            <h2 className="mt-2 text-xl font-bold sm:text-2xl">
              Which days can you study?
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Select all the days you are normally available for preparation.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">

              {weekDays.map((day) => {

                const selected =
                  selectedDays.includes(day);

                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() =>
                      toggleDay(day)
                    }
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition-all duration-300 ${
                      selected
                        ? "border-green-400 bg-green-400/10 text-green-300 shadow-lg"
                        : "border-slate-700 bg-slate-950/50 text-slate-400 hover:border-slate-500 hover:bg-slate-800"
                    }`}
                  >

                    {selected ? "✓ " : ""}

                    {day.slice(0, 3)}

                  </button>
                );
              })}

            </div>

            {selectedDays.length > 0 && (
              <p className="mt-4 text-xs text-slate-500">
                {selectedDays.length} day
                {selectedDays.length > 1
                  ? "s"
                  : ""}{" "}
                selected
              </p>
            )}

          </div>

          {/* =====================================================
              COLLEGE SYLLABUS
              ===================================================== */}

          {selectedGoal === "College Exam" && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-xl backdrop-blur-xl sm:p-7">

              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Step 4
              </p>

              <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                Upload your syllabus
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">

                Upload your college syllabus so PrepMaster
                can understand your subjects and organize
                your preparation.

              </p>

              <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 px-5 py-10 text-center transition hover:border-cyan-400/50 hover:bg-slate-900">

                <span className="text-4xl">
                  📄
                </span>

                <span className="mt-3 max-w-full break-all font-semibold">

                  {syllabusFile
                    ? syllabusFile.name
                    : "Click to upload syllabus"}

                </span>

                <span className="mt-2 text-xs text-slate-500">
                  PDF, DOC or DOCX
                </span>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) =>
                    setSyllabusFile(
                      e.target.files?.[0] ||
                        null
                    )
                  }
                />

              </label>

              {syllabusFile && (
                <button
                  type="button"
                  onClick={() =>
                    setSyllabusFile(null)
                  }
                  className="mt-3 text-xs font-semibold text-red-400 transition hover:text-red-300"
                >
                  Remove file
                </button>
              )}

            </div>
          )}

          {/* =====================================================
              CREATE PLAN
              ===================================================== */}

          <div className="pt-2">

            <button
              type="button"
              disabled={!isComplete}
              onClick={handleCreatePlan}
              className={`w-full rounded-2xl px-6 py-4 text-base font-black transition-all duration-300 sm:py-5 sm:text-lg ${
                isComplete
                  ? "bg-gradient-to-r from-orange-500 via-white to-green-500 text-slate-950 shadow-xl hover:-translate-y-1 hover:shadow-orange-500/20"
                  : "cursor-not-allowed bg-slate-800 text-slate-500"
              }`}
            >
              Create My Study Plan →
            </button>

            {!isComplete && (
              <p className="mt-3 text-center text-xs text-slate-600">
                Complete all required preferences to continue.
              </p>
            )}

          </div>

        </div>

      </section>

    </main>
  );
}