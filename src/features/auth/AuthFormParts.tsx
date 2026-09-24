/**
 * Shared micro-components used across auth forms.
 * Extracted to avoid duplication between Signup / Login / Reset.
 */
import React from 'react';
import { passwordStrength } from './schemas';

// ── Eye toggle icon ──
export function EyeIcon({ closed }: { closed: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
      {closed && <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />}
    </svg>
  );
}

// ── Password strength bar ──
export function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const { score, label, color } = passwordStrength(password);

  return (
    <div>
      <div className="in-strength">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="in-strength__seg"
            style={{ background: i <= score ? color : undefined }}
          />
        ))}
        {label && (
          <span className="in-strength__lbl" style={{ color }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Google icon ──
export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.64 9.2a10.35 10.35 0 00-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.91a8.78 8.78 0 002.69-6.62z" fill="#4285F4" />
      <path d="M9 18a8.6 8.6 0 005.96-2.18l-2.91-2.26a5.43 5.43 0 01-8.09-2.85H.96v2.33A9 9 0 009 18z" fill="#34A853" />
      <path d="M3.96 10.71a5.41 5.41 0 010-3.42V4.96H.96a9 9 0 000 8.08l3-2.33z" fill="#FBBC05" />
      <path d="M9 3.58a4.86 4.86 0 013.44 1.35L14.5 2.87A8.65 8.65 0 009 0 9 9 0 00.96 4.96l3 2.33A5.37 5.37 0 019 3.58z" fill="#EA4335" />
    </svg>
  );
}

// ── Spinner ──
export function Spinner() {
  return <span className="in-spinner" aria-hidden="true" />;
}

// ── Generic field wrapper ──
interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}
export function Field({ label, hint, error, htmlFor, children }: FieldProps) {
  return (
    <div className="in-field">
      <label className="in-label" htmlFor={htmlFor}>{label}</label>
      {children}
      {hint  && !error && <span className="in-hint" id={`${htmlFor}-hint`}>{hint}</span>}
      {error && <span className="in-err" id={`${htmlFor}-err`} role="alert">{error}</span>}
    </div>
  );
}
