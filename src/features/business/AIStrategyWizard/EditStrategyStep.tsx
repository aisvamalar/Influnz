/**
 * AI Strategy Wizard - Step 6: Edit Strategy
 * Allow users to edit and customize the AI-generated strategy
 */
import { useState } from 'react';
import type { GeneratedStrategy } from './AIGenerationStep';

interface EditStrategyStepProps {
  strategy: GeneratedStrategy;
  onSave: (updatedStrategy: GeneratedStrategy) => void;
  onBack: () => void;
}

export default function EditStrategyStep({ strategy, onSave, onBack }: EditStrategyStepProps) {
  const [editedStrategy, setEditedStrategy] = useState<GeneratedStrategy>(strategy);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaving(false);
    onSave(editedStrategy);
  };

  const updateStrategyName = (name: string) => {
    setEditedStrategy(prev => ({
      ...prev,
      strategy: { ...prev.strategy, name }
    }));
  };

  const updateStrategyDescription = (description: string) => {
    setEditedStrategy(prev => ({
      ...prev,
      strategy: { ...prev.strategy, description }
    }));
  };

  const updateBudget = (field: keyof GeneratedStrategy['budget']['breakdown'], value: number) => {
    setEditedStrategy(prev => {
      const breakdown = { ...prev.budget.breakdown, [field]: value };
      const total = breakdown.creators + breakdown.platform_fees + breakdown.management;
      return {
        ...prev,
        budget: { ...prev.budget, breakdown, total }
      };
    });
  };

  const updateCreatorCount = (total: number) => {
    setEditedStrategy(prev => ({
      ...prev,
      creators: { ...prev.creators, total }
    }));
  };

  const updateTimeline = (field: keyof GeneratedStrategy['timeline'], value: string) => {
    setEditedStrategy(prev => ({
      ...prev,
      timeline: { ...prev.timeline, [field]: value }
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="edit-strategy-step">
      {/* Header */}
      <div className="step-header">
        <h1 className="step-title">Customize Your Strategy</h1>
        <p className="step-subtitle">
          Adjust any aspect of your campaign strategy to better fit your needs.
        </p>
      </div>

      {/* Edit Form */}
      <div className="edit-form">
        {/* Strategy Name & Description */}
        <div className="form-section">
          <h3 className="section-title">Strategy Overview</h3>
          
          <div className="form-group">
            <label htmlFor="strategy-name">Strategy Name</label>
            <input
              id="strategy-name"
              type="text"
              className="form-input"
              value={editedStrategy.strategy.name}
              onChange={(e) => updateStrategyName(e.target.value)}
              placeholder="Enter strategy name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="strategy-description">Description</label>
            <textarea
              id="strategy-description"
              className="form-textarea"
              rows={3}
              value={editedStrategy.strategy.description}
              onChange={(e) => updateStrategyDescription(e.target.value)}
              placeholder="Describe your strategy"
            />
          </div>
        </div>

        {/* Budget Allocation */}
        <div className="form-section">
          <h3 className="section-title">Budget Allocation</h3>
          
          <div className="budget-total">
            <span>Total Budget:</span>
            <strong>{formatCurrency(editedStrategy.budget.total)}</strong>
          </div>

          <div className="form-group">
            <label htmlFor="creator-budget">Creator Payments</label>
            <div className="input-with-currency">
              <span className="currency-prefix">₹</span>
              <input
                id="creator-budget"
                type="number"
                className="form-input"
                value={editedStrategy.budget.breakdown.creators}
                onChange={(e) => updateBudget('creators', parseInt(e.target.value) || 0)}
                min="0"
                step="1000"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="platform-fees">Platform Fees</label>
            <div className="input-with-currency">
              <span className="currency-prefix">₹</span>
              <input
                id="platform-fees"
                type="number"
                className="form-input"
                value={editedStrategy.budget.breakdown.platform_fees}
                onChange={(e) => updateBudget('platform_fees', parseInt(e.target.value) || 0)}
                min="0"
                step="1000"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="management-fees">Management Fees</label>
            <div className="input-with-currency">
              <span className="currency-prefix">₹</span>
              <input
                id="management-fees"
                type="number"
                className="form-input"
                value={editedStrategy.budget.breakdown.management}
                onChange={(e) => updateBudget('management', parseInt(e.target.value) || 0)}
                min="0"
                step="1000"
              />
            </div>
          </div>
        </div>

        {/* Creator Settings */}
        <div className="form-section">
          <h3 className="section-title">Creator Settings</h3>
          
          <div className="form-group">
            <label htmlFor="creator-count">Number of Creators</label>
            <input
              id="creator-count"
              type="number"
              className="form-input"
              value={editedStrategy.creators.total}
              onChange={(e) => updateCreatorCount(parseInt(e.target.value) || 1)}
              min="1"
              max="20"
            />
            <p className="form-hint">
              Current mix: {editedStrategy.creators.mix}
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="estimated-reach">Estimated Reach</label>
            <input
              id="estimated-reach"
              type="text"
              className="form-input"
              value={editedStrategy.creators.estimated_reach}
              onChange={(e) => setEditedStrategy(prev => ({
                ...prev,
                creators: { ...prev.creators, estimated_reach: e.target.value }
              }))}
              placeholder="e.g., 3.2 Lakh"
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="form-section">
          <h3 className="section-title">Campaign Timeline</h3>
          
          <div className="form-group">
            <label htmlFor="setup-time">Setup Duration</label>
            <input
              id="setup-time"
              type="text"
              className="form-input"
              value={editedStrategy.timeline.setup}
              onChange={(e) => updateTimeline('setup', e.target.value)}
              placeholder="e.g., 3-5 days"
            />
          </div>

          <div className="form-group">
            <label htmlFor="execution-time">Execution Duration</label>
            <input
              id="execution-time"
              type="text"
              className="form-input"
              value={editedStrategy.timeline.execution}
              onChange={(e) => updateTimeline('execution', e.target.value)}
              placeholder="e.g., 15 days"
            />
          </div>

          <div className="form-group">
            <label htmlFor="total-time">Total Duration</label>
            <input
              id="total-time"
              type="text"
              className="form-input"
              value={editedStrategy.timeline.total}
              onChange={(e) => updateTimeline('total', e.target.value)}
              placeholder="e.g., 18-20 days"
            />
          </div>
        </div>

        {/* KPIs */}
        <div className="form-section">
          <h3 className="section-title">Key Performance Indicators</h3>
          
          <div className="form-group">
            <label htmlFor="primary-kpi">Primary KPI</label>
            <input
              id="primary-kpi"
              type="text"
              className="form-input"
              value={editedStrategy.kpis.primary}
              onChange={(e) => setEditedStrategy(prev => ({
                ...prev,
                kpis: { ...prev.kpis, primary: e.target.value }
              }))}
              placeholder="Main goal to measure"
            />
          </div>

          <div className="kpi-benchmarks">
            <label>Benchmarks</label>
            {Object.entries(editedStrategy.kpis.benchmarks).map(([key, value]) => (
              <div key={key} className="benchmark-item">
                <input
                  type="text"
                  className="form-input benchmark-key"
                  value={key}
                  readOnly
                />
                <input
                  type="text"
                  className="form-input benchmark-value"
                  value={value}
                  onChange={(e) => {
                    setEditedStrategy(prev => ({
                      ...prev,
                      kpis: {
                        ...prev.kpis,
                        benchmarks: { ...prev.kpis.benchmarks, [key]: e.target.value }
                      }
                    }));
                  }}
                  placeholder="Target value"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="step-actions">
        <button className="btn btn-secondary" onClick={onBack} disabled={saving}>
          ← View Strategy
        </button>
        <button
          className={`btn btn-primary ${saving ? 'btn--disabled' : ''}`}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <div className="btn-spinner" />
              Saving Changes...
            </>
          ) : (
            'Save & Continue →'
          )}
        </button>
      </div>
    </div>
  );
}
