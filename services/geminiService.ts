import { GoogleGenAI, Type } from "@google/genai";
import { Movie, MovieRecommendation } from '../types';

export const getMovieRecommendations = async (movies: Movie[]): Promise<MovieRecommendation[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const movieList = movies.map(movie => `- ${movie.title}`).join('\n');
  const prompt = `
    As a world-class film connoisseur and recommendation expert, analyze the following list of movies that a user loves.
    Based on this list, identify the underlying themes, tones, directorial styles, narrative structures, and subtle emotional currents that connect these films.
    Do not just match by genre or actors.
    Generate a list of 5 unique movie recommendations that this user will almost certainly love, but might not have discovered.
    For each recommendation, provide a short, compelling, and personalized reason (1-2 sentences) explaining *why* they will love it, connecting it back to the tastes demonstrated by their favorite movies.

    The user loves:
    ${movieList}

    Return the response as a JSON array of objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "The title of the recommended movie."
              },
              reason: {
                type: Type.STRING,
                description: "A short, compelling reason why the user will like this movie based on their favorites."
              },
            },
            required: ["title", "reason"],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const recommendations: MovieRecommendation[] = JSON.parse(jsonText);
    return recommendations;

  } catch (error) {
    console.error("Error fetching recommendations:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get recommendations from Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching recommendations.");
  }
};
