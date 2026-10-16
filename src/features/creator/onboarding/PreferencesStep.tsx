/**
 * Onboarding step 3 — Preferences.
 * Availability, the content you make, and the platforms and languages
 * brands can match you on. Everything is editable later from Preferences.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, CalendarCheck, Handshake, Search, Languages, Tags, Share2 } from 'lucide-react';
import PlatformMark from '../../../components/mobile/PlatformMark';
import { useCreator } from '../CreatorContext';
import { Toggle } from '../ui';
import FormField from '../../auth/FormField';
import { OTHER_MAX_LENGTH, OTHER_MAX_TOPICS, useOtherTopics } from '../useOtherTopics';
import type { CreatorPreferences, Platform } from '../types';
import { Actions, Btn, ProgressRail, Section, SelectChip, StepHead } from './parts';

const ALL_CATEGORIES = ['Food', 'Lifestyle', 'Travel', 'Fashion', 'Fitness', 'Technology', 'Beauty', 'Education'];
const ALL_LANGUAGES = ['Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'];
const ALL_PLATFORMS: Array<{ id: Platform; label: string }> = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'tiktok', label: 'TikTok' },
];

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter(v => v !== value) : [...list, value];
}

export default function PreferencesStep() {
  const navigate = useNavigate();
  const { preferences, updatePreferences, completeOnboardingStep } = useCreator();
  const [draft, setDraft] = useState<CreatorPreferences>(preferences);

  const set = <K extends keyof CreatorPreferences>(key: K, value: CreatorPreferences[K]) =>
    setDraft(d => ({ ...d, [key]: value }));

  const topics = useOtherTopics(ALL_CATEGORIES, draft.categories, next => set('categories', next));

  const finish = (save: boolean) => {
    if (save) updatePreferences(draft);
    completeOnboardingStep('preferences');
    navigate('/creator/dashboard', { replace: true });
  };

  return (
    <>
      <div className="cro-main">
        <StepHead
          eyebrow="Step 3 · Preferences"
          title={<>Tell us what you <em>love making.</em></>}
          sub="Influnz uses this to match you with the right campaigns and to let AI negotiate within your comfort zone. Change any of it later from Preferences."
        />

        <Section title="Availability" sub="Control whether brands can reach you right now." list>
          <SwitchRow icon={CalendarCheck} title="Available for campaigns" sub="Brands can send you invitations"
            on={draft.availableForCampaigns} onChange={v => set('availableForCampaigns', v)} />
          <SwitchRow icon={Handshake} title="Open to long-term collaborations" sub="Prefer ongoing brand partnerships over one-offs"
            on={draft.openToLongTerm} onChange={v => set('openToLongTerm', v)} />
          <SwitchRow icon={Search} title="Discoverable in search" sub="Appear when brands browse creators"
            on={draft.allowDiscovery} onChange={v => set('allowDiscovery', v)} />
        </Section>

        <Section
          title="What you create"
          sub="Pick every topic that fits. Brands filter by these."
          kicker={<><Tags size={12} /> {draft.categories.length} selected</>}
        >
          <div className="cro-chips">
            {ALL_CATEGORIES.map(c => (
              <SelectChip key={c} on={topics.selectedPresets.includes(c)} onClick={() => topics.togglePreset(c)}>{c}</SelectChip>
            ))}
            <SelectChip on={topics.otherOn} onClick={topics.toggleOther}>Other</SelectChip>
          </div>
          {topics.otherOn && (
            <FormField
              id="pr-other" label="Your topic" full
              help={`Type your own topic. Separate several with commas, up to ${OTHER_MAX_TOPICS}.`}
            >
              <div className="aw-control">
                <Tags className="aw-control__icon" size={17} />
                <input
                  id="pr-other" type="text" placeholder="e.g. Pets, Gardening"
                  autoFocus autoComplete="off" value={topics.otherText}
                  maxLength={OTHER_MAX_LENGTH * OTHER_MAX_TOPICS + OTHER_MAX_TOPICS * 2}
                  onChange={e => topics.changeOtherText(e.target.value)}
                />
              </div>
            </FormField>
          )}
        </Section>

        <Section title="Where and how you post" sub="The platforms you post on and the languages you create in.">
          <div>
            <p className="aw-label" style={{ marginBottom: 10 }}><Share2 size={14} /> Platforms</p>
            <div className="cro-tiles">
              {ALL_PLATFORMS.map(p => {
                const on = draft.platforms.includes(p.id);
                return (
                  <button key={p.id} type="button" className={`cro-tile${on ? ' is-on' : ''}`} aria-pressed={on}
                    onClick={() => set('platforms', toggle(draft.platforms, p.id))}>
                    <span className="cro-tile__icon"><PlatformMark id={p.id} size={18} /></span>
                    {p.label}
                    {on && <span className="cro-tile__mark"><Check size={11} strokeWidth={3} /></span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="aw-label" style={{ marginBottom: 10 }}><Languages size={14} /> Languages you create in</p>
            <div className="cro-chips">
              {ALL_LANGUAGES.map(l => (
                <SelectChip key={l} on={draft.languages.includes(l)} onClick={() => set('languages', toggle(draft.languages, l))}>{l}</SelectChip>
              ))}
            </div>
          </div>

        </Section>
      </div>

      <div className="cro-aside">
        <section className="cro-panel cro-rail" aria-label="Your matching profile">
          <h3 className="cro-rail__title">Your matching profile</h3>
          <div className="cro-summary">
            <div className="cro-summary__item"><strong>{draft.categories.length}</strong><span>Topics</span></div>
            <div className="cro-summary__item"><strong>{draft.platforms.length}</strong><span>Platforms</span></div>
            <div className="cro-summary__item"><strong>{draft.languages.length}</strong><span>Languages</span></div>
          </div>
        </section>

        <ProgressRail
          title="Almost there"
          items={[
            { label: 'Availability set', done: true },
            { label: 'At least one topic', done: draft.categories.length > 0 },
            { label: 'At least one platform', done: draft.platforms.length > 0 },
            { label: 'At least one language', done: draft.languages.length > 0 },
          ]}
          note={<>Rates, AI negotiation limits and blocked categories live in <strong>Preferences</strong> once you are in.</>}
        />
      </div>

      <Actions
        left={
          <>
            <Btn variant="ghost" onClick={() => navigate('/creator/onboarding/passport')}><ArrowLeft size={16} /> Back</Btn>
            <Btn variant="link" onClick={() => finish(false)}>Skip for now</Btn>
          </>
        }
      >
        <Btn onClick={() => finish(true)}><Check size={16} /> Save &amp; go to dashboard</Btn>
      </Actions>
    </>
  );
}

function SwitchRow({
  icon: Icon, title, sub, on, onChange,
}: {
  icon: typeof CalendarCheck;
  title: string;
  sub: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="cro-switch">
      <span className="cro-switch__icon"><Icon size={17} /></span>
      <div className="cro-switch__main">
        <p className="cro-switch__title">{title}</p>
        <p className="cro-switch__sub">{sub}</p>
      </div>
      <Toggle on={on} onChange={onChange} label={title} />
    </div>
  );
}
