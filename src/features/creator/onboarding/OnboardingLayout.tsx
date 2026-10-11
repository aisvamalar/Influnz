import { Navigate, Outlet } from 'react-router-dom';
import Logo from '../../../components/Logo';
import { useCreator } from '../CreatorContext';
import Stepper from './Stepper';

/**
 * Layout for the creator onboarding sequence.
 * Shows a brand header + stepper, no main sidebar.
 * Redirects to the dashboard once onboarding is complete.
 */
export default function OnboardingLayout() {
  const { onboarding } = useCreator();

  if (onboarding.complete) {
    return <Navigate to="/creator/dashboard" replace />;
  }

  return (
    <div className="cr-onboarding">
      <header className="cr-onboarding__header">
        <Logo size="md" />
        <Stepper current={onboarding.currentStep} completed={onboarding.completedSteps} />
      </header>

      <main id="main-content" className="cr-onboarding__body">
        <Outlet />
      </main>
    </div>
  );
}
