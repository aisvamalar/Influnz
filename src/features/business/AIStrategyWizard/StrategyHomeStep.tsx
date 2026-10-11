/**
 * AI Strategy Wizard - Step 1: Strategy Home
 * Mobile-first design matching Influnz design system
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UiIcon from '../../../components/UiIcon';

interface StrategyHomeStepProps {
  onNext: () => void;
}

export default function StrategyHomeStep({ onNext }: StrategyHomeStepProps) {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<'ai' | 'manual' | null>(null);

  const handleContinue = () => {
    if (selectedOption === 'ai') {
      onNext();
    } else {
      navigate('/business/campaigns/strategy');
    }
  };

  return (
    <div className="strategy-home-step">
      {/* Header */}
      <div className="step-header">
        <h1 className="step-title">AI Strategy Assistant</h1>
        <p className="step-subtitle">
          Let AI create the perfect campaign strategy for your business goals, or set it up manually.
        </p>
      </div>

      {/* Strategy Options */}
      <div className="strategy-options">
        <button
          className={`strategy-option ${selectedOption === 'ai' ? 'strategy-option--selected' : ''}`}
          onClick={() => setSelectedOption('ai')}
        >
          <div className="strategy-option__icon"><UiIcon name="bot" /></div>
          <div className="strategy-option__content">
            <h3>AI-Powered Strategy</h3>
            <p>Answer a few questions and get a personalized strategy recommendation</p>
            <div className="strategy-option__features">
              <span className="feature-tag"><UiIcon name="sparkles" /> Smart recommendations</span>
              <span className="feature-tag"><UiIcon name="target" /> Goal-based matching</span>
              <span className="feature-tag"><UiIcon name="chart" /> Data-driven insights</span>
            </div>
          </div>
          <div className="strategy-option__check">
            {selectedOption === 'ai' && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="#ff6b35"/>
                <path d="M6 10l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </div>
        </button>

        <button
          className={`strategy-option ${selectedOption === 'manual' ? 'strategy-option--selected' : ''}`}
          onClick={() => setSelectedOption('manual')}
        >
          <div className="strategy-option__icon"><UiIcon name="settings" /></div>
          <div className="strategy-option__content">
            <h3>Manual Setup</h3>
            <p>Choose from pre-built strategies based on your experience</p>
            <div className="strategy-option__features">
              <span className="feature-tag"><UiIcon name="wrench" /> Full control</span>
              <span className="feature-tag"><UiIcon name="clipboard" /> Pre-built templates</span>
              <span className="feature-tag"><UiIcon name="zap" /> Quick setup</span>
            </div>
          </div>
          <div className="strategy-option__check">
            {selectedOption === 'manual' && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="#ff6b35"/>
                <path d="M6 10l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* Benefits */}
      <div className="strategy-benefits">
        <h4>Why use AI Strategy?</h4>
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon"><UiIcon name="target" /></div>
            <div>
              <strong>Better targeting</strong>
              <p>Match your goals with the right creators and audience</p>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon"><UiIcon name="money" /></div>
            <div>
              <strong>Budget optimization</strong>
              <p>Get the most impact from your marketing spend</p>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon"><UiIcon name="zap" /></div>
            <div>
              <strong>Faster setup</strong>
              <p>Create campaigns in minutes, not hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="step-actions">
        <button
          className={`btn btn-primary ${!selectedOption ? 'btn--disabled' : ''}`}
          onClick={handleContinue}
          disabled={!selectedOption}
        >
          {selectedOption === 'ai' ? 'Start AI Strategy →' : selectedOption === 'manual' ? 'Choose Strategy →' : 'Select an option'}
        </button>
      </div>
    </div>
  );
}