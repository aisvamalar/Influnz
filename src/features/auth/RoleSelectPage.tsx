import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Megaphone, Building2, ArrowRight, Check } from 'lucide-react';
import Logo from '../../components/Logo';
import type { AccountType } from '../../lib/auth/types';

interface RoleOption {
  type: AccountType;
  icon: typeof Megaphone;
  title: string;
  tagline: string;
  points: string[];
}

const OPTIONS: RoleOption[] = [
  {
    type: 'creator',
    icon: Megaphone,
    title: "I'm a Creator",
    tagline: 'Get discovered by brands and get paid for your content.',
    points: ['Receive matched campaign invitations', 'Let AI negotiate your rates', 'Protected, on-time payments'],
  },
  {
    type: 'business',
    icon: Building2,
    title: "I'm a Business",
    tagline: 'Run creator campaigns that drive real, measurable results.',
    points: ['AI builds your campaign plan', 'Discover verified creators', 'Track ROI per creator'],
  },
];

export default function RoleSelectPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<AccountType | null>(null);

  const proceed = (type: AccountType) => {
    navigate(`/signup?role=${type}`);
  };

  return (
    <main id="main-content" className="in-auth-page" aria-label="Choose account type">
      <div className="in-auth-blob in-auth-blob--tl" aria-hidden="true" />
      <div className="in-auth-blob in-auth-blob--br" aria-hidden="true" />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: 860, margin: 'auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32,
        padding: 'clamp(24px, 5vw, 48px)',
      }}>
        <Link to="/" aria-label="Influnz home"><Logo size="lg" /></Link>

        <div style={{ textAlign: 'center', maxWidth: 520 }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--in-charcoal)', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
            How do you want to use Influnz?
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--in-gray)', lineHeight: 1.6, margin: 0 }}>
            Choose the option that fits you best. You can always create the other account type later.
          </p>
        </div>

        <div className="in-role-grid" role="radiogroup" aria-label="Account type">
          {OPTIONS.map(opt => {
            const active = selected === opt.type;
            return (
              <button
                key={opt.type}
                type="button"
                role="radio"
                aria-checked={active}
                className={`in-role-card${active ? ' in-role-card--active' : ''}`}
                onClick={() => setSelected(opt.type)}
                onDoubleClick={() => proceed(opt.type)}
              >
                <span className="in-role-card__icon" aria-hidden="true">
                  <opt.icon size={28} />
                </span>
                <span className="in-role-card__title">{opt.title}</span>
                <span className="in-role-card__tagline">{opt.tagline}</span>
                <ul className="in-role-card__points">
                  {opt.points.map(p => (
                    <li key={p}><Check size={15} aria-hidden="true" /> {p}</li>
                  ))}
                </ul>
                {active && <span className="in-role-card__badge" aria-hidden="true"><Check size={16} /></span>}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="in-submit"
          style={{ maxWidth: 400 }}
          disabled={!selected}
          onClick={() => selected && proceed(selected)}
        >
          Continue {selected ? `as ${selected === 'creator' ? 'Creator' : 'Business'}` : ''} <ArrowRight size={18} />
        </button>

        <p style={{ fontSize: '0.875rem', color: 'var(--in-gray)' }}>
          Already have an account? <Link to="/login" className="in-link">Sign in →</Link>
        </p>
      </div>
    </main>
  );
}
