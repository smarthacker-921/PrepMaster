import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";

import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getCurrentSession();

  // 1. Login nahi hai
  if (!session) {
    redirect("/login");
  }

  // 2. Goal check
  const goal = await prisma.goal.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      type: true,
      option: true,
      subjects: true,
    },
  });

  // 3. Goal nahi hai → Goal Selection
  if (!goal) {
    redirect("/goals");
  }

  // 4. Study Plan check
  const studyPlan = await prisma.studyPlan.findUnique({
    where: {
      goalId: goal.id,
    },
    select: {
      id: true,
    },
  });

  // 5. Study Plan nahi hai → Personalize
  if (!studyPlan) {
    redirect("/personalize");
  }

  // 6. Goal + Study Plan dono hain → Dashboard
  return (
    <DashboardClient
      user={{
        name: session.user.name,
        email: session.user.email,
      }}
      goal={goal}
    />
  );
}