/**
 * AI Strategy Wizard - Step 5: Generated Strategy Display
 * Mobile-first display of AI generated strategy
 */
import { useState } from 'react';
import type { GeneratedStrategy } from './AIGenerationStep';
import UiIcon from '../../../components/UiIcon';

interface GeneratedStrategyStepProps {
  strategy: GeneratedStrategy;
  onNext: () => void;
  onBack: () => void;
  onEdit: () => void;
}

export default function GeneratedStrategyStep({ strategy, onNext, onBack, onEdit }: GeneratedStrategyStepProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'creators' | 'budget' | 'timeline'>('overview');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="generated-strategy-step">
      {/* Header */}
      <div className="step-header">
        <div className="strategy-success-badge">
          <span className="success-icon"><UiIcon name="sparkles" /></span>
          <span>Strategy Generated</span>
        </div>
        <h1 className="step-title">{strategy.strategy.name}</h1>
        <p className="step-subtitle">{strategy.strategy.description}</p>
        
        <div className="confidence-score">
          <div className="confidence-label">AI Confidence Score</div>
          <div className="confidence-meter">
            <div 
              className="confidence-fill" 
              style={{ width: `${strategy.strategy.confidence}%` }}
            />
            <span className="confidence-text">{strategy.strategy.confidence}%</span>
          </div>
        </div>
      </div>

      {/* Strategy Tabs */}
      <div className="strategy-tabs">
        {[
          { id: 'overview', label: 'Overview', icon: 'clipboard' },
          { id: 'creators', label: 'Creators', icon: 'users' },
          { id: 'budget', label: 'Budget', icon: 'money' },
          { id: 'timeline', label: 'Timeline', icon: 'calendar' }
        ].map((tab) => (
          <button
            key={tab.id}
            className={`strategy-tab ${activeTab === tab.id ? 'strategy-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <span className="tab-icon"><UiIcon name={tab.icon} /></span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="strategy-content">
        {activeTab === 'overview' && (
          <div className="strategy-overview">
            <div className="strategy-card">
              <h3>Strategy Rationale</h3>
              <p>{strategy.strategy.rationale}</p>
            </div>

            <div className="strategy-card">
              <h3>Primary KPI</h3>
              <div className="kpi-primary">{strategy.kpis.primary}</div>
            </div>

            <div className="strategy-card">
              <h3>Secondary Metrics</h3>
              <div className="kpi-secondary">
                {strategy.kpis.secondary.map((kpi, idx) => (
                  <span key={idx} className="kpi-tag">{kpi}</span>
                ))}
              </div>
            </div>

            <div className="strategy-card">
              <h3>Expected Benchmarks</h3>
              <div className="benchmarks-grid">
                {Object.entries(strategy.kpis.benchmarks).map(([key, value]) => (
                  <div key={key} className="benchmark-item">
                    <span className="benchmark-label">{key}</span>
                    <span className="benchmark-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'creators' && (
          <div className="strategy-creators">
            <div className="creators-summary">
              <div className="summary-stat">
                <span className="stat-value">{strategy.creators.total}</span>
                <span className="stat-label">Total Creators</span>
              </div>
              <div className="summary-stat">
                <span className="stat-value">{strategy.creators.estimated_reach}</span>
                <span className="stat-label">Est. Reach</span>
              </div>
              <div className="summary-stat">
                <span className="stat-value">{strategy.creators.estimated_engagement}</span>
                <span className="stat-label">Est. Engagement</span>
              </div>
            </div>

            <div className="strategy-card">
              <h3>Creator Mix</h3>
              <div className="creator-mix">
                <div className="mix-description">{strategy.creators.mix}</div>
                <p>This combination provides optimal balance between reach and authentic local engagement for your Chennai restaurant campaign.</p>
              </div>
            </div>

            <div className="strategy-card">
              <h3>Why This Mix Works</h3>
              <div className="mix-benefits">
                <div className="benefit-point">
                  <span className="benefit-icon"><UiIcon name="target" /></span>
                  <span>Macro creators provide broad local awareness</span>
                </div>
                <div className="benefit-point">
                  <span className="benefit-icon"><UiIcon name="heart" /></span>
                  <span>Nano creators deliver authentic community trust</span>
                </div>
                <div className="benefit-point">
                  <span className="benefit-icon"><UiIcon name="pin" /></span>
                  <span>All creators have strong Chennai presence</span>
                </div>
                <div className="benefit-point">
                  <span className="benefit-icon"><UiIcon name="utensils" /></span>
                  <span>Food-focused content aligns with your business</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="strategy-budget">
            <div className="budget-total">
              <span className="total-amount">{formatCurrency(strategy.budget.total)}</span>
              <span className="total-label">Total Campaign Budget</span>
            </div>

            <div className="strategy-card">
              <h3>Budget Breakdown</h3>
              <div className="budget-breakdown">
                <div className="breakdown-item">
                  <div className="breakdown-bar">
                    <div 
                      className="breakdown-fill breakdown-fill--creators" 
                      style={{ width: `${(strategy.budget.breakdown.creators / strategy.budget.total) * 100}%` }}
                    />
                  </div>
                  <div className="breakdown-details">
                    <span className="breakdown-label">Creator Payments</span>
                    <span className="breakdown-amount">{formatCurrency(strategy.budget.breakdown.creators)}</span>
                  </div>
                  <span className="breakdown-percentage">
                    {Math.round((strategy.budget.breakdown.creators / strategy.budget.total) * 100)}%
                  </span>
                </div>

                <div className="breakdown-item">
                  <div className="breakdown-bar">
                    <div 
                      className="breakdown-fill breakdown-fill--platform" 
                      style={{ width: `${(strategy.budget.breakdown.platform_fees / strategy.budget.total) * 100}%` }}
                    />
                  </div>
                  <div className="breakdown-details">
                    <span className="breakdown-label">Platform Fees</span>
                    <span className="breakdown-amount">{formatCurrency(strategy.budget.breakdown.platform_fees)}</span>
                  </div>
                  <span className="breakdown-percentage">
                    {Math.round((strategy.budget.breakdown.platform_fees / strategy.budget.total) * 100)}%
                  </span>
                </div>

                <div className="breakdown-item">
                  <div className="breakdown-bar">
                    <div 
                      className="breakdown-fill breakdown-fill--management" 
                      style={{ width: `${(strategy.budget.breakdown.management / strategy.budget.total) * 100}%` }}
                    />
                  </div>
                  <div className="breakdown-details">
                    <span className="breakdown-label">Management & Support</span>
                    <span className="breakdown-amount">{formatCurrency(strategy.budget.breakdown.management)}</span>
                  </div>
                  <span className="breakdown-percentage">
                    {Math.round((strategy.budget.breakdown.management / strategy.budget.total) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="budget-optimization">
              <div className="optimization-title"><UiIcon name="idea" /> Budget Optimization Tips</div>
              <ul className="optimization-tips">
                <li>80% of budget allocated to creators for maximum impact</li>
                <li>Platform fees include content review and performance tracking</li>
                <li>Management fee covers campaign setup and ongoing support</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="strategy-timeline">
            <div className="timeline-total">
              <span className="total-duration">{strategy.timeline.total}</span>
              <span className="total-label">Total Campaign Duration</span>
            </div>

            <div className="timeline-phases">
              <div className="phase-item">
                <div className="phase-icon"><UiIcon name="rocket" /></div>
                <div className="phase-content">
                  <h4>Setup Phase</h4>
                  <p>Creator outreach, contract negotiation, and brief alignment</p>
                  <span className="phase-duration">{strategy.timeline.setup}</span>
                </div>
              </div>

              <div className="phase-item">
                <div className="phase-icon"><UiIcon name="camera" /></div>
                <div className="phase-content">
                  <h4>Execution Phase</h4>
                  <p>Content creation, review process, and publishing</p>
                  <span className="phase-duration">{strategy.timeline.execution}</span>
                </div>
              </div>

              <div className="phase-item">
                <div className="phase-icon"><UiIcon name="chart" /></div>
                <div className="phase-content">
                  <h4>Analysis Phase</h4>
                  <p>Performance tracking and results analysis</p>
                  <span className="phase-duration">Ongoing</span>
                </div>
              </div>
            </div>

            <div className="timeline-milestones">
              <h4>Key Milestones</h4>
              <div className="milestones-list">
                <div className="milestone-item">
                  <span className="milestone-day">Day 1-3</span>
                  <span className="milestone-task">Creator confirmation and briefing</span>
                </div>
                <div className="milestone-item">
                  <span className="milestone-day">Day 4-7</span>
                  <span className="milestone-task">Content planning and approval</span>
                </div>
                <div className="milestone-item">
                  <span className="milestone-day">Day 8-18</span>
                  <span className="milestone-task">Content creation and publishing</span>
                </div>
                <div className="milestone-item">
                  <span className="milestone-day">Day 19+</span>
                  <span className="milestone-task">Performance monitoring and optimization</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="step-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Generate New
        </button>
        <button className="btn btn-outline" onClick={onEdit}>
          <UiIcon name="edit" /> Edit Strategy
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          Confirm Strategy →
        </button>
      </div>
    </div>
  );
}