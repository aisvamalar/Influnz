/**
 * Level 2 — Business verification. GSTIN is optional; the business either adds it
 * or confirms it isn't GST registered.
 */
import { useState, type FormEvent } from 'react';
import { BadgeCheck, FileText, Pencil, ShieldCheck } from 'lucide-react';
import FormField from '../../auth/FormField';
import {
  PATTERNS, maskTail, saveBusinessVerification, useBusinessProfile,
} from '../businessProfile';
import './business-profile.css';

const GST_STATES: Record<string, string> = {
  '06': 'Haryana', '07': 'Delhi', '08': 'Rajasthan', '09': 'Uttar Pradesh', '19': 'West Bengal',
  '24': 'Gujarat', '27': 'Maharashtra', '29': 'Karnataka', '32': 'Kerala', '33': 'Tamil Nadu',
  '34': 'Puducherry', '36': 'Telangana', '37': 'Andhra Pradesh',
};

export default function BusinessVerificationCard() {
  const { account, verification } = useBusinessProfile();
  const done = Boolean(verification.submittedAt);

  const [editing, setEditing] = useState(!done);
  const [gstin, setGstin] = useState(verification.gstin);
  const [notRegistered, setNotRegistered] = useState(verification.notRegistered);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const validGstin = PATTERNS.gstin.test(gstin);
  const stateName = validGstin ? GST_STATES[gstin.slice(0, 2)] : undefined;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!notRegistered && !gstin) {
      setError("Enter your GSTIN, or tick \"My business isn't registered for GST\"");
      return;
    }
    if (!notRegistered && !validGstin) {
      setError('Enter a valid 15-character GSTIN, for example 33ABCDE1234F1Z5');
      return;
    }
    setError('');
    setSaving(true);
    setTimeout(() => {
      saveBusinessVerification({
        gstin: notRegistered ? '' : gstin,
        notRegistered,
        submittedAt: new Date().toISOString(),
      });
      setSaving(false);
      setEditing(false);
    }, 900);
  };

  return (
    <section className="bp-card aw-scope" id="verification" aria-labelledby="bp-verify-title">
      <header className="bp-card__head">
        <span className={`bp-card__icon${done ? ' is-done' : ''}`}>
          {done ? <BadgeCheck size={20} /> : <ShieldCheck size={20} />}
        </span>
        <div>
          <span className="bp-card__level">Level 2</span>
          <h2 className="bp-card__title" id="bp-verify-title">Business verification</h2>
          <p className="bp-card__sub">
            Verified businesses get a badge that creators see on every invite, which means faster replies.
          </p>
        </div>
        {done && !editing && (
          <button type="button" className="bp-btn bp-btn--ghost" onClick={() => setEditing(true)}>
            <Pencil size={14} /> Edit
          </button>
        )}
      </header>

      {done && !editing ? (
        <dl className="bp-facts">
          <div>
            <dt>Status</dt>
            <dd><span className="bp-chip bp-chip--ok"><BadgeCheck size={13} /> Verified</span></dd>
          </div>
          <div>
            <dt>GSTIN</dt>
            <dd>{verification.notRegistered ? 'Not GST registered' : maskTail(verification.gstin, 5)}</dd>
          </div>
          <div>
            <dt>Business</dt>
            <dd>{account.businessName} · {account.businessType}</dd>
          </div>
        </dl>
      ) : (
        <form className="bp-form" onSubmit={submit} noValidate>
          <FormField
            id="bp-gstin" label="GSTIN" optional error={error}
            help={validGstin
              ? <>Looks right{stateName ? <> · registered in <strong>{stateName}</strong></> : null} · PAN {gstin.slice(2, 12)}</>
              : "15 characters, printed on your GST registration certificate."}
          >
            <div className={`aw-control${error ? ' is-invalid' : ''}${validGstin && !notRegistered ? ' is-verified' : ''}`}>
              <FileText className="aw-control__icon" size={17} />
              <input
                id="bp-gstin" type="text" placeholder="33ABCDE1234F1Z5" maxLength={15}
                value={gstin} disabled={notRegistered || saving}
                aria-invalid={Boolean(error)}
                onChange={e => { setGstin(e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '')); setError(''); }}
              />
            </div>
          </FormField>

          <label className="aw-consent" htmlFor="bp-not-registered">
            <input
              id="bp-not-registered" type="checkbox" checked={notRegistered} disabled={saving}
              onChange={e => { setNotRegistered(e.target.checked); setError(''); }}
            />
            <span>My business isn't registered for GST</span>
          </label>

          <div className="bp-form__actions">
            {done && (
              <button type="button" className="bp-btn bp-btn--ghost" onClick={() => setEditing(false)} disabled={saving}>
                Cancel
              </button>
            )}
            <button type="submit" className="bp-btn bp-btn--primary" disabled={saving}>
              {saving ? <><span className="aw-spin aw-spin--light" /> Verifying…</> : 'Verify business'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
