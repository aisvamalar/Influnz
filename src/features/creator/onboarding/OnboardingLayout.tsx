/**
 * Layout for the creator onboarding sequence (verify → passport → preferences).
 * Top bar + stepper band, then the step with its progress rail. No sidebar.
 * Redirects to the dashboard once onboarding is complete.
 */
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import logoImg from '../../../assets/logo.png';
import { useAuth } from '../../../app/AuthContext';
import { useCreator } from '../CreatorContext';
import type { OnboardingStep } from '../types';
import '../../business/campaign-strategy.css';
import '../../auth/auth-web.css';
import '../creator-ui.css';
import '../creator-onboarding.css';

const STEPS: Array<{ key: OnboardingStep; label: string }> = [
  { key: 'verify', label: 'Verification' },
  { key: 'passport', label: 'Creator Passport' },
  { key: 'preferences', label: 'Preferences' },
];

export default function OnboardingLayout() {
  const { onboarding } = useCreator();
  const { logout } = useAuth();
  const navigate = useNavigate();

  if (onboarding.complete) {
    return <Navigate to="/creator/dashboard" replace />;
  }

  const currentIndex = STEPS.findIndex(s => s.key === onboarding.currentStep);
  const current = STEPS[currentIndex] ?? STEPS[0];

  const exit = async () => {
    await logout();
    navigate('/login?type=creator', { replace: true });
  };

  return (
    <div className="cro aw-scope">
      <header className="cro-top">
        <div className="cro-top__inner">
          <img className="cro-top__logo" src={logoImg} alt="Influnz" />
          <span className="cro-top__step">
            Step <strong>{currentIndex + 2} of 4</strong> · {current.label}
          </span>
          <button type="button" className="cro-top__exit" onClick={exit}>
            <LogOut size={14} /> Save &amp; exit
          </button>
        </div>
      </header>

      <div className="cro-band">
        <div className="cro-band__inner">
          <ol className="st-steps" aria-label="Onboarding progress">
            {STEPS.map((s, i) => {
              const done = onboarding.completedSteps.includes(s.key);
              const active = s.key === onboarding.currentStep && !done;
              return (
                <li
                  key={s.key}
                  className={`st-step${active ? ' st-step--active' : ''}${done ? ' st-step--done' : ''}`}
                  aria-current={active ? 'step' : undefined}
                >
                  <span className="st-step__dot">{done ? '✓' : i + 1}</span>
                  <span className="st-step__label">{s.label}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <main id="main-content" className="cro-body">
        <Outlet />
      </main>
    </div>
  );
}
