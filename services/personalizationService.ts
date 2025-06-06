
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { YouTubeVideo, FavoriteItem } from '../types';
import { 
    GEMINI_MODEL_TEXT, 
    GEMINI_API_KEY_PLACEHOLDER, 
    MOCK_API_DELAY
} from '../constants';
import { allMockVideos as globalAllMockVideos } from './youtubeService'; // To access all videos

const API_KEY = typeof process !== 'undefined' && process.env && process.env.API_KEY 
                ? process.env.API_KEY 
                : GEMINI_API_KEY_PLACEHOLDER;

let ai: GoogleGenAI | null = null;

if (API_KEY && API_KEY !== GEMINI_API_KEY_PLACEHOLDER) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.error("Personalization Service: Failed to initialize GoogleGenAI.", error);
    ai = null; 
  }
} else {
  if (API_KEY === GEMINI_API_KEY_PLACEHOLDER) {
     console.warn("Personalization Service: Gemini API key is a placeholder. 'For You' feed may be mocked.");
  } else {
     console.warn("Personalization Service: Gemini API key not found. 'For You' feed may be mocked.");
  }
}

interface PersonalizedFeedResponse {
    recommendedVideoIds: string[];
}

const generateMockRecommendations = (favoriteItems: FavoriteItem[], allVideos: YouTubeVideo[], count: number = 5): YouTubeVideo[] => {
    console.log("Personalization Service: Generating mock recommendations.");
    const favoriteVideoIds = new Set(favoriteItems.map(fav => fav.videoId));
    const nonFavoritedVideos = allVideos.filter(video => !favoriteVideoIds.has(video.id));
    
    let recommendations: YouTubeVideo[] = [];
    if (nonFavoritedVideos.length > 0) {
        // Prioritize non-favorited videos
        const shuffledNonFavorites = [...nonFavoritedVideos].sort(() => 0.5 - Math.random());
        recommendations = shuffledNonFavorites.slice(0, count);
    }
    
    // If not enough non-favorites, fill with any random videos (excluding already selected)
    if (recommendations.length < count) {
        const remainingCount = count - recommendations.length;
        const recommendationIds = new Set(recommendations.map(r => r.id));
        const availableForAll = allVideos.filter(video => !recommendationIds.has(video.id) && !favoriteVideoIds.has(video.id));
        const shuffledAll = [...availableForAll].sort(() => 0.5 - Math.random());
        recommendations.push(...shuffledAll.slice(0, remainingCount));
    }
    
    // If still not enough (e.g. very few videos overall), try to include some favorites if absolutely necessary
    // but ideally the feed should show new content. This part is less likely with mock data.
    if (recommendations.length < count && favoriteItems.length > 0) {
        const favDetails = allVideos.filter(v => favoriteVideoIds.has(v.id) && !recommendations.some(r => r.id === v.id));
        recommendations.push(...favDetails.slice(0, count - recommendations.length));
    }


    return recommendations.slice(0, count); // Ensure exactly count items if possible
};

export const getPersonalizedFeed = async (favoriteItems: FavoriteItem[], allVideos: YouTubeVideo[]): Promise<YouTubeVideo[]> => {
    if (!ai || favoriteItems.length === 0) {
        await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2)); // Simulate network delay
        return generateMockRecommendations(favoriteItems, allVideos);
    }

    try {
        const userProfileParts: string[] = [];
        const favoriteChannels = new Set<string>();
        const favoriteKeywords = new Set<string>();

        favoriteItems.forEach(fav => {
            const videoDetail = allVideos.find(v => v.id === fav.videoId);
            if (videoDetail) {
                favoriteChannels.add(videoDetail.channelTitle);
                // Extract keywords from title/description (simple split for now)
                videoDetail.title.toLowerCase().split(/\s+/).forEach(word => favoriteKeywords.add(word));
                videoDetail.description.substring(0,50).toLowerCase().split(/\s+/).forEach(word => favoriteKeywords.add(word));
            }
        });
        
        if (favoriteChannels.size > 0) {
            userProfileParts.push(`User enjoys channels like: ${Array.from(favoriteChannels).slice(0,5).join(', ')}.`);
        }
        if (favoriteKeywords.size > 0) {
            // Select some prominent keywords, could be improved with frequency analysis
            const commonKeywords = Array.from(favoriteKeywords).filter(k => k.length > 3 && isNaN(Number(k))).slice(0,10);
            if(commonKeywords.length > 0) userProfileParts.push(`User shows interest in topics related to: ${commonKeywords.join(', ')}.`);
        }
        
        if (userProfileParts.length === 0) { // Still no profile even with favorites (e.g. video details missing)
             return generateMockRecommendations(favoriteItems, allVideos);
        }

        const userProfilePrompt = userProfileParts.join(' ');
        const videoIdsToExclude = favoriteItems.map(fav => fav.videoId);
        const candidateVideosForPrompt = allVideos
            .filter(v => !videoIdsToExclude.includes(v.id))
            .map(v => ({ id: v.id, title: v.title, description: v.description.substring(0, 150) + "..." }))
            .slice(0, 50); // Limit candidates to avoid overly long prompt

        if (candidateVideosForPrompt.length < 5) { // Not enough candidates for meaningful recommendation
            return generateMockRecommendations(favoriteItems, allVideos);
        }

        const prompt = `
            Based on the following user profile: "${userProfilePrompt}"
            Recommend 5 unique video IDs from the candidate video list below that the user might like.
            Do NOT recommend any video IDs that are already in the user's favorites (excluded from candidate list).
            
            Candidate Video List (ID, Title, Description Snippet):
            ${JSON.stringify(candidateVideosForPrompt)}

            Provide your response strictly as a JSON object with a single key "recommendedVideoIds", which is an array of 5 video string IDs.
            Example: {"recommendedVideoIds": ["videoId1", "videoId2", "videoId3", "videoId4", "videoId5"]}
            Ensure the JSON is valid.
        `;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_MODEL_TEXT,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.7, // Allow some creativity
            }
        });
        
        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
          jsonStr = match[2].trim();
        }

        const parsedData = JSON.parse(jsonStr) as PersonalizedFeedResponse;

        if (!parsedData.recommendedVideoIds || !Array.isArray(parsedData.recommendedVideoIds) || parsedData.recommendedVideoIds.length === 0) {
            console.error("Personalization Service: Gemini returned invalid JSON structure for recommendations. Falling back to mock.", parsedData);
            return generateMockRecommendations(favoriteItems, allVideos);
        }

        const recommendedVideosDetails = parsedData.recommendedVideoIds
            .map(id => allVideos.find(video => video.id === id))
            .filter(video => video !== undefined) as YouTubeVideo[];
        
        if(recommendedVideosDetails.length < 5 && recommendedVideosDetails.length > 0) {
             // If Gemini returned fewer than 5, fill up with mock non-favorites
            const mockFill = generateMockRecommendations(favoriteItems, allVideos, 5 - recommendedVideosDetails.length);
            const currentIds = new Set(recommendedVideosDetails.map(v => v.id));
            mockFill.forEach(mf => {
                if(!currentIds.has(mf.id) && recommendedVideosDetails.length < 5) {
                    recommendedVideosDetails.push(mf);
                    currentIds.add(mf.id);
                }
            });
        }


        return recommendedVideosDetails.length > 0 ? recommendedVideosDetails : generateMockRecommendations(favoriteItems, allVideos);

    } catch (error) {
        console.error("Personalization Service: Error getting personalized feed from Gemini or parsing JSON:", error);
        return generateMockRecommendations(favoriteItems, allVideos);
    }
};
