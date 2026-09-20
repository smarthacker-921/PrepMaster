import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";

type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function POST(
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
        status: true,
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

    if (task.videoCompleted) {
      return NextResponse.json({
        success: true,
        message: "Video is already marked as completed.",
        task,
      });
    }

    const updatedTask = await prisma.studyTask.update({
      where: {
        id: task.id,
      },
      data: {
        videoCompleted: true,
        status:
          task.bestQuizScore !== null &&
          task.bestQuizScore >= 50
            ? "COMPLETED"
            : "IN PROGRESS",
        completedAt:
          task.bestQuizScore !== null &&
          task.bestQuizScore >= 50
            ? new Date()
            : null,
      },
      select: {
        id: true,
        title: true,
        subject: true,
        type: true,
        scheduledDate: true,
        durationMin: true,
        status: true,
        videoCompleted: true,
        quizAttempts: true,
        bestQuizScore: true,
        completedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Video completion recorded successfully.",
      task: updatedTask,
    });
  } catch (error) {
    console.error("VIDEO COMPLETION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to record video completion.",
      },
      { status: 500 }
    );
  }
}