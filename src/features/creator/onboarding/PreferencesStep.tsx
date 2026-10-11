import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal, ArrowLeft, Check, Rocket } from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, Chip, Toggle, Button } from '../ui';
import type { CreatorPreferences, Platform } from '../types';

const ALL_CATEGORIES = ['Food', 'Lifestyle', 'Travel', 'Fashion', 'Fitness', 'Technology', 'Beauty', 'Education'];
const ALL_LANGUAGES = ['Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'];
const ALL_PLATFORMS: Platform[] = ['instagram', 'youtube', 'tiktok'];

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter(v => v !== value) : [...list, value];
}

export default function PreferencesStep() {
  const navigate = useNavigate();
  const { preferences, updatePreferences, completeOnboardingStep } = useCreator();
  const [draft, setDraft] = useState<CreatorPreferences>(preferences);

  const set = <K extends keyof CreatorPreferences>(key: K, value: CreatorPreferences[K]) =>
    setDraft(d => ({ ...d, [key]: value }));

  const finish = () => {
    updatePreferences(draft);
    completeOnboardingStep('preferences');
    navigate('/creator/dashboard', { replace: true });
  };

  const skip = () => {
    completeOnboardingStep('preferences');
    navigate('/creator/dashboard', { replace: true });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="cr-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <SlidersHorizontal size={22} style={{ color: 'var(--in-coral-text)' }} /> Quick preferences
        </h1>
        <p className="cr-page-sub">Just a few things to personalise your experience — update everything in Settings later.</p>
      </div>

      {/* Availability */}
      <Card>
        <div className="cr-card__title" style={{ marginBottom: 14 }}>Availability</div>
        <ToggleRow label="Available for campaigns" desc="Brands can send you invitations" on={draft.availableForCampaigns} onChange={v => set('availableForCampaigns', v)} />
        <ToggleRow label="Open to long-term collaborations" desc="Prefer ongoing brand partnerships" on={draft.openToLongTerm} onChange={v => set('openToLongTerm', v)} />
        <ToggleRow label="Discoverable in search" desc="Appear in brand discovery and search" on={draft.allowDiscovery} onChange={v => set('allowDiscovery', v)} />
      </Card>

      {/* Interests */}
      <Card>
        <div className="cr-card__title" style={{ marginBottom: 8 }}>What do you create content about?</div>
        <div className="cr-card__sub" style={{ marginBottom: 12 }}>Pick everything that fits — brands use this to match you.</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ALL_CATEGORIES.map(c => (
            <Chip key={c} active={draft.categories.includes(c)} onClick={() => set('categories', toggle(draft.categories, c))}>{c}</Chip>
          ))}
        </div>
      </Card>

      {/* Platforms & Languages */}
      <Card>
        <div className="cr-card__title" style={{ marginBottom: 8 }}>Platforms you're active on</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
          {ALL_PLATFORMS.map(p => (
            <Chip key={p} active={draft.platforms.includes(p)} onClick={() => set('platforms', toggle(draft.platforms, p))}>
              <span style={{ textTransform: 'capitalize' }}>{p}</span>
            </Chip>
          ))}
        </div>
        <div className="cr-card__title" style={{ marginBottom: 8 }}>Languages you create in</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ALL_LANGUAGES.map(l => (
            <Chip key={l} active={draft.languages.includes(l)} onClick={() => set('languages', toggle(draft.languages, l))}>{l}</Chip>
          ))}
        </div>
      </Card>

      <div className="cr-onboarding__actions">
        <Button variant="ghost" onClick={() => navigate('/creator/onboarding/passport')}>
          <ArrowLeft size={16} /> Back
        </Button>
        <Button variant="ghost" onClick={skip}>Skip for now</Button>
        <Button onClick={finish}><Check size={16} /> Save & go to Dashboard</Button>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12,
        background: 'rgba(242,132,107,0.07)', border: '1px solid rgba(242,132,107,0.2)',
      }}>
        <Rocket size={16} style={{ color: 'var(--in-coral-text)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.8125rem', color: 'var(--in-gray)' }}>
          Campaign rates, AI negotiation limits and more are in <strong>Settings → Preferences</strong> anytime.
        </span>
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, on, onChange }: { label: string; desc: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="cr-row" style={{ paddingTop: 12, paddingBottom: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--in-charcoal)' }}>{label}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--in-gray)' }}>{desc}</div>
      </div>
      <Toggle on={on} onChange={onChange} label={label} />
    </div>
  );
}
