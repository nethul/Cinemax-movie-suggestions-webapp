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

    For each recommendation, provide the following in a JSON object:
    1. "title": The title of the recommended movie.
    2. "reason": A short, compelling, and personalized paragraph (2-3 sentences) explaining *why* they will love it, connecting it back to the tastes demonstrated by their favorite movies.
    3. "match_reasons": An array of 2-3 short strings. Each string should be a bullet point that specifically highlights a shared feature with one of the user's favorite movies. For example: "Shares the philosophical depth and stunning visuals of 'Blade Runner 2049'." or "Features a complex, non-linear narrative similar to 'Inception'."

    The user loves:
    ${movieList}

    Return the response as a JSON array of objects, following the schema precisely.
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
                description: "A short, compelling paragraph explaining why the user will like this movie based on their favorites."
              },
              match_reasons: {
                type: Type.ARRAY,
                description: "A list of specific features matching the user's favorite movies.",
                items: {
                    type: Type.STRING
                }
              }
            },
            required: ["title", "reason", "match_reasons"],
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