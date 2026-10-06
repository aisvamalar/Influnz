import { useState } from 'react';
import { Sparkles, Check, ShieldCheck, Bot } from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, Button, Chip, Toggle, Toast } from '../ui';
import { inr } from '../format';
import type { CreatorPreferences, Platform } from '../types';

const ALL_CATEGORIES = ['Food', 'Lifestyle', 'Travel', 'Fashion', 'Fitness', 'Technology', 'Beauty', 'Education'];
const BLOCKABLE = ['Alcohol', 'Gambling', 'Tobacco', 'Politics', 'Adult'];
const ALL_LANGUAGES = ['Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'];
const ALL_PLATFORMS: Platform[] = ['instagram', 'youtube', 'tiktok'];
const ALL_FORMATS = ['Instagram Reel', 'Instagram Story', 'YouTube Short', 'YouTube Video', 'UGC'];

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter(v => v !== value) : [...list, value];
}

export default function PreferencesPage() {
  const { preferences, updatePreferences } = useCreator();
  const [draft, setDraft] = useState<CreatorPreferences>(preferences);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const set = <K extends keyof CreatorPreferences>(key: K, value: CreatorPreferences[K]) => {
    setDraft(d => ({ ...d, [key]: value }));
    setDirty(true);
  };

  const save = () => {
    updatePreferences(draft);
    setDirty(false);
    setToast('Preferences saved');
    window.setTimeout(() => setToast(null), 2600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="cr-page-title">Preferences</h1>
          <p className="cr-page-sub">Control the campaigns you see and how your AI agent negotiates.</p>
        </div>
        <Button onClick={save} disabled={!dirty}><Check size={16} /> Save Changes</Button>
      </div>

      {/* Discovery / availability */}
      <Card>
        <div className="cr-card__title" style={{ marginBottom: 14 }}>Availability</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <ToggleRow label="Available for campaigns" desc="Brands can send you invitations" on={draft.availableForCampaigns} onChange={v => set('availableForCampaigns', v)} />
          <ToggleRow label="Open to long-term collaborations" desc="Prefer ongoing brand partnerships" on={draft.openToLongTerm} onChange={v => set('openToLongTerm', v)} />
          <ToggleRow label="Discoverable in search" desc="Appear in brand discovery and search results" on={draft.allowDiscovery} onChange={v => set('allowDiscovery', v)} />
        </div>
      </Card>

      <div className="cr-grid cr-grid--2">
        {/* Categories */}
        <Card>
          <div className="cr-card__title" style={{ marginBottom: 12 }}>Preferred categories</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_CATEGORIES.map(c => (
              <Chip key={c} active={draft.categories.includes(c)} onClick={() => set('categories', toggle(draft.categories, c))}>{c}</Chip>
            ))}
          </div>
          <div className="cr-card__title" style={{ margin: '18px 0 12px' }}>Blocked categories</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {BLOCKABLE.map(c => (
              <Chip key={c} active={draft.blockedCategories.includes(c)} onClick={() => set('blockedCategories', toggle(draft.blockedCategories, c))}>{c}</Chip>
            ))}
          </div>
        </Card>

        {/* Languages + platforms + formats */}
        <Card>
          <div className="cr-card__title" style={{ marginBottom: 12 }}>Languages</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_LANGUAGES.map(l => (
              <Chip key={l} active={draft.languages.includes(l)} onClick={() => set('languages', toggle(draft.languages, l))}>{l}</Chip>
            ))}
          </div>
          <div className="cr-card__title" style={{ margin: '18px 0 12px' }}>Platforms</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_PLATFORMS.map(p => (
              <Chip key={p} active={draft.platforms.includes(p)} onClick={() => set('platforms', toggle(draft.platforms, p))}>
                <span style={{ textTransform: 'capitalize' }}>{p}</span>
              </Chip>
            ))}
          </div>
          <div className="cr-card__title" style={{ margin: '18px 0 12px' }}>Content formats</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_FORMATS.map(f => (
              <Chip key={f} active={draft.contentFormats.includes(f)} onClick={() => set('contentFormats', toggle(draft.contentFormats, f))}>{f}</Chip>
            ))}
          </div>
        </Card>
      </div>

      {/* Minimum rate */}
      <Card>
        <div className="cr-card__title" style={{ marginBottom: 6 }}>Minimum rate</div>
        <div className="cr-card__sub" style={{ marginBottom: 14 }}>Campaigns below this won't be shown to you.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <input
            type="range" min={1000} max={50000} step={1000}
            value={draft.minRate}
            onChange={e => set('minRate', Number(e.target.value))}
            style={{ flex: 1, minWidth: 200, accentColor: 'var(--in-coral)' }}
            aria-label="Minimum rate"
          />
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--in-charcoal)', minWidth: 96, textAlign: 'right' }}>{inr(draft.minRate)}</span>
        </div>
      </Card>

      {/* AI negotiation */}
      <Card style={{ background: 'linear-gradient(135deg, rgba(242,132,107,0.06), rgba(248,208,196,0.1))', border: '1px solid var(--in-coral)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, var(--in-coral), var(--in-coral-dark))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={20} />
          </span>
          <div>
            <div className="cr-card__title">AI Negotiation Agent</div>
            <div className="cr-card__sub">Let your agent negotiate deals within limits you control.</div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <ToggleRow
            label="Enable AI negotiation"
            desc="Your agent auto-negotiates rates on new invitations"
            on={draft.aiNegotiationEnabled}
            onChange={v => set('aiNegotiationEnabled', v)}
          />
        </div>

        {draft.aiNegotiationEnabled && (
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <RangeRow
              label="Minimum acceptable rate"
              value={inr(draft.aiMinAcceptableRate)}
              min={1000} max={50000} step={1000}
              raw={draft.aiMinAcceptableRate}
              onChange={v => set('aiMinAcceptableRate', v)}
            />
            <RangeRow
              label="Flexibility"
              value={`${draft.aiFlexibilityPct}%`}
              min={0} max={40} step={5}
              raw={draft.aiFlexibilityPct}
              onChange={v => set('aiFlexibilityPct', v)}
            />
            <RangeRow
              label="Max exclusivity accepted"
              value={`${draft.aiMaxExclusivityDays} days`}
              min={0} max={90} step={5}
              raw={draft.aiMaxExclusivityDays}
              onChange={v => set('aiMaxExclusivityDays', v)}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: 'var(--in-gray)' }}>
              <ShieldCheck size={14} style={{ color: 'var(--in-success)' }} />
              Your agent will never accept below {inr(Math.round(draft.aiMinAcceptableRate * (1 - draft.aiFlexibilityPct / 100)))}.
            </div>
          </div>
        )}
      </Card>

      {toast && <Toast message={toast} icon={Sparkles} />}
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

function RangeRow({ label, value, raw, min, max, step, onChange }: {
  label: string; value: string; raw: number; min: number; max: number; step: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--in-charcoal)' }}>{label}</span>
        <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--in-coral-text)' }}>{value}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={raw}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--in-coral)' }}
        aria-label={label}
      />
    </div>
  );
}
