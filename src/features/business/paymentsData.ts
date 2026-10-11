/**
 * Creator payments shared by the web and mobile Payments screens.
 */
export type PayState = 'committed' | 'pending_release' | 'processing' | 'paid' | 'failed' | 'disputed';

export interface Payment {
  id: number;
  creator: string;
  campaign: string;
  amount: string;
  state: PayState;
  milestone: string;
  date: string;
}

export const PAYMENTS: Payment[] = [
  { id: 1, creator: 'Foodie Tamilan',  campaign: 'Chennai Café Launch',    amount: '₹10,000', state: 'pending_release', milestone: 'Content approved', date: '25 Sep 2026' },
  { id: 2, creator: 'Chennai Bites',   campaign: 'Chennai Café Launch',    amount: '₹11,500', state: 'committed',       milestone: 'Awaiting content',   date: '28 Sep 2026' },
  { id: 3, creator: 'Madras Food Trail', campaign: 'Chennai Café Launch',  amount: '₹6,200',  state: 'committed',       milestone: 'Awaiting content',   date: '30 Sep 2026' },
  { id: 4, creator: 'TechVoice India', campaign: 'Bangalore Tech Event',   amount: '₹22,000', state: 'paid',            milestone: 'Completed',          date: '10 Sep 2026' },
  { id: 5, creator: 'MumbaiStyle',     campaign: 'Mumbai Fashion Drop',    amount: '₹18,000', state: 'processing',      milestone: 'Processing payment', date: '20 Sep 2026' },
];

export const STATE_LABEL: Record<PayState, string> = {
  committed: 'Committed',
  pending_release: 'Pending Release',
  processing: 'Processing',
  paid: 'Paid',
  failed: 'Failed',
  disputed: 'Disputed',
};

export const amountValue = (amount: string) => parseInt(amount.replace(/[^0-9]/g, ''), 10) || 0;
