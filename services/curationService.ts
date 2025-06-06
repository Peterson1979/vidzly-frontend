
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { YouTubeVideo, CuratedFeed, InAppNotificationType } from '../types';
import { 
    GEMINI_MODEL_TEXT, 
    GEMINI_API_KEY_PLACEHOLDER, 
    MOCK_API_DELAY,
    CURATED_FEEDS_STORAGE_KEY,
    CURATED_FEED_STALE_HOURS
} from '../constants';
import { addInAppNotificationToStore } from './notificationService';
import { allMockVideos } from './youtubeService'; // To get video details for mock/selection

const API_KEY = typeof process !== 'undefined' && process.env && process.env.API_KEY 
                ? process.env.API_KEY 
                : GEMINI_API_KEY_PLACEHOLDER;

let ai: GoogleGenAI | null = null;

if (API_KEY && API_KEY !== GEMINI_API_KEY_PLACEHOLDER) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.error("Curation Service: Failed to initialize GoogleGenAI. Check API key and network.", error);
    ai = null; 
  }
} else {
  if (API_KEY === GEMINI_API_KEY_PLACEHOLDER) {
     console.warn("Curation Service: Gemini API key is a placeholder. Curated feeds will be mocked.");
  } else {
     console.warn("Curation Service: Gemini API key not found. Curated feeds will be mocked.");
  }
}

const MOCK_THEMES = [
    "Mind-Bending Science Docs", "Viral Comedy Gold", "Epic Gaming Moments", 
    "Future Tech Insights", "Travel Vlogs Uncharted", "DIY Home Projects",
    "Learn to Code Fast", "Space Exploration Wonders", "Hidden Culinary Gems",
    "Indie Music Discoveries"
];

const generateMockTheme = (existingThemes: string[] = []): string => {
    const availableThemes = MOCK_THEMES.filter(t => !existingThemes.includes(t));
    if (availableThemes.length === 0) return MOCK_THEMES[Math.floor(Math.random() * MOCK_THEMES.length)];
    return availableThemes[Math.floor(Math.random() * availableThemes.length)];
};

const generateMockVideosForTheme = (theme: string, videos: YouTubeVideo[], count: number = 5): { videoIds: string[], description: string } => {
    const shuffled = [...videos].sort(() => 0.5 - Math.random());
    const selectedVideos = shuffled.slice(0, count);
    return {
        videoIds: selectedVideos.map(v => v.id),
        description: `A mock curated list of amazing videos about "${theme}". Dive in and explore these hand-picked (mocked) selections perfect for your viewing pleasure.`
    };
};

async function generateCuratedFeedTheme(existingThemes: string[]): Promise<string> {
    if (!ai) {
        console.log("Curation Service: Using mock theme due to Gemini API unavailability.");
        return generateMockTheme(existingThemes);
    }
    try {
        const prompt = `Generate a short, catchy theme title (max 5 words) for a YouTube video playlist. It should be engaging and suitable for a general audience. If possible, avoid these themes: [${existingThemes.join(', ')}]. Examples: 'Epic Movie Soundtracks', 'Viral Comedy Gold', 'Mind-Blowing Tech'. Your response should be ONLY the theme title.`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_MODEL_TEXT,
            contents: prompt,
            // config: { temperature: 0.8 }
        });

        let theme = response.text.trim();
        // Basic cleanup
        theme = theme.replace(/["'.]/g, ''); // Remove quotes or trailing punctuation
        if (!theme) { // Fallback if Gemini returns empty
            console.warn("Curation Service: Gemini returned an empty theme, using mock.");
            return generateMockTheme(existingThemes);
        }
        return theme;
    } catch (error) {
        console.error("Curation Service: Error generating theme from Gemini:", error);
        return generateMockTheme(existingThemes);
    }
}

interface VideoSelectionResponse {
    videoIds: string[];
    description: string;
}

