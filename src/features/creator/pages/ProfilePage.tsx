import { useMemo, useState } from 'react';
import {
  BadgeCheck, Camera, Video, MapPin, Languages as LangIcon,
  Users, Activity, Eye, Pencil, Check, X, Star, ShieldCheck,
} from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, StatCard, ProgressBar, Button, Chip, Avatar, Toast } from '../ui';
import { compact } from '../format';
import type { CreatorProfile, PlatformConnection } from '../types';

const ALL_CATEGORIES = ['Food', 'Lifestyle', 'Travel', 'Fashion', 'Fitness', 'Technology', 'Beauty', 'Education'];
const ALL_LANGUAGES = ['Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'];
const ALL_CONTENT = ['Instagram Reel', 'Instagram Story', 'Instagram Post', 'YouTube Short', 'YouTube Video', 'UGC'];

type EditableFields = Pick<
  CreatorProfile,
  'displayName' | 'bio' | 'location' | 'categories' | 'languages' | 'contentTypes'
>;

function toDraft(p: CreatorProfile): EditableFields {
  return {
    displayName: p.displayName,
    bio: p.bio,
    location: p.location,
    categories: [...p.categories],
    languages: [...p.languages],
    contentTypes: [...p.contentTypes],
  };
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter(v => v !== value) : [...list, value];
}

const BIO_MAX = 240;

