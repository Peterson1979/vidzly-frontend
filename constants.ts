
import { Badge, BadgeId, NotificationPreferences } from './types';
import { PlayCircleIcon, CollectionIcon, LightBulbIcon } from './components/Icons'; // Placeholder icons

export const APP_NAME = "Vidzly.AI"; // Updated App Name
export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
export const GEMINI_MODEL_IMAGE = 'imagen-3.0-generate-002';

export const GEMINI_API_KEY_PLACEHOLDER = "YOUR_GEMINI_API_KEY_PLACEHOLDER";

export const MOCK_API_DELAY = 1000; // ms
export const SEARCH_DEBOUNCE_DELAY = 500; // ms for search input in overlay

// LocalStorage Keys
export const FAVORITES_STORAGE_KEY = 'vidzly_favorites_v3';
export const FAVORITE_CATEGORIES_STORAGE_KEY = 'vidzly_favorite_categories_v1';
export const SAVED_ITEMS_STORAGE_KEY = 'vidzly_saved_items_v1'; // Renamed from WATCH_LATER_STORAGE_KEY
export const VIEW_HISTORY_STORAGE_KEY = 'vidzly_view_history_v1'; 
export const THEME_STORAGE_KEY = 'vidzly_theme';
export const NOTIFICATION_PREFERENCES_KEY = 'vidzly_notification_prefs_v2'; 
export const LAST_ACTIVE_STORAGE_KEY = 'vidzly_last_active_date';
export const STREAK_STORAGE_KEY = 'vidzly_streak_data';
export const LAST_NOTIFICATION_TIME_KEY = 'vidzly_last_notification_time';
export const LAST_WEEKLY_NOTIFICATION_TIME_KEY = 'vidzly_last_weekly_notification_time';
export const LAST_HUMOROUS_NOTIFICATION_TIME_KEY = 'vidzly_last_humorous_notification_time';
export const CUSTOM_LOGO_STORAGE_KEY = 'vidzly_custom_logo';
export const RECENT_SEARCHES_STORAGE_KEY = 'vidzly_recent_searches_v1'; 
export const IN_APP_NOTIFICATIONS_STORAGE_KEY = 'vidzly_in_app_notifications_v1';
export const CURATED_FEEDS_STORAGE_KEY = 'vidzly_curated_feeds_v1';


// Gamification LocalStorage Keys
export const BADGES_STORAGE_KEY = 'vidzly_earned_badges_v1';
export const BADGE_PROGRESS_STORAGE_KEY = 'vidzly_badge_progress_v1';


// Notification settings
export const INACTIVITY_THRESHOLD_DAYS = 3; // Days
export const NOTIFICATION_COOLDOWN_MS = 20 * 60 * 60 * 1000; // 20 hours (for browser push notifications)
export const HUMOROUS_NOTIFICATION_INTERVAL_MS = 2 * 24 * 60 * 60 * 1000; // Approx every 2 days
export const MAX_IN_APP_NOTIFICATIONS = 30; // Max number of in-app notifications to store
export const UNCATEGORIZED_CATEGORY_ID = '___uncategorized___';
export const UNCATEGORIZED_CATEGORY_NAME = 'Uncategorized';

// Search settings
export const MAX_RECENT_SEARCHES = 5;

// Watch History settings
export const MAX_VIEW_HISTORY_ITEMS = 50; 

// Curation settings
export const CURATED_FEED_STALE_HOURS = 12; // Generate new curated feed if older than this

// Default Logo SVG String
export const DEFAULT_LOGO_SVG_STRING = "<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><rect width='100' height='100' fill='white'/><rect x='15' y='15' width='70' height='70' rx='15' ry='15' fill='red'/><path d='M 42.3 30.2 Q 39 28 39 32 L 39 68 Q 39 72 42.3 69.8 L 68.7 52.2 Q 72 50 68.7 47.8 Z' fill='white'/></svg>";

// Default Notification Preferences
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  allEnabled: true, // For browser push notifications
  dailyHotContent: true,
  weeklyTopList: true,
  inactivityReengagement: true,
  humorousSurprising: true,
  gamification: true, // For browser push notifications about badges/streaks
  // New for in-app notification visibility (defaults to show all initially)
  inAppShowSystem: true,
  inAppShowContent: true,
  inAppShowEngagement: true,
};

// Badge Definitions
export const ALL_BADGES: Badge[] = [
  {
    id: BadgeId.WATCH_10,
    name: 'Video Voyager',
    description: 'Watched 10 videos. Keep exploring!',
    iconComponent: PlayCircleIcon,
    criteriaCount: 10,
  },
  {
    id: BadgeId.FAVORITE_5_DISTINCT_CATEGORIES,
    name: 'Category Connoisseur',
    description: 'Favorited videos in 5 different categories.',
    iconComponent: CollectionIcon,
    criteriaCount: 5,
  },
  {
    id: BadgeId.AI_INSIGHTS_3,
    name: 'Insight Explorer',
    description: 'Used AI Insights 3 times to learn more.',
    iconComponent: LightBulbIcon,
    criteriaCount: 3,
  },
];

// Custom event name for new in-app notifications
export const NEW_IN_APP_NOTIFICATION_EVENT = 'vidzly_new_in_app_notification';
