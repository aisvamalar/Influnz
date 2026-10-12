/**
 * Creator account store (demo, localStorage-backed).
 *
 * The creator counterpart of businessProfile.ts: what we learn at sign-up
 * (name + verified phone), what the onboarding verify step adds (email),
 * and whether onboarding (verify → passport → preferences) is complete so a
 * returning creator lands on the dashboard instead of the stepper.
 */
import { useSyncExternalStore } from 'react';

export interface CreatorAccount {
  displayName: string;
  phone: string;
  email: string;
  emailVerified: boolean;
  onboardingComplete: boolean;
  createdAt: string | null;
}

const STORAGE_KEY = 'influnz.creator.account';

/** Used when someone signs in as a creator without having signed up in this browser. */
export const DEMO_CREATOR: CreatorAccount = {
  displayName: 'Foodie Tamilian',
  phone: '9000000002',
  email: 'hello@foodietamilian.in',
  emailVerified: true,
  onboardingComplete: true,
  createdAt: null,
};

function read(): CreatorAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CreatorAccount>;
    return { ...DEMO_CREATOR, ...parsed };
  } catch {
    return null;
  }
}

let current: CreatorAccount | null = read();
const listeners = new Set<() => void>();

function commit(next: CreatorAccount) {
  current = next;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
  listeners.forEach(l => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function getCreatorAccount(): CreatorAccount | null {
  return current;
}

/** Starts a fresh account for a newly signed-up creator. Onboarding begins from scratch. */
export function createCreatorAccount(input: { displayName: string; phone: string }) {
  commit({
    displayName: input.displayName,
    phone: input.phone,
    email: '',
    emailVerified: false,
    onboardingComplete: false,
    createdAt: new Date().toISOString(),
  });
}

export function updateCreatorAccount(patch: Partial<CreatorAccount>) {
  commit({ ...(current ?? DEMO_CREATOR), ...patch });
}

/**
 * Demo sign-in: the stored account if one exists (its phone is updated to the
 * number used), otherwise the demo creator, who has already finished onboarding.
 */
export function signInCreator(phone: string): CreatorAccount {
  const next = current ? { ...current, phone } : { ...DEMO_CREATOR, phone };
  commit(next);
  return next;
}

export function useCreatorAccount(): CreatorAccount | null {
  return useSyncExternalStore(subscribe, getCreatorAccount, getCreatorAccount);
}

/** "Shruti Menon" → "shruti_menon" */
export function usernameFrom(name: string): string {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  return slug || 'creator';
}
