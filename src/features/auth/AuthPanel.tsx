/**
 * AuthPanel — Enhanced interactive coral brand panel (desktop ≥860px)
 * Now with animated stats, floating badges, and smooth interactions
 */
import { useState, useEffect } from 'react';
import Logo from '../../components/Logo';

interface AuthPanelProps {
  mode: 'login' | 'signup';
  onSwitch: () => void;
}

const FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 2l1.5 4h4l-3.2 2.4 1.2 3.8L9 9.8l-3.5 2.4 1.2-3.8L3.5 6h4L9 2z" fill="white" />
      </svg>
    ),
    text: 'AI builds your entire campaign brief',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="7" r="3.5" stroke="white" strokeWidth="1.6" />
        <path d="M2 16c0-3.9 3.1-6 7-6s7 2.1 7 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    text: '15,000+ verified Indian creators',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="5" width="14" height="10" rx="2" stroke="white" strokeWidth="1.6" />
        <path d="M5 5V4a4 4 0 018 0v1" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    text: 'Protected payments & smart contracts',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M3 13l4-5 3 3 3-4 3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: 'Real-time ROI tracking per creator',
  },
];

// Animated stat values
const INITIAL_STATS = [
  { value: 0, target: 12.5, suffix: 'L', label: 'saved this week', prefix: '₹' },
  { value: 0, target: 2400, suffix: '+', label: 'active campaigns', prefix: '' },
  { value: 0, target: 94, suffix: '%', label: 'fill rate', prefix: '' },
];

function AnimatedNumber({ target, suffix, prefix }: { target: number; suffix: string; prefix: string }) {
  const [current, setCurrent] = useState(0);
  
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      if (step <= steps) {
        setCurrent(_prev => {
          const next = increment * step;
          return next > target ? target : next;
        });
      } else {
        clearInterval(timer);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [target]);
  
  const formatNumber = (num: number) => {
    if (suffix === 'L') return (num).toFixed(1);
    if (suffix === '%') return Math.round(num);
    return Math.round(num);
  };
  
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}{formatNumber(current)}{suffix}
    </span>
  );
}

export default function AuthPanel({ mode, onSwitch }: AuthPanelProps) {
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const isLogin = mode === 'login';

  useEffect(() => {
    const timer = setTimeout(() => setFeaturesVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <aside className="in-auth-panel" aria-hidden="true">
      {/* Animated background blobs */}
      <div style={{
        position: 'absolute', top: -80, right: -80,
        width: 280, height: 280, borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)', 
        pointerEvents: 'none',
        animation: 'float 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, left: -60,
        width: 220, height: 220, borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)', 
        pointerEvents: 'none',
        animation: 'float 8s ease-in-out infinite 3s',
      }} />
      
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 3 + 4}s ease-in-out infinite ${Math.random() * 2}s`,
            pointerEvents: 'none',
          }}
        />
      ))}

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', gap: 32 }}>

        {/* Logo with entrance animation */}
        <div style={{ animation: 'fadeIn 0.6s ease both' }}>
          <Logo size="md" inverted />
        </div>

        {/* Headline with stagger animation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            margin: 0,
            animation: 'slideUp 0.7s ease both 0.2s',
            opacity: 0,
            animationFillMode: 'forwards',
          }}>
            {isLogin ? (
              <>Creator marketing,<br /><em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', opacity: 0.92 }}>simplified.</em></>
            ) : (
              <>Your goal.<br /><em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', opacity: 0.92 }}>Our AI. Real results.</em></>
            )}
          </h2>
          <p style={{ 
            fontSize: '0.9375rem', 
            color: 'rgba(255,255,255,0.8)', 
            lineHeight: 1.65, 
            margin: 0, 
            maxWidth: 300,
            animation: 'slideUp 0.7s ease both 0.4s',
            opacity: 0,
            animationFillMode: 'forwards',
          }}>
            {isLogin
              ? 'From local businesses to national brands — we make creator marketing simple, effective and measurable.'
              : 'Join thousands of Indian businesses running smarter creator campaigns with AI.'}
          </p>
        </div>

        {/* Feature list with staggered entrance */}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <li 
              key={f.text} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12,
                animation: featuresVisible ? `slideUp 0.5s ease both ${0.6 + i * 0.1}s` : 'none',
                opacity: featuresVisible ? 1 : 0,
                transform: featuresVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'transform 0.3s ease, opacity 0.3s ease',
              }}
              onMouseEnter={e => {
                if (featuresVisible) {
                  e.currentTarget.style.transform = 'translateX(8px)';
                }
              }}
              onMouseLeave={e => {
                if (featuresVisible) {
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <span style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(8px)',
              }}>
                {f.icon}
              </span>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.92)', fontWeight: 500 }}>
                {f.text}
              </span>
            </li>
          ))}
        </ul>

        {/* Animated Stats strip */}
        <div style={{
          display: 'flex', gap: 0,
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.18)',
          overflow: 'hidden',
          marginTop: 'auto',
          animation: 'slideUp 0.6s ease both 1.2s',
          opacity: 0,
          animationFillMode: 'forwards',
          transform: 'translateY(20px)',
        }}>
          {INITIAL_STATS.map((s, i) => (
            <div key={s.label} style={{
              flex: 1, textAlign: 'center', padding: '14px 8px',
              borderRight: i < INITIAL_STATS.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'white', lineHeight: 1.2 }}>
                <AnimatedNumber target={s.target} suffix={s.suffix} prefix={s.prefix} />
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Enhanced Switch CTA */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12,
          padding: '12px 18px',
          animation: 'slideUp 0.6s ease both 1.4s',
          opacity: 0,
          animationFillMode: 'forwards',
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>
            {isLogin ? 'New to Influnz?' : 'Already have an account?'}
          </span>
          <button
            type="button"
            onClick={onSwitch}
            style={{
              background: 'white', color: '#b94a33',
              border: 'none', borderRadius: 40,
              padding: '8px 18px', fontSize: '0.8125rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'translateY(-1px) scale(0.98)'}
            onMouseUp={e => e.currentTarget.style.transform = 'translateY(-2px) scale(1)'}
          >
            {isLogin ? 'Create account →' : 'Sign in →'}
          </button>
        </div>
      </div>
    </aside>
  );
}