/**
 * Settings — business profile (Levels 1 & 2), payments (Level 3) and preferences.
 */
import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AtSign, BadgeCheck, Briefcase, Building2, Check, ChevronDown, CreditCard, Globe, Mail, MapPin,
  Pencil, Phone, UserRound,
} from 'lucide-react';
import BusinessLayout from './BusinessLayout';
import FormField from '../auth/FormField';
import ProfileLevels from './profile/ProfileLevels';
import BusinessVerificationCard from './profile/BusinessVerificationCard';
import PaymentSetupForm, { PaymentDetailsSummary } from './profile/PaymentSetupForm';
import {
  BUSINESS_TYPES, POPULAR_CITIES, presenceKind, updateBusinessAccount, useBusinessProfile,
} from './businessProfile';
import './profile/business-profile.css';

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'payments', label: 'Payments' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'security', label: 'Security' },
] as const;

type TabKey = typeof TABS[number]['key'];

function isTab(value: string | null): value is TabKey {
  return TABS.some(t => t.key === value);
}

export default function SettingsPage() {
  const [params, setParams] = useSearchParams();
  const tabParam = params.get('tab');
  const tab: TabKey = isTab(tabParam) ? tabParam : 'profile';
  const [toast, setToast] = useState('');

  const setTab = (key: TabKey) => setParams(key === 'profile' ? {} : { tab: key }, { replace: true });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (tab !== 'profile' || window.location.hash !== '#verification') return;
    requestAnimationFrame(() => document.getElementById('verification')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, [tab]);

  const goVerify = () => {
    if (tab !== 'profile') setTab('profile');
    requestAnimationFrame(() => document.getElementById('verification')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <BusinessLayout breadcrumb="Settings">
      <div className="biz-page-head">
        <div>
          <h1 className="biz-page-head__title">Settings</h1>
          <p className="biz-page-head__sub">Manage your business profile, verification and payment details.</p>
        </div>
      </div>

      <div className="bset">
        <div className="bset-tabs" role="tablist" aria-label="Settings sections">
          {TABS.map(t => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={`bset-tabs__btn${tab === t.key ? ' is-active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div className="bset-stack">
            <ProfileLevels onVerify={goVerify} onPayments={() => setTab('payments')} />
            <AccountDetailsCard onSaved={() => setToast('Profile updated')} />
            <BusinessVerificationCard />
          </div>
        )}

        {tab === 'payments' && (
          <div className="bset-stack">
            <PaymentsCard onSaved={() => setToast('Payment details saved')} />
          </div>
        )}

        {(tab === 'notifications' || tab === 'security') && (
          <div className="biz-card" style={{ maxWidth: 600 }}>
            <div className="biz-empty" style={{ padding: '36px 0' }}>
              <p className="biz-empty__title">{tab === 'notifications' ? 'Notifications' : 'Security'} settings</p>
              <p className="biz-empty__desc">This section is coming in the next phase.</p>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className="bp-toast" role="status"><Check size={16} strokeWidth={2.5} /> {toast}</div>
      )}

      <style>{`
        .bset { display: flex; flex-direction: column; gap: 20px; max-width: 920px; }
        .bset-tabs { display: flex; gap: 4px; padding: 4px; border-radius: 12px; background: #f1ece8; align-self: flex-start; max-width: 100%; overflow-x: auto; }
        .bset-tabs__btn { height: 38px; padding: 0 18px; border: 0; border-radius: 9px; background: none; font: inherit; font-size: 0.875rem; font-weight: 600; color: #6b7280; cursor: pointer; white-space: nowrap; transition: background 0.15s, color 0.15s; }
        .bset-tabs__btn:hover { color: #1f2430; }
        .bset-tabs__btn.is-active { background: #fff; color: #1f2430; box-shadow: 0 1px 3px rgba(31,36,48,0.08); }
        .bset-stack { display: flex; flex-direction: column; gap: 20px; }
      `}</style>
    </BusinessLayout>
  );
}

function AccountDetailsCard({ onSaved }: { onSaved: () => void }) {
  const { account } = useBusinessProfile();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(account);
  const [error, setError] = useState<Partial<Record<'businessName' | 'contactPerson' | 'city' | 'presence', string>>>({});

  const startEdit = () => { setDraft(account); setError({}); setEditing(true); };

  const save = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof error = {};
    if (draft.businessName.trim().length < 2) next.businessName = 'Enter your business name';
    if (draft.contactPerson.trim().length < 2) next.contactPerson = 'Enter a contact person';
    if (draft.city.trim().length < 2) next.city = 'Enter your city';
    if (draft.presence.trim() && !presenceKind(draft.presence)) next.presence = 'Enter a website, @instagram handle or LinkedIn link';
    setError(next);
    if (Object.keys(next).length) return;
    const presence = draft.presence.trim();
    updateBusinessAccount({
      businessName: draft.businessName.trim(),
      contactPerson: draft.contactPerson.trim(),
      businessType: draft.businessType,
      city: draft.city.trim(),
      presence,
      presenceVerified: presence === account.presence ? account.presenceVerified : false,
    });
    setEditing(false);
    onSaved();
  };

  const kind = presenceKind(account.presence);

  return (
    <section className="bp-card aw-scope" aria-labelledby="bp-account-title">
      <header className="bp-card__head">
        <span className="bp-card__icon is-done"><Building2 size={20} /></span>
        <div>
          <span className="bp-card__level">Level 1</span>
          <h2 className="bp-card__title" id="bp-account-title">Account details</h2>
          <p className="bp-card__sub">What you shared at sign-up. Creators see your business name, type and city.</p>
        </div>
        {!editing && (
          <button type="button" className="bp-btn bp-btn--ghost" onClick={startEdit}>
            <Pencil size={14} /> Edit
          </button>
        )}
      </header>

      {!editing ? (
        <dl className="bp-facts">
          <div><dt>Business name</dt><dd>{account.businessName}</dd></div>
          <div><dt>Contact person</dt><dd>{account.contactPerson || '—'}</dd></div>
          <div><dt>Business type</dt><dd>{account.businessType}</dd></div>
          <div><dt>City</dt><dd>{account.city || '—'}</dd></div>
          <div>
            <dt>Phone</dt>
            <dd className="bset-verified">
              +91 {account.phone.slice(0, 5)} {account.phone.slice(5)}
              <span className="bp-chip bp-chip--ok"><BadgeCheck size={13} /> Verified</span>
            </dd>
          </div>
          <div>
            <dt>Work email</dt>
            <dd className="bset-verified">
              {account.email || 'Not added'}
              {account.email && (account.emailVerified
                ? <span className="bp-chip bp-chip--ok"><BadgeCheck size={13} /> Verified</span>
                : <span className="bp-chip bp-chip--warn">Unverified</span>)}
            </dd>
          </div>
          <div>
            <dt>{kind === 'instagram' ? 'Instagram' : kind === 'linkedin' ? 'LinkedIn' : 'Website'}</dt>
            <dd className="bset-verified">
              {account.presence || 'Not added'}
              {account.presence && (account.presenceVerified
                ? <span className="bp-chip bp-chip--ok"><BadgeCheck size={13} /> Verified</span>
                : <span className="bp-chip bp-chip--warn">Unverified</span>)}
            </dd>
          </div>
        </dl>
      ) : (
        <form className="bp-form" onSubmit={save} noValidate>
          <div className="aw-grid">
            <FormField id="ac-name" label="Business name" error={error.businessName}>
              <div className={`aw-control${error.businessName ? ' is-invalid' : ''}`}>
                <Building2 className="aw-control__icon" size={17} />
                <input id="ac-name" value={draft.businessName} onChange={e => setDraft({ ...draft, businessName: e.target.value })} />
              </div>
            </FormField>
            <FormField id="ac-contact" label="Contact person" error={error.contactPerson}>
              <div className={`aw-control${error.contactPerson ? ' is-invalid' : ''}`}>
                <UserRound className="aw-control__icon" size={17} />
                <input id="ac-contact" value={draft.contactPerson} onChange={e => setDraft({ ...draft, contactPerson: e.target.value })} />
              </div>
            </FormField>
            <FormField id="ac-type" label="Business type">
              <div className="aw-control aw-control--select">
                <Briefcase className="aw-control__icon" size={17} />
                <select id="ac-type" value={draft.businessType} onChange={e => setDraft({ ...draft, businessType: e.target.value })}>
                  {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="aw-control__chevron" size={16} />
              </div>
            </FormField>
            <FormField id="ac-city" label="City" error={error.city}>
              <div className={`aw-control${error.city ? ' is-invalid' : ''}`}>
                <MapPin className="aw-control__icon" size={17} />
                <input id="ac-city" list="ac-city-list" value={draft.city} onChange={e => setDraft({ ...draft, city: e.target.value })} />
                <datalist id="ac-city-list">{POPULAR_CITIES.map(c => <option key={c} value={c} />)}</datalist>
              </div>
            </FormField>
            <FormField
              id="ac-presence" label="Website / Instagram / LinkedIn" optional full error={error.presence}
              help={draft.presence.trim() && draft.presence.trim() !== account.presence ? 'Changed links need to be verified again.' : undefined}
            >
              <div className={`aw-control${error.presence ? ' is-invalid' : ''}`}>
                {presenceKind(draft.presence) === 'instagram' ? <AtSign className="aw-control__icon" size={17} /> : <Globe className="aw-control__icon" size={17} />}
                <input id="ac-presence" value={draft.presence} onChange={e => setDraft({ ...draft, presence: e.target.value })} />
              </div>
            </FormField>
            <FormField id="ac-phone" label="Phone" help="Used to sign in. Contact support to change it.">
              <div className="aw-control is-verified">
                <Phone className="aw-control__icon" size={17} />
                <input id="ac-phone" value={`+91 ${account.phone}`} readOnly />
              </div>
            </FormField>
            <FormField id="ac-email" label="Work email">
              <div className={`aw-control${account.emailVerified && account.email ? ' is-verified' : ''}`}>
                <Mail className="aw-control__icon" size={17} />
                <input id="ac-email" value={account.email || 'Not added'} readOnly />
              </div>
            </FormField>
          </div>
          <div className="bp-form__actions">
            <button type="button" className="bp-btn bp-btn--ghost" onClick={() => setEditing(false)}>Cancel</button>
            <button type="submit" className="bp-btn bp-btn--primary">Save changes</button>
          </div>
        </form>
      )}

      <style>{`
        .bset-verified { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      `}</style>
    </section>
  );
}

function PaymentsCard({ onSaved }: { onSaved: () => void }) {
  const { payments } = useBusinessProfile();
  const done = Boolean(payments.completedAt);
  const [editing, setEditing] = useState(!done);

  return (
    <section className="bp-card aw-scope" aria-labelledby="bp-payments-title">
      <header className="bp-card__head">
        <span className={`bp-card__icon${done ? ' is-done' : ''}`}><CreditCard size={20} /></span>
        <div>
          <span className="bp-card__level">Level 3</span>
          <h2 className="bp-card__title" id="bp-payments-title">
            Payment details
            {done
              ? <span className="bp-chip bp-chip--ok"><BadgeCheck size={13} /> Ready to pay creators</span>
              : <span className="bp-chip">Needed before your first payment</span>}
          </h2>
          <p className="bp-card__sub">
            Used for invoices, tax compliance and refunds. You only need this when you are ready to pay creators.
          </p>
        </div>
        {done && !editing && (
          <button type="button" className="bp-btn bp-btn--ghost" onClick={() => setEditing(true)}>
            <Pencil size={14} /> Edit
          </button>
        )}
      </header>

      {done && !editing ? (
        <PaymentDetailsSummary payments={payments} />
      ) : (
        <PaymentSetupForm
          onCancel={done ? () => setEditing(false) : undefined}
          onSaved={() => { setEditing(false); onSaved(); }}
        />
      )}
    </section>
  );
}
