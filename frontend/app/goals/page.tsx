"use client";

import Link from "next/link";
import { useState } from "react";

type Goal = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const goals: Goal[] = [
  {
    id: "GATE",
    title: "GATE",
    description: "Prepare for GATE with a personalized study plan.",
    icon: "🎯",
  },
  {
    id: "JEE",
    title: "JEE",
    description: "Prepare for JEE Main and Advanced.",
    icon: "🚀",
  },
  {
    id: "NEET",
    title: "NEET",
    description: "Prepare for NEET UG with structured preparation.",
    icon: "🩺",
  },
  {
    id: "Coding",
    title: "Coding",
    description: "Improve your coding and technical skills.",
    icon: "💻",
  },
  {
    id: "College Exam",
    title: "College Exam",
    description: "Prepare for your college examinations.",
    icon: "📚",
  },
];

/* ---------------- GATE ---------------- */

const gateOptions = [
  "Computer Science & IT (CS)",
  "Data Science & AI (DA)",
  "Electronics & Communication (EC)",
  "Electrical Engineering (EE)",
  "Mechanical Engineering (ME)",
  "Civil Engineering (CE)",
];

/* ---------------- JEE ---------------- */

const jeeOptions = [
  "JEE Main",
  "JEE Advanced",
  "JEE Main + Advanced",
];

const jeeSubjects = [
  "Physics",
  "Chemistry",
  "Mathematics",
];

/* ---------------- NEET ---------------- */

const neetSubjects = [
  "Physics",
  "Chemistry",
  "Botany",
  "Zoology",
];

/* ---------------- CODING ---------------- */

const codingOptions = [
  "DSA",
  "Python",
  "Java",
  "JavaScript",
  "Web Development",
  "App Development",
  "AI / Machine Learning",
  "Cyber Security",
  "Cloud / DevOps",
];

/* ---------------- COLLEGE ---------------- */

const collegeOptions = [
  "Engineering",
  "BCA",
  "BSc",
  "BCom",
  "BA",
];

