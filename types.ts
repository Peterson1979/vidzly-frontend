
export enum VideoPlatform {
  YOUTUBE = 'YouTube',
  VIMEO = 'Vimeo', 
  LOCAL = 'Local', 
}

export interface Video {
  id: string; // YouTube video ID
  title: string;
  description?: string;
  thumbnailUrl: string;
  videoUrl: string; // Embed URL for YouTube
  platform: VideoPlatform;
  // categoryId: string; // Removed
  duration?: string; 
  views?: string; 
  uploader?: string; 
  uploadDate?: string; 
  youtubeVideoId?: string; 
  youtubeChannelId?: string; 
}

// Category interface removed

export interface NotificationSettings {
  enabled: boolean;
  trending: boolean;
  recommendations: boolean;
  appUpdates: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  // customCategories: Category[]; // Removed
  notifications: NotificationSettings;
}

export interface FavoriteVideo extends Video {
  favoritedDate: number;
}

export interface SocialSharePlatform {
  name: string;
  icon: React.ReactNode;
  urlPattern: string;
}