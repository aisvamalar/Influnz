/**
 * Mobile header for the campaign setup flow: back, brand, close, and the step tracker.
 */
import { ArrowLeft, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import './mobile-flow-header.css';

export const CAMPAIGN_FLOW_STEPS = ['Strategy', 'Creators', 'Negotiate', 'Review', 'Payment', 'Analytics'] as const;

export interface MobileFlowHeaderProps {
  /** Zero-based index into CAMPAIGN_FLOW_STEPS. */
  step: number;
  /** Hide the step tracker on drill-down screens (e.g. a creator profile). */
  showSteps?: boolean;
  showClose?: boolean;
  onBack?: () => void;
  onClose?: () => void;
}

export default function MobileFlowHeader({ step, showSteps = true, showClose = true, onBack, onClose }: MobileFlowHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="mfh">
      <div className="mfh__bar">
        <button type="button" className="mfh__circle" aria-label="Back" onClick={onBack ?? (() => navigate(-1))}>
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <div className="mfh__brand">
          <img src={logoImg} alt="Influnz" className="mfh__logo" />
          <span className="mfh__badge">BUSINESS</span>
        </div>
        {showClose ? (
          <button
            type="button"
            className="mfh__circle"
            aria-label="Close campaign setup"
            onClick={onClose ?? (() => navigate('/business/campaigns'))}
          >
            <X size={20} strokeWidth={2} />
          </button>
        ) : (
          <span className="mfh__spacer" aria-hidden="true" />
        )}
      </div>

      {showSteps && (
        <ol className="mfh__steps" aria-label="Campaign setup progress">
          {CAMPAIGN_FLOW_STEPS.map((label, i) => {
            const state = i < step ? 'done' : i === step ? 'active' : 'todo';
            return (
              <li key={label} className={`mfh__step mfh__step--${state}`} aria-current={i === step ? 'step' : undefined}>
                <span className="mfh__dot">{state === 'done' ? <Check size={13} strokeWidth={3} /> : i + 1}</span>
                <span className="mfh__label">{label}</span>
              </li>
            );
          })}
        </ol>
      )}
    </header>
  );
}
