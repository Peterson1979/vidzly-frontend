
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_TEXT, GEMINI_API_KEY_PLACEHOLDER, MOCK_API_DELAY } from '../constants';

// Attempt to use environment variable for API key.
// The `process.env.API_KEY` is expected to be set in the execution environment.
const API_KEY = typeof process !== 'undefined' && process.env && process.env.API_KEY 
                ? process.env.API_KEY 
                : GEMINI_API_KEY_PLACEHOLDER;

let ai: GoogleGenAI | null = null;

if (API_KEY && API_KEY !== GEMINI_API_KEY_PLACEHOLDER) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI. Check API key and network.", error);
    ai = null; 
  }
} else {
  if (API_KEY === GEMINI_API_KEY_PLACEHOLDER) {
     console.warn("Gemini API key is a placeholder. Gemini features will be mocked.");
  } else {
     console.warn("Gemini API key not found. Gemini features will be mocked.");
  }
}

export const getVideoSummary = async (title: string, description: string): Promise<string> => {
  if (!ai) {
    // Mock response if API key is not available or initialization failed
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`This is a mock AI summary for "${title}". Key points: This video seems to be about ${description.substring(0,50)}... It likely offers engaging content, potentially high production value, and a clear message. Viewers often find this type of video informative and entertaining.`);
      }, MOCK_API_DELAY / 2); // Faster mock for summaries
    });
  }

  try {
    const prompt = `Provide a concise, engaging summary (2-3 sentences, max 150 characters) for a YouTube video titled "${title}" with description: "${description}". Highlight its key appeal or what a viewer can expect.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: prompt,
        // config: { temperature: 0.7 } // Example config, adjust as needed
    });

    let summaryText = response.text;
    
    // Clean up potential markdown fences if responseMimeType was accidentally set to json elsewhere (though not here)
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = summaryText.match(fenceRegex);
    if (match && match[2]) {
      summaryText = match[2].trim();
    }

    return summaryText.trim();

  } catch (error) {
    console.error("Error fetching summary from Gemini:", error);
    // Provide a more specific error message or fallback
    if (error instanceof Error && error.message.includes("API key not valid")) {
         return `Could not generate summary: Invalid Gemini API Key. Please check your configuration.`;
    }
    return `AI summary unavailable for "${title}" due to an error.`;
  }
};
