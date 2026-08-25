import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* Navbar */}

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">

        <Link
          href="/"
          className="text-2xl font-black tracking-tight"
        >
          Prep<span className="text-blue-500">Master</span>
        </Link>

        <Link
          href="/"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          ← Home
        </Link>

      </nav>

      {/* About */}

      <section className="px-6 pb-24 pt-16">

        <div className="mx-auto max-w-4xl">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-3xl">
              🧠
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
              About PrepMaster
            </p>

            <h1 className="mt-5 text-4xl font-black sm:text-5xl md:text-6xl">

              Study with a plan,
              <span className="block bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
                not with confusion.
              </span>

            </h1>

          </div>

          <div className="mt-14 space-y-7 text-base leading-8 text-slate-400 sm:text-lg">

            <p>
              PrepMaster is an AI-powered personal study management
              platform designed to help students prepare in a more
              organized and intelligent way.
            </p>

            <p>
              Students often know their final goal but struggle with
              simple questions such as: What should I study today?
              What should I study next? Which lecture should I watch?
              Did I understand what I studied? And am I actually
              progressing according to my target date?
            </p>

            <p>
              PrepMaster is designed to act as a personal study
              manager that helps answer these questions. Instead of
              giving every student the same timetable, it uses the
              student's goal, syllabus, preparation level, target
              date, available study days and performance to organize
              the preparation journey.
            </p>

            <p>
              The platform can break a large syllabus into smaller
              tasks, organize learning resources, provide tests after
              learning and help identify topics that require additional
              attention.
            </p>

            <p>
              PrepMaster also follows a deadline-focused approach.
              The goal is to complete the required preparation
              <strong className="text-white">
                {" "}5 days before the target date
              </strong>
              , leaving the final 5 days specifically for revision.
            </p>

          </div>

          {/* Mission */}

          <div className="mt-14 rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-center backdrop-blur-xl sm:p-10">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Our Vision
            </p>

            <h2 className="mt-4 text-2xl font-black sm:text-3xl">
              Make preparation simple, structured and intelligent.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              PrepMaster aims to reduce the confusion surrounding
              preparation and help students focus their time and
              energy on actually learning, practicing and improving.
            </p>

          </div>

          {/* CTA */}

          <div className="mt-12 text-center">

            <Link
              href="/goals"
              className="inline-flex rounded-2xl bg-blue-600 px-8 py-4 font-bold transition hover:-translate-y-1 hover:bg-blue-500"
            >
              Start Your Preparation →
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}