async function selectVideosForTheme(theme: string, availableVideos: YouTubeVideo[], count: number = 5): Promise<{ videoIds: string[], description: string }> {
    if (!ai) {
        console.log("Curation Service: Using mock videos for theme due to Gemini API unavailability.");
        return generateMockVideosForTheme(theme, availableVideos, count);
    }
    
    const videosForPrompt = availableVideos.map(v => ({ id: v.id, title: v.title, description: v.description.substring(0,100) + "..." }));

    try {
        const prompt = `Given the theme "${theme}", select exactly ${count} relevant video IDs from the following list.
For each video, consider its title and description.
Provide your response strictly as a JSON object with two keys:
1.  "videoIds": An array of ${count} selected video string IDs (e.g., ["videoId1", "videoId2"]).
2.  "description": A short, engaging 1-2 sentence description (max 150 characters) for this curated feed based on the theme and selected videos. This description should entice users to watch.

Video List:
${JSON.stringify(videosForPrompt)}

Ensure your JSON is valid.
`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_MODEL_TEXT,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                // temperature: 0.5 
            }
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
          jsonStr = match[2].trim();
        }

        const parsedData = JSON.parse(jsonStr) as VideoSelectionResponse;

        if (!parsedData.videoIds || !Array.isArray(parsedData.videoIds) || parsedData.videoIds.length === 0 || !parsedData.description) {
            console.error("Curation Service: Gemini returned invalid JSON structure for video selection. Falling back to mock.", parsedData);
            return generateMockVideosForTheme(theme, availableVideos, count);
        }
        
        // Ensure videoIds are valid from the provided list
        const validVideoIds = parsedData.videoIds.filter(id => availableVideos.some(v => v.id === id));
        if(validVideoIds.length !== parsedData.videoIds.length){
            console.warn("Curation Service: Gemini selected some invalid video IDs. Filtering them out.");
        }
        if(validVideoIds.length === 0){
            console.error("Curation Service: Gemini selected no valid video IDs. Falling back to mock.");
            return generateMockVideosForTheme(theme, availableVideos, count);
        }


        return { videoIds: validVideoIds.slice(0, count), description: parsedData.description };

    } catch (error) {
        console.error("Curation Service: Error selecting videos from Gemini or parsing JSON:", error);
        return generateMockVideosForTheme(theme, availableVideos, count);
    }
}

export async function getLatestCuratedFeed(): Promise<CuratedFeed | null> {
    let storedFeeds: CuratedFeed[] = [];
    try {
        const rawStoredFeeds = localStorage.getItem(CURATED_FEEDS_STORAGE_KEY);
        if (rawStoredFeeds) {
            storedFeeds = JSON.parse(rawStoredFeeds);
        }
    } catch (e) {
        console.error("Curation Service: Error reading curated feeds from localStorage", e);
    }

    const latestFeed = storedFeeds.length > 0 ? storedFeeds[0] : null; // Assuming newest is first

    if (latestFeed && (Date.now() - latestFeed.generatedAt < CURATED_FEED_STALE_HOURS * 60 * 60 * 1000)) {
        console.log("Curation Service: Using recent curated feed from localStorage.");
        return latestFeed;
    }

    console.log("Curation Service: Generating new curated feed.");
    const existingThemeTitles = storedFeeds.map(f => f.title);
    const newThemeTitle = await generateCuratedFeedTheme(existingThemeTitles);
    const { videoIds, description } = await selectVideosForTheme(newThemeTitle, allMockVideos, 5);

    if (videoIds.length === 0) {
        console.warn("Curation Service: Failed to select videos for the new theme. Not creating feed.");
        return latestFeed; // Return old one if new generation failed
    }

    const newFeed: CuratedFeed = {
        id: `curated_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        title: newThemeTitle,
        description: description,
        videoIds: videoIds,
        generatedAt: Date.now(),
        themePrompt: `Generated theme: ${newThemeTitle}` // Example, can be more detailed
    };

    const updatedFeeds = [newFeed, ...storedFeeds].slice(0, 5); // Keep last 5 feeds
    try {
        localStorage.setItem(CURATED_FEEDS_STORAGE_KEY, JSON.stringify(updatedFeeds));
    } catch (e) {
        console.error("Curation Service: Error saving new curated feed to localStorage", e);
    }

    // Notify user about the new feed
    addInAppNotificationToStore(
        `✨ New Curated Feed: ${newFeed.title}`,
        newFeed.description,
        InAppNotificationType.GEMINI_CURATED_NEW,
        '/' // Link to home, where the feed will be displayed
        // We could add a specific anchor like '/#curated-feed-${newFeed.id}' if the UI supports scrolling to it.
    );
    console.log(`Curation Service: New feed "${newFeed.title}" generated and notification sent.`);
    return newFeed;
}
