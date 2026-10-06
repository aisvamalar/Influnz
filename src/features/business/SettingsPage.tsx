/**
 * Screen 02 & Settings — Business Profile + Settings
 */
import { useState } from 'react';
import { useAuth } from '../../app/AuthContext';
import BusinessLayout from './BusinessLayout';

const TABS = ['Profile', 'Payments', 'Notifications', 'Team', 'Security'];

export default function SettingsPage() {
  const { state } = useAuth();
  const [tab, setTab] = useState('Profile');
  const [businessName, setBusinessName] = useState(state.user?.businessName ?? 'Brew & Bites');
  const [category, setCategory] = useState('Restaurant / Café');
  const [location, setLocation] = useState('Chennai, Tamil Nadu');
  const [website, setWebsite] = useState('https://brewandbites.in');
  const [description, setDescription] = useState('A modern café serving great coffee, food and community. We want to bring more people to our café through local creators.');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <BusinessLayout breadcrumb="Settings">
      <div className="biz-page-head">
        <div>
          <h1 className="biz-page-head__title">Settings</h1>
          <p className="biz-page-head__sub">Manage your business profile, payments and preferences.</p>
        </div>
      </div>

      {/* Tab row */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--in-border)', marginBottom: 24, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              height: 42, padding: '0 18px', borderRadius: '8px 8px 0 0',
              fontSize: '0.875rem', fontWeight: tab === t ? 700 : 500,
              border: 'none',
              borderBottom: `2px solid ${tab === t ? 'var(--in-coral)' : 'transparent'}`,
              background: 'none',
              color: tab === t ? 'var(--in-coral-text)' : 'var(--in-gray)',
              cursor: 'pointer', fontFamily: 'inherit',
              marginBottom: -2, transition: 'color 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === 'Profile' && (
        <div style={{ maxWidth: 600 }}>
          {/* Logo */}
          <div className="biz-card" style={{ marginBottom: 16 }}>
            <p className="biz-card__title" style={{ marginBottom: 14 }}>Business Logo</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 72, height: 72, borderRadius: 18,
                background: 'linear-gradient(135deg, var(--in-peach), var(--in-blush))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', border: '1px solid var(--in-border)',
              }}>
                ☕
              </div>
              <div>
                <button className="biz-btn biz-btn--ghost">Change logo</button>
                <p style={{ fontSize: '0.75rem', color: 'var(--in-gray-light)', marginTop: 4 }}>PNG, JPG up to 2MB. Min 200×200px.</p>
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="biz-card">
            <p className="biz-card__title" style={{ marginBottom: 18 }}>Business Details</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Business name', value: businessName, set: setBusinessName, type: 'text' },
                { label: 'Website', value: website, set: setWebsite, type: 'url' },
                { label: 'Category', value: category, set: setCategory, type: 'text' },
                { label: 'Location', value: location, set: setLocation, type: 'text' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--in-charcoal)', marginBottom: 5 }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={f.value}
                    onChange={e => f.set(e.target.value)}
                    style={{
                      width: '100%', height: 46, padding: '0 14px',
                      border: '1.5px solid rgba(242,132,107,0.2)', borderRadius: 10,
                      background: '#fafafa', fontFamily: 'inherit', fontSize: '0.9375rem',
                      color: 'var(--in-charcoal)', outline: 'none', transition: 'border-color 0.2s',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--in-coral)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(242,132,107,0.2)')}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--in-charcoal)', marginBottom: 5 }}>
                  Business description
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%', padding: '12px 14px',
                    border: '1.5px solid rgba(242,132,107,0.2)', borderRadius: 10,
                    background: '#fafafa', fontFamily: 'inherit', fontSize: '0.9375rem',
                    color: 'var(--in-charcoal)', outline: 'none', resize: 'vertical', lineHeight: 1.6,
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--in-coral)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(242,132,107,0.2)')}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--in-gray-light)', marginTop: 4 }}>{description.length} / 500</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20, alignItems: 'center' }}>
              <button className="biz-btn biz-btn--primary biz-btn--lg" onClick={handleSave}>
                {saved ? '✓ Saved!' : 'Save changes'}
              </button>
              {saved && <span style={{ fontSize: '0.875rem', color: 'var(--in-success)' }}>Profile updated</span>}
            </div>
          </div>
        </div>
      )}

      {tab === 'Payments' && (
        <div className="biz-card" style={{ maxWidth: 600 }}>
          <p className="biz-card__title" style={{ marginBottom: 14 }}>Payment Method</p>
          <div style={{ padding: '16px', borderRadius: 12, border: '1.5px solid var(--in-border)', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <span style={{ fontSize: '1.5rem' }}>💳</span>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9375rem' }}>HDFC Business Card ending 4242</p>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--in-gray-light)' }}>Expires 08/28 · Verified</p>
            </div>
            <button className="biz-btn biz-btn--ghost" style={{ marginLeft: 'auto' }}>Change</button>
          </div>
          <button className="biz-btn biz-btn--ghost">+ Add payment method</button>
          <p style={{ fontSize: '0.75rem', color: 'var(--in-gray-light)', marginTop: 14 }}>Payments are processed securely. Exact escrow and settlement terms will be communicated before launch.</p>
        </div>
      )}

      {['Notifications', 'Team', 'Security'].includes(tab) && (
        <div className="biz-card" style={{ maxWidth: 600 }}>
          <div className="biz-empty" style={{ padding: '36px 0' }}>
            <span className="biz-empty__icon">🔧</span>
            <p className="biz-empty__title">{tab} settings</p>
            <p className="biz-empty__desc">This section is coming in the next phase.</p>
          </div>
        </div>
      )}
    </BusinessLayout>
  );
}
