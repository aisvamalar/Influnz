/**
 * Level 3 — Payments. Asked only when the business wants to pay creators.
 */
import { useState, type FormEvent, type ReactNode } from 'react';
import { ChevronDown, Landmark } from 'lucide-react';
import FormField from '../../auth/FormField';
import {
  ENTITY_TYPES, INDIAN_STATES, PATTERNS, getBusinessProfile, maskTail, savePaymentDetails,
  type PaymentDetails,
} from '../businessProfile';
import './business-profile.css';

interface Draft {
  legalName: string;
  entityType: string;
  pan: string;
  gstApplicable: boolean;
  gstin: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  holder: string;
  account: string;
  accountConfirm: string;
  ifsc: string;
  upi: string;
}

type Errors = Partial<Record<keyof Draft, string>>;

function toDraft(p: PaymentDetails, fallbackName: string, fallbackCity: string): Draft {
  return {
    legalName: p.legalName || fallbackName,
    entityType: p.entityType,
    pan: p.pan,
    gstApplicable: p.gstApplicable,
    gstin: p.gstin,
    line1: p.address.line1,
    line2: p.address.line2,
    city: p.address.city || fallbackCity,
    state: p.address.state,
    pincode: p.address.pincode,
    holder: p.bank.holder,
    account: p.bank.account,
    accountConfirm: p.bank.account,
    ifsc: p.bank.ifsc,
    upi: p.bank.upi,
  };
}

function validate(d: Draft): Errors {
  const e: Errors = {};
  if (d.legalName.trim().length < 2) e.legalName = 'Enter the legal name as on your PAN';
  if (!d.entityType) e.entityType = 'Choose your entity type';
  if (!PATTERNS.pan.test(d.pan)) e.pan = 'Enter a valid PAN, for example ABCDE1234F';
  if (d.gstApplicable) {
    if (!PATTERNS.gstin.test(d.gstin)) e.gstin = 'Enter a valid 15-character GSTIN';
    else if (PATTERNS.pan.test(d.pan) && d.gstin.slice(2, 12) !== d.pan) e.gstin = "This GSTIN doesn't belong to the PAN above";
  }
  if (d.line1.trim().length < 4) e.line1 = 'Enter your billing address';
  if (d.city.trim().length < 2) e.city = 'Enter the city';
  if (!d.state) e.state = 'Choose the state';
  if (!PATTERNS.pincode.test(d.pincode)) e.pincode = 'Enter a 6-digit PIN code';
  if (d.holder.trim().length < 2) e.holder = 'Enter the account holder name';
  if (!PATTERNS.account.test(d.account)) e.account = 'Account numbers are 9 to 18 digits';
  if (d.accountConfirm !== d.account) e.accountConfirm = "Account numbers don't match";
  if (!PATTERNS.ifsc.test(d.ifsc)) e.ifsc = 'Enter a valid IFSC, for example HDFC0001234';
  if (d.upi && !PATTERNS.upi.test(d.upi)) e.upi = 'Enter a valid UPI ID, for example brand@okhdfc';
  return e;
}

const ORDER: Array<keyof Draft> = [
  'legalName', 'entityType', 'pan', 'gstin', 'line1', 'city', 'state', 'pincode',
  'holder', 'account', 'accountConfirm', 'ifsc', 'upi',
];

