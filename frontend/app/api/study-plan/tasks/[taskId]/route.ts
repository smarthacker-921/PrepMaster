import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";

type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
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

    const { taskId } = await context.params;

    if (!taskId) {
      return NextResponse.json(
        {
          success: false,
          message: "Task ID is required.",
        },
        { status: 400 }
      );
    }

    const task = await prisma.studyTask.findFirst({
      where: {
        id: taskId,
        studyPlan: {
          userId: session.user.id,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        subject: true,
        type: true,
        scheduledDate: true,
        durationMin: true,
        status: true,
        completedAt: true,
        videoId: true,
        videoUrl: true,
        videoCompleted: true,
        quizAttempts: true,
        bestQuizScore: true,
      },
    });

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Study task not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Study task fetched successfully.",
      task,
    });
  } catch (error) {
    console.error("STUDY TASK GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch study task.",
      },
      { status: 500 }
    );
  }
}