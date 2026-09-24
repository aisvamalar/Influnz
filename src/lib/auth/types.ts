export type UserRole = 'owner' | 'marketer';

export interface User {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarInitials: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SignupPayload {
  businessName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  identifier: string; // email or phone
  password: string;
  remember: boolean;
}

export interface OtpPayload {
  identifier: string;
  otp: string;
  type: 'email' | 'phone';
}

export interface AuthResponse {
  user: User;
  requiresOtp: boolean;
  otpTarget?: string;
  otpType?: 'email' | 'phone';
}