interface PaymentSetupFormProps {
  onSaved?: () => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function PaymentSetupForm({ onSaved, onCancel, submitLabel = 'Save payment details' }: PaymentSetupFormProps) {
  const [draft, setDraft] = useState<Draft>(() => {
    const { payments, account } = getBusinessProfile();
    return toDraft(payments, account.businessName, account.city);
  });
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft(d => ({ ...d, [key]: value }));
    setErrors(e => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const next = validate(draft);
    setErrors(next);
    const first = ORDER.find(k => next[k]);
    if (first) {
      requestAnimationFrame(() => {
        const el = document.getElementById(`ps-${first}`);
        el?.focus({ preventScroll: true });
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      savePaymentDetails({
        legalName: draft.legalName.trim(),
        entityType: draft.entityType,
        pan: draft.pan,
        gstApplicable: draft.gstApplicable,
        gstin: draft.gstApplicable ? draft.gstin : '',
        address: {
          line1: draft.line1.trim(),
          line2: draft.line2.trim(),
          city: draft.city.trim(),
          state: draft.state,
          pincode: draft.pincode,
        },
        bank: {
          holder: draft.holder.trim(),
          account: draft.account,
          ifsc: draft.ifsc,
          upi: draft.upi.trim(),
        },
        completedAt: new Date().toISOString(),
      });
      setSaving(false);
      onSaved?.();
    }, 900);
  };

  const cls = (key: keyof Draft) => `aw-control${errors[key] ? ' is-invalid' : ''}`;

  const text = (
    key: keyof Draft,
    label: string,
    opts: { placeholder?: string; full?: boolean; optional?: boolean; help?: ReactNode; upper?: boolean; digits?: number; max?: number; autoComplete?: string; type?: string } = {},
  ) => (
    <FormField id={`ps-${key}`} label={label} full={opts.full} optional={opts.optional} error={errors[key]} help={opts.help}>
      <div className={cls(key)}>
        <input
          id={`ps-${key}`} type={opts.type ?? 'text'} placeholder={opts.placeholder}
          inputMode={opts.digits ? 'numeric' : undefined}
          maxLength={opts.digits ?? opts.max} autoComplete={opts.autoComplete ?? 'off'}
          value={draft[key] as string}
          aria-invalid={Boolean(errors[key])}
          onChange={e => {
            let v = e.target.value;
            if (opts.upper) v = v.toUpperCase().replace(/[^0-9A-Z]/g, '');
            if (opts.digits) v = v.replace(/\D/g, '');
            set(key, v as Draft[typeof key]);
          }}
        />
      </div>
    </FormField>
  );

  return (
    <form className="bp-form aw-scope" onSubmit={submit} noValidate aria-label="Payment details">
      <fieldset className="bp-group" disabled={saving}>
        <legend className="bp-group__title"><span>1</span> Legal entity</legend>
        <div className="aw-grid">
          {text('legalName', 'Legal entity name', { full: true, placeholder: 'As printed on your PAN', autoComplete: 'organization' })}
          <FormField id="ps-entityType" label="Entity type" error={errors.entityType}>
            <div className={`${cls('entityType')} aw-control--select`}>
              <select id="ps-entityType" value={draft.entityType} onChange={e => set('entityType', e.target.value)}>
                <option value="" disabled>Select</option>
                {ENTITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="aw-control__chevron" size={16} />
            </div>
          </FormField>
          {text('pan', 'PAN', { placeholder: 'ABCDE1234F', upper: true, max: 10 })}
        </div>
      </fieldset>

      <fieldset className="bp-group" disabled={saving}>
        <legend className="bp-group__title"><span>2</span> GST details</legend>
        <label className="bp-switch" htmlFor="ps-gst-toggle">
          <input
            id="ps-gst-toggle" type="checkbox" checked={draft.gstApplicable}
            onChange={e => set('gstApplicable', e.target.checked)}
          />
          <span className="bp-switch__track" aria-hidden="true" />
          <span>
            <strong>My business is GST registered</strong>
            <small>We'll add your GSTIN to invoices so you can claim input tax credit.</small>
          </span>
        </label>
        {draft.gstApplicable && (
          <div className="aw-grid bp-group__more">
            {text('gstin', 'GSTIN', { full: true, placeholder: '33ABCDE1234F1Z5', upper: true, max: 15 })}
          </div>
        )}
      </fieldset>

      <fieldset className="bp-group" disabled={saving}>
        <legend className="bp-group__title"><span>3</span> Billing address</legend>
        <div className="aw-grid">
          {text('line1', 'Address line 1', { full: true, placeholder: 'Building, street', autoComplete: 'address-line1' })}
          {text('line2', 'Address line 2', { full: true, optional: true, placeholder: 'Area, landmark', autoComplete: 'address-line2' })}
          {text('city', 'City', { placeholder: 'Chennai', autoComplete: 'address-level2' })}
          <FormField id="ps-state" label="State" error={errors.state}>
            <div className={`${cls('state')} aw-control--select`}>
              <select id="ps-state" value={draft.state} onChange={e => set('state', e.target.value)}>
                <option value="" disabled>Select state</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="aw-control__chevron" size={16} />
            </div>
          </FormField>
          {text('pincode', 'PIN code', { placeholder: '600001', digits: 6, autoComplete: 'postal-code' })}
        </div>
      </fieldset>

      <fieldset className="bp-group" disabled={saving}>
        <legend className="bp-group__title"><span>4</span> Bank and payment</legend>
        <div className="aw-grid">
          {text('holder', 'Account holder name', { full: true, placeholder: 'As per bank records' })}
          {text('account', 'Account number', { placeholder: '000123456789', digits: 18, type: 'password' })}
          {text('accountConfirm', 'Confirm account number', { placeholder: 'Re-enter account number', digits: 18 })}
          {text('ifsc', 'IFSC', { placeholder: 'HDFC0001234', upper: true, max: 11 })}
          {text('upi', 'UPI ID', { optional: true, placeholder: 'brand@okhdfc' })}
        </div>
        <p className="bp-note">
          <Landmark size={14} /> Refunds and unused campaign funds go back to this account.
        </p>
      </fieldset>

      <div className="bp-form__actions">
        {onCancel && (
          <button type="button" className="bp-btn bp-btn--ghost" onClick={onCancel} disabled={saving}>Cancel</button>
        )}
        <button type="submit" className="bp-btn bp-btn--primary" disabled={saving}>
          {saving ? <><span className="aw-spin aw-spin--light" /> Saving…</> : submitLabel}
        </button>
      </div>
    </form>
  );
}

export function PaymentDetailsSummary({ payments }: { payments: PaymentDetails }) {
  return (
    <dl className="bp-facts bp-facts--grid">
      <div><dt>Legal entity</dt><dd>{payments.legalName}<small>{payments.entityType}</small></dd></div>
      <div><dt>PAN</dt><dd>{maskTail(payments.pan, 4)}</dd></div>
      <div><dt>GST</dt><dd>{payments.gstApplicable ? maskTail(payments.gstin, 5) : 'Not registered'}</dd></div>
      <div>
        <dt>Billing address</dt>
        <dd>{payments.address.line1}<small>{payments.address.city}, {payments.address.state} {payments.address.pincode}</small></dd>
      </div>
      <div><dt>Bank account</dt><dd>{maskTail(payments.bank.account, 4)}<small>IFSC {payments.bank.ifsc}</small></dd></div>
      <div><dt>UPI</dt><dd>{payments.bank.upi || 'Not added'}</dd></div>
    </dl>
  );
}
