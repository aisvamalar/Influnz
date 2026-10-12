export type ConversationStage = 'initial' | 'results';
export type CreationMode = 'ai' | 'manual';
export type TabKey = 'strategy' | 'creators' | 'content' | 'budget' | 'timeline';

export interface CampaignParameter {
  key: string;
  label: string;
  value: string;
  icon: string;
}

export interface ExtractedParameters {
  goal: string;
  budget: string;
  location: string;
  duration: string;
  category: string;
  targetAudience: string;
  language: string;
  platform: string;
}

export interface Metric {
  icon: string;
  label: string;
  value: string;
}

export interface GeneratedStrategy {
  title: string;
  description: string;
  icon: string;
  metrics: {
    creators: number;
    estimatedReach: string;
    totalBudget: string;
  };
  highlights: string[];
}
