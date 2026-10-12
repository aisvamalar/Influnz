/**
 * Campaign Parameters Wizard - Step 5: Budget & Timeline
 * Define budget allocation and campaign timeline
 */
import { useState } from 'react';
import UiIcon from '../../../components/UiIcon';

interface BudgetTimelineStepProps {
  onNext: (data: BudgetTimelineData) => void;
  onBack: () => void;
  initialData?: Partial<BudgetTimelineData>;
  totalBudget: number;
}

export interface BudgetTimelineData {
  creatorBudget: number;
  platformFees: number;
  managementFees: number;
  contingency: number;
  paymentTerms: string;
  milestones: Array<{
    name: string;
    date: string;
    percentage: number;
  }>;
}

const PAYMENT_TERMS = [
  { value: '100-upfront', label: '100% Upfront', description: 'Full payment before content creation' },
  { value: '50-50', label: '50-50 Split', description: '50% upfront, 50% on delivery' },
  { value: '30-70', label: '30-70 Split', description: '30% upfront, 70% on delivery' },
  { value: 'milestone', label: 'Milestone-based', description: 'Payment tied to campaign milestones' },
];

export default function BudgetTimelineStep({ onNext, onBack, initialData, totalBudget }: BudgetTimelineStepProps) {
  const [creatorBudget, setCreatorBudget] = useState(initialData?.creatorBudget || totalBudget * 0.7);
  const [platformFees, setPlatformFees] = useState(initialData?.platformFees || totalBudget * 0.15);
  const [managementFees, setManagementFees] = useState(initialData?.managementFees || totalBudget * 0.1);
  const [contingency, setContingency] = useState(initialData?.contingency || totalBudget * 0.05);
  const [paymentTerms, setPaymentTerms] = useState(initialData?.paymentTerms || '');
  const [milestones, setMilestones] = useState(initialData?.milestones || [
    { name: 'Campaign Kickoff', date: '', percentage: 30 },
    { name: 'Content Approval', date: '', percentage: 40 },
    { name: 'Campaign Completion', date: '', percentage: 30 },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const allocatedBudget = creatorBudget + platformFees + managementFees + contingency;
  const remainingBudget = totalBudget - allocatedBudget;

  const updateMilestone = (index: number, field: string, value: any) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const addMilestone = () => {
    setMilestones([...milestones, { name: '', date: '', percentage: 0 }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!paymentTerms) {
      alert('Please select payment terms');
      return;
    }

    if (Math.abs(remainingBudget) > 100) {
      alert(`Budget allocation mismatch. ${remainingBudget > 0 ? 'Remaining' : 'Exceeding by'}: ${formatCurrency(Math.abs(remainingBudget))}`);
      return;
    }

    if (paymentTerms === 'milestone') {
      const totalPercentage = milestones.reduce((sum, m) => sum + m.percentage, 0);
      if (Math.abs(totalPercentage - 100) > 1) {
        alert(`Milestone percentages must total 100% (currently ${totalPercentage}%)`);
        return;
      }
    }

    onNext({
      creatorBudget,
      platformFees,
      managementFees,
      contingency,
      paymentTerms,
      milestones,
    });
  };

  return (
    <div className="budget-timeline-step">
      {/* Header */}
      <div className="step-header">
        <h1 className="step-title">Budget & Timeline</h1>
        <p className="step-subtitle">
          Allocate your campaign budget and set payment terms
        </p>
      </div>

      {/* Budget Summary */}
      <div className="budget-summary-card">
        <h3>Total Campaign Budget</h3>
        <div className="budget-amount">{formatCurrency(totalBudget)}</div>
        <div className={`budget-status ${Math.abs(remainingBudget) < 100 ? 'budget-status--balanced' : remainingBudget > 0 ? 'budget-status--remaining' : 'budget-status--exceeded'}`}>
          {Math.abs(remainingBudget) < 100 ? (
            <>✓ Budget Fully Allocated</>
          ) : remainingBudget > 0 ? (
            <><UiIcon name="alert" /> {formatCurrency(remainingBudget)} Unallocated</>
          ) : (
            <><UiIcon name="x" /> Exceeding by {formatCurrency(Math.abs(remainingBudget))}</>
          )}
        </div>
      </div>

      {/* Budget Allocation */}
      <div className="form-section">
        <h3 className="section-title">Budget Allocation</h3>

        <div className="budget-allocation-list">
          <div className="allocation-item">
            <div className="allocation-header">
              <label htmlFor="creator-budget">Creator Payments</label>
              <span className="allocation-percentage">
                {((creatorBudget / totalBudget) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="input-with-currency">
              <span className="currency-prefix">₹</span>
              <input
                id="creator-budget"
                type="number"
                className="form-input"
                value={creatorBudget}
                onChange={(e) => setCreatorBudget(parseInt(e.target.value) || 0)}
                min="0"
                step="1000"
              />
            </div>
          </div>

          <div className="allocation-item">
            <div className="allocation-header">
              <label htmlFor="platform-fees">Platform Fees</label>
              <span className="allocation-percentage">
                {((platformFees / totalBudget) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="input-with-currency">
              <span className="currency-prefix">₹</span>
              <input
                id="platform-fees"
                type="number"
                className="form-input"
                value={platformFees}
                onChange={(e) => setPlatformFees(parseInt(e.target.value) || 0)}
                min="0"
                step="1000"
              />
            </div>
          </div>

          <div className="allocation-item">
            <div className="allocation-header">
              <label htmlFor="management-fees">Management Fees</label>
              <span className="allocation-percentage">
                {((managementFees / totalBudget) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="input-with-currency">
              <span className="currency-prefix">₹</span>
              <input
                id="management-fees"
                type="number"
                className="form-input"
                value={managementFees}
                onChange={(e) => setManagementFees(parseInt(e.target.value) || 0)}
                min="0"
                step="1000"
              />
            </div>
          </div>

          <div className="allocation-item">
            <div className="allocation-header">
              <label htmlFor="contingency">Contingency Buffer</label>
              <span className="allocation-percentage">
                {((contingency / totalBudget) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="input-with-currency">
              <span className="currency-prefix">₹</span>
              <input
                id="contingency"
                type="number"
                className="form-input"
                value={contingency}
                onChange={(e) => setContingency(parseInt(e.target.value) || 0)}
                min="0"
                step="1000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      <div className="form-section">
        <h3 className="section-title">Payment Terms</h3>
        <div className="payment-terms-grid">
          {PAYMENT_TERMS.map((term) => (
            <button
              key={term.value}
              type="button"
              className={`payment-term-card ${paymentTerms === term.value ? 'payment-term-card--selected' : ''}`}
              onClick={() => setPaymentTerms(term.value)}
            >
              <div className="payment-term-label">{term.label}</div>
              <div className="payment-term-description">{term.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Milestones - Only show if milestone-based payment selected */}
      {paymentTerms === 'milestone' && (
        <div className="form-section">
          <h3 className="section-title">Payment Milestones</h3>
          <div className="milestones-list">
            {milestones.map((milestone, index) => (
              <div key={index} className="milestone-item">
                <input
                  type="text"
                  className="form-input milestone-name"
                  value={milestone.name}
                  onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                  placeholder="Milestone name"
                />
                <input
                  type="date"
                  className="form-input milestone-date"
                  value={milestone.date}
                  onChange={(e) => updateMilestone(index, 'date', e.target.value)}
                />
                <div className="milestone-percentage-input">
                  <input
                    type="number"
                    className="form-input"
                    value={milestone.percentage}
                    onChange={(e) => updateMilestone(index, 'percentage', parseInt(e.target.value) || 0)}
                    min="0"
                    max="100"
                  />
                  <span>%</span>
                </div>
                <button
                  type="button"
                  className="btn-icon btn-icon-danger"
                  onClick={() => removeMilestone(index)}
                ><UiIcon name="trash" /></button>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addMilestone}>
            + Add Milestone
          </button>
          <div className="milestone-total">
            Total: {milestones.reduce((sum, m) => sum + m.percentage, 0)}%
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="step-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Continue to Review →
        </button>
      </div>
    </div>
  );
}
