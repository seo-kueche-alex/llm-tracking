
export interface LLMMentionItem {
  keyword: string;
  search_volume: number;
  is_mentioned: boolean;
  sentiment?: 'positive' | 'neutral' | 'negative';
  context_snippet?: string;
}

export interface BrandVisibilityReport {
  brand: string;
  totalMentions: number;
  avgSearchVolume: number;
  items: LLMMentionItem[];
  insights: string;
}

export interface AuthConfig {
  user: string;
  pass: string;
}
