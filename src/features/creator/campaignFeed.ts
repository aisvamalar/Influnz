/**
 * Published campaigns, as the creator side sees them.
 *
 * The business app never calls into the creator app. Whatever it persists is the
 * hand-off, and this module only reads it (nothing here writes to business keys):
 *
 *  - `campaign_parameters` (+ `campaign_data`, `ai_strategy`) — saved when a
 *    business confirms the campaign parameters wizard ("Save & Start Campaign").
 *  - `influnz.campaignDraft.v1` — the strategy portfolio, used for creator slots.
 *  - `influnz.biz.profile` — the brand name shown on the invitation.
 *  - the business campaign catalog — campaigns that are live or filling up.
 *
 * Each source is turned into a creator-facing `CampaignBrief`: payout, deliverables,
 * due dates and terms. Total budget, fees and other creators never leave this file.
 * Swap `readSources()` for an API call when the backend exists.
 */
import { useSyncExternalStore } from 'react';
import { CAMPAIGNS as BUSINESS_CATALOG } from '../business/mobile/mobileCampaigns';
import cafeImg from '../../assets/campaigns/chennai-cafe.png';
import fashionImg from '../../assets/campaigns/mumbai-fashion.png';
import techImg from '../../assets/campaigns/bangalore-tech.png';
import festiveImg from '../../assets/campaigns/delhi-festive.png';
import type { CampaignBrief, DeliverableSpec } from './types';

/** What a brief carries on top of the creator-facing fields: the brand's per-slot payout. */
export interface PublishedCampaign extends CampaignBrief {
  brandName: string;
  brandVerified: boolean;
  /** What the brand has set aside for one micro-sized creator slot. Tier-scaled per creator. */
  baseOffer: number;
  usageRights: string;
  exclusivityDays: number;
  revisions: number;
}

// ── Small helpers ─────────────────────────────────────────────────────────────

export function toISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function parseISO(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}/.test(iso)) return null;
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function hash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

const round500 = (n: number) => Math.max(500, Math.round(n / 500) * 500);

// ── Labels shared with the business wizard ───────────────────────────────────

const PLATFORM_LABEL: Record<string, string> = {
  instagram: 'Instagram', youtube: 'YouTube', tiktok: 'TikTok', facebook: 'Facebook',
  twitter: 'X (Twitter)', linkedin: 'LinkedIn',
};

const OBJECTIVE_LABEL: Record<string, string> = {
  brand_awareness: 'Brand awareness', engagement: 'Engagement', conversions: 'Conversions',
  traffic: 'Website traffic', store_visits: 'Store visits', app_installs: 'App installs',
};

const PAYMENT_TERMS: Record<string, string> = {
  '100-upfront': '100% upfront',
  '50-50': '50% upfront, 50% on delivery',
  '30-70': '30% upfront, 70% on delivery',
  milestone: 'Milestone based',
};

interface ContentKind {
  name: string;
  spec: string;
  prefer: string[];
  format: (platform: string) => string;
}

const CONTENT_KINDS: Record<string, ContentKind> = {
  reel: {
    name: 'Reel', spec: '30–60s · vertical 9:16', prefer: ['instagram', 'youtube', 'tiktok'],
    format: p => (p === 'YouTube' ? 'YouTube Short' : p === 'TikTok' ? 'TikTok Video' : `${p} Reel`),
  },
  story: {
    name: 'Story', spec: '3 frames · vertical 9:16', prefer: ['instagram', 'facebook'],
    format: p => `${p} Story`,
  },
  post: {
    name: 'Post', spec: 'Single image or video · 4:5', prefer: ['instagram', 'facebook', 'linkedin', 'twitter'],
    format: p => `${p} Post`,
  },
  video: {
    name: 'Video', spec: '3–8 min · landscape 16:9', prefer: ['youtube', 'facebook'],
    format: p => (p === 'YouTube' ? 'YouTube Video' : `${p} Video`),
  },
  carousel: {
    name: 'Carousel', spec: '5–8 slides · square 1:1', prefer: ['instagram', 'linkedin', 'facebook'],
    format: p => `${p} Carousel`,
  },
  live: {
    name: 'Live session', spec: '30+ minutes live', prefer: ['instagram', 'youtube', 'facebook'],
    format: p => `${p} Live`,
  },
};

const STANDARD_CHECKLIST = ['Paid disclosure (#ad)', 'Product shown clearly', 'No misleading claims', 'Format & duration correct'];