export default function ProfilePage() {
  const { profile, updateProfile } = useCreator();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<EditableFields>(() => toDraft(profile));
  const [toast, setToast] = useState<string | null>(null);

  const startEdit = () => {
    setDraft(toDraft(profile));
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(toDraft(profile));
    setEditing(false);
  };

  const canSave = useMemo(
    () => draft.displayName.trim().length > 0 && draft.categories.length > 0,
    [draft.displayName, draft.categories.length],
  );

  const save = () => {
    if (!canSave) return;
    updateProfile({
      displayName: draft.displayName.trim(),
      bio: draft.bio.trim(),
      location: draft.location.trim(),
      categories: draft.categories,
      languages: draft.languages,
      contentTypes: draft.contentTypes,
    });
    setEditing(false);
    setToast('Profile updated');
    window.setTimeout(() => setToast(null), 2600);
  };

  const set = <K extends keyof EditableFields>(key: K, value: EditableFields[K]) =>
    setDraft(d => ({ ...d, [key]: value }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="cr-page-title">Creator Passport</h1>
          <p className="cr-page-sub">Your verified identity that brands see when they discover you.</p>
        </div>
        {!editing ? (
          <Button variant="ghost" onClick={startEdit}><Pencil size={16} /> Edit Profile</Button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost" onClick={cancelEdit}><X size={16} /> Cancel</Button>
            <Button onClick={save} disabled={!canSave}><Check size={16} /> Save Changes</Button>
          </div>
        )}
      </div>

      {/* Identity card */}
      <Card>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Avatar name={profile.displayName} size={72} />
          <div style={{ flex: 1, minWidth: 220 }}>
            {!editing ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--in-charcoal)' }}>{profile.displayName}</span>
                  {profile.verified && (
                    <span title="Verified creator" style={{ display: 'inline-flex', color: 'var(--in-coral-text)' }}>
                      <BadgeCheck size={20} />
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--in-gray)' }}>@{profile.username}</div>
                <p style={{ marginTop: 10, fontSize: '0.9rem', color: 'var(--in-charcoal)', lineHeight: 1.55 }}>{profile.bio}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 12, fontSize: '0.8125rem', color: 'var(--in-gray)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><MapPin size={15} /> {profile.location}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><LangIcon size={15} /> {profile.languages.join(', ')}</span>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label className="cr-field">
                  <span className="cr-field__label">Display name</span>
                  <input
                    className="cr-input"
                    value={draft.displayName}
                    onChange={e => set('displayName', e.target.value)}
                    placeholder="Your creator name"
                  />
                  {draft.displayName.trim().length === 0 && (
                    <span className="cr-field__err">Display name is required.</span>
                  )}
                </label>
                <label className="cr-field">
                  <span className="cr-field__label">Bio</span>
                  <textarea
                    className="cr-input cr-input--area"
                    value={draft.bio}
                    maxLength={BIO_MAX}
                    onChange={e => set('bio', e.target.value)}
                    placeholder="Tell brands what makes your content unique"
                    rows={3}
                  />
                  <span className="cr-field__hint">{draft.bio.length}/{BIO_MAX}</span>
                </label>
                <label className="cr-field">
                  <span className="cr-field__label">Location</span>
                  <input
                    className="cr-input"
                    value={draft.location}
                    onChange={e => set('location', e.target.value)}
                    placeholder="City, State"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="cr-grid cr-grid--4">
        <StatCard icon={Users} value={compact(profile.followers)} label="Followers" />
        <StatCard icon={Activity} value={`${profile.engagement}%`} label="Engagement" />
        <StatCard icon={Eye} value={compact(profile.avgViews)} label="Avg. Views" />
        <StatCard icon={Star} value={`${profile.rating}/5`} label="Rating" />
      </div>

      {/* Categories / Languages / Content */}
      <div className="cr-grid cr-grid--3">
        <Card>
          <div className="cr-card__title" style={{ marginBottom: 12 }}>Categories</div>
          {!editing ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {profile.categories.map(c => <Chip key={c} staticChip>{c}</Chip>)}
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {ALL_CATEGORIES.map(c => (
                  <Chip key={c} active={draft.categories.includes(c)} onClick={() => set('categories', toggle(draft.categories, c))}>
                    {c}
                  </Chip>
                ))}
              </div>
              {draft.categories.length === 0 && <span className="cr-field__err" style={{ marginTop: 8 }}>Pick at least one category.</span>}
            </>
          )}
        </Card>

        <Card>
          <div className="cr-card__title" style={{ marginBottom: 12 }}>Languages</div>
          {!editing ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {profile.languages.map(l => <Chip key={l} staticChip>{l}</Chip>)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ALL_LANGUAGES.map(l => (
                <Chip key={l} active={draft.languages.includes(l)} onClick={() => set('languages', toggle(draft.languages, l))}>
                  {l}
                </Chip>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="cr-card__title" style={{ marginBottom: 12 }}>Content Types</div>
          {!editing ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {profile.contentTypes.map(c => <Chip key={c} staticChip>{c}</Chip>)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ALL_CONTENT.map(c => (
                <Chip key={c} active={draft.contentTypes.includes(c)} onClick={() => set('contentTypes', toggle(draft.contentTypes, c))}>
                  {c}
                </Chip>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="cr-grid cr-grid--2">
        {/* Audience insights */}
        <Card>
          <div className="cr-card__title" style={{ marginBottom: 4 }}>Audience Insights</div>
          <div className="cr-card__sub" style={{ marginBottom: 14 }}>Where your audience comes from</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <AudienceRow label="Top city" value={profile.audience.topCity} pct={profile.audience.topCityPct} />
            <AudienceRow label="Top language" value={profile.audience.topLanguage} pct={profile.audience.topLanguagePct} />
            <AudienceRow label="Top age range" value={profile.audience.topAgeRange} pct={profile.audience.topAgePct} />
            <AudienceRow label="Top country" value={profile.audience.topCountry} pct={profile.audience.topCountryPct} />
          </div>
        </Card>

        {/* Connected platforms + trust */}
        <Card>
          <div className="cr-card__title" style={{ marginBottom: 4 }}>Connected Platforms</div>
          <div className="cr-card__sub" style={{ marginBottom: 14 }}>Verified handles brands can trust</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {profile.platforms.map(p => <PlatformRow key={p.platform} conn={p} />)}
          </div>

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--in-border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 600, color: 'var(--in-charcoal)' }}>
                  <ShieldCheck size={15} style={{ color: 'var(--in-success)' }} /> Reliability
                </span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--in-charcoal)' }}>{profile.reliability}/100</span>
              </div>
              <ProgressBar value={profile.reliability} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--in-charcoal)' }}>Profile completion</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--in-charcoal)' }}>{profile.completionPct}%</span>
              </div>
              <ProgressBar value={profile.completionPct} />
            </div>
          </div>
        </Card>
      </div>

      {toast && <Toast message={toast} icon={Check} />}
    </div>
  );
}

// ── Local sub-components ──────────────────────────────────────────────

function AudienceRow({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.8125rem' }}>
        <span style={{ color: 'var(--in-gray)' }}>{label}</span>
        <span style={{ fontWeight: 700, color: 'var(--in-charcoal)' }}>{value} · {pct}%</span>
      </div>
      <ProgressBar value={pct} />
    </div>
  );
}

function PlatformRow({ conn }: { conn: PlatformConnection }) {
  const Icon = conn.platform === 'youtube' ? Video : Camera;
  const connected = conn.state === 'connected';
  return (
    <div className="cr-row" style={{ paddingTop: 10, paddingBottom: 10 }}>
      <span style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(242,132,107,0.1)', color: 'var(--in-coral-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--in-charcoal)', textTransform: 'capitalize' }}>{conn.platform}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--in-gray)' }}>
          {connected ? `${conn.handle} · ${compact(conn.followers)} followers` : 'Not connected'}
        </div>
      </div>
      {connected ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700, color: 'var(--in-success)' }}>
          <BadgeCheck size={15} /> Verified
        </span>
      ) : (
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--in-gray-light)' }}>—</span>
      )}
    </div>
  );
}
