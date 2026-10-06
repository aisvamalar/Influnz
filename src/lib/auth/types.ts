export type UserRole = 'owner' | 'marketer';

// Which side of the marketplace the account belongs to
export type AccountType = 'creator' | 'business';

export interface User {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  role: UserRole;
  accountType: AccountType;
  avatarInitials: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SignupPayload {
  businessName: string;   // for creators this holds their display name
  email: string;
  phone: string;
  password: string;
  accountType: AccountType;
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
  accountType?: AccountType;
}
