/** Maps error codes/shapes to user-friendly generic messages (no enumeration). */
export function extractAuthError(err: unknown): string {
  if (err && typeof err === 'object') {
    const e = err as Record<string, unknown>;
    if (e.code === 'ACCOUNT_EXISTS')     return 'An account with this email already exists.';
    if (e.code === 'INVALID_CREDENTIALS') return 'Incorrect email or password.';
    if (e.code === 'INVALID_OTP')        return 'Incorrect code. Please try again.';
    if (e.code === 'RATE_LIMITED')       return 'Too many attempts. Please wait a few minutes.';
    if (e.code === 'GOOGLE_CANCELLED')   return 'Google sign-in was cancelled.';
    if (typeof e.message === 'string')   return e.message;
  }
  if (!navigator.onLine) return 'No internet connection. Please check your network.';
  return 'Something went wrong. Please try again.';
}
