
import { Video, VideoPlatform } from '../types'; // Category import removed
import { formatVideoDuration, formatYouTubeViews, formatTimeAgo, getYouTubeEmbedUrl } from '../utils/formatters';
import { PLACEHOLDER_THUMBNAIL, BACKEND_BASE_URL, DEFAULT_YOUTUBE_REGION_CODE } from '../constants';

const API_BASE = `${BACKEND_BASE_URL}/api/youtube`;

interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

interface YouTubeSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default?: YouTubeThumbnail;
    medium?: YouTubeThumbnail;
    high?: YouTubeThumbnail;
    standard?: YouTubeThumbnail;
    maxres?: YouTubeThumbnail;
  };
  channelTitle: string;
  tags?: string[];
  categoryId?: string; 
  liveBroadcastContent?: string;
}

interface YouTubeContentDetails {
  duration: string; 
  dimension: string;
  definition: string;
  caption: string;
  licensedContent: boolean;
  projection?: string;
}

interface YouTubeStatistics {
  viewCount: string;
  likeCount?: string;
  dislikeCount?: string; 
  favoriteCount: string;
  commentCount?: string;
}

interface YouTubeVideoItem {
  kind: string; 
  etag: string;
  id: string; 
  snippet: YouTubeSnippet;
  contentDetails: YouTubeContentDetails;
  statistics: YouTubeStatistics;
}

interface YouTubeApiResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeVideoItem[]; 
}


const mapYouTubeItemToVideo = (item: YouTubeVideoItem): Video => {
  const bestThumbnail = item.snippet.thumbnails.high || item.snippet.thumbnails.medium || item.snippet.thumbnails.default;
  return {
    id: item.id, 
    youtubeVideoId: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl: bestThumbnail?.url || PLACEHOLDER_THUMBNAIL,
    videoUrl: getYouTubeEmbedUrl(item.id), 
    platform: VideoPlatform.YOUTUBE,
    // categoryId: categoryQueryId, // Removed
    duration: formatVideoDuration(item.contentDetails?.duration),
    views: formatYouTubeViews(item.statistics?.viewCount),
    uploader: item.snippet.channelTitle,
    uploadDate: formatTimeAgo(item.snippet.publishedAt),
    youtubeChannelId: item.snippet.channelId,
  };
};

export const fetchTrendingVideos = async (
  pageToken?: string,
  limit: number = 10,
  regionCode: string = DEFAULT_YOUTUBE_REGION_CODE,
): Promise<{ videos: Video[]; nextPageToken?: string }> => {
  try {
    let url = `${API_BASE}/trending?maxResults=${limit}&regionCode=${regionCode}`;
    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown server error"}));
      throw new Error(`Error ${response.status} fetching trending videos: ${errorData.error || response.statusText}`);
    }
    const data: YouTubeApiResponse = await response.json();
    const videos = data.items.map(item => mapYouTubeItemToVideo(item)); // Removed categoryId
    return { videos, nextPageToken: data.nextPageToken };
  } catch (error) {
    console.error("Error in fetchTrendingVideos:", error);
    throw error;
  }
};

// fetchVideosByCategory function removed

export const fetchVideoDetailsById = async (youtubeVideoId: string): Promise<Video | null> => {
  console.warn("fetchVideoDetailsById is not fully implemented yet for direct YouTube fetching via backend.");
  return null;
};