function imageFor(category: string): string {
  const c = category.toLowerCase();
  if (/fashion|beauty|apparel|style/.test(c)) return fashionImg;
  if (/tech|gadget|gaming|app|software/.test(c)) return techImg;
  if (/food|cafe|café|restaurant|beverage|dining/.test(c)) return cafeImg;
  return festiveImg;
}

function brandIdentity(): { name: string; verified: boolean; city: string } {
  const profile = readJson<{ account?: { businessName?: string; city?: string }; verification?: { submittedAt?: string | null } }>('influnz.biz.profile');
  const name = profile?.account?.businessName?.trim();
  const usable = name && name !== 'Demo Business' ? name : 'Brew & Bites Café';
  return { name: usable, verified: Boolean(profile?.verification?.submittedAt), city: profile?.account?.city?.trim() || 'Chennai' };
}

/** First time this creator browser saw a campaign — stands in for the publish time. */
function publishedAtFor(id: string): string {
  const key = 'influnz.creator.campaignSeen';
  const seen = readJson<Record<string, string>>(key) ?? {};
  if (!seen[id]) {
    seen[id] = new Date().toISOString();
    try { localStorage.setItem(key, JSON.stringify(seen)); } catch { /* storage unavailable */ }
  }
  return seen[id];
}

// ── Wizard-published campaign ────────────────────────────────────────────────

interface WizardParameters {
  basic?: { campaignName?: string; campaignObjective?: string; startDate?: string; endDate?: string; budget?: number; description?: string };
  platforms?: { platforms?: string[] };
  content?: {
    contentTypes?: string[]; contentCount?: Record<string, number>; contentGuidelines?: string;
    hashtags?: string[]; mentions?: string[]; dosDonts?: { dos?: string[]; donts?: string[] };
  };
  creators?: {
    creatorTiers?: string[]; minFollowers?: number; maxFollowers?: number; location?: string;
    language?: string[]; niche?: string[]; engagementRate?: number;
  };
  budget?: { creatorBudget?: number; paymentTerms?: string; milestones?: Array<{ name: string; date: string; percentage: number }> };
}

interface AiStrategyData {
  strategy?: { description?: string };
  creators?: { total?: number };
}

interface CampaignDataSaved {
  description?: string;
  productCategory?: string;
  targetAudience?: { location?: string; language?: string };
}

interface DraftSaved { strategy?: string; negotiation?: { usageRights?: boolean; turnaroundDays?: number } }

const STRATEGY_SLOTS: Record<string, number> = { reach: 2, performance: 5, community: 4, hybrid: 3 };

/**
 * The wizard keeps its default 30/40/30 milestones even when the business picks a fixed
 * split, so the schedule comes from the payment terms. Only "milestone based" uses them.
 */
function payoutMilestones(
  terms: string | undefined,
  saved: Array<{ name: string; date: string; percentage: number }> | undefined,
  start: string,
  end: string,
) {
  switch (terms) {
    case '100-upfront': return [{ name: 'On contract signing', date: start, pct: 100 }];
    case '50-50': return [{ name: 'On contract signing', date: start, pct: 50 }, { name: 'On content approval', date: end, pct: 50 }];
    case '30-70': return [{ name: 'On contract signing', date: start, pct: 30 }, { name: 'On content approval', date: end, pct: 70 }];
    default: return (saved ?? []).map(m => ({ name: m.name, date: m.date, pct: m.percentage }));
  }
}