export default function GoalsPage() {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedDsaLanguage, setSelectedDsaLanguage] = useState("");

  /*
    Save selected goal and continue.
  */
  const handleContinue = () => {
    if (!selectedGoal) return;

    let option = selectedOption;

    /*
      For DSA, save the selected language
      as the actual option.
    */
    if (selectedGoal.id === "Coding" && selectedOption === "DSA") {
      if (!selectedDsaLanguage) return;

      option = selectedDsaLanguage;
    }

    /*
      JEE and NEET subjects are compulsory,
      so we store them automatically.
    */
    const data = {
      goal: selectedGoal.id,
      option,
      subjects:
        selectedGoal.id === "JEE"
          ? jeeSubjects
          : selectedGoal.id === "NEET"
            ? neetSubjects
            : [],
    };

    localStorage.setItem(
      "prepMasterGoal",
      JSON.stringify(data)
    );

    window.location.href = "/personalize";
  };

  /*
    When changing the main goal,
    clear previous selections.
  */
  const handleGoalChange = (goal: Goal) => {
    setSelectedGoal(goal);
    setSelectedOption("");
    setSelectedDsaLanguage("");
  };

  const showOptions =
    selectedGoal &&
    ["GATE", "JEE", "Coding", "College Exam"].includes(
      selectedGoal.id
    );

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">

      {/* Background Effects */}

      <div className="pointer-events-none fixed -left-40 -top-40 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="pointer-events-none fixed -right-40 top-1/3 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />

      <div className="pointer-events-none fixed bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Navbar */}

      <nav className="relative z-10 flex items-center justify-between px-4 py-5 sm:px-8 md:px-12">

        <Link
          href="/"
          className="text-2xl font-black tracking-tight transition duration-300 hover:scale-105"
        >
          <span className="text-orange-400">Prep</span>
          <span className="text-white">Mast</span>
          <span className="text-blue-400">er</span>
        </Link>

        <Link
          href="/"
          className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-300 backdrop-blur transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"
        >
          ← Home
        </Link>

      </nav>

      {/* Main */}

      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6 md:pt-10">

        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-5 inline-flex rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs text-slate-300 backdrop-blur sm:text-sm">
            🎯 Let&apos;s personalize your preparation
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">

            {" "}

            <span className="bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
              Choose Your Goal
            </span>

          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base md:text-lg">
            Select what you want to prepare for and PrepMaster will build
            your personalized study journey.
          </p>

        </div>

        {/* Goal Cards */}

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

          {goals.map((goal) => {

            const selected =
              selectedGoal?.id === goal.id;

            return (
              <button
                type="button"
                key={goal.id}
                onClick={() => handleGoalChange(goal)}
                className={`group relative rounded-3xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 sm:p-6 ${
                  selected
                    ? "border-cyan-400 bg-cyan-400/10 shadow-xl shadow-cyan-500/10"
                    : "border-slate-800 bg-slate-900/70 hover:border-slate-600 hover:bg-slate-900"
                }`}
              >

                {/* Selected indicator */}

                {selected && (
                  <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-xs font-black text-slate-950">
                    ✓
                  </div>
                )}

                <div className="text-4xl transition-transform duration-300 group-hover:scale-110">
                  {goal.icon}
                </div>

                <h2 className="mt-4 text-xl font-bold">
                  {goal.title}
                </h2>

                <p className="mt-2 text-sm leading-5 text-slate-400">
                  {goal.description}
                </p>

              </button>
            );
          })}

        </div>

        {/* Options */}

        {selectedGoal && (
          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-2xl backdrop-blur-xl sm:p-7">

            {/* GATE */}

            {selectedGoal.id === "GATE" && (
              <>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    GATE Preparation
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Choose your GATE paper
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Select the paper you want to prepare for.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  {gateOptions.map((option) => {

                    const selected =
                      selectedOption === option;

                    return (
                      <button
                        type="button"
                        key={option}
                        onClick={() => setSelectedOption(option)}
                        className={`rounded-xl border px-4 py-4 text-left text-sm font-semibold transition-all duration-300 ${
                          selected
                            ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                            : "border-slate-700 bg-slate-950/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
                        }`}
                      >
                        {selected ? "✓ " : "○ "}
                        {option}
                      </button>
                    );
                  })}

                </div>
              </>
            )}

            {/* JEE */}

            {selectedGoal.id === "JEE" && (
              <>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    JEE Preparation
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Choose your JEE target
                  </h2>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">

                  {jeeOptions.map((option) => {

                    const selected =
                      selectedOption === option;

                    return (
                      <button
                        type="button"
                        key={option}
                        onClick={() => setSelectedOption(option)}
                        className={`rounded-xl border px-4 py-4 text-sm font-semibold transition-all duration-300 ${
                          selected
                            ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                            : "border-slate-700 bg-slate-950/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
                        }`}
                      >
                        {selected ? "✓ " : "○ "}
                        {option}
                      </button>
                    );
                  })}

                </div>

                <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/5 p-5">

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <h3 className="font-semibold">
                        Compulsory Subjects
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        These subjects are automatically included.
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                      Automatic
                    </span>

                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">

                    {jeeSubjects.map((subject) => (
                      <span
                        key={subject}
                        className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-2 text-sm text-green-300"
                      >
                        ✓ {subject}
                      </span>
                    ))}

                  </div>

                </div>
              </>
            )}

            {/* NEET */}

            {selectedGoal.id === "NEET" && (
              <>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    NEET Preparation
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    NEET UG Subjects
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    NEET subjects are compulsory and automatically included
                    in your study plan.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">

                  {neetSubjects.map((subject) => (
                    <div
                      key={subject}
                      className="rounded-xl border border-green-500/20 bg-green-500/5 px-5 py-3 text-sm font-semibold text-green-300"
                    >
                      ✓ {subject}
                    </div>
                  ))}

                </div>

              </>
            )}

            {/* CODING */}

            {selectedGoal.id === "Coding" && (
              <>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    Coding
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Choose your learning area
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Select the skill you want to improve.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  {codingOptions.map((option) => {

                    const selected =
                      selectedOption === option;

                    return (
                      <button
                        type="button"
                        key={option}
                        onClick={() => {
                          setSelectedOption(option);

                          if (option !== "DSA") {
                            setSelectedDsaLanguage("");
                          }
                        }}
                        className={`rounded-xl border px-4 py-4 text-left text-sm font-semibold transition-all duration-300 ${
                          selected
                            ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                            : "border-slate-700 bg-slate-950/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
                        }`}
                      >
                        {selected ? "✓ " : "○ "}
                        {option}
                      </button>
                    );
                  })}

                </div>

                {/* DSA Sub Options */}

                {selectedOption === "DSA" && (
                  <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">

                    <h3 className="font-bold">
                      Choose DSA Language
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Select the language you want to use for DSA.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">

                      {[
                        "DSA in C++",
                        "DSA in Java",
                      ].map((option) => {

                        const selected =
                          selectedDsaLanguage === option;

                        return (
                          <button
                            type="button"
                            key={option}
                            onClick={() =>
                              setSelectedDsaLanguage(option)
                            }
                            className={`rounded-xl border px-4 py-4 text-left text-sm font-semibold transition-all duration-300 ${
                              selected
                                ? "border-green-400 bg-green-400/10 text-green-300"
                                : "border-slate-700 bg-slate-950/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
                            }`}
                          >
                            {selected ? "✓ " : "○ "}
                            {option}
                          </button>
                        );
                      })}

                    </div>

                  </div>
                )}
              </>
            )}

            {/* COLLEGE */}

            {selectedGoal.id === "College Exam" && (
              <>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    College Exam
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Select your course
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Choose the course for which you want to prepare.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  {collegeOptions.map((option) => {

                    const selected =
                      selectedOption === option;

                    return (
                      <button
                        type="button"
                        key={option}
                        onClick={() => setSelectedOption(option)}
                        className={`rounded-xl border px-4 py-4 text-sm font-semibold transition-all duration-300 ${
                          selected
                            ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                            : "border-slate-700 bg-slate-950/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
                        }`}
                      >
                        {selected ? "✓ " : "○ "}
                        {option}
                      </button>
                    );
                  })}

                </div>

              </>
            )}

            {/* Continue */}

            {showOptions && (
              <div className="mt-8 border-t border-slate-800 pt-6">

                <button
                  type="button"
                  disabled={
                    !selectedOption ||
                    (selectedGoal.id === "Coding" &&
                      selectedOption === "DSA" &&
                      !selectedDsaLanguage)
                  }
                  onClick={handleContinue}
                  className={`w-full rounded-2xl px-6 py-4 text-base font-black transition-all duration-300 sm:py-5 sm:text-lg ${
                    selectedOption &&
                    !(
                      selectedGoal.id === "Coding" &&
                      selectedOption === "DSA" &&
                      !selectedDsaLanguage
                    )
                      ? "bg-gradient-to-r from-orange-500 via-white to-green-500 text-slate-950 shadow-xl hover:-translate-y-1 hover:shadow-orange-500/20"
                      : "cursor-not-allowed bg-slate-800 text-slate-500"
                  }`}
                >
                  Continue to Personalize →
                </button>

              </div>
            )}

            {/* NEET Continue */}

            {selectedGoal.id === "NEET" && (
              <div className="mt-8 border-t border-slate-800 pt-6">

                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-white to-green-500 px-6 py-4 text-base font-black text-slate-950 shadow-xl transition-all duration-300 hover:-translate-y-1 sm:py-5 sm:text-lg"
                >
                  Continue to Personalize →
                </button>

              </div>
            )}

          </div>
        )}

      </section>

    </main>
  );
}