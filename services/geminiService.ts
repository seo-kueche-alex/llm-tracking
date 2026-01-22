
import { GoogleGenAI, Type } from "@google/genai";
import { LLMMentionItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getBrandInsights = async (brand: string, data: LLMMentionItem[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following LLM visibility data for the brand "${brand}". 
      Data: ${JSON.stringify(data)}
      Provide a concise executive summary (3-4 sentences) about their AI presence and one actionable optimization tip.`,
    });
    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI insight generation failed. Please check your API configuration.";
  }
};

export const enhanceMentionsWithSentiment = async (brand: string, items: LLMMentionItem[]): Promise<LLMMentionItem[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `For the brand "${brand}", categorize the sentiment of these LLM trigger prompts and generate a short context snippet for each.
      Data: ${JSON.stringify(items)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              keyword: { type: Type.STRING },
              sentiment: { type: Type.STRING, description: "positive, neutral, or negative" },
              context_snippet: { type: Type.STRING }
            },
            required: ["keyword", "sentiment", "context_snippet"]
          }
        }
      }
    });

    const enriched = JSON.parse(response.text || "[]");
    return items.map(item => {
      const match = enriched.find((e: any) => e.keyword === item.keyword);
      return {
        ...item,
        sentiment: match?.sentiment || 'neutral',
        context_snippet: match?.context_snippet || `Standard response context for ${item.keyword}`
      };
    });
  } catch (error) {
    console.error("Sentiment Enrichment Error:", error);
    return items;
  }
};
