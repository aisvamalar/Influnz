/**
 * Inline verification controls shared by the business and creator sign-up forms
 * and the creator onboarding verify step: the "Verify / Verified · Change" action
 * that sits inside an .aw-control, and the OTP panel that opens beneath it.
 */
import { BadgeCheck } from 'lucide-react';
import OtpInput from './OtpInput';
import type { OtpVerification } from './useOtpVerification';

export function VerifyAction({
  show, verified, busy, started, onVerify, onChange, label = 'Verify',
}: {
  show: boolean;
  verified: boolean;
  busy: boolean;
  started: boolean;
  onVerify: () => void;
  onChange: () => void;
  label?: string;
}) {
  if (verified) {
    return (
      <span className="aw-verified">
        <BadgeCheck size={16} />
        Verified
        <button type="button" className="aw-verified__change" onClick={onChange}>Change</button>
      </span>
    );
  }
  if (!show || started) return null;
  return (
    <button type="button" className="aw-inline-btn" onClick={onVerify} disabled={busy}>
      {busy ? <span className="aw-spin" /> : label}
    </button>
  );
}

export function OtpPanel({ otp, target, onResend }: { otp: OtpVerification; target: string; onResend: () => void }) {
  if (otp.status === 'idle' || otp.status === 'verified') return null;
  const sending = otp.status === 'sending';
  return (
    <div className="aw-verify" aria-live="polite">
      {sending ? (
        <p className="aw-verify__text"><span className="aw-spin" /> Sending code to {target}…</p>
      ) : (
        <>
          <p className="aw-verify__text">
            Enter the 6-digit code sent to <strong>{target}</strong>
          </p>
          <div className="aw-verify__row">
            <OtpInput
              size="sm" value={otp.code} onChange={otp.enter} autoFocus
              invalid={Boolean(otp.error)} disabled={otp.status === 'checking'}
            />
            {otp.status === 'checking' && <span className="aw-verify__checking"><span className="aw-spin" /> Checking…</span>}
          </div>
          {otp.error && <p className="aw-error" role="alert">{otp.error}</p>}
          <p className="aw-verify__meta">
            {otp.timer > 0 ? <>Resend code in {otp.timer}s</> : (
              <button type="button" className="aw-link" onClick={onResend}>Resend code</button>
            )}
            <span aria-hidden="true">·</span>
            <button type="button" className="aw-link aw-link--muted" onClick={otp.reset}>Cancel</button>
          </p>
        </>
      )}
    </div>
  );
}
