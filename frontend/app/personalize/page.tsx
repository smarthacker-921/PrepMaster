"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const levels = ["Beginner", "Intermediate", "Advanced"];

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const jeeSubjects = ["Physics", "Chemistry", "Mathematics"];

const neetSubjects = ["Physics", "Chemistry", "Botany", "Zoology"];

export default function PersonalizePage() {
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const [level, setLevel] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);

  // Subjects selected to run in parallel.
  const [parallelSubjects, setParallelSubjects] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /*
   * =====================================================
   * LOAD SELECTED GOAL
   * =====================================================
   */

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

  /*
   * =====================================================
   * MINIMUM DAYS
   * =====================================================
   */

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

  /*
   * =====================================================
   * MINIMUM TARGET DATE
   * =====================================================
   */

  const getMinimumTargetDate = () => {
    const date = new Date();

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + getMinimumDays());

    return date.toISOString().split("T")[0];
  };

  /*
   * =====================================================
   * TOGGLE STUDY DAY
   * =====================================================
   */

  const toggleDay = (day: string) => {
    setSelectedDays((previous) =>
      previous.includes(day)
        ? previous.filter((item) => item !== day)
        : [...previous, day]
    );
  };

  /*
   * =====================================================
   * GOAL ICON
   * =====================================================
   */

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

  /*
   * =====================================================
   * REQUIRED SUBJECTS
   * =====================================================
   *
   * Currently JEE / NEET subjects are fixed.
   *
   * Later this will be replaced by complete syllabus data.
   */

  const subjects =
    selectedGoal === "JEE"
      ? jeeSubjects
      : selectedGoal === "NEET"
        ? neetSubjects
        : [];

  /*
   * =====================================================
   * PARALLEL SUBJECT LOGIC
   * =====================================================
   *
   * 3–5 required subjects:
   *     All subjects automatically run in parallel.
   *
   * More than 5 subjects:
   *     User selects 2–5 subjects.
   *
   * 1–2 subjects:
   *     All available subjects run in parallel.
   */

  const requiresParallelSelection = subjects.length > 5;

  const effectiveParallelSubjects =
    subjects.length > 0 && subjects.length <= 5
      ? subjects
      : parallelSubjects;

  /*
   * =====================================================
   * VALIDATION
   * =====================================================
   */

  const isTargetDateValid =
    targetDate === "" ||
    targetDate >= getMinimumTargetDate();

  const parallelSubjectsValid =
    subjects.length === 0 ||
    !requiresParallelSelection ||
    (parallelSubjects.length >= 2 &&
      parallelSubjects.length <= 5 &&
      parallelSubjects.every((subject) =>
        subjects.includes(subject)
      ));

  const isComplete =
    selectedGoal !== "" &&
    level !== "" &&
    targetDate !== "" &&
    isTargetDateValid &&
    selectedDays.length > 0 &&
    parallelSubjectsValid;

  /*
   * =====================================================
   * TOGGLE PARALLEL SUBJECT
   * =====================================================
   */

  const toggleParallelSubject = (subject: string) => {
    if (!requiresParallelSelection) {
      return;
    }

    setParallelSubjects((previous) => {
      if (previous.includes(subject)) {
        return previous.filter((item) => item !== subject);
      }

      if (previous.length >= 5) {
        return previous;
      }

      return [...previous, subject];
    });
  };

  /*
   * =====================================================
   * CREATE STUDY PLAN
   * =====================================================
   */

  const handleCreatePlan = async () => {
    if (!isComplete || saving) {
      return;
    }

    setSaving(true);

    try {
      /*
       * Target date
       */

      const target = new Date(
        `${targetDate}T00:00:00.000Z`
      );

      /*
       * Preparation ends 5 days before target date.
       */

      const preparationEnd = new Date(target);

      preparationEnd.setUTCDate(
        preparationEnd.getUTCDate() - 5
      );

      const preparationEndDate =
        preparationEnd.toISOString().split("T")[0];

      /*
       * Revision starts after preparation ends.
       */

      const revisionStart = new Date(preparationEnd);

      revisionStart.setUTCDate(
        revisionStart.getUTCDate() + 1
      );

      const revisionStartDate =
        revisionStart.toISOString().split("T")[0];

      /*
       * Required subjects.
       */

      const selectedSubjects =
        selectedGoal === "JEE"
          ? jeeSubjects
          : selectedGoal === "NEET"
            ? neetSubjects
            : [];

      /*
       * Final parallel subjects.
       *
       * If there are 5 or fewer required subjects,
       * all subjects automatically run in parallel.
       *
       * If there are more than 5,
       * use the user's selected subjects.
       */

      const finalParallelSubjects =
        selectedSubjects.length > 0 &&
        selectedSubjects.length <= 5
          ? selectedSubjects
          : parallelSubjects;

      /*
       * Data sent to Goal API.
       */

      const data = {
        goal: selectedGoal,
        option: selectedOption || null,

        // All required subjects.
        subjects: selectedSubjects,

        // Subjects the scheduler should run in parallel.
        parallelSubjects: finalParallelSubjects,

        level,
        targetDate,
        preparationEndDate,
        revisionStartDate,
        studyDays: selectedDays,

        /*
         * Currently only the filename is stored.
         * Actual syllabus upload will be implemented later.
         */

        syllabusFileName:
          syllabusFile?.name || null,
      };

      /*
       * Save local copy.
       */

      localStorage.setItem(
        "prepMasterPreferences",
        JSON.stringify(data)
      );

      /*
       * =================================================
       * STEP 1: SAVE GOAL
       * =================================================
       */

      const goalResponse = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const goalResult = await goalResponse.json();

      if (!goalResponse.ok) {
        console.error(
          "Goal save failed:",
          goalResult
        );

        alert(
          goalResult.message ||
            "Unable to save your study preferences."
        );

        setSaving(false);
        return;
      }

      /*
       * =================================================
       * STEP 2: GENERATE STUDY PLAN
       * =================================================
       *
       * Goal is now saved.
       * The Study Plan API reads that Goal from the database
       * and creates the StudyPlan + StudyTasks.
       */

      const studyPlanResponse = await fetch(
        "/api/study-plan",
        {
          method: "POST",
        }
      );

      const studyPlanResult =
        await studyPlanResponse.json();

      if (!studyPlanResponse.ok) {
        console.error(
          "Study plan generation failed:",
          studyPlanResult
        );

        alert(
          studyPlanResult.message ||
            "Your preferences were saved, but the study plan could not be generated."
        );

        setSaving(false);
        return;
      }

      /*
       * =================================================
       * STEP 3: SUCCESS
       * =================================================
       */

      console.log(
        "Study plan created successfully:",
        studyPlanResult
      );

      alert(
        "Your study plan has been created successfully!"
      );

      /*
       * Open dashboard only after both:
       *
       * 1. Goal saved
       * 2. Study plan generated
       */

      window.location.href = "/dashboard";
    } catch (error) {
      console.error(
        "Unable to create study plan:",
        error
      );

      alert(
        "Something went wrong while creating your study plan."
      );

      setSaving(false);
    }
  };

  /*
   * =====================================================
   * LOADING SCREEN
   * =====================================================
   */

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

  /*
   * =====================================================
   * MAIN PAGE
   * =====================================================
   */

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/goals"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Change Goal
          </Link>

          <div className="text-sm font-semibold text-cyan-400">
            PrepMaster
          </div>
        </div>

        {/* TITLE */}

        <div className="mb-10 text-center">
          <div className="mb-4 text-5xl">
            {goalIcon}
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Personalize Your Preparation
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Tell PrepMaster a few things about your preparation.
            We&apos;ll use them to build your personalized study plan.
          </p>

          <div className="mt-4 inline-flex rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm text-slate-300">
            Goal:
            <span className="ml-1 font-semibold text-cyan-400">
              {selectedOption
                ? `${selectedGoal} — ${selectedOption}`
                : selectedGoal}
            </span>
          </div>
        </div>

        {/* MAIN CARD */}

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl backdrop-blur-xl sm:p-8">

          {/* LEVEL */}

          <section>
            <h2 className="text-lg font-semibold">
              1. What is your current level?
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              This helps PrepMaster adjust the difficulty and pace.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {levels.map((item) => {
                const active = level === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLevel(item)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      active
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                        : "border-slate-700 bg-slate-950/50 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    <div className="font-medium">
                      {item}
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      {item === "Beginner"
                        ? "Starting from basics"
                        : item === "Intermediate"
                          ? "Know the fundamentals"
                          : "Strong foundation"}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* TARGET DATE */}

          <section className="mt-10">
            <h2 className="text-lg font-semibold">
              2. When is your target date?
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              PrepMaster automatically calculates your daily study
              workload from this date.
            </p>

            <div className="mt-5 max-w-md">
              <input
                type="date"
                value={targetDate}
                min={getMinimumTargetDate()}
                onChange={(event) =>
                  setTargetDate(event.target.value)
                }
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
              />

              <p className="mt-2 text-xs text-slate-500">
                Minimum target date:{" "}
                {getMinimumTargetDate()}
              </p>

              {!isTargetDateValid && (
                <p className="mt-2 text-sm text-red-400">
                  Please select a date at least{" "}
                  {getMinimumDays()} days from today.
                </p>
              )}
            </div>
          </section>

          {/* JEE / NEET SUBJECTS */}

          {subjects.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-semibold">
                3. Your subjects
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                These subjects are automatically included for your
                selected exam.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {subjects.map((subject) => {
                  const isParallel =
                    effectiveParallelSubjects.includes(subject);

                  const canSelect =
                    requiresParallelSelection;

                  return (
                    <button
                      key={subject}
                      type="button"
                      disabled={!canSelect}
                      onClick={() =>
                        toggleParallelSubject(subject)
                      }
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        isParallel
                          ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                          : canSelect
                            ? "border-slate-700 bg-slate-950/50 text-slate-300 hover:border-slate-500"
                            : "border-slate-700 bg-slate-950/50 text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {subject}
                        </span>

                        <span className="text-xs">
                          {isParallel ? "✓ Parallel" : ""}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {subjects.length <= 5 ? (
                <p className="mt-3 text-xs text-cyan-400">
                  All {subjects.length} subjects will run in
                  parallel.
                </p>
              ) : (
                <>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      Select 2–5 subjects to study in parallel.
                    </p>

                    <p className="text-xs font-semibold text-cyan-400">
                      Selected: {parallelSubjects.length} / 5
                    </p>
                  </div>

                  {parallelSubjects.length < 2 && (
                    <p className="mt-3 text-xs text-amber-400">
                      Select at least 2 subjects.
                    </p>
                  )}

                  {parallelSubjects.length >= 5 && (
                    <p className="mt-3 text-xs text-slate-500">
                      Maximum 5 parallel subjects allowed.
                    </p>
                  )}
                </>
              )}
            </section>
          )}

          {/* COLLEGE SYLLABUS */}

          {selectedGoal === "College Exam" && (
            <section className="mt-10">
              <h2 className="text-lg font-semibold">
                3. Upload your syllabus
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Upload your syllabus so PrepMaster can use it to
                understand your topics.
              </p>

              <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 px-6 py-10 text-center transition hover:border-cyan-400">
                <div className="text-3xl">
                  📄
                </div>

                <p className="mt-3 text-sm font-medium text-slate-200">
                  {syllabusFile
                    ? syllabusFile.name
                    : "Choose your syllabus file"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  PDF, DOC or DOCX
                </p>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(event) => {
                    const file =
                      event.target.files?.[0] || null;

                    setSyllabusFile(file);
                  }}
                />
              </label>
            </section>
          )}

          {/* STUDY DAYS */}

          <section className="mt-10">
            <h2 className="text-lg font-semibold">
              {subjects.length > 0 ||
              selectedGoal === "College Exam"
                ? "4"
                : "3"}
              . Which days can you study?
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Select the days you normally want to study.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {weekDays.map((day) => {
                const active = selectedDays.includes(day);

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`rounded-2xl border px-3 py-4 text-sm font-medium transition ${
                      active
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                        : "border-slate-700 bg-slate-950/50 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                    }`}
                  >
                    <div className="text-xs">
                      {day.slice(0, 3)}
                    </div>

                    <div className="mt-2">
                      {active ? "✓" : "○"}
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedDays.length === 0 && (
              <p className="mt-3 text-xs text-amber-400">
                Select at least four study day.
              </p>
            )}
          </section>

          {/* PLANNING RULE */}

          <section className="mt-10 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
            <div className="flex gap-4">
              <div className="text-2xl">
                🧠
              </div>

              <div>
                <h3 className="font-semibold text-slate-200">
                  How PrepMaster plans your preparation
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Your preparation content will be completed
                  <span className="font-medium text-cyan-400">
                    {" "}
                    5 days before your target date
                  </span>
                  . The final 5 days are reserved for revision.
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Daily study time is calculated automatically.
                  You don&apos;t need to enter study hours or a
                  preferred study time.
                </p>
              </div>
            </div>
          </section>

          {/* CREATE PLAN */}

          <div className="mt-10">
            <button
              type="button"
              onClick={handleCreatePlan}
              disabled={!isComplete || saving}
              className={`w-full rounded-2xl px-6 py-4 text-sm font-semibold transition ${
                isComplete && !saving
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.01]"
                  : "cursor-not-allowed bg-slate-800 text-slate-500"
              }`}
            >
              {saving
                ? "Creating Your Study Plan..."
                : "Create My Study Plan →"}
            </button>

            {!isComplete && !saving && (
              <p className="mt-3 text-center text-xs text-slate-500">
                Complete all required fields to continue.
              </p>
            )}
          </div>
        </div>

        {/* FOOTER */}

        <div className="py-8 text-center">
          <p className="text-xs text-slate-600">
            PrepMaster • Your AI-powered exam preparation
          </p>
        </div>
      </div>
    </main>
  );
}