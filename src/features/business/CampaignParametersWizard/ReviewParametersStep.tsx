/**
 * Campaign Parameters Wizard - Step 6: Review Parameters
 * Final review before saving campaign parameters
 */
import { useState } from 'react';

interface ReviewParametersStepProps {
  parameters: any;
  onConfirm: () => void;
  onBack: () => void;
  onEdit: (step: number) => void;
}

export default function ReviewParametersStep({ parameters, onConfirm, onBack, onEdit }: ReviewParametersStepProps) {
  const [saving, setSaving] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleConfirm = async () => {
    setSaving(true);
    
    // Simulate API call to save parameters
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSaving(false);
    onConfirm();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="review-parameters-step">
      {/* Header */}
      <div className="step-header">
        <h1 className="step-title">Review Campaign Parameters</h1>
        <p className="step-subtitle">
          Review all your campaign settings before proceeding
        </p>
      </div>

      {/* Review Sections */}
      <div className="review-sections">
        {/* Basic Parameters */}
        <div className="review-section">
          <div className="review-section-header">
            <h3>Campaign Details</h3>
            <button className="btn-edit" onClick={() => onEdit(0)}>
              Edit
            </button>
          </div>
          <div className="review-content">
            <div className="review-item">
              <span className="review-label">Campaign Name:</span>
              <span className="review-value">{parameters.basic?.campaignName || 'N/A'}</span>
            </div>
            <div className="review-item">
              <span className="review-label">Objective:</span>
              <span className="review-value">{parameters.basic?.campaignObjective || 'N/A'}</span>
            </div>
            <div className="review-item">
              <span className="review-label">Duration:</span>
              <span className="review-value">
                {parameters.basic?.startDate} to {parameters.basic?.endDate}
              </span>
            </div>
            <div className="review-item">
              <span className="review-label">Total Budget:</span>
              <span className="review-value">{formatCurrency(parameters.basic?.budget || 0)}</span>
            </div>
          </div>
        </div>

        {/* Platforms */}
        <div className="review-section">
          <div className="review-section-header">
            <h3>Platform Selection</h3>
            <button className="btn-edit" onClick={() => onEdit(1)}>
              Edit
            </button>
          </div>
          <div className="review-content">
            <div className="review-item">
              <span className="review-label">Platforms:</span>
              <div className="platform-tags">
                {parameters.platforms?.platforms?.map((platform: string) => (
                  <span key={platform} className="platform-tag">
                    {platform} ({parameters.platforms?.platformPriority?.[platform] || 0}%)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="review-section">
          <div className="review-section-header">
            <h3>Content Requirements</h3>
            <button className="btn-edit" onClick={() => onEdit(2)}>
              Edit
            </button>
          </div>
          <div className="review-content">
            <div className="review-item">
              <span className="review-label">Content Types:</span>
              <div className="content-type-tags">
                {parameters.content?.contentTypes?.map((type: string) => (
                  <span key={type} className="content-tag">
                    {type} (×{parameters.content?.contentCount?.[type] || 1})
                  </span>
                ))}
              </div>
            </div>
            {parameters.content?.hashtags?.length > 0 && (
              <div className="review-item">
                <span className="review-label">Hashtags:</span>
                <div className="hashtag-list">
                  {parameters.content.hashtags.map((tag: string) => (
                    <span key={tag} className="hashtag">#{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Creators */}
        <div className="review-section">
          <div className="review-section-header">
            <h3>Creator Criteria</h3>
            <button className="btn-edit" onClick={() => onEdit(3)}>
              Edit
            </button>
          </div>
          <div className="review-content">
            <div className="review-item">
              <span className="review-label">Creator Tiers:</span>
              <div className="tier-tags">
                {parameters.creators?.creatorTiers?.map((tier: string) => (
                  <span key={tier} className="tier-tag">{tier}</span>
                ))}
              </div>
            </div>
            <div className="review-item">
              <span className="review-label">Follower Range:</span>
              <span className="review-value">
                {parameters.creators?.minFollowers?.toLocaleString()} - {parameters.creators?.maxFollowers?.toLocaleString()}
              </span>
            </div>
            <div className="review-item">
              <span className="review-label">Location:</span>
              <span className="review-value">{parameters.creators?.location || 'Any'}</span>
            </div>
            <div className="review-item">
              <span className="review-label">Min. Engagement:</span>
              <span className="review-value">{parameters.creators?.engagementRate}%</span>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="review-section">
          <div className="review-section-header">
            <h3>Budget Allocation</h3>
            <button className="btn-edit" onClick={() => onEdit(4)}>
              Edit
            </button>
          </div>
          <div className="review-content">
            <div className="review-item">
              <span className="review-label">Creator Budget:</span>
              <span className="review-value">{formatCurrency(parameters.budget?.creatorBudget || 0)}</span>
            </div>
            <div className="review-item">
              <span className="review-label">Platform Fees:</span>
              <span className="review-value">{formatCurrency(parameters.budget?.platformFees || 0)}</span>
            </div>
            <div className="review-item">
              <span className="review-label">Management:</span>
              <span className="review-value">{formatCurrency(parameters.budget?.managementFees || 0)}</span>
            </div>
            <div className="review-item">
              <span className="review-label">Payment Terms:</span>
              <span className="review-value">{parameters.budget?.paymentTerms || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="campaign-summary-card">
        <h3>Campaign Summary</h3>
        <div className="summary-stats">
          <div className="summary-stat">
            <div className="stat-value">{formatCurrency(parameters.basic?.budget || 0)}</div>
            <div className="stat-label">Total Budget</div>
          </div>
          <div className="summary-stat">
            <div className="stat-value">{parameters.platforms?.platforms?.length || 0}</div>
            <div className="stat-label">Platforms</div>
          </div>
          <div className="summary-stat">
            <div className="stat-value">{parameters.content?.contentTypes?.length || 0}</div>
            <div className="stat-label">Content Types</div>
          </div>
          <div className="summary-stat">
            <div className="stat-value">{parameters.creators?.creatorTiers?.length || 0}</div>
            <div className="stat-label">Creator Tiers</div>
          </div>
        </div>
      </div>

      {/* Agreement */}
      <div className="agreement-section">
        <label className="agreement-checkbox">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span className="checkbox-custom"></span>
          <span className="agreement-text">
            I have reviewed all campaign parameters and confirm they are correct. I understand that these settings will be used to find and match creators for my campaign.
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="step-actions">
        <button className="btn btn-secondary" onClick={onBack} disabled={saving}>
          ← Back
        </button>
        <button
          className={`btn btn-primary ${!agreed || saving ? 'btn--disabled' : ''}`}
          onClick={handleConfirm}
          disabled={!agreed || saving}
        >
          {saving ? (
            <>
              <div className="btn-spinner" />
              Saving Parameters...
            </>
          ) : (
            'Save & Start Campaign →'
          )}
        </button>
      </div>
    </div>
  );
}
