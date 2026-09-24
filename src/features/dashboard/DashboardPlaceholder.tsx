import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import Logo from '../../components/Logo';

export default function DashboardPlaceholder() {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(145deg,#fef3ed 0%,var(--in-cream) 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 24, gap: 28,
    }}>
      <Logo size="xl"/>

      <div style={{
        background: 'white',
        borderRadius: 24,
        padding: 'clamp(28px,5vw,44px) clamp(24px,5vw,44px)',
        maxWidth: 500, width: '100%',
        boxShadow: '0 12px 40px rgba(242,132,107,0.12)',
        border: '1px solid var(--in-border)',
        textAlign: 'center',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <div style={{ fontSize: '2.5rem' }}>🎉</div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--in-charcoal)', letterSpacing: '-0.02em', margin: 0 }}>
          You're in, {state.user?.businessName ?? 'Business'}!
        </h1>

        <p style={{ color: 'var(--in-gray)', lineHeight: 1.65, margin: 0 }}>
          Your Influnz business account is active. The full campaign dashboard — AI briefs, creator matching, analytics — is coming in the next phase.
        </p>

        {/* Session info chip */}
        <div style={{
          background: 'rgba(242,132,107,0.05)',
          border: '1px solid var(--in-border)',
          borderRadius: 12, padding: '14px 18px',
          textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--in-gray-light)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
            Session info
          </p>
          {[
            ['Business', state.user?.businessName ?? '—'],
            ['Email',    state.user?.email ?? '—'],
            ['Role',     state.user?.role ?? '—'],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', gap: 8, fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--in-gray-light)', minWidth: 68 }}>{label}</span>
              <span style={{ color: 'var(--in-charcoal)', fontWeight: 600 }}>{val}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="in-submit"
          style={{ marginTop: 4 }}
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>

      <p style={{ fontSize: '0.8125rem', color: 'var(--in-gray-light)', textAlign: 'center' }}>
        Phase 1 complete ✓ · Auth &amp; landing working · Dashboard coming in Phase 3
      </p>
    </div>
  );
}
