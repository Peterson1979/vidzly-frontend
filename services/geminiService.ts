
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// IMPORTANT: API Key Management
// The API key MUST be set as an environment variable `process.env.API_KEY`.
// This client-side code assumes `process.env.API_KEY` is made available
// during the build process (e.g., via Vite's `import.meta.env.VITE_API_KEY`
// or a similar mechanism if this were a typical Vite setup, or Webpack's DefinePlugin).
// For this specific environment, we directly check `process.env.API_KEY`.
// DO NOT embed the API key directly in the code.
// The application MUST NOT prompt the user for the API key.

const API_KEY = AIzaSyBDb5keY8-YdEA6M6i-Zl19RJ6kpkfx9aA;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("Gemini API key (process.env.API_KEY) is not configured. AI features will be disabled.");
}

export const generateTagsForVideo = async (title: string, description?: string): Promise<string[] | null> => {
  if (!ai) {
    console.error("Gemini AI client not initialized. API Key might be missing.");
    return null;
  }

  const prompt = `Generate 5-7 relevant, concise, comma-separated tags for a video with the following details. Output only the tags, separated by commas.
Title: ${title}
Description: ${description || 'No description provided.'}

Tags:`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17", // Use the specified model
      contents: prompt,
      config: {
        temperature: 0.5,
        topK: 32,
        topP: 0.9,
        // For this type of task, disabling thinking might be okay for speed.
        // For higher quality or more complex generation, omit thinkingConfig or set a budget.
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    const textResponse = response.text;
    if (!textResponse) {
      console.error("Gemini API returned an empty response.");
      return null;
    }

    // Clean up the response: split by comma, trim whitespace, filter empty tags
    const tags = textResponse
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    return tags;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // You could inspect the error type here for more specific messages
    // e.g. if (error instanceof GoogleGenAIError) { ... }
    return null;
  }
};