/**
 * Turns a published campaign into an invitation for one creator.
 *
 * The business side shows a campaign with every creator, their numbers and the
 * whole budget. Here the same campaign is reduced to what matters to this one
 * creator: how well they fit, what they would be paid, and what they have to make.
 */
import type { PublishedCampaign } from './campaignFeed';
import { dateRange } from './format';
import type { CreatorPreferences, CreatorProfile, Invitation, MatchBreakdown } from './types';

type Tier = 'nano' | 'micro' | 'macro' | 'mega';

const TIER_WEIGHT: Record<Tier, number> = { nano: 0.6, micro: 1, macro: 1.6, mega: 3 };

export function tierOf(followers: number): Tier {
  if (followers >= 1_000_000) return 'mega';
  if (followers >= 100_000) return 'macro';
  if (followers >= 10_000) return 'micro';
  return 'nano';
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').trim();

/** Topic words that mean the same thing across the business and creator pickers. */
const SYNONYMS: Record<string, string[]> = {
  food: ['food', 'beverage', 'cafe', 'café', 'restaurant', 'dining', 'cuisine'],
  technology: ['tech', 'technology', 'gadget', 'gadgets', 'software', 'gaming'],
  fashion: ['fashion', 'apparel', 'style', 'clothing'],
  beauty: ['beauty', 'skincare', 'haircare', 'makeup', 'cosmetics'],
  fitness: ['fitness', 'health', 'wellness', 'gym', 'sports'],
  travel: ['travel', 'tourism', 'hotel', 'hospitality'],
  lifestyle: ['lifestyle', 'home', 'living'],
  education: ['education', 'learning', 'edtech', 'courses'],
};

function topicKey(topic: string): string {
  const t = norm(topic);
  for (const [key, words] of Object.entries(SYNONYMS)) {
    if (t === key || words.some(w => t.split(' ').includes(w) || t.includes(w))) return key;
  }
  return t;
}

function topicMatches(creatorTopics: string[], wanted: string[]): string | null {
  const have = new Set(creatorTopics.map(topicKey));
  for (const w of wanted) if (have.has(topicKey(w))) return w;
  return null;
}

function round500(n: number): number {
  return Math.max(500, Math.round(n / 500) * 500);
}

export interface CreatorFit {
  offer: number;
  pct: number;
  breakdown: MatchBreakdown;
  reasons: string[];
}

export function fitForCreator(c: PublishedCampaign, profile: CreatorProfile, prefs: CreatorPreferences): CreatorFit {
  const tier = tierOf(profile.followers);
  const offer = round500(c.baseOffer * TIER_WEIGHT[tier] * (profile.engagement >= 8 ? 1.1 : 1));
  const reasons: string[] = [];

  // Category — the creator's own topics (including any custom "Other" topic) against what the campaign asks for.
  const topics = prefs.categories.length ? prefs.categories : profile.categories;
  const wanted = [c.category, ...c.eligibility.niches];
  const hit = topicMatches(topics, wanted);
  const category = hit ? 96 : 42;
  if (hit) reasons.push(`${hit} is one of your topics`);

  // Location — same city beats same state beats elsewhere.
  const cityOf = (s: string) => norm(s.split(',')[0]);
  const campaignPlace = norm(c.location);
  const creatorPlace = norm(profile.location);
  let location = 55;
  if (!campaignPlace || /^(any|india|pan india|all)/.test(campaignPlace)) location = 85;
  else if (creatorPlace && (campaignPlace.includes(cityOf(profile.location)) || creatorPlace.includes(cityOf(c.location)))) {
    location = 98;
    reasons.push(`You are based in ${profile.location.split(',')[0]}, where this campaign runs`);
  } else if (creatorPlace && profile.location.split(',').pop()?.trim() && creatorPlace.includes(norm(c.location.split(',').pop() ?? ''))) {
    location = 78;
  }

  // Audience — the platforms and languages the campaign needs against the ones the creator posts in.
  const myPlatforms = new Set<string>([
    ...prefs.platforms,
    ...profile.platforms.filter(p => p.state === 'connected').map(p => p.platform),
  ]);
  const platformHits = c.platforms.filter(p => myPlatforms.has(p.toLowerCase() as never));
  const platformScore = c.platforms.length ? (platformHits.length / c.platforms.length) * 100 : 80;
  const languageHits = c.languages.filter(l => prefs.languages.map(norm).includes(norm(l)));
  const languageScore = c.languages.length ? (languageHits.length / c.languages.length) * 100 : 80;
  const audience = clamp(platformScore * 0.55 + Math.max(languageScore, 40) * 0.45);
  if (platformHits.length) reasons.push(`You post on ${platformHits.join(' and ')}`);
  if (languageHits.length) reasons.push(`You create in ${languageHits.join(' and ')}, like the audience`);

  // Performance — followers inside the range the brand wants, and engagement above their floor.
  const { minFollowers, maxFollowers, minEngagement } = c.eligibility;
  let reach = 90;
  if (minFollowers && profile.followers < minFollowers) reach = 50;
  else if (maxFollowers && profile.followers > maxFollowers) reach = 78;
  const engagementScore = minEngagement ? clamp(60 + ((profile.engagement - minEngagement) / minEngagement) * 40) : 90;
  const performance = clamp(reach * 0.5 + engagementScore * 0.5);
  if (minEngagement && profile.engagement >= minEngagement) {
    reasons.push(`Your ${profile.engagement}% engagement beats the ${minEngagement}% they ask for`);
  }

  // Rate — how the payout sits against the creator's own minimum.
  const rate = prefs.minRate > 0 ? clamp(offer >= prefs.minRate ? 78 + Math.min(22, ((offer - prefs.minRate) / prefs.minRate) * 22) : (offer / prefs.minRate) * 70) : 85;
  if (offer >= prefs.minRate) reasons.push('The payout clears your minimum rate');

  const breakdown: MatchBreakdown = { audience, location, category, performance, rate };
  const pct = clamp(category * 0.3 + location * 0.2 + audience * 0.2 + performance * 0.15 + rate * 0.15);
  if (reasons.length === 0) reasons.push('The brand is open to creators across topics');
  return { offer, pct, breakdown, reasons: reasons.slice(0, 5) };
}

export function invitationFromCampaign(c: PublishedCampaign, profile: CreatorProfile, prefs: CreatorPreferences): Invitation {
  const fit = fitForCreator(c, profile, prefs);
  const range = dateRange(c.startDate, c.endDate);
  return {
    id: c.campaignId,
    brand: c.brandName,
    brandVerified: c.brandVerified,
    category: c.category,
    location: c.location,
    proposedRate: fit.offer,
    deliverables: c.deliverableSpecs.map(d => `${d.count} ${d.format}`),
    matchPct: fit.pct,
    matchBreakdown: fit.breakdown,
    deadline: range,
    timeline: range,
    status: 'new',
    objective: c.summary,
    whySelected: fit.reasons,
    usageRights: c.usageRights,
    exclusivityDays: c.exclusivityDays,
    revisions: c.revisions,
    paymentProtected: true,
    image: c.image,
    selectedForYou: fit.pct >= 85,
    invited: true,
    brief: c,
  };
}
