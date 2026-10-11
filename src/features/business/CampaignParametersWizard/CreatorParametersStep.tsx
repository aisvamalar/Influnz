/**
 * Campaign Parameters Wizard - Step 4: Creator Parameters
 * Define creator requirements and criteria
 */
import { useState } from 'react';
import UiIcon from '../../../components/UiIcon';

interface CreatorParametersStepProps {
  onNext: (data: CreatorParametersData) => void;
  onBack: () => void;
  initialData?: Partial<CreatorParametersData>;
}

export interface CreatorParametersData {
  creatorTiers: string[];
  minFollowers: number;
  maxFollowers: number;
  location: string;
  language: string[];
  niche: string[];
  gender: string;
  ageRange: string;
  engagementRate: number;
}

const CREATOR_TIERS = [
  { id: 'nano', label: 'Nano', range: '1K - 10K', icon: 'sprout', color: '#10b981' },
  { id: 'micro', label: 'Micro', range: '10K - 100K', icon: 'leaf', color: '#3b82f6' },
  { id: 'macro', label: 'Macro', range: '100K - 1M', icon: 'tree', color: '#f59e0b' },
  { id: 'mega', label: 'Mega', range: '1M+', icon: 'star', color: '#ef4444' },
];

const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi'];

const NICHES = [
  'Fashion', 'Beauty', 'Food', 'Travel', 'Fitness', 'Tech', 'Gaming', 'Lifestyle',
  'Parenting', 'Business', 'Education', 'Entertainment', 'Sports', 'Art', 'Music', 'Comedy'
];

export default function CreatorParametersStep({ onNext, onBack, initialData }: CreatorParametersStepProps) {
  const [selectedTiers, setSelectedTiers] = useState<string[]>(initialData?.creatorTiers || []);
  const [minFollowers, setMinFollowers] = useState(initialData?.minFollowers || 1000);
  const [maxFollowers, setMaxFollowers] = useState(initialData?.maxFollowers || 1000000);
  const [location, setLocation] = useState(initialData?.location || '');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(initialData?.language || []);
  const [selectedNiches, setSelectedNiches] = useState<string[]>(initialData?.niche || []);
  const [gender, setGender] = useState(initialData?.gender || 'any');
  const [ageRange, setAgeRange] = useState(initialData?.ageRange || 'any');
  const [engagementRate, setEngagementRate] = useState(initialData?.engagementRate || 3);

  const toggleTier = (tierId: string) => {
    setSelectedTiers(prev =>
      prev.includes(tierId) ? prev.filter(t => t !== tierId) : [...prev, tierId]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const toggleNiche = (niche: string) => {
    setSelectedNiches(prev =>
      prev.includes(niche) ? prev.filter(n => n !== niche) : [...prev, niche]
    );
  };

  const handleSubmit = () => {
    if (selectedTiers.length === 0) {
      alert('Please select at least one creator tier');
      return;
    }

    onNext({
      creatorTiers: selectedTiers,
      minFollowers,
      maxFollowers,
      location,
      language: selectedLanguages,
      niche: selectedNiches,
      gender,
      ageRange,
      engagementRate,
    });
  };

  return (
    <div className="creator-parameters-step">
      {/* Header */}
      <div className="step-header">
        <h1 className="step-title">Creator Parameters</h1>
        <p className="step-subtitle">
          Define the criteria for selecting creators for your campaign
        </p>
      </div>

      {/* Creator Tiers */}
      <div className="form-section">
        <h3 className="section-title">Creator Tiers</h3>
        <div className="tier-grid">
          {CREATOR_TIERS.map((tier) => {
            const isSelected = selectedTiers.includes(tier.id);
            return (
              <button
                key={tier.id}
                type="button"
                className={`tier-card ${isSelected ? 'tier-card--selected' : ''}`}
                onClick={() => toggleTier(tier.id)}
                style={{ borderColor: isSelected ? tier.color : undefined }}
              >
                <div className="tier-icon" style={{ color: tier.color }}>
                  <UiIcon name={tier.icon} />
                </div>
                <div className="tier-label">{tier.label}</div>
                <div className="tier-range">{tier.range}</div>
                {isSelected && (
                  <div className="tier-check" style={{ backgroundColor: tier.color }}>
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Follower Range */}
      <div className="form-section">
        <h3 className="section-title">Follower Range</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="min-followers">Minimum Followers</label>
            <input
              id="min-followers"
              type="number"
              className="form-input"
              value={minFollowers}
              onChange={(e) => setMinFollowers(parseInt(e.target.value) || 0)}
              min="0"
              step="1000"
            />
          </div>
          <div className="form-group">
            <label htmlFor="max-followers">Maximum Followers</label>
            <input
              id="max-followers"
              type="number"
              className="form-input"
              value={maxFollowers}
              onChange={(e) => setMaxFollowers(parseInt(e.target.value) || 0)}
              min={minFollowers}
              step="1000"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="form-section">
        <h3 className="section-title">Location</h3>
        <input
          type="text"
          className="form-input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Chennai, Mumbai, Pan-India"
        />
      </div>

      {/* Languages */}
      <div className="form-section">
        <h3 className="section-title">Languages</h3>
        <div className="chip-grid">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              className={`chip ${selectedLanguages.includes(lang) ? 'chip--selected' : ''}`}
              onClick={() => toggleLanguage(lang)}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Niches */}
      <div className="form-section">
        <h3 className="section-title">Content Niche</h3>
        <div className="chip-grid">
          {NICHES.map((niche) => (
            <button
              key={niche}
              type="button"
              className={`chip ${selectedNiches.includes(niche) ? 'chip--selected' : ''}`}
              onClick={() => toggleNiche(niche)}
            >
              {niche}
            </button>
          ))}
        </div>
      </div>

      {/* Demographics */}
      <div className="form-section">
        <h3 className="section-title">Creator Demographics</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              className="form-select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="any">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-Binary</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="age-range">Age Range</label>
            <select
              id="age-range"
              className="form-select"
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
            >
              <option value="any">Any</option>
              <option value="18-24">18-24</option>
              <option value="25-34">25-34</option>
              <option value="35-44">35-44</option>
              <option value="45+">45+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Engagement Rate */}
      <div className="form-section">
        <h3 className="section-title">Minimum Engagement Rate</h3>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={engagementRate}
            onChange={(e) => setEngagementRate(parseFloat(e.target.value))}
            className="slider"
          />
          <div className="slider-value">{engagementRate}%</div>
        </div>
        <p className="form-hint">
          Creators with engagement rate below {engagementRate}% will be filtered out
        </p>
      </div>

      {/* Actions */}
      <div className="step-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Continue to Budget →
        </button>
      </div>
    </div>
  );
}
