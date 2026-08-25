import Link from "next/link";

const features = [
  {
    icon: "🤖",
    title: "AI-Powered Study Planning",
    text: "PrepMaster creates a personalized preparation plan according to your goal, syllabus, target date and current preparation level.",
  },
  {
    icon: "🎯",
    title: "Goal-Based Preparation",
    text: "Choose GATE, JEE, NEET, Coding or College Exam and get a preparation approach designed around your selected goal.",
  },
  {
    icon: "📚",
    title: "Smart Syllabus Management",
    text: "A large syllabus is divided into smaller and manageable topics so you always know what needs to be completed next.",
  },
  {
    icon: "▶️",
    title: "Smart Lecture Planning",
    text: "PrepMaster helps organize suitable learning resources and lectures according to the topics in your preparation plan.",
  },
  {
    icon: "📝",
    title: "Topic-Based Tests",
    text: "After learning a topic, take a test to check your understanding and identify areas that need more attention.",
  },
  {
    icon: "🔄",
    title: "Weak Topic Detection",
    text: "Your performance can identify weak areas so you can revise or re-learn them instead of simply moving ahead.",
  },
  {
    icon: "📅",
    title: "Deadline-Based Planning",
    text: "Your preparation is organized around your target date so that the required syllabus is completed before the final revision period.",
  },
  {
    icon: "🧠",
    title: "Final Revision Planning",
    text: "The final 5 days before your target date are reserved for focused revision instead of new syllabus completion.",
  },
  {
    icon: "📈",
    title: "Progress Tracking",
    text: "Track completed topics, lectures, tests and overall preparation progress from your dashboard.",
  },
  {
    icon: "⏰",
    title: "Smart Reminders",
    text: "Get reminders for pending study tasks and important preparation activities.",
  },
  {
    icon: "🏆",
    title: "Leaderboard",
    text: "Healthy competition through progress-based rankings can help make preparation more engaging and motivating.",
  },
  {
    icon: "🗣️",
    title: "AI Study Assistant",
    text: "Get study-related guidance and explanations from an AI assistant that acts as your personal study companion.",
  },
  {
    icon: "📄",
    title: "College Syllabus Upload",
    text: "College students can upload their syllabus so PrepMaster can organize it into a structured preparation plan.",
  },
  {
    icon: "📱",
    title: "Responsive Design",
    text: "PrepMaster is designed to provide a smooth experience across desktop, tablet and mobile devices.",
  },
];

export default function FeaturesPage() {
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

      {/* Heading */}

      <section className="px-6 pb-20 pt-16">

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            PrepMaster Features
          </p>

          <h1 className="mt-5 text-4xl font-black sm:text-5xl md:text-6xl">

            Everything you need to
            <span className="block bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
              prepare smarter.
            </span>

          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            PrepMaster combines intelligent planning, learning,
            testing and progress tracking to create a complete
            preparation experience.
          </p>

        </div>

        {/* Features */}

        <div className="mx-auto mt-16 grid max-w-6xl gap-5 md:grid-cols-2">

          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-3xl border border-white/10 bg-white/[0.035] p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-blue-400/30 hover:bg-white/[0.06]"
            >

              <div className="flex gap-5">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-2xl transition group-hover:scale-110">
                  {feature.icon}
                </div>

                <div>

                  <h2 className="text-lg font-bold">
                    {feature.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {feature.text}
                  </p>

                </div>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* Bottom CTA */}

      <section className="px-6 pb-24">

        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">

          <h2 className="text-2xl font-black sm:text-3xl">
            Ready to start your preparation?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400">
            Choose your goal and let PrepMaster organize your
            preparation journey.
          </p>

          <Link
            href="/goals"
            className="mt-7 inline-flex rounded-2xl bg-blue-600 px-7 py-4 font-bold transition hover:-translate-y-1 hover:bg-blue-500"
          >
            Start Preparation →
          </Link>

        </div>

      </section>

    </main>
  );
}