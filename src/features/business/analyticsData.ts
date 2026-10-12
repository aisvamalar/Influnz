/**
 * Performance analytics shared by the web and mobile Analytics screens.
 */
export interface CreatorPerf {
  name: string;
  reach: string;
  views: string;
  engagements: string;
  enquiries: string;
  spend: string;
  cac: string;
  perf: number;
}

export const CREATOR_PERF: CreatorPerf[] = [
  { name: 'Foodie Tamilan', reach: '2.1L', views: '1.84L', engagements: '180K', enquiries: '310', spend: '₹10,000', cac: '₹32', perf: 94 },
  { name: 'Chennai Bites',  reach: '380K', views: '310K',  engagements: '38K',  enquiries: '142', spend: '₹11,500', cac: '₹81', perf: 78 },
  { name: 'Madras Food Trail', reach: '62K', views: '48K', engagements: '12K', enquiries: '88', spend: '₹6,200', cac: '₹70', perf: 82 },
];

export const TREND = [
  { label: '1 Sep', views: 0 },
  { label: '8 Sep', views: 12000 },
  { label: '15 Sep', views: 58000 },
  { label: '22 Sep', views: 145000 },
  { label: '30 Sep', views: 184000 },
];

export interface AiRecommendation {
  kind: 'growth' | 'alert' | 'target';
  icon: string;
  rec: string;
}

export const AI_OPTS: AiRecommendation[] = [
  { kind: 'growth', icon: 'trending', rec: 'Foodie Tamilan is driving 3× more enquiries per rupee spent. Consider allocating ₹8,000 more for Phase 2.' },
  { kind: 'alert', icon: 'zap', rec: 'Chennai Bites engagement rate dropped after Day 3. Content cadence may need review.' },
  { kind: 'target', icon: 'target', rec: 'Overall CAC of ₹52 is below the ₹80 target. Campaign is performing above expectations.' },
];

export interface Kpi {
  label: string;
  value: string;
  delta: string;
  dir: 'up' | 'down' | '';
}

export const KPIS: Kpi[] = [
  { label: 'Total views', value: '2.8M', delta: '+12%', dir: 'up' },
  { label: 'Engagements', value: '180K', delta: '+95%', dir: 'up' },
  { label: 'Enquiries', value: '302', delta: '+140%', dir: 'up' },
  { label: 'Story visits', value: '110', delta: '+145%', dir: 'up' },
  { label: 'Total spend', value: '₹27,700', delta: '', dir: '' },
  { label: 'Avg. CAC', value: '₹52', delta: '↓35%', dir: 'up' },
];
