/**
 * Auth service interface + mock implementation.
 * Swap out mockAuthService for a real implementation — zero component changes needed.
 */

import type { AuthResponse, LoginPayload, OtpPayload, SignupPayload, User } from './types';

export interface IAuthService {
  signup(payload: SignupPayload): Promise<AuthResponse>;
  login(payload: LoginPayload): Promise<AuthResponse>;
  verifyOtp(payload: OtpPayload): Promise<{ user: User }>;
  resendOtp(identifier: string): Promise<void>;
  googleSignIn(): Promise<AuthResponse>;
  forgotPassword(identifier: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  logout(): Promise<void>;
  getSession(): Promise<User | null>;
}

// ── Simulated delay helper ──
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// ── Mock data store (in-memory) ──
const MOCK_USERS = new Map<string, { user: User; password: string }>();
const MOCK_OTP = '123456';
let mockSession: User | null = null;

// ── Mock implementation ──
export const mockAuthService: IAuthService = {
  async signup({ businessName, email, phone, password }) {
    await delay(1200);
    const emailKey = email.toLowerCase();
    if (MOCK_USERS.has(emailKey)) {
      throw { code: 'ACCOUNT_EXISTS', message: 'An account with this email already exists.' };
    }
    const user: User = {
      id: `usr_${Date.now()}`,
      businessName,
      email,
      phone,
      role: 'owner',
      avatarInitials: businessName.slice(0, 2).toUpperCase(),
    };
    MOCK_USERS.set(emailKey, { user, password });
    return { user, requiresOtp: true, otpTarget: email, otpType: 'email' };
  },

  async login({ identifier, password, remember }) {
    await delay(1000);
    const key = identifier.toLowerCase();
    const record = MOCK_USERS.get(key)
      ?? [...MOCK_USERS.values()].find(r => r.user.phone === identifier);
    if (!record || record.password !== password) {
      throw { code: 'INVALID_CREDENTIALS', message: 'Incorrect email or password.' };
    }
    if (remember) mockSession = record.user;
    return { user: record.user, requiresOtp: false };
  },

  async verifyOtp({ identifier, otp }) {
    await delay(900);
    if (otp !== MOCK_OTP) {
      throw { code: 'INVALID_OTP', message: 'Incorrect code. Please try again.' };
    }
    const key = identifier.toLowerCase();
    const record = MOCK_USERS.get(key)
      ?? [...MOCK_USERS.values()].find(r => r.user.phone === identifier);
    if (!record) throw { code: 'NOT_FOUND', message: 'Account not found.' };
    mockSession = record.user;
    return { user: record.user };
  },

  async resendOtp(_identifier) {
    await delay(600);
    // In mock, OTP is always MOCK_OTP
  },

  async googleSignIn() {
    await delay(1000);
    const user: User = {
      id: 'usr_google_demo',
      businessName: 'Demo Business',
      email: 'demo@gmail.com',
      phone: '9000000001',
      role: 'owner',
      avatarInitials: 'DB',
    };
    mockSession = user;
    MOCK_USERS.set(user.email, { user, password: '' });
    return { user, requiresOtp: false };
  },

  async forgotPassword(_identifier) {
    await delay(900);
    // Mock: always succeeds
  },

  async resetPassword(_token, _password) {
    await delay(900);
  },

  async logout() {
    await delay(300);
    mockSession = null;
  },

  async getSession() {
    await delay(200);
    return mockSession;
  },
};

// ── Active service (swap here for real API) ──
export const authService: IAuthService = mockAuthService;
