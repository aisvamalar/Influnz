/**
 * AI Strategy Wizard - Step 7: Confirm Strategy
 * Final confirmation step before proceeding to campaign parameters
 */
import { useState } from 'react';
import type { GeneratedStrategy } from './AIGenerationStep';
import UiIcon from '../../../components/UiIcon';

interface ConfirmStrategyStepProps {
  strategy: GeneratedStrategy;
  onConfirm: () => void;
  onBack: () => void;
}

export default function ConfirmStrategyStep({ strategy, onConfirm, onBack }: ConfirmStrategyStepProps) {
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    setSaving(true);
    
    // Simulate API call to save strategy
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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
    <div className="confirm-strategy-step">
      {/* Header */}
      <div className="step-header">
        <div className="confirmation-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" fill="#22c55e" fillOpacity="0.1"/>
            <circle cx="32" cy="32" r="24" fill="#22c55e" fillOpacity="0.2"/>
            <circle cx="32" cy="32" r="18" fill="#22c55e"/>
            <path d="M24 32l6 6 10-10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="step-title">Ready to Launch?</h1>
        <p className="step-subtitle">
          Review your AI-generated strategy one final time before we proceed to set up your campaign.
        </p>
      </div>

      {/* Strategy Summary */}
      <div className="strategy-summary-card">
        <h3>{strategy.strategy.name}</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Budget</span>
            <span className="summary-value">{formatCurrency(strategy.budget.total)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Duration</span>
            <span className="summary-value">{strategy.timeline.total}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Creators</span>
            <span className="summary-value">{strategy.creators.total} creators</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Est. Reach</span>
            <span className="summary-value">{strategy.creators.estimated_reach}</span>
          </div>
        </div>
      </div>

      {/* What Happens Next */}
      <div className="next-steps-section">
        <h3>What happens next?</h3>
        <div className="next-steps-list">
          <div className="next-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Campaign Parameters</h4>
              <p>Set up content requirements, creator criteria, and budget details</p>
            </div>
          </div>
          <div className="next-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Creator Matching</h4>
              <p>Our AI will find and connect you with the perfect creators</p>
            </div>
          </div>
          <div className="next-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Campaign Launch</h4>
              <p>Start collaborating with creators and track your campaign's performance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Benefits */}
      <div className="strategy-benefits-section">
        <h3>Your Strategy Benefits</h3>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon"><UiIcon name="target" /></div>
            <h4>Targeted Approach</h4>
            <p>Optimized for your specific goals and target audience</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon"><UiIcon name="pin" /></div>
            <h4>Local Focus</h4>
            <p>Creators with strong presence in your target location</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon"><UiIcon name="money" /></div>
            <h4>Budget Efficient</h4>
            <p>Maximum ROI with optimized spend allocation</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon"><UiIcon name="chart" /></div>
            <h4>Data-Driven</h4>
            <p>Based on performance data and market insights</p>
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
            I confirm that I have reviewed the strategy details and am ready to proceed with the campaign setup.
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="step-actions">
        <button className="btn btn-secondary" onClick={onBack} disabled={saving}>
          ← Edit Strategy
        </button>
        <button
          className={`btn btn-primary ${!agreed || saving ? 'btn--disabled' : ''}`}
          onClick={handleConfirm}
          disabled={!agreed || saving}
        >
          {saving ? (
            <>
              <div className="btn-spinner" />
              Saving Strategy...
            </>
          ) : (
            'Confirm & Continue →'
          )}
        </button>
      </div>

      {/* Success Message */}
      {saving && (
        <div className="saving-message">
          <div className="saving-icon"><UiIcon name="save" /></div>
          <p>Saving your strategy and preparing campaign parameters...</p>
        </div>
      )}
    </div>
  );
}