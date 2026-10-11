import { Check } from 'lucide-react';
import type { OnboardingStep } from '../types';

interface StepDef {
  key: OnboardingStep;
  label: string;
}

const STEPS: StepDef[] = [
  { key: 'verify', label: 'Verification' },
  { key: 'passport', label: 'Passport' },
  { key: 'preferences', label: 'Preferences' },
];

export default function Stepper({
  current,
  completed,
}: {
  current: OnboardingStep;
  completed: OnboardingStep[];
}) {
  return (
    <ol className="cr-stepper" aria-label="Onboarding progress">
      {STEPS.map((s, i) => {
        const isDone = completed.includes(s.key);
        const isCurrent = s.key === current && !isDone;
        const state = isDone ? 'done' : isCurrent ? 'current' : 'upcoming';
        return (
          <li key={s.key} className={`cr-step cr-step--${state}`} aria-current={isCurrent ? 'step' : undefined}>
            <span className="cr-step__marker">
              {isDone ? <Check size={15} /> : i + 1}
            </span>
            <span className="cr-step__label">{s.label}</span>
            {i < STEPS.length - 1 && <span className="cr-step__line" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
