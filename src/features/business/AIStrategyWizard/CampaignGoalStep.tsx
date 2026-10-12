/**
 * AI Strategy Wizard - Step 2: Campaign Goal
 * Mobile-first design for goal selection
 */
import { useState } from 'react';
import UiIcon from '../../../components/UiIcon';

interface CampaignGoalStepProps {
  onNext: (data: { goal: string; description?: string }) => void;
  onBack: () => void;
  initialData?: { goal: string; description?: string };
}

interface GoalOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  examples: string[];
  popular?: boolean;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: 'awareness',
    title: 'Brand Awareness',
    description: 'Increase visibility and recognition of your brand',
    icon: 'megaphone',
    examples: ['Product launches', 'Brand introduction', 'Market expansion']
  },
  {
    id: 'engagement',
    title: 'Social Engagement',
    description: 'Drive likes, comments, shares and social interactions',
    icon: 'heart',
    examples: ['Community building', 'Content virality', 'User-generated content'],
    popular: true
  },
  {
    id: 'traffic',
    title: 'Website Traffic',
    description: 'Direct users to your website or app',
    icon: 'globe',
    examples: ['Landing page visits', 'App downloads', 'Product page views']
  },
  {
    id: 'leads',
    title: 'Lead Generation',
    description: 'Collect contact information and potential customers',
    icon: 'mail',
    examples: ['Email signups', 'Contact forms', 'Newsletter subscriptions']
  },
  {
    id: 'sales',
    title: 'Direct Sales',
    description: 'Drive immediate purchases and conversions',
    icon: 'card',
    examples: ['E-commerce sales', 'Product orders', 'Service bookings'],
    popular: true
  },
  {
    id: 'footfall',
    title: 'Store Visits',
    description: 'Bring customers to your physical location',
    icon: 'store',
    examples: ['Restaurant visits', 'Retail foot traffic', 'Event attendance']
  },
  {
    id: 'app',
    title: 'App Downloads',
    description: 'Increase mobile app installations and usage',
    icon: 'phone',
    examples: ['iOS downloads', 'Android installs', 'App engagement']
  },
  {
    id: 'other',
    title: 'Other Goal',
    description: 'Custom objective specific to your business',
    icon: 'target',
    examples: ['Custom KPIs', 'Specific metrics', 'Unique objectives']
  }
];

export default function CampaignGoalStep({ onNext, onBack, initialData }: CampaignGoalStepProps) {
  const [selectedGoal, setSelectedGoal] = useState(initialData?.goal || '');
  const [customDescription, setCustomDescription] = useState(initialData?.description || '');
  const [showCustomInput, setShowCustomInput] = useState(!!initialData?.description || selectedGoal === 'other');

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
    if (goalId === 'other') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setCustomDescription('');
    }
  };

  const handleContinue = () => {
    const selectedOption = GOAL_OPTIONS.find(opt => opt.id === selectedGoal);
    onNext({
      goal: selectedGoal,
      description: selectedGoal === 'other' ? customDescription : selectedOption?.title
    });
  };

  const canContinue = selectedGoal && (selectedGoal !== 'other' || customDescription.trim());

  return (
    <div className="campaign-goal-step">
      {/* Header */}
      <div className="step-header">
        <h1 className="step-title">What's your campaign goal?</h1>
        <p className="step-subtitle">
          Choose your primary objective to get the most relevant strategy recommendations.
        </p>
      </div>

      {/* Goals Grid */}
      <div className="goals-grid">
        {GOAL_OPTIONS.map((goal) => (
          <button
            key={goal.id}
            className={`goal-option ${selectedGoal === goal.id ? 'goal-option--selected' : ''}`}
            onClick={() => handleGoalSelect(goal.id)}
          >
            {goal.popular && (
              <div className="goal-option__badge">Popular</div>
            )}
            
            <div className="goal-option__icon"><UiIcon name={goal.icon} /></div>
            
            <div className="goal-option__content">
              <h3>{goal.title}</h3>
              <p>{goal.description}</p>
              
              <div className="goal-option__examples">
                <span className="examples-label">Examples:</span>
                <div className="examples-list">
                  {goal.examples.map((example, idx) => (
                    <span key={idx} className="example-tag">{example}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="goal-option__check">
              {selectedGoal === goal.id && (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="9" fill="#ff6b35"/>
                  <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Custom Goal Input */}
      {showCustomInput && (
        <div className="custom-goal-input">
          <label htmlFor="custom-goal" className="input-label">
            Describe your specific goal
          </label>
          <textarea
            id="custom-goal"
            placeholder="e.g., Increase newsletter subscriptions for our weekly food blog..."
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            className="textarea"
            rows={3}
          />
          <div className="input-help">
            Be as specific as possible to get better recommendations
          </div>
        </div>
      )}

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