function buildPublished(): PublishedCampaign | null {
  const params = readJson<WizardParameters>('campaign_parameters');
  const title = params?.basic?.campaignName?.trim();
  if (!params || !title) return null;

  const data = readJson<CampaignDataSaved>('campaign_data');
  const ai = readJson<AiStrategyData>('ai_strategy');
  const draft = readJson<DraftSaved>('influnz.campaignDraft.v1');
  const brand = brandIdentity();

  const start = parseISO(params.basic?.startDate ?? '') ?? addDays(new Date(), 3);
  const endRaw = parseISO(params.basic?.endDate ?? '');
  const end = endRaw && endRaw >= start ? endRaw : addDays(start, 15);
  const span = Math.max(4, Math.round((end.getTime() - start.getTime()) / 86400000));

  const platformIds = (params.platforms?.platforms ?? []).filter(Boolean);
  const platformLabels = platformIds.map(p => PLATFORM_LABEL[p] ?? p);

  const typeIds = (params.content?.contentTypes ?? []).filter(t => CONTENT_KINDS[t]);
  const kinds = typeIds.length ? typeIds : ['reel'];
  const specs: DeliverableSpec[] = kinds.map((typeId, i) => {
    const kind = CONTENT_KINDS[typeId];
    const platformId = kind.prefer.find(p => platformIds.includes(p)) ?? platformIds[0] ?? kind.prefer[0];
    const platform = PLATFORM_LABEL[platformId] ?? 'Instagram';
    const due = addDays(start, Math.max(3, Math.round(((i + 1) / kinds.length) * span * 0.85)));
    return {
      id: `${typeId}-${i}`,
      title: `${title} ${kind.name}`,
      format: kind.format(platform),
      platform,
      count: Math.max(1, params.content?.contentCount?.[typeId] ?? 1),
      spec: kind.spec,
      due: toISO(due),
    };
  });

  const mentions = params.content?.mentions ?? [];
  const hashtags = params.content?.hashtags ?? [];
  const slots = ai?.creators?.total || STRATEGY_SLOTS[draft?.strategy ?? ''] || 5;
  const creatorPool = params.budget?.creatorBudget ?? (params.basic?.budget ?? 0) * 0.7;
  const category = data?.productCategory?.trim() || params.creators?.niche?.[0] || 'General';
  const id = `pub-${hash(`${title}|${params.basic?.startDate ?? ''}`)}`;

  return {
    campaignId: id,
    source: 'published',
    title,
    summary: params.basic?.description?.trim() || ai?.strategy?.description || data?.description || `${brand.name} is looking for creators for ${title}.`,
    objective: OBJECTIVE_LABEL[params.basic?.campaignObjective ?? ''] ?? (params.basic?.campaignObjective || 'Brand awareness'),
    category,
    image: imageFor(category),
    platforms: platformLabels.length ? platformLabels : ['Instagram'],
    location: params.creators?.location?.trim() || data?.targetAudience?.location?.trim() || brand.city,
    languages: params.creators?.language?.length ? params.creators.language : data?.targetAudience?.language ? [data.targetAudience.language] : ['English'],
    startDate: toISO(start),
    endDate: toISO(end),
    publishedAt: publishedAtFor(id),
    deliverableSpecs: specs,
    guidelines: params.content?.contentGuidelines?.trim() ?? '',
    hashtags,
    mentions,
    dos: params.content?.dosDonts?.dos ?? [],
    donts: params.content?.dosDonts?.donts ?? [],
    paymentTerms: PAYMENT_TERMS[params.budget?.paymentTerms ?? ''] ?? (params.budget?.paymentTerms || 'Released on approval'),
    milestones: payoutMilestones(params.budget?.paymentTerms, params.budget?.milestones, toISO(start), toISO(end)),
    eligibility: {
      tiers: params.creators?.creatorTiers ?? [],
      minFollowers: params.creators?.minFollowers ?? 0,
      maxFollowers: params.creators?.maxFollowers ?? 0,
      minEngagement: params.creators?.engagementRate ?? 0,
      languages: params.creators?.language ?? [],
      niches: params.creators?.niche ?? [],
    },
    checklist: [
      ...mentions.map(m => `Brand tag (@${m.replace(/^@/, '')})`),
      ...hashtags.slice(0, 3).map(h => `Hashtag #${h.replace(/^#/, '')}`),
      ...STANDARD_CHECKLIST,
    ],
    slots,
    brandCity: brand.city,
    brandName: brand.name,
    brandVerified: brand.verified,
    baseOffer: round500(creatorPool > 0 ? creatorPool / slots : 8000),
    usageRights: draft?.negotiation?.usageRights === false ? 'Organic social · 30 days' : 'Organic social + paid amplification · 60 days',
    exclusivityDays: 15,
    revisions: 2,
  };
}

// ── Catalog campaigns (live or filling on the business side) ─────────────────

interface CatalogBrief {
  offer: number;
  slots: number;
  objective: string;
  languages: string[];
  startIn: number;
  lengthDays: number;
  deliverables: Array<{ title: string; format: string; platform: string; count: number; spec: string; dueIn: number; notes?: string }>;
  guidelines: string;
  hashtags: string[];
  mentions: string[];
  dos: string[];
  donts: string[];
  terms: string;
  milestones: Array<{ name: string; dueIn: number; pct: number }>;
  eligibility: { tiers: string[]; minFollowers: number; maxFollowers: number; minEngagement: number; niches: string[] };
  checklist: string[];
  usage: string;
  exclusivityDays: number;
  revisions: number;
}

