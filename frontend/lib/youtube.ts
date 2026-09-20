const YOUTUBE_API_BASE_URL =
  "https://www.googleapis.com/youtube/v3";

type YouTubePlaylistSearchItem = {
  id?: {
    playlistId?: string;
  };
  snippet?: {
    title?: string;
    description?: string;
    channelTitle?: string;
    thumbnails?: {
      medium?: {
        url?: string;
      };
      high?: {
        url?: string;
      };
    };
  };
};

export type YouTubePlaylist = {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  thumbnailUrl: string | null;
};

type YouTubeSearchResponse = {
  items?: YouTubePlaylistSearchItem[];
  error?: {
    message?: string;
  };
};

function getApiKey() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is not configured.");
  }

  return apiKey;
}

export async function searchYouTubePlaylists(
  query: string
): Promise<YouTubePlaylist[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const apiKey = getApiKey();

  const params = new URLSearchParams({
    part: "snippet",
    q: normalizedQuery,
    type: "playlist",
    maxResults: "3",
    key: apiKey,
  });

  const response = await fetch(
    `${YOUTUBE_API_BASE_URL}/search?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  let data: YouTubeSearchResponse;

  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid response received from YouTube.");
  }

  if (!response.ok) {
    throw new Error(
      data.error?.message || "YouTube playlist search failed."
    );
  }

  return (data.items ?? [])
    .map((item) => {
      const playlistId = item.id?.playlistId;
      const snippet = item.snippet;

      if (!playlistId || !snippet?.title) {
        return null;
      }

      return {
        id: playlistId,
        title: snippet.title,
        description: snippet.description || "",
        channelTitle: snippet.channelTitle || "Unknown channel",
        thumbnailUrl:
          snippet.thumbnails?.high?.url ||
          snippet.thumbnails?.medium?.url ||
          null,
      };
    })
    .filter(
      (playlist): playlist is YouTubePlaylist =>
        playlist !== null
    );
}