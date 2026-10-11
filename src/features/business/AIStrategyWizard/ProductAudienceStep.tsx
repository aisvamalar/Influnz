/**
 * AI Strategy Wizard - Step 3: Product & Audience
 * Mobile-first design for product and audience selection
 */
import { useState } from 'react';
import UiIcon from '../../../components/UiIcon';

interface ProductAudienceStepProps {
  onNext: (data: ProductAudienceData) => void;
  onBack: () => void;
  initialData?: ProductAudienceData;
}

interface ProductAudienceData {
  businessType: string;
  productCategory: string;
  targetAudience: {
    ageRange: string;
    gender: string;
    interests: string[];
    location: string;
    language: string;
  };
  budget: {
    amount: number;
    timeframe: string;
  };
}

const BUSINESS_TYPES = [
  { id: 'restaurant', label: 'Restaurant/Café', icon: 'utensils' },
  { id: 'retail', label: 'Retail Store', icon: 'bag' },
  { id: 'services', label: 'Services', icon: 'zap' },
  { id: 'ecommerce', label: 'E-commerce', icon: 'package' },
  { id: 'tech', label: 'Tech/SaaS', icon: 'laptop' },
  { id: 'fitness', label: 'Fitness/Health', icon: 'dumbbell' },
  { id: 'beauty', label: 'Beauty/Fashion', icon: 'brush' },
  { id: 'education', label: 'Education', icon: 'book' },
  { id: 'other', label: 'Other', icon: 'building' }
];

const PRODUCT_CATEGORIES = [
  'Food & Beverage', 'Fashion & Apparel', 'Beauty & Personal Care',
  'Electronics & Tech', 'Home & Lifestyle', 'Health & Fitness',
  'Travel & Tourism', 'Financial Services', 'Education & Training',
  'Entertainment', 'Automotive', 'Real Estate', 'Other'
];

const AGE_RANGES = [
  '13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'
];

const GENDER_OPTIONS = [
  { id: 'all', label: 'All genders' },
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'non-binary', label: 'Non-binary' }
];

const INTEREST_OPTIONS = [
  'Food & Cooking', 'Fashion & Style', 'Beauty & Skincare', 'Technology',
  'Travel & Adventure', 'Fitness & Health', 'Entertainment', 'Shopping',
  'Photography', 'Music', 'Sports', 'Gaming', 'Business', 'Education',
  'Art & Design', 'Lifestyle', 'Parenting', 'Finance'
];

const LANGUAGES = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam',
  'Marathi', 'Gujarati', 'Bengali', 'Punjabi'
];

export default function ProductAudienceStep({ onNext, onBack, initialData }: ProductAudienceStepProps) {
  const [formData, setFormData] = useState<ProductAudienceData>(initialData || {
    businessType: '',
    productCategory: '',
    targetAudience: {
      ageRange: '',
      gender: 'all',
      interests: [],
      location: '',
      language: 'English'
    },
    budget: {
      amount: 0,
      timeframe: 'monthly'
    }
  });

  const handleBusinessTypeChange = (type: string) => {
    setFormData(prev => ({ ...prev, businessType: type }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        interests: prev.targetAudience.interests.includes(interest)
          ? prev.targetAudience.interests.filter(i => i !== interest)
          : [...prev.targetAudience.interests, interest]
      }
    }));
  };

  const updateTargetAudience = (field: keyof ProductAudienceData['targetAudience'], value: any) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: { ...prev.targetAudience, [field]: value }
    }));
  };

  const updateBudget = (field: keyof ProductAudienceData['budget'], value: any) => {
    setFormData(prev => ({
      ...prev,
      budget: { ...prev.budget, [field]: value }
    }));
  };

  const canContinue = formData.businessType && formData.productCategory && 
                     formData.targetAudience.ageRange && formData.budget.amount > 0;

  const handleContinue = () => {
    if (canContinue) {
      onNext(formData);
    }
  };

  return (
    <div className="product-audience-step">
      {/* Header */}
      <div className="step-header">
        <h1 className="step-title">Tell us about your business</h1>
        <p className="step-subtitle">
          Help us understand your product and target audience for better recommendations.
        </p>
      </div>

      <div className="form-sections">
        {/* Business Type */}
        <div className="form-section">
          <h3 className="section-title">Business Type</h3>
          <div className="business-types-grid">
            {BUSINESS_TYPES.map((type) => (
              <button
                key={type.id}
                className={`business-type-option ${formData.businessType === type.id ? 'business-type-option--selected' : ''}`}
                onClick={() => handleBusinessTypeChange(type.id)}
              >
                <span className="business-type-icon"><UiIcon name={type.icon} /></span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Category */}
        <div className="form-section">
          <label className="section-title" htmlFor="product-category">
            Product Category
          </label>
          <select
            id="product-category"
            className="select-input"
            value={formData.productCategory}
            onChange={(e) => setFormData(prev => ({ ...prev, productCategory: e.target.value }))}
          >
            <option value="">Select category</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Target Audience */}
        <div className="form-section">
          <h3 className="section-title">Target Audience</h3>
          
          {/* Age Range */}
          <div className="input-group">
            <label className="input-label">Age Range</label>
            <select
              className="select-input"
              value={formData.targetAudience.ageRange}
              onChange={(e) => updateTargetAudience('ageRange', e.target.value)}
            >
              <option value="">Select age range</option>
              {AGE_RANGES.map((range) => (
                <option key={range} value={range}>{range} years</option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div className="input-group">
            <label className="input-label">Gender</label>
            <div className="radio-group">
              {GENDER_OPTIONS.map((option) => (
                <label key={option.id} className="radio-option">
                  <input
                    type="radio"
                    name="gender"
                    value={option.id}
                    checked={formData.targetAudience.gender === option.id}
                    onChange={(e) => updateTargetAudience('gender', e.target.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="input-group">
            <label className="input-label" htmlFor="location">
              Primary Location
            </label>
            <input
              id="location"
              type="text"
              className="text-input"
              placeholder="e.g., Chennai, Mumbai, Delhi"
              value={formData.targetAudience.location}
              onChange={(e) => updateTargetAudience('location', e.target.value)}
            />
          </div>

          {/* Language */}
          <div className="input-group">
            <label className="input-label">Preferred Language</label>
            <select
              className="select-input"
              value={formData.targetAudience.language}
              onChange={(e) => updateTargetAudience('language', e.target.value)}
            >
              {LANGUAGES.map((language) => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>

          {/* Interests */}
          <div className="input-group">
            <label className="input-label">
              Interests ({formData.targetAudience.interests.length} selected)
            </label>
            <div className="interests-grid">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  className={`interest-tag ${formData.targetAudience.interests.includes(interest) ? 'interest-tag--selected' : ''}`}
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="form-section">
          <h3 className="section-title">Campaign Budget</h3>
          
          <div className="budget-inputs">
            <div className="input-group">
              <label className="input-label" htmlFor="budget-amount">
                Budget Amount (₹)
              </label>
              <input
                id="budget-amount"
                type="number"
                className="text-input"
                placeholder="e.g., 150000"
                value={formData.budget.amount || ''}
                onChange={(e) => updateBudget('amount', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Timeframe</label>
              <select
                className="select-input"
                value={formData.budget.timeframe}
                onChange={(e) => updateBudget('timeframe', e.target.value)}
              >
                <option value="monthly">Per month</option>
                <option value="quarterly">Per quarter</option>
                <option value="campaign">Per campaign</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="step-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <button
          className={`btn btn-primary ${!canContinue ? 'btn--disabled' : ''}`}
          onClick={handleContinue}
          disabled={!canContinue}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}