/** Briefs for the business catalog campaigns, keyed by the business campaign id. */
const CATALOG_BRIEFS: Record<number, CatalogBrief> = {
  1: {
    offer: 14000, slots: 8, objective: 'Store visits', languages: ['Tamil', 'English'], startIn: 3, lengthDays: 22,
    deliverables: [
      { title: 'Café Experience Reel', format: 'Instagram Reel', platform: 'Instagram', count: 1, spec: '30–60s · vertical 9:16', dueIn: 9, notes: 'Show the walk-in, the coffee pour and the first bite. Natural audio or Tamil voice-over.' },
      { title: 'Menu Highlight Story', format: 'Instagram Story', platform: 'Instagram', count: 1, spec: '3 frames · vertical 9:16', dueIn: 12, notes: 'One frame per signature item, with the price visible.' },
      { title: 'Closing Story', format: 'Instagram Story', platform: 'Instagram', count: 1, spec: '2 frames · vertical 9:16', dueIn: 16, notes: 'Finish with the location tag and a "visit this weekend" call to action.' },
    ],
    guidelines: 'Warm, honest and local. Tell your followers why this café is worth a visit, shot at the café itself. No stock footage and no heavy filters.',
    hashtags: ['ChennaiCafe', 'ChennaiFoodie', 'Ad'], mentions: ['ChennaiCafe'],
    dos: ['Tag @ChennaiCafe and the café location', 'Show the product clearly in the first 3 seconds', 'Say the offer: free dessert with any two drinks'],
    donts: ['Compare with competing cafés', 'Make health or price claims we did not give you', 'Use copyrighted music'],
    terms: '50% on contract, 50% on approval',
    milestones: [{ name: 'Contract signed', dueIn: 3, pct: 50 }, { name: 'Content approved', dueIn: 18, pct: 50 }],
    eligibility: { tiers: ['Nano', 'Micro', 'Macro'], minFollowers: 10000, maxFollowers: 1000000, minEngagement: 3, niches: ['Food', 'Lifestyle'] },
    checklist: ['Brand tag (@ChennaiCafe)', 'Paid disclosure (#ad)', 'Product shown clearly', 'No misleading claims', 'Format & duration correct'],
    usage: 'Organic social · 20 days', exclusivityDays: 20, revisions: 2,
  },
  2: {
    offer: 9000, slots: 6, objective: 'Brand awareness', languages: ['English', 'Hindi'], startIn: 8, lengthDays: 15,
    deliverables: [
      { title: 'Collection Reveal Reel', format: 'Instagram Reel', platform: 'Instagram', count: 1, spec: '20–45s · vertical 9:16', dueIn: 13, notes: 'Style three looks from the new collection.' },
      { title: 'Try-on Stories', format: 'Instagram Story', platform: 'Instagram', count: 2, spec: '3 frames each · vertical 9:16', dueIn: 16 },
    ],
    guidelines: 'Confident and personal. Wear the pieces the way you would on a normal day.',
    hashtags: ['MumbaiFashionDrop', 'Ad'], mentions: ['MumbaiFashionDrop'],
    dos: ['Tag the brand and the products', 'Show fit and fabric in motion'],
    donts: ['Edit the colours of the garments', 'Use other brand names in frame'],
    terms: '30% on contract, 70% on approval',
    milestones: [{ name: 'Contract signed', dueIn: 8, pct: 30 }, { name: 'Content approved', dueIn: 18, pct: 70 }],
    eligibility: { tiers: ['Nano', 'Micro'], minFollowers: 5000, maxFollowers: 200000, minEngagement: 3, niches: ['Fashion', 'Lifestyle', 'Beauty'] },
    checklist: ['Brand tag (@MumbaiFashionDrop)', 'Paid disclosure (#ad)', 'Product shown clearly', 'No misleading claims', 'Format & duration correct'],
    usage: 'Organic social · 30 days', exclusivityDays: 10, revisions: 1,
  },
};

