import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";
import { searchYouTubePlaylists } from "@/lib/youtube";

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

function normalizeValue(value: string | null): string {
  return (value ?? "").trim().replace(/\s+/g, " ");
}

export async function GET(request: Request) {
  try {
    // 1. Verify logged-in user
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

    // 2. Read query parameters
    const { searchParams } = new URL(request.url);

    const subject = normalizeValue(
      searchParams.get("subject")
    );

    const topic = normalizeValue(
      searchParams.get("topic")
    );

    const examType = normalizeValue(
      searchParams.get("exam")
    );

    // 3. Validate input
    if (!subject && !topic) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject or topic is required.",
        },
        { status: 400 }
      );
    }

    // 4. Create normalized search query
    const query = [subject, topic]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid search query is required.",
        },
        { status: 400 }
      );
    }

    const cacheSubject = subject;
    const cacheExamType = examType;

    // 5. Check database cache
    const existingCache =
      await prisma.youTubePlaylistCache.findUnique({
        where: {
          query_subject_examType: {
            query,
            subject: cacheSubject,
            examType: cacheExamType,
          },
        },
      });

    const now = new Date();

    // 6. Return valid cache
    if (
      existingCache &&
      existingCache.expiresAt > now
    ) {
      return NextResponse.json({
        success: true,
        source: "cache",
        message: "Playlists fetched from cache.",
        playlists: existingCache.playlists,
      });
    }

    // 7. Fetch fresh results from YouTube
    try {
      const playlists =
        await searchYouTubePlaylists(query);

      const expiresAt = new Date(
        now.getTime() + CACHE_DURATION_MS
      );

      // 8. Save or update cache
      const savedCache =
        await prisma.youTubePlaylistCache.upsert({
          where: {
            query_subject_examType: {
              query,
              subject: cacheSubject,
              examType: cacheExamType,
            },
          },
          update: {
            playlists,
            expiresAt,
          },
          create: {
            query,
            subject: cacheSubject,
            examType: cacheExamType,
            playlists,
            expiresAt,
          },
        });

      return NextResponse.json({
        success: true,
        source: "youtube",
        message: "Playlists fetched successfully.",
        playlists: savedCache.playlists,
      });
    } catch (youtubeError) {
      console.error(
        "YOUTUBE PLAYLIST SEARCH ERROR:",
        youtubeError
      );

      // 9. Fallback to stale cache if YouTube fails
      if (existingCache) {
        return NextResponse.json({
          success: true,
          source: "stale-cache",
          message:
            "YouTube is temporarily unavailable. Using cached playlists.",
          playlists: existingCache.playlists,
        });
      }

      // 10. Graceful API failure
      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to fetch YouTube playlists right now. Please try again later.",
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error(
      "PLAYLIST API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to process playlist request.",
      },
      { status: 500 }
    );
  }
}