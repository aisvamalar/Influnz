export function inr(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}

export function compact(n: number): string {
  if (n >= 10000000) return (n / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
  if (n >= 100000) return (n / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parts(iso: string): { y: number; m: number; d: number } | null {
  const hit = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return hit ? { y: Number(hit[1]), m: Number(hit[2]) - 1, d: Number(hit[3]) } : null;
}

/** "2026-10-24" → "24 Oct" */
export function shortDate(iso: string): string {
  const p = parts(iso);
  return p ? `${p.d} ${MONTHS[p.m]}` : iso;
}

/** "2026-10-24", "2026-11-15" → "24 Oct – 15 Nov" */
export function dateRange(from: string, to: string): string {
  return `${shortDate(from)} – ${shortDate(to)}`;
}

/** Whole days from today to an ISO date (negative once it has passed). */
export function daysUntil(iso: string): number {
  const p = parts(iso);
  if (!p) return 0;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((new Date(p.y, p.m, p.d).getTime() - today) / 86400000);
}

/** "Due today", "Due tomorrow", "Due in 5 days", "3 days overdue" */
export function dueLabel(iso: string): string {
  const n = daysUntil(iso);
  if (n === 0) return 'Due today';
  if (n === 1) return 'Due tomorrow';
  if (n > 1) return `Due in ${n} days`;
  return `${-n} day${n === -1 ? '' : 's'} overdue`;
}

/** "2 hours ago", "yesterday", "3 days ago" */
export function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.max(0, Math.round(ms / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? 'yesterday' : `${days} days ago`;
}
