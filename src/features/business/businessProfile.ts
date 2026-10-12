/**
 * Business profile store (demo, localStorage-backed).
 *
 * Level 1 — Account: collected and verified at sign-up.
 * Level 2 — Business verification: GSTIN (optional), asked from the profile.
 * Level 3 — Payments: legal entity, PAN, GST, billing address and bank details,
 *           asked only when the business wants to pay creators.
 */
import { useSyncExternalStore } from 'react';

export const BUSINESS_TYPES = [
  'Company',
  'Proprietorship',
  'Partnership',
  'LLP',
  'Private Limited',
  'Agency',
  'Startup',
  'Other',
] as const;

export const ENTITY_TYPES = [
  'Private Limited Company',
  'Public Limited Company',
  'LLP',
  'Partnership Firm',
  'Sole Proprietorship',
  'Trust / Society / NGO',
] as const;

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
] as const;

export const POPULAR_CITIES = [
  'Chennai', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad',
  'Coimbatore', 'Kochi', 'Jaipur', 'Lucknow', 'Chandigarh', 'Indore', 'Madurai',
];

export interface BusinessAccount {
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  emailVerified: boolean;
  businessType: string;
  presence: string;
  presenceVerified: boolean;
  city: string;
}

export interface BusinessVerification {
  gstin: string;
  notRegistered: boolean;
  submittedAt: string | null;
}

export interface BillingAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

export interface BankDetails {
  holder: string;
  account: string;
  ifsc: string;
  upi: string;
}

export interface PaymentDetails {
  legalName: string;
  entityType: string;
  pan: string;
  gstApplicable: boolean;
  gstin: string;
  address: BillingAddress;
  bank: BankDetails;
  completedAt: string | null;
}

export interface BusinessProfile {
  account: BusinessAccount;
  verification: BusinessVerification;
  payments: PaymentDetails;
}

// ── Validation ───────────────────────────────────────────────────────────────

export const PATTERNS = {
  phone: /^[6-9]\d{9}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  gstin: /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
  pan: /^[A-Z]{5}\d{4}[A-Z]$/,
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  pincode: /^[1-9]\d{5}$/,
  account: /^\d{9,18}$/,
  upi: /^[\w.-]{2,}@[a-zA-Z]{2,}$/,
};

export type PresenceKind = 'instagram' | 'linkedin' | 'website';

/** Classifies a Website / Instagram / LinkedIn entry, or returns null if it isn't usable. */
export function presenceKind(value: string): PresenceKind | null {
  const v = value.trim().toLowerCase();
  if (!v) return null;
  if (v.startsWith('@') || v.includes('instagram.com')) return /^@?[\w.]{2,30}$/.test(v) || v.includes('instagram.com/') ? 'instagram' : null;
  if (v.includes('linkedin.com/')) return 'linkedin';
  return /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/.test(v) ? 'website' : null;
}

export function maskTail(value: string, visible = 4): string {
  if (value.length <= visible) return value;
  return `${'•'.repeat(Math.min(6, value.length - visible))}${value.slice(-visible)}`;
}

// ── Store ────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'influnz.biz.profile';

const EMPTY_PAYMENTS: PaymentDetails = {
  legalName: '',
  entityType: '',
  pan: '',
  gstApplicable: false,
  gstin: '',
  address: { line1: '', line2: '', city: '', state: '', pincode: '' },
  bank: { holder: '', account: '', ifsc: '', upi: '' },
  completedAt: null,
};

const DEMO_PROFILE: BusinessProfile = {
  account: {
    businessName: 'Demo Business',
    contactPerson: 'Priya Raman',
    phone: '9000000001',
    email: 'demo@influnz.in',
    emailVerified: true,
    businessType: 'Company',
    presence: '',
    presenceVerified: false,
    city: 'Chennai',
  },
  verification: { gstin: '', notRegistered: false, submittedAt: null },
  payments: EMPTY_PAYMENTS,
};

function read(): BusinessProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEMO_PROFILE;
    const parsed = JSON.parse(raw) as Partial<BusinessProfile>;
    return {
      account: { ...DEMO_PROFILE.account, ...parsed.account },
      verification: { ...DEMO_PROFILE.verification, ...parsed.verification },
      payments: {
        ...EMPTY_PAYMENTS,
        ...parsed.payments,
        address: { ...EMPTY_PAYMENTS.address, ...parsed.payments?.address },
        bank: { ...EMPTY_PAYMENTS.bank, ...parsed.payments?.bank },
      },
    };
  } catch {
    return DEMO_PROFILE;
  }
}

let current: BusinessProfile = read();
const listeners = new Set<() => void>();

function commit(next: BusinessProfile) {
  current = next;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
  listeners.forEach(l => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function getBusinessProfile(): BusinessProfile {
  return current;
}

/** Starts a fresh profile for a newly created account. */
export function createBusinessAccount(account: BusinessAccount) {
  commit({
    account,
    verification: { gstin: '', notRegistered: false, submittedAt: null },
    payments: EMPTY_PAYMENTS,
  });
}

export function updateBusinessAccount(patch: Partial<BusinessAccount>) {
  commit({ ...current, account: { ...current.account, ...patch } });
}

export function saveBusinessVerification(verification: BusinessVerification) {
  const payments = current.payments.completedAt || !verification.gstin
    ? current.payments
    : {
        ...current.payments,
        gstApplicable: true,
        gstin: verification.gstin,
        pan: current.payments.pan || verification.gstin.slice(2, 12),
      };
  commit({ ...current, verification, payments });
}

export function savePaymentDetails(payments: PaymentDetails) {
  commit({ ...current, payments });
}

export function useBusinessProfile(): BusinessProfile {
  return useSyncExternalStore(subscribe, getBusinessProfile, getBusinessProfile);
}

// ── Progress ─────────────────────────────────────────────────────────────────

export interface ProfileProgress {
  verificationDone: boolean;
  paymentsDone: boolean;
  /** Level 1 + Level 2 — what "profile complete" means. */
  profileComplete: boolean;
  percent: number;
}

export function profileProgress(profile: BusinessProfile): ProfileProgress {
  const verificationDone = Boolean(profile.verification.submittedAt);
  const paymentsDone = Boolean(profile.payments.completedAt);
  const percent = 40 + (verificationDone ? 35 : 0) + (paymentsDone ? 25 : 0);
  return { verificationDone, paymentsDone, profileComplete: verificationDone, percent };
}
