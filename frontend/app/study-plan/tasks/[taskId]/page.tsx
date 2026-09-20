import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";

type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

type PlaylistRequest = {
  playlistId?: unknown;
  playlistTitle?: unknown;
};

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    // 1. Authentication
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

    // 2. Resolve task ID
    const { taskId } = await params;

    if (!taskId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Task ID is required.",
        },
        { status: 400 }
      );
    }

    // 3. Read request body
    let body: PlaylistRequest;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const playlistId = cleanString(body.playlistId);
    const playlistTitle = cleanString(body.playlistTitle);

    // 4. Validate playlist data
    if (!playlistId || !playlistTitle) {
      return NextResponse.json(
        {
          success: false,
          message: "Playlist ID and title are required.",
        },
        { status: 400 }
      );
    }

    if (playlistId.length > 150 || playlistTitle.length > 500) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid playlist data.",
        },
        { status: 400 }
      );
    }

    // 5. Verify task belongs to logged-in user
    const task = await prisma.studyTask.findFirst({
      where: {
        id: taskId,
        studyPlan: {
          userId: session.user.id,
        },
      },
      select: {
        id: true,
        playlistId: true,
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

    // 6. Save selected playlist
    const updatedTask = await prisma.studyTask.update({
      where: {
        id: task.id,
      },
      data: {
        playlistId,
        playlistTitle,
        playlistSelectedAt: new Date(),
        playlistVideoIndex: 0,
      },
      select: {
        id: true,
        playlistId: true,
        playlistTitle: true,
        playlistSelectedAt: true,
        playlistVideoIndex: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Playlist selected successfully.",
      task: updatedTask,
    });
  } catch (error) {
    console.error(
      "PLAYLIST SELECTION API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to save playlist selection right now.",
      },
      { status: 500 }
    );
  }
}