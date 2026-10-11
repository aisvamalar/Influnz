/**
 * Campaign Parameters Wizard - Step 1: Campaign Parameters
 * Basic campaign setup and objectives
 */
import { useState } from 'react';
import UiIcon from '../../../components/UiIcon';

interface CampaignParametersStepProps {
  onNext: (data: CampaignParametersData) => void;
  onBack?: () => void;
  initialData?: Partial<CampaignParametersData>;
}

export interface CampaignParametersData {
  campaignName: string;
  campaignObjective: string;
  startDate: string;
  endDate: string;
  budget: number;
  description: string;
}

const CAMPAIGN_OBJECTIVES = [
  { value: 'brand_awareness', label: 'Brand Awareness', icon: 'megaphone', description: 'Increase visibility and reach' },
  { value: 'engagement', label: 'Engagement', icon: 'message', description: 'Drive likes, comments, shares' },
  { value: 'conversions', label: 'Conversions', icon: 'target', description: 'Drive sales or sign-ups' },
  { value: 'traffic', label: 'Website Traffic', icon: 'globe', description: 'Increase website visits' },
  { value: 'store_visits', label: 'Store Visits', icon: 'store', description: 'Drive foot traffic' },
  { value: 'app_installs', label: 'App Installs', icon: 'phone', description: 'Increase app downloads' },
];

export default function CampaignParametersStep({ onNext, onBack, initialData }: CampaignParametersStepProps) {
  const [formData, setFormData] = useState<CampaignParametersData>({
    campaignName: initialData?.campaignName || '',
    campaignObjective: initialData?.campaignObjective || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    budget: initialData?.budget || 0,
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CampaignParametersData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CampaignParametersData, string>> = {};

    if (!formData.campaignName.trim()) {
      newErrors.campaignName = 'Campaign name is required';
    }
    if (!formData.campaignObjective) {
      newErrors.campaignObjective = 'Please select a campaign objective';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.budget <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  const updateField = (field: keyof CampaignParametersData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="campaign-parameters-step">
      {/* Header */}
      <div className="step-header">
        <h1 className="step-title">Campaign Parameters</h1>
        <p className="step-subtitle">
          Set up the basic details and objectives for your influencer campaign
        </p>
      </div>

      {/* Form */}
      <div className="params-form">
        {/* Campaign Name */}
        <div className="form-group">
          <label htmlFor="campaign-name" className="form-label">
            Campaign Name <span className="required">*</span>
          </label>
          <input
            id="campaign-name"
            type="text"
            className={`form-input ${errors.campaignName ? 'form-input--error' : ''}`}
            value={formData.campaignName}
            onChange={(e) => updateField('campaignName', e.target.value)}
            placeholder="e.g., Summer Product Launch 2024"
          />
          {errors.campaignName && <span className="form-error">{errors.campaignName}</span>}
        </div>

        {/* Campaign Objective */}
        <div className="form-group">
          <label className="form-label">
            Campaign Objective <span className="required">*</span>
          </label>
          <div className="objective-grid">
            {CAMPAIGN_OBJECTIVES.map((objective) => (
              <button
                key={objective.value}
                type="button"
                className={`objective-card ${formData.campaignObjective === objective.value ? 'objective-card--selected' : ''}`}
                onClick={() => updateField('campaignObjective', objective.value)}
              >
                <div className="objective-icon"><UiIcon name={objective.icon} /></div>
                <div className="objective-label">{objective.label}</div>
                <div className="objective-description">{objective.description}</div>
              </button>
            ))}
          </div>
          {errors.campaignObjective && <span className="form-error">{errors.campaignObjective}</span>}
        </div>

        {/* Date Range */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="start-date" className="form-label">
              Start Date <span className="required">*</span>
            </label>
            <input
              id="start-date"
              type="date"
              className={`form-input ${errors.startDate ? 'form-input--error' : ''}`}
              value={formData.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
            />
            {errors.startDate && <span className="form-error">{errors.startDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="end-date" className="form-label">
              End Date <span className="required">*</span>
            </label>
            <input
              id="end-date"
              type="date"
              className={`form-input ${errors.endDate ? 'form-input--error' : ''}`}
              value={formData.endDate}
              onChange={(e) => updateField('endDate', e.target.value)}
              min={formData.startDate}
            />
            {errors.endDate && <span className="form-error">{errors.endDate}</span>}
          </div>
        </div>

        {/* Budget */}
        <div className="form-group">
          <label htmlFor="budget" className="form-label">
            Total Budget <span className="required">*</span>
          </label>
          <div className="input-with-currency">
            <span className="currency-prefix">₹</span>
            <input
              id="budget"
              type="number"
              className={`form-input ${errors.budget ? 'form-input--error' : ''}`}
              value={formData.budget || ''}
              onChange={(e) => updateField('budget', parseInt(e.target.value) || 0)}
              placeholder="0"
              min="0"
              step="1000"
            />
          </div>
          {errors.budget && <span className="form-error">{errors.budget}</span>}
          <p className="form-hint">Enter your total campaign budget including creator fees and platform costs</p>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Campaign Description
          </label>
          <textarea
            id="description"
            className="form-textarea"
            rows={4}
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Describe your campaign goals, key messages, and any specific requirements..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="step-actions">
        {onBack && (
          <button className="btn btn-secondary" onClick={onBack}>
            ← Back
          </button>
        )}
        <button className="btn btn-primary" onClick={handleSubmit}>
          Continue to Platforms →
        </button>
      </div>
    </div>
  );
}
