/**
 * Helpers and online media for the mobile campaign workspace screens.
 */
import type { PlatformId } from '../../../components/mobile/PlatformMark';
import { INITIAL_CREATORS, type ContentDeliverable, type CreatorData } from '../campaignWorkspaceData';
import { CAMPAIGNS, type Platform, type Status } from './mobileCampaigns';

export interface WorkspaceCampaign {
  id: number;
  name: string;
  status: Status;
  platform: Platform;
  dates: string;
  dueDate: string;
  goal: string;
  description: string;
  budget: number;
  spent: number;
  image: string;
  creators: CreatorData[];
}

const CHENNAI_CAFE: WorkspaceCampaign = {
  id: 1,
  name: 'Chennai Café Launch',
  status: 'active',
  platform: 'Instagram',
  dates: 'Oct 24 – Nov 15',
  dueDate: 'Nov 10',
  goal: 'Drive local store visits and footfall',
  description: 'Drive local store visits and footfall for the new Chennai Café outlet with food & lifestyle creators.',
  budget: 150000,
  spent: 102000,
  image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&crop=entropy&w=320&h=360&q=70',
  creators: INITIAL_CREATORS,
};

/** Campaign for the workspace route; the creator flow (no :id) lands on Chennai Café Launch. */
export function getWorkspaceCampaign(id?: string): WorkspaceCampaign | null {
  if (id === undefined || id === String(CHENNAI_CAFE.id)) return CHENNAI_CAFE;
  const c = CAMPAIGNS.find((x) => String(x.id) === id);
  if (!c) return null;
  return {
    id: c.id,
    name: c.name,
    status: c.status,
    platform: c.platform,
    dates: c.dates,
    dueDate: c.dates.split('–')[1]?.trim() ?? c.dates,
    goal: c.description,
    description: `${c.description}. ${c.category} • ${c.location}`,
    budget: c.budget,
    spent: c.spent,
    image: c.image,
    creators: [],
  };
}

const AVATAR_PHOTOS: Record<string, string> = {
  shruti: '1760551938407-f66c40173749',
  pranav: '1763014456070-6f42f3d8fbb0',
  explorer: '1759840278511-f73a3d62fb9f',
  anu: '1756376755233-d3abcd9a5edb',
  rohit: '1694871420680-88c06ab9cc49',
  foodtales: '1774437891793-2013f7b5a04a',
  madras: '1507003211169-0a1dd7228f2d',
  cafe: '1669555354650-02227bc6c811',
};

/** Zoom into the face where the avatar reuses a wide content shot. */
const AVATAR_CROPS: Record<string, string> = {
  shruti: 'focalpoint&fp-x=0.47&fp-y=0.38&fp-z=2.6',
};

const CONTENT_PHOTOS: Record<string, string> = {
  'deliv-shruti-1': '1760551938407-f66c40173749',
  'deliv-shruti-2': '1757010055832-de355d2f8f06',
  'deliv-shruti-3': '1495474472287-4d71bcdd2085',
  'deliv-pranav-1': '1751956066306-c5684cbcf385',
  'deliv-rohit-1': '1761455952969-8ec513b486c0',
  'deliv-foodtales-1': '1509042239860-f550ce710b93',
};

/** Fallback café shots for delivered content that has no record in the data. */
export const EXTRA_CONTENT_PHOTOS = [
  '1757010055832-de355d2f8f06',
  '1495474472287-4d71bcdd2085',
  '1509042239860-f550ce710b93',
  '1751956066306-c5684cbcf385',
];

export const photoUrl = (id: string, w: number, h: number, crop = 'faces,center') =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=${crop}&w=${w}&h=${h}&q=70`;

export const avatarUrl = (creator: CreatorData, px: number) => {
  const id = AVATAR_PHOTOS[creator.id];
  return id ? photoUrl(id, px, px, AVATAR_CROPS[creator.id]) : null;
};

export const contentPhotoId = (d: ContentDeliverable, index = 0) =>
  CONTENT_PHOTOS[d.id] ?? EXTRA_CONTENT_PHOTOS[index % EXTRA_CONTENT_PHOTOS.length];

export const downloadUrl = (photoId: string) =>
  `https://images.unsplash.com/photo-${photoId}?w=1600&q=85&dl=influnz-${photoId}.jpg`;

export const instagramUrl = (handle: string) => `https://www.instagram.com/${handle.replace(/^@/, '')}/`;

export type ContentState = 'approved' | 'in_review' | 'pending' | 'not-started';

export const contentState = (c: CreatorData): ContentState =>
  c.contentStatus === 'completed' ? 'approved' : c.contentStatus;

export const CONTENT_STATE_LABEL: Record<ContentState, string> = {
  approved: 'Approved',
  in_review: 'In Review',
  pending: 'Pending',
  'not-started': 'Not Started',
};

export const DELIVERABLE_LABEL: Record<ContentDeliverable['status'], string> = {
  approved: 'Approved',
  in_review: 'In Review',
  revision: 'Revision',
  pending: 'Pending',
};

export function deliveredCounts(c: CreatorData) {
  const m = c.contentDeliveredText.match(/(\d+)\s*\/\s*(\d+)/);
  if (m) return { done: Number(m[1]), total: Number(m[2]) };
  return { done: c.contentDeliverables.length, total: c.contentDeliverables.length };
}

/** "Instagram Reel (30–60s)" → { name: "Instagram Reel", detail: "30–60s" } */
export function splitType(type: string) {
  const m = type.match(/^(.*?)\s*\((.*)\)\s*$/);
  return m ? { name: m[1], detail: m[2] } : { name: type, detail: '' };
}

export const platformOf = (type: string): PlatformId =>
  /youtube/i.test(type) ? 'youtube' : /tiktok/i.test(type) ? 'tiktok' : 'instagram';

/** Playback length for the preview: "0:45" → 45s, story frames run 5s each. */
export function durationSeconds(d: ContentDeliverable) {
  const clockMatch = d.duration.match(/^(\d+):(\d{2})$/);
  if (clockMatch) return Number(clockMatch[1]) * 60 + Number(clockMatch[2]);
  const frames = d.duration.match(/(\d+)\s*frames?/);
  return frames ? Number(frames[1]) * 5 : 30;
}

export const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export const rupees = (s: string) => Number(s.split('(')[0].replace(/[^\d]/g, '')) || 0;

export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export const creatorInitials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');
