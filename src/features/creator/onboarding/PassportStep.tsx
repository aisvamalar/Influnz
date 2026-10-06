import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, Chip, Button } from '../ui';

const ALL_CATEGORIES = ['Food', 'Lifestyle', 'Travel', 'Fashion', 'Fitness', 'Technology', 'Beauty', 'Education'];
const ALL_LANGUAGES = ['Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'];
const ALL_CONTENT = ['Instagram Reel', 'Instagram Story', 'Instagram Post', 'YouTube Short', 'YouTube Video', 'UGC'];
const BIO_MAX = 240;

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter(v => v !== value) : [...list, value];
}

export default function PassportStep() {
  const navigate = useNavigate();
  const { profile, updateProfile, completeOnboardingStep } = useCreator();

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [categories, setCategories] = useState<string[]>(profile.categories);
  const [languages, setLanguages] = useState<string[]>(profile.languages);
  const [contentTypes, setContentTypes] = useState<string[]>(profile.contentTypes);

  const canContinue = useMemo(
    () => displayName.trim().length > 0 && categories.length > 0,
    [displayName, categories.length],
  );

  const handleContinue = () => {
    if (!canContinue) return;
    updateProfile({
      displayName: displayName.trim(),
      bio: bio.trim(),
      location: location.trim(),
      categories, languages, contentTypes,
    });
    completeOnboardingStep('passport');
    navigate('/creator/onboarding/preferences');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="cr-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <UserCircle size={22} style={{ color: 'var(--in-coral-text)' }} /> Build your Creator Passport
        </h1>
        <p className="cr-page-sub">This is what brands see when they discover you.</p>
      </div>

      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label className="cr-field">
            <span className="cr-field__label">Display name</span>
            <input className="cr-input" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your creator name" />
            {displayName.trim().length === 0 && <span className="cr-field__err">Display name is required.</span>}
          </label>
          <label className="cr-field">
            <span className="cr-field__label">Bio</span>
            <textarea className="cr-input cr-input--area" value={bio} maxLength={BIO_MAX} rows={3}
              onChange={e => setBio(e.target.value)} placeholder="Tell brands what makes your content unique" />
            <span className="cr-field__hint">{bio.length}/{BIO_MAX}</span>
          </label>
          <label className="cr-field">
            <span className="cr-field__label">Location</span>
            <input className="cr-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="City, State" />
          </label>
        </div>
      </Card>

      <Card>
        <div className="cr-card__title" style={{ marginBottom: 12 }}>Categories</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ALL_CATEGORIES.map(c => (
            <Chip key={c} active={categories.includes(c)} onClick={() => setCategories(toggle(categories, c))}>{c}</Chip>
          ))}
        </div>
        {categories.length === 0 && <span className="cr-field__err" style={{ marginTop: 8, display: 'block' }}>Pick at least one category.</span>}

        <div className="cr-card__title" style={{ margin: '18px 0 12px' }}>Languages</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ALL_LANGUAGES.map(l => (
            <Chip key={l} active={languages.includes(l)} onClick={() => setLanguages(toggle(languages, l))}>{l}</Chip>
          ))}
        </div>

        <div className="cr-card__title" style={{ margin: '18px 0 12px' }}>Content types</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ALL_CONTENT.map(c => (
            <Chip key={c} active={contentTypes.includes(c)} onClick={() => setContentTypes(toggle(contentTypes, c))}>{c}</Chip>
          ))}
        </div>
      </Card>

      <div className="cr-onboarding__actions">
        <Button variant="ghost" onClick={() => navigate('/creator/onboarding/verify')}>
          <ArrowLeft size={16} /> Back
        </Button>
        <Button variant="ghost" onClick={() => { completeOnboardingStep('passport'); navigate('/creator/onboarding/preferences'); }}>
          Skip for now
        </Button>
        <Button onClick={handleContinue} disabled={!canContinue}>
          Continue <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
