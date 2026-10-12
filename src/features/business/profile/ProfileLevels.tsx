import { ArrowRight, Check, CreditCard, ShieldCheck, UserRound, type LucideIcon } from 'lucide-react';
import { profileProgress, useBusinessProfile } from '../businessProfile';
import './business-profile.css';

interface ProfileLevelsProps {
  onVerify: () => void;
  onPayments: () => void;
}

interface Level {
  key: string;
  icon: LucideIcon;
  level: string;
  title: string;
  text: string;
  done: boolean;
  action?: { label: string; onClick: () => void };
  note?: string;
}

export default function ProfileLevels({ onVerify, onPayments }: ProfileLevelsProps) {
  const profile = useBusinessProfile();
  const { verificationDone, paymentsDone, profileComplete, percent } = profileProgress(profile);
  const { account } = profile;

  const levels: Level[] = [
    {
      key: 'account',
      icon: UserRound,
      level: 'Level 1',
      title: 'Account',
      text: `Business details and verified phone${account.emailVerified && account.email ? ' and email' : ''}.`,
      done: true,
    },
    {
      key: 'verification',
      icon: ShieldCheck,
      level: 'Level 2',
      title: 'Business verification',
      text: 'Add your GSTIN (optional) to get a verified badge.',
      done: verificationDone,
      action: { label: 'Verify business', onClick: onVerify },
    },
    {
      key: 'payments',
      icon: CreditCard,
      level: 'Level 3',
      title: 'Payments',
      text: 'Legal entity, PAN, GST, billing address and bank details.',
      done: paymentsDone,
      action: { label: 'Set up payments', onClick: onPayments },
      note: 'Only needed when you pay creators',
    },
  ];

  return (
    <section className="bp-levels" aria-labelledby="bp-levels-title">
      <div className="bp-levels__head">
        <div>
          <h2 className="bp-levels__title" id="bp-levels-title">
            {profileComplete ? 'Your profile is complete' : 'Complete your business profile'}
          </h2>
          <p className="bp-levels__sub">
            {profileComplete
              ? paymentsDone
                ? 'Everything is set up. You can launch campaigns and pay creators.'
                : 'Add payment details when you are ready to pay creators.'
              : 'Verify your business so creators know they are working with a real brand.'}
          </p>
        </div>
        <div className="bp-levels__pct">
          <strong>{percent}%</strong>
          <span>complete</span>
        </div>
      </div>

      <div className="bp-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: `${percent}%` }} />
      </div>

      <ol className="bp-levels__list">
        {levels.map(({ key, icon: Icon, level, title, text, done, action, note }) => (
          <li key={key} className={`bp-level${done ? ' is-done' : ''}`}>
            <span className="bp-level__icon">{done ? <Check size={16} strokeWidth={2.5} /> : <Icon size={16} />}</span>
            <div className="bp-level__body">
              <span className="bp-level__tag">{level}</span>
              <strong>{title}</strong>
              <p>{text}</p>
              {done ? (
                <span className="bp-chip bp-chip--ok">Done</span>
              ) : action ? (
                <button type="button" className="bp-level__action" onClick={action.onClick}>
                  {action.label} <ArrowRight size={14} />
                </button>
              ) : null}
              {!done && note && <small className="bp-level__note">{note}</small>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
