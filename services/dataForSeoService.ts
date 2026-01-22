
import { LLMMentionItem, AuthConfig } from "../types";

/**
 * Note: DataForSEO API usually requires a server-side proxy due to CORS.
 * For this client-side demonstration, we implement the logic and provide 
 * mock data if the direct request fails or credentials aren't provided.
 */
export const fetchLLMMentions = async (brand: string, auth: AuthConfig): Promise<LLMMentionItem[]> => {
  // In a real app, you would use a proxy to avoid CORS and hide credentials
  // For the purpose of this demo, we'll provide realistic mock data if the API call isn't feasible
  
  // Real implementation attempt (would likely hit CORS in browser)
  if (auth.user && auth.pass) {
    try {
      // This is the structure for DataForSEO LLM Mentions API
      const endpoint = "https://api.dataforseo.com/v3/ai_optimization/llm_mentions/search/live";
      const credentials = btoa(`${auth.user}:${auth.pass}`);
      
      const payload = [{
        target: brand,
        location_code: 2840, // USA
        language_code: "en",
        limit: 10
      }];

      // Note: This fetch will likely fail in a standard browser environment without a proxy
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const items = data.tasks?.[0]?.result?.[0]?.items || [];
        return items.map((i: any) => ({
          keyword: i.keyword,
          search_volume: i.search_volume || 0,
          is_mentioned: i.is_mentioned || false
        }));
      }
    } catch (e) {
      console.warn("API call failed (likely CORS). Falling back to simulated data for demo.");
    }
  }

  // High-fidelity fallback/mock data for demonstration
  return generateMockData(brand);
};

const generateMockData = (brand: string): LLMMentionItem[] => {
  const variations = [
    `best ${brand} products 2024`,
    `${brand} vs competitors`,
    `how to use ${brand}`,
    `${brand} customer reviews`,
    `${brand} technical support`,
    `is ${brand} worth it?`,
    `${brand} new features`,
    `history of ${brand}`
  ];

  return variations.map(v => ({
    keyword: v,
    search_volume: Math.floor(Math.random() * 5000) + 500,
    is_mentioned: Math.random() > 0.3
  }));
};
