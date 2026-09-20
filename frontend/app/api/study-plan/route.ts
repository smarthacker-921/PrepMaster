import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";

const REVISION_DAYS = 5;

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setUTCHours(0, 0, 0, 0);
  return result;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days); 
  return result;
}

/*
 * GET
 * Fetch the current user's study plan and tasks.
 */
export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const studyPlan = await prisma.studyPlan.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        tasks: {
          orderBy: {
            scheduledDate: "asc",
          },
        },
      },
    });

    if (!studyPlan) {
      return NextResponse.json(
        {
          success: false,
          message: "No study plan found.",
          studyPlan: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Study plan fetched successfully.",
      studyPlan,
    });
  } catch (error) {
    console.error("STUDY PLAN GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch your study plan.",
      },
      { status: 500 }
    );
  }
}

/*
 * POST
 * Generate the study plan.
 */
export async function POST() {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const goal = await prisma.goal.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!goal) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete your study preferences first.",
        },
        { status: 400 }
      );
    }

    const startDate = startOfDay(new Date());

    const preparationEndDate = startOfDay(
      goal.preparationEndDate
    );

    if (preparationEndDate < startDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Your preparation period has already ended.",
        },
        { status: 400 }
      );
    }

    /*
     * If a StudyPlan already exists for this Goal,
     * return the existing plan instead of creating duplicates.
     */
    const existingPlan = await prisma.studyPlan.findUnique({
      where: {
        goalId: goal.id,
      },
      include: {
        tasks: {
          orderBy: {
            scheduledDate: "asc",
          },
        },
      },
    });

    if (existingPlan) {
      return NextResponse.json({
        success: true,
        message: "Study plan already exists.",
        studyPlan: existingPlan,
      });
    }

    /*
     * Create StudyPlan.
     */
    const studyPlan = await prisma.studyPlan.create({
      data: {
        userId: session.user.id,
        goalId: goal.id,
        startDate,
        endDate: preparationEndDate,
        status: "ACTIVE",
      },
    });

    /*
     * Selected study days.
     */
    const selectedDays = new Set(
      goal.studyDays.map((day) => day.toLowerCase())
    );

    /*
     * Use selected subjects.
     * If no subjects were selected, fall back to option/type.
     */
    const subjects =
      goal.subjects.length > 0
        ? goal.subjects
        : [goal.option || goal.type];

    const tasks: {
      studyPlanId: string;
      title: string;
      description: string;
      subject: string;
      type: string;
      scheduledDate: Date;
      durationMin: number;
      status: string;
    }[] = [];

    let subjectIndex = 0;

    /*
     * Generate one task for each selected study day.
     */
    for (
      let current = new Date(startDate);
      current <= preparationEndDate;
      current = addDays(current, 1)
    ) {
      const dayName = current
        .toLocaleDateString("en-US", {
          weekday: "long",
          timeZone: "UTC",
        })
        .toLowerCase();

      if (!selectedDays.has(dayName)) {
        continue;
      }

      const subject =
        subjects[subjectIndex % subjects.length];

      subjectIndex++;

      tasks.push({
        studyPlanId: studyPlan.id,
        title: `${subject} Study Session`,
        description: `Study ${subject} according to your ${goal.type} preparation plan.`,
        subject,
        type: "LECTURE",
        scheduledDate: current,
        durationMin: 60,
        status: "PENDING",
      });
    }

    if (tasks.length > 0) {
      await prisma.studyTask.createMany({
        data: tasks,
      });
    }

    /*
     * Fetch the complete plan with generated tasks.
     */
    const finalPlan = await prisma.studyPlan.findUnique({
      where: {
        id: studyPlan.id,
      },
      include: {
        tasks: {
          orderBy: {
            scheduledDate: "asc",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Study plan generated successfully.",
      studyPlan: finalPlan,
    });
  } catch (error) {
    console.error("STUDY PLAN GENERATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to generate study plan.",
      },
      { status: 500 }
    );
  }
}