import { z } from 'zod';

const FREE_MAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'rediffmail.com'];

export const signupSchema = z.object({
  businessName: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .max(80, 'Business name must be 80 characters or fewer'),

  email: z
    .string()
    .email('Please enter a valid email address'),

  phone: z
    .string()
    .refine(
      (v) => /^[6-9]\d{9}$/.test(v.replace(/^\+91\s?/, '').replace(/\s/g, '')),
      'Enter a valid 10-digit Indian mobile number'
    ),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Include at least one uppercase letter')
    .regex(/[0-9]/, 'Include at least one number')
    .regex(/[^A-Za-z0-9]/, 'Include at least one special character'),

  consent: z
    .boolean()
    .refine(val => val === true, 'You must accept the terms to continue'),
}).superRefine((data, ctx) => {
  // Soft warn if free-mail domain
  const emailLower = data.email.toLowerCase();
  const domain = emailLower.split('@')[1];
  if (FREE_MAIL_DOMAINS.includes(domain)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Tip: using a work email helps with business verification',
      path: ['email'],
    });
  }
  // Password must not contain email local part
  const local = emailLower.split('@')[0];
  if (data.password.toLowerCase().includes(local)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password should not contain your email',
      path: ['password'],
    });
  }
});

export type SignupFormValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  password:   z.string().min(1, 'Password is required'),
  remember:   z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const otpSchema = z.object({
  otp: z.string().length(6, 'Enter the 6-digit code'),
});
export type OtpFormValues = z.infer<typeof otpSchema>;

export const forgotSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
});
export type ForgotFormValues = z.infer<typeof forgotSchema>;

export const resetSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Include at least one uppercase letter')
    .regex(/[0-9]/, 'Include at least one number'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: "Passwords don't match",
  path: ['confirm'],
});
export type ResetFormValues = z.infer<typeof resetSchema>;

// ── Password strength scorer ──────────────────────────────────────────────────
export function passwordStrength(pwd: string): { score: 0|1|2|3|4; label: string; color: string } {
  let s = 0;
  if (pwd.length >= 8)       s++;
  if (/[A-Z]/.test(pwd))    s++;
  if (/[0-9]/.test(pwd))    s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  const map: Array<{ label: string; color: string }> = [
    { label: '',       color: 'transparent' },
    { label: 'Weak',   color: '#e05252' },
    { label: 'Fair',   color: '#b76b3e' },
    { label: 'Good',   color: '#5a9bd4' },
    { label: 'Strong', color: '#2e7d32' },
  ];
  return { score: s as 0|1|2|3|4, ...map[s] };
}
