/**
 * Full-screen "Sending request…" loader shown while offers are prepared,
 * then hands control back via onDone. Used by both the web and mobile flows.
 */
import { useEffect, useRef, useState } from 'react';
import RobotMark from './mobile/RobotMark';
import './sending-request-overlay.css';

export interface SendingRequestOverlayProps {
  /** Progress lines cycled under the title. */
  steps?: string[];
  durationMs?: number;
  onDone: () => void;
}

const DEFAULT_STEPS = [
  'Preparing personalized offers…',
  'Applying your budget guardrails…',
  'Sending request to creators…',
];

export default function SendingRequestOverlay({ steps = DEFAULT_STEPS, durationMs = 2600, onDone }: SendingRequestOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    const perStep = durationMs / steps.length;
    const ticker = window.setInterval(() => setStepIndex((i) => Math.min(i + 1, steps.length - 1)), perStep);
    const done = window.setTimeout(() => onDoneRef.current(), durationMs);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearInterval(ticker);
      window.clearTimeout(done);
      document.body.style.overflow = overflow;
    };
  }, [durationMs, steps.length]);

  return (
    <div className="sro" role="status" aria-live="polite" aria-busy="true">
      <div className="sro__panel">
        <div className="sro__visual" aria-hidden="true">
          <span className="sro__ring" />
          <span className="sro__ring sro__ring--delay" />
          <span className="sro__spinner" />
          <span className="sro__robot">
            <RobotMark size={56} />
          </span>
        </div>
        <p className="sro__title">
          Sending request
          <span className="sro__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </p>
        <p className="sro__step" key={stepIndex}>
          {steps[stepIndex]}
        </p>
        <div className="sro__bar" aria-hidden="true">
          <span style={{ animationDuration: `${durationMs}ms` }} />
        </div>
      </div>
    </div>
  );
}
