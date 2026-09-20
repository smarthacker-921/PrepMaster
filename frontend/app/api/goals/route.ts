import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";

const MINIMUM_DAYS: Record<string, number> = {
  GATE: 120,
  JEE: 120,
  NEET: 120,
  Coding: 60,
  "College Exam": 25,
};

const REQUIRED_REVISION_DAYS = 5;

function isValidDateString(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function POST(request: Request) {
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

    const body = await request.json();

    const {
      goal,
      option,
      subjects,
      level,
      targetDate,
      studyDays,
    } = body;

    if (!goal || !MINIMUM_DAYS[goal]) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid goal selected.",
        },
        { status: 400 }
      );
    }

    if (!level) {
      return NextResponse.json(
        {
          success: false,
          message: "Preparation level is required.",
        },
        { status: 400 }
      );
    }

    if (!isValidDateString(targetDate)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid target date.",
        },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(studyDays) ||
      studyDays.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Select at least one study day.",
        },
        { status: 400 }
      );
    }

    const target = new Date(`${targetDate}T00:00:00.000Z`);

    if (Number.isNaN(target.getTime())) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid target date.",
        },
        { status: 400 }
      );
    }

    const today = new Date();

    today.setUTCHours(0, 0, 0, 0);

    const minimumTarget = new Date(today);

    minimumTarget.setUTCDate(
      minimumTarget.getUTCDate() + MINIMUM_DAYS[goal]
    );

    if (target < minimumTarget) {
      return NextResponse.json(
        {
          success: false,
          message: `Target date must be at least ${MINIMUM_DAYS[goal]} days from today.`,
        },
        { status: 400 }
      );
    }

    const preparationEnd = new Date(target);

    preparationEnd.setUTCDate(
      preparationEnd.getUTCDate() -
        REQUIRED_REVISION_DAYS
    );

    const revisionStart = new Date(preparationEnd);

    revisionStart.setUTCDate(
      revisionStart.getUTCDate() + 1
    );

    const normalizedSubjects = Array.isArray(subjects)
      ? subjects.filter(
          (subject): subject is string =>
            typeof subject === "string"
        )
      : [];

    const normalizedStudyDays = studyDays.filter(
      (day): day is string =>
        typeof day === "string"
    );

    const savedGoal = await prisma.goal.upsert({
      where: {
        userId: session.user.id,
      },

      create: {
        userId: session.user.id,
        type: goal,
        option: option || null,
        subjects: normalizedSubjects,
        level,
        studyDays: normalizedStudyDays,
        targetDate: target,
        preparationEndDate: preparationEnd,
        revisionStartDate: revisionStart,
      },

      update: {
        type: goal,
        option: option || null,
        subjects: normalizedSubjects,
        level,
        studyDays: normalizedStudyDays,
        targetDate: target,
        preparationEndDate: preparationEnd,
        revisionStartDate: revisionStart,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Study plan preferences saved successfully.",
      goal: {
        id: savedGoal.id,
        type: savedGoal.type,
        option: savedGoal.option,
        subjects: savedGoal.subjects,
        level: savedGoal.level,
        studyDays: savedGoal.studyDays,
        targetDate: savedGoal.targetDate,
        preparationEndDate:
          savedGoal.preparationEndDate,
        revisionStartDate:
          savedGoal.revisionStartDate,
      },
    });
  } catch (error) {
    console.error("GOAL SAVE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to save your study plan.",
      },
      { status: 500 }
    );
  }
}