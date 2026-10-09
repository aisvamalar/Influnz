import './campaign-strategy.css';

const STEPS = ['Strategy', 'Creators', 'Negotiate', 'Review', 'Payment', 'Analytics'];

export default function CampaignStepper({ current }: { current: number }) {
  return (
    <ol className="st-steps" aria-label="Campaign setup progress">
      {STEPS.map((label, i) => (
        <li
          key={label}
          className={`st-step${i === current ? ' st-step--active' : ''}${i < current ? ' st-step--done' : ''}`}
          aria-current={i === current ? 'step' : undefined}
        >
          <span className="st-step__dot">{i + 1}</span>
          <span className="st-step__label">{label}</span>
        </li>
      ))}
    </ol>
  );
}