function buildCatalog(): PublishedCampaign[] {
  const brand = brandIdentity();
  const today = new Date();
  const out: PublishedCampaign[] = [];
  for (const c of BUSINESS_CATALOG) {
    // Drafts are not published yet and completed campaigns no longer take creators.
    if (c.status !== 'active' && c.status !== 'pending') continue;
    const brief = CATALOG_BRIEFS[c.id];
    if (!brief) continue;
    const id = `cat-${c.id}`;
    const start = addDays(today, brief.startIn);
    out.push({
      campaignId: id,
      source: 'catalog',
      title: c.name,
      summary: c.description,
      objective: brief.objective,
      category: c.category,
      image: c.image,
      platforms: [c.platform],
      location: c.location.replace(/\s*[•(].*$/, '').trim() || c.location,
      languages: brief.languages,
      startDate: toISO(start),
      endDate: toISO(addDays(start, brief.lengthDays)),
      publishedAt: publishedAtFor(id),
      deliverableSpecs: brief.deliverables.map((d, i) => ({
        id: `${id}-d${i}`, title: d.title, format: d.format, platform: d.platform, count: d.count,
        spec: d.spec, due: toISO(addDays(today, d.dueIn)), notes: d.notes,
      })),
      guidelines: brief.guidelines,
      hashtags: brief.hashtags,
      mentions: brief.mentions,
      dos: brief.dos,
      donts: brief.donts,
      paymentTerms: brief.terms,
      milestones: brief.milestones.map(m => ({ name: m.name, date: toISO(addDays(today, m.dueIn)), pct: m.pct })),
      eligibility: { ...brief.eligibility, languages: brief.languages },
      checklist: brief.checklist,
      slots: brief.slots,
      brandCity: brand.city,
      brandName: brand.name,
      brandVerified: true,
      baseOffer: brief.offer,
      usageRights: brief.usage,
      exclusivityDays: brief.exclusivityDays,
      revisions: brief.revisions,
    });
  }
  return out;
}

// ── Store ────────────────────────────────────────────────────────────────────

const ARCHIVE_KEY = 'influnz.creator.campaignArchive';

/**
 * The business app keeps only its latest wizard campaign, so a second publish would
 * overwrite the first. Once a campaign has been published it stays published for
 * creators, so every one this browser has seen is kept here (newest first).
 */
function withArchive(current: PublishedCampaign | null): PublishedCampaign[] {
  const stored = readJson<PublishedCampaign[]>(ARCHIVE_KEY) ?? [];
  let list = stored;
  if (current) {
    const previous = stored.find(c => c.campaignId === current.campaignId);
    if (!previous || JSON.stringify(previous) !== JSON.stringify(current)) {
      list = [current, ...stored.filter(c => c.campaignId !== current.campaignId)].slice(0, 20);
      try { localStorage.setItem(ARCHIVE_KEY, JSON.stringify(list)); } catch { /* storage unavailable */ }
    }
  }
  // Image URLs are bundler paths that change between builds, so they are never trusted from storage.
  return list.map(c => ({ ...c, image: imageFor(c.category) }));
}

function readSources(): PublishedCampaign[] {
  return [...withArchive(buildPublished()), ...buildCatalog()];
}

let cache: PublishedCampaign[] = [];
let signature = '';
let primed = false;
const listeners = new Set<() => void>();

function refresh(): boolean {
  const next = readSources();
  // publishedAt is stable per campaign, so the signature only moves when content does.
  const sig = JSON.stringify(next);
  if (sig === signature) return false;
  signature = sig;
  cache = next;
  return true;
}

function ensurePrimed() {
  if (!primed) {
    primed = true;
    refresh();
  }
}

function onExternalChange() {
  if (refresh()) listeners.forEach(l => l());
}

function subscribe(listener: () => void) {
  ensurePrimed();
  if (listeners.size === 0 && typeof window !== 'undefined') {
    window.addEventListener('storage', onExternalChange);
    window.addEventListener('focus', onExternalChange);
    document.addEventListener('visibilitychange', onExternalChange);
  }
  listeners.add(listener);
  onExternalChange();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== 'undefined') {
      window.removeEventListener('storage', onExternalChange);
      window.removeEventListener('focus', onExternalChange);
      document.removeEventListener('visibilitychange', onExternalChange);
    }
  };
}

function getSnapshot(): PublishedCampaign[] {
  ensurePrimed();
  return cache;
}

/** Live list of campaigns businesses have published. Updates when another tab publishes. */
export function usePublishedCampaigns(): PublishedCampaign[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
