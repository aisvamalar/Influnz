/**
 * Campaign Parameters Wizard - Step 2: Platform Selection
 * Select social media platforms for the campaign
 */
import { useState } from 'react';
import UiIcon from '../../../components/UiIcon';

interface PlatformSelectionStepProps {
  onNext: (data: PlatformSelectionData) => void;
  onBack: () => void;
  initialData?: Partial<PlatformSelectionData>;
}

export interface PlatformSelectionData {
  platforms: string[];
  platformPriority: Record<string, number>; // Platform allocation percentage
}

const PLATFORMS = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'camera',
    color: '#E4405F',
    description: 'Photos, Reels, Stories',
    popular: true,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'play',
    color: '#FF0000',
    description: 'Videos, Shorts',
    popular: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'users',
    color: '#1877F2',
    description: 'Posts, Videos, Stories',
    popular: false,
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: 'at',
    color: '#1DA1F2',
    description: 'Tweets, Threads',
    popular: false,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'music',
    color: '#000000',
    description: 'Short Videos',
    popular: true,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'briefcase',
    color: '#0A66C2',
    description: 'Professional Content',
    popular: false,
  },
];

export default function PlatformSelectionStep({ onNext, onBack, initialData }: PlatformSelectionStepProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(initialData?.platforms || []);
  const [platformPriority, setPlatformPriority] = useState<Record<string, number>>(
    initialData?.platformPriority || {}
  );
  const [error, setError] = useState<string>('');

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        // Remove platform
        const newPriority = { ...platformPriority };
        delete newPriority[platformId];
        setPlatformPriority(newPriority);
        return prev.filter(id => id !== platformId);
      } else {
        // Add platform with default allocation
        const remaining = 100 - Object.values(platformPriority).reduce((sum, val) => sum + val, 0);
        setPlatformPriority(prev => ({ ...prev, [platformId]: Math.max(20, remaining) }));
        return [...prev, platformId];
      }
    });
    setError('');
  };

  const updatePriority = (platformId: string, value: number) => {
    setPlatformPriority(prev => ({ ...prev, [platformId]: value }));
  };

  const handleSubmit = () => {
    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }

    const totalAllocation = Object.values(platformPriority).reduce((sum, val) => sum + val, 0);
    if (Math.abs(totalAllocation - 100) > 1) {
      setError(`Platform allocation must total 100% (currently ${totalAllocation}%)`);
      return;
    }

    onNext({
      platforms: selectedPlatforms,
      platformPriority,
    });
  };

  const totalAllocation = Object.values(platformPriority).reduce((sum, val) => sum + val, 0);

  return (
    <div className="platform-selection-step">
      {/* Header */}
      <div className="step-header">
        <h1 className="step-title">Platform Selection</h1>
        <p className="step-subtitle">
          Choose which social media platforms you want to run your campaign on
        </p>
      </div>

      {/* Platform Grid */}
      <div className="platform-selection">
        <h3 className="section-title">Select Platforms</h3>
        <div className="platform-grid">
          {PLATFORMS.map((platform) => {
            const isSelected = selectedPlatforms.includes(platform.id);
            return (
              <button
                key={platform.id}
                type="button"
                className={`platform-card ${isSelected ? 'platform-card--selected' : ''}`}
                onClick={() => togglePlatform(platform.id)}
              >
                {platform.popular && <span className="popular-badge">Popular</span>}
                <div className="platform-icon" style={{ backgroundColor: platform.color + '20' }}>
                  <UiIcon name={platform.icon} />
                </div>
                <div className="platform-name">{platform.name}</div>
                <div className="platform-description">{platform.description}</div>
                {isSelected && (
                  <div className="selected-check">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="10" fill="#22c55e"/>
                      <path d="M6 10l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget Allocation */}
      {selectedPlatforms.length > 0 && (
        <div className="budget-allocation">
          <h3 className="section-title">Budget Allocation by Platform</h3>
          <p className="section-subtitle">
            Allocate your campaign budget across selected platforms (must total 100%)
          </p>

          <div className="allocation-list">
            {selectedPlatforms.map((platformId) => {
              const platform = PLATFORMS.find(p => p.id === platformId);
              if (!platform) return null;

              return (
                <div key={platformId} className="allocation-item">
                  <div className="allocation-platform">
                    <span className="platform-icon-small"><UiIcon name={platform.icon} /></span>
                    <span className="platform-name-small">{platform.name}</span>
                  </div>
                  <div className="allocation-slider">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={platformPriority[platformId] || 0}
                      onChange={(e) => updatePriority(platformId, parseInt(e.target.value))}
                      className="slider"
                    />
                    <div className="allocation-value">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="5"
                        value={platformPriority[platformId] || 0}
                        onChange={(e) => updatePriority(platformId, parseInt(e.target.value) || 0)}
                        className="allocation-input"
                      />
                      <span className="allocation-percent">%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`allocation-total ${Math.abs(totalAllocation - 100) > 1 ? 'allocation-total--error' : 'allocation-total--success'}`}>
            <span>Total Allocation:</span>
            <strong>{totalAllocation.toFixed(0)}%</strong>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon"><UiIcon name="alert" /></span>
          <span>{error}</span>
        </div>
      )}

      {/* Actions */}
      <div className="step-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Continue to Content →
        </button>
      </div>
    </div>
  );
}
