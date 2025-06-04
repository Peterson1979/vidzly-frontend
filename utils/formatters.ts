
// Parses ISO 8601 duration string (e.g., "PT2M35S") to "MM:SS" or "HH:MM:SS"
export function formatVideoDuration(isoDuration?: string): string {
  if (!isoDuration) return '';

  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(regex);

  if (!matches) return '';

  const hours = matches[1] ? parseInt(matches[1], 10) : 0;
  const minutes = matches[2] ? parseInt(matches[2], 10) : 0;
  const seconds = matches[3] ? parseInt(matches[3], 10) : 0;

  let formatted = '';
  if (hours > 0) {
    formatted += `${hours}:`;
    formatted += `${minutes < 10 ? '0' : ''}${minutes}:`;
  } else {
    formatted += `${minutes}:`;
  }
  formatted += `${seconds < 10 ? '0' : ''}${seconds}`;
  
  return formatted;
}

// Formats YouTube view count (which comes as a string)
export function formatYouTubeViews(viewCountStr?: string): string {
  if (!viewCountStr) return '';
  const views = parseInt(viewCountStr, 10);
  if (isNaN(views)) return '';

  if (views >= 1000000000) {
    return `${(views / 1000000000).toFixed(1)}B views`;
  }
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(0)}K views`; // No decimal for thousands
  }
  return `${views} views`;
}


// Adapts formatTimeAgo for ISO 8601 date strings from YouTube
export function formatTimeAgo(isoDateString?: string): string {
  if (!isoDateString) return '';
  const now = new Date();
  const past = new Date(isoDateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 2) {
    return 'just now';
  }
  
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, 'minute');
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, 'hour');
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return rtf.format(-diffInDays, 'day');
  }
  const diffInWeeks = Math.floor(diffInDays / 7);
   if (diffInWeeks < 4) { // Approx a month
    return rtf.format(-diffInWeeks, 'week');
  }
  const diffInMonths = Math.floor(diffInDays / 30.44); // Average days in month
  if (diffInMonths < 12) {
    return rtf.format(-diffInMonths, 'month');
  }
  const diffInYears = Math.floor(diffInDays / 365.25); // Account for leap year
  return rtf.format(-diffInYears, 'year');
}

export function getYouTubeEmbedUrl(youtubeVideoId: string): string {
    // Assumes youtubeVideoId is just the ID, not a full URL
    return `https://www.youtube.com/embed/${youtubeVideoId}`;
}

// formatRedditScore function is removed as it's no longer needed.
