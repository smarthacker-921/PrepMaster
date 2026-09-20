import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";

type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

/*
 * POST
 * Mark a study task as completed.
 */
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

    /*
     * Find the task and make sure it belongs
     * to the currently logged-in user's study plan.
     */
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
        completedAt: true,
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

    /*
     * Prevent unnecessary database updates
     * if the task is already completed.
     */
    if (task.status === "COMPLETED") {
      return NextResponse.json({
        success: true,
        message: "Task is already completed.",
        task,
      });
    }

    const completedAt = new Date();

    const updatedTask = await prisma.studyTask.update({
      where: {
        id: task.id,
      },
      data: {
        status: "COMPLETED",
        completedAt,
      },
      select: {
        id: true,
        title: true,
        subject: true,
        type: true,
        scheduledDate: true,
        durationMin: true,
        status: true,
        completedAt: true,
      },
    });

    /*
     * Calculate current study-plan progress.
     */
    const progress = await prisma.studyTask.aggregate({
      where: {
        studyPlan: {
          userId: session.user.id,
        },
      },
      _count: {
        _all: true,
      },
    });

    const completedCount = await prisma.studyTask.count({
      where: {
        studyPlan: {
          userId: session.user.id,
        },
        status: "COMPLETED",
      },
    });

    const totalTasks = progress._count._all;

    const progressPercent =
      totalTasks > 0
        ? Math.round((completedCount / totalTasks) * 100)
        : 0;

    return NextResponse.json({
      success: true,
      message: "Study task completed successfully.",
      task: updatedTask,
      progress: {
        completed: completedCount,
        total: totalTasks,
        percentage: progressPercent,
      },
    });
  } catch (error) {
    console.error("STUDY TASK COMPLETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to complete the study task.",
      },
      { status: 500 }
    );
  }
}