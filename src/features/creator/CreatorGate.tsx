import { Navigate } from 'react-router-dom';
import { useCreator } from './CreatorContext';

/**
 * Gates the main creator app (dashboard + lifecycle) behind onboarding completion.
 * If onboarding is incomplete, redirects to the first incomplete step.
 */
export default function CreatorGate({ children }: { children: React.ReactNode }) {
  const { onboarding } = useCreator();

  if (!onboarding.complete) {
    return <Navigate to={`/creator/onboarding/${onboarding.currentStep}`} replace />;
  }

  return <>{children}</>;
}
