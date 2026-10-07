import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

// ── Navigation ────────────────────────────────────────────────────────────────
function Nav() {
  const navigate = useNavigate();

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #f0f0f0',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 60px'
    }}>
      {/* Logo */}
      <img 
        src={logoImg} 
        alt="Influnz" 
        style={{ 
          height: '32px',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/')}
      />

      {/* Center Nav Links */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        {['How it works', 'For Businesses', 'For Creators', 'Pricing', 'Resources ▾'].map((label) => (
          <button key={label} style={{
            background: 'none',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            color: '#4b5563',
            cursor: 'pointer',
            padding: '8px 0',
            fontFamily: 'inherit'
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1f2937',
            cursor: 'pointer',
            padding: '10px 20px',
            fontFamily: 'inherit'
          }}
        >
          Log in
        </button>
        <button
          onClick={() => navigate('/signup')}
          style={{
            background: 'linear-gradient(135deg, #dc6b5f 0%, #d14538 100%)',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            color: 'white',
            cursor: 'pointer',
            padding: '11px 22px',
            borderRadius: '6px',
            fontFamily: 'inherit'
          }}
        >
          Get started →
        </button>
      </div>
    </nav>
  );
}

// ── Main landing ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#fdfcfb', minHeight: '100vh' }}>
      <Nav />

      <main style={{ paddingTop: '70px' }}>
        {/* ── Hero Section ── */}
        <section style={{
          padding: '60px 60px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center',
          maxWidth: '1320px',
          margin: '0 auto',
          background: 'radial-gradient(circle at 80% 20%, rgba(252, 231, 243, 0.25) 0%, transparent 50%)'
        }}>
          {/* Left Content */}
          <div>
            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '20px',
              marginBottom: '28px'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#dc2626">
                <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
              </svg>
              <span style={{ fontSize: '13px', color: '#dc2626', fontWeight: '600' }}>
                India's first AI-powered creator commerce platform
              </span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: '56px',
              fontWeight: '800',
              lineHeight: '1.1',
              color: '#111827',
              marginBottom: '20px',
              letterSpacing: '-0.03em'
            }}>
              Creators create.<br />
              Brands grow.<br />
              We <span style={{ 
                color: '#dc2626', 
                fontStyle: 'italic',
                fontWeight: '800',
                textDecoration: 'underline',
                textDecorationColor: '#dc2626',
                textDecorationThickness: '3px',
                textUnderlineOffset: '4px'
              }}>make it happen.</span>
            </h1>

            {/* Subheadline */}
            <p style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#6b7280',
              marginBottom: '32px',
              maxWidth: '480px'
            }}>
              From finding the right creators to campaign execution and real results — all powered by AI.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  padding: '13px 26px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'white',
                  background: 'linear-gradient(135deg, #dc6b5f 0%, #d14538 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                Get started →
              </button>
              <button
                style={{
                  padding: '13px 26px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#4b5563',
                  background: 'white',
                  border: '1.5px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch video
              </button>
            </div>

            {/* Feature Pills */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px'
            }}>
              {[
                { icon: '🎯', label: 'AI creator matching', desc: 'Find the right fit, faster' },
                { icon: '📊', label: 'End-to-end campaign management', desc: '' },
                { icon: '🔒', label: 'Secure & transparent', desc: 'With real-time tracking' }
              ].map((feature) => (
                <div key={feature.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: feature.icon === '🎯' ? '#fef2f2' : feature.icon === '📊' ? '#fef3e8' : '#fef2f2',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0
                  }}>{feature.icon}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '2px' }}>
                      {feature.label}
                    </div>
                    {feature.desc && (
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                        {feature.desc}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual - Complex Hero Mockup */}
          <div style={{ position: 'relative', height: '600px' }}>
            {/* Main Creator Photo Card */}
            <div style={{
              position: 'absolute',
              top: '80px',
              right: '40px',
              width: '340px',
              height: '420px',
              background: 'linear-gradient(135deg, #fde9e7 0%, #fdf2e8 100%)',
              borderRadius: '200px 200px 30px 30px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.8)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=faces"
                alt="Creator"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top'
                }}
              />
            </div>

            {/* AI Match Card - Top Left */}
            <div style={{
              position: 'absolute',
              top: '60px',
              left: '0',
              background: 'white',
              borderRadius: '50px',
              padding: '10px 20px 10px 10px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: '#ede9fe',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px'
              }}>🤖</div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#111827' }}>AI Match</div>
                <div style={{ fontSize: '10px', color: '#6b7280' }}>96% match</div>
              </div>
              <div style={{ display: 'flex', marginLeft: '4px' }}>
                {[1,2,3].map((i) => (
                  <div key={i} style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: `hsl(${i * 30}, 70%, 60%)`,
                    border: '2px solid white',
                    marginLeft: i > 1 ? '-10px' : '0'
                  }} />
                ))}
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#e5e7eb',
                  border: '2px solid white',
                  marginLeft: '-10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: '700',
                  color: '#6b7280'
                }}>+5</div>
              </div>
            </div>

            {/* Campaign Reach Card - Right Side */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '0',
              background: 'white',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6',
              width: '150px'
            }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', marginBottom: '8px' }}>
                Campaign Reach
              </div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>
                125K
              </div>
              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '600' }}>+42%</div>
              <div style={{
                height: '40px',
                display: 'flex',
                alignItems: 'flex-end',
                gap: '3px',
                marginTop: '12px'
              }}>
                {[50, 65, 55, 75, 70, 85, 100].map((height, idx) => (
                  <div key={idx} style={{
                    flex: 1,
                    height: `${height}%`,
                    background: '#fca5a5',
                    borderRadius: '2px 2px 0 0'
                  }} />
                ))}
              </div>
            </div>

            {/* Coffee Latte Art Card with Instagram */}
            <div style={{
              position: 'absolute',
              bottom: '140px',
              left: '20px',
              width: '140px',
              height: '140px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.14)',
              overflow: 'hidden',
              border: '3px solid white',
              transform: 'rotate(-8deg)'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '56px'
              }}>
                ☕
              </div>
              {/* Instagram overlay on coffee */}
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                width: '32px',
                height: '32px',
                background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              {/* Stats overlay */}
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '9px',
                fontWeight: '700',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span>❤️</span>
                <span>1.2k</span>
              </div>
            </div>

            {/* Categories List - Right Side */}
            <div style={{
              position: 'absolute',
              top: '240px',
              right: '10px',
              background: 'white',
              borderRadius: '14px',
              padding: '12px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6',
              width: '100px'
            }}>
              {[
                { icon: '🍕', label: 'Food' },
                { icon: '👗', label: 'Lifestyle' },
                { icon: '✈️', label: 'Travel' },
                { icon: '💄', label: 'Beauty' },
                { icon: '💪', label: 'Fitness' }
              ].map((cat) => (
                <div key={cat.label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 0',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#6b7280'
                }}>
                  <span style={{ fontSize: '14px' }}>{cat.icon}</span>
                  <span>{cat.label}</span>
                </div>
              ))}
            </div>

            {/* Heart Icon - Floating */}
            <div style={{
              position: 'absolute',
              bottom: '180px',
              right: '80px',
              fontSize: '32px'
            }}>
              ❤️
            </div>

            {/* Real Creators Real Results Badge */}
            <div style={{
              position: 'absolute',
              bottom: '40px',
              right: '100px',
              fontStyle: 'italic',
              lineHeight: '1.2'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#dc2626' }}>
                Real Creators
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#dc2626' }}>
                Real Results
              </div>
              <svg width="60" height="30" viewBox="0 0 60 30" fill="none" style={{ marginTop: '-5px' }}>
                <path d="M5 15 Q20 25 35 15" stroke="#dc2626" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Paper Plane */}
            <div style={{
              position: 'absolute',
              top: '0',
              right: '20px',
              fontSize: '32px',
              transform: 'rotate(45deg)'
            }}>
              ✈️
            </div>

            {/* Decorative Lines - Top Left */}
            <svg style={{
              position: 'absolute',
              top: '100px',
              left: '30px',
              width: '50px',
              height: '50px'
            }} viewBox="0 0 100 100" fill="none">
              <path d="M20 40 L40 20" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M20 60 L40 40" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
        </section>

        {/* ── Trusted By Section ── */}
        <section style={{
          padding: '50px 60px',
          background: 'white',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{
            maxWidth: '1320px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '70px'
          }}>
            <div style={{ minWidth: '160px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827', lineHeight: '1.4' }}>
                Trusted by
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827', lineHeight: '1.4' }}>
                growing brands
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '50px',
              flex: 1,
              justifyContent: 'space-between',
              opacity: 0.35
            }}>
              {['zomato', 'NYKAA', 'mamaearth', 'boAt', 'TITAN', 'purplle'].map((brand) => (
                <div key={brand} style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#9ca3af',
                  letterSpacing: '-0.01em'
                }}>
                  {brand}
                </div>
              ))}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#9ca3af',
              fontWeight: '600',
              minWidth: '110px',
              textAlign: 'right',
              lineHeight: '1.5'
            }}>
              and 500+ more<br />brands
            </div>
          </div>
        </section>

        {/* ── How It Works Section ── */}
        <section style={{
          padding: '80px 60px',
          background: '#fdfcfb'
        }}>
          <div style={{
            maxWidth: '1320px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#dc2626',
              letterSpacing: '0.05em',
              marginBottom: '16px'
            }}>
              HOW IT WORKS
            </div>
            <h2 style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#111827',
              marginBottom: '12px',
              letterSpacing: '-0.02em'
            }}>
              From idea to impact — <span style={{ color: '#dc2626', fontStyle: 'italic' }}>in 6 simple steps.</span>
            </h2>
            <p style={{
              fontSize: '17px',
              color: '#6b7280',
              marginBottom: '60px'
            }}>
              Launch successful creator campaigns with complete transparency and ease.
            </p>

            {/* Steps Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '24px',
              marginTop: '60px'
            }}>
              {[
                { num: '01', icon: '🎯', title: 'Deal Confirmed', desc: 'Finalize goals, budget and creators.' },
                { num: '02', icon: '🤝', title: 'Collaboration Setup', desc: 'Share guidelines, assets and timelines.' },
                { num: '03', icon: '💚', title: 'Content Submission', desc: 'Creators submit content for reviews.' },
                { num: '04', icon: '⚖️', title: 'Review & Approval', desc: 'Provide feedback and approve.' },
                { num: '05', icon: '💳', title: 'Payment', desc: 'Secure and timely payments.' },
                { num: '06', icon: '📊', title: 'Campaign Analytics', desc: 'Track real impact and ROI.' }
              ].map((step, idx) => (
                <div key={step.num}>
                  <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '28px 20px',
                    border: '1px solid #e5e7eb',
                    textAlign: 'center',
                    height: '100%'
                  }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      background: '#fef2f2',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      margin: '0 auto 20px'
                    }}>
                      {step.icon}
                    </div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#111827',
                      marginBottom: '8px'
                    }}>
                      {step.title}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      lineHeight: '1.5'
                    }}>
                      {step.desc}
                    </div>
                  </div>
                  {idx < 5 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ 
                      position: 'absolute', 
                      right: '-12px', 
                      top: '50%',
                      transform: 'translateY(-50%)',
                      opacity: 0.3
                    }}>
                      <path d="M9 18l6-6-6-6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── For Businesses Section ── */}
        <section style={{
          padding: '80px 60px',
          background: 'white'
        }}>
          <div style={{
            maxWidth: '1320px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center'
          }}>
            {/* Left Content */}
            <div>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#dc2626',
                letterSpacing: '0.05em',
                marginBottom: '16px'
              }}>
                FOR BUSINESSES
              </div>
              <h2 style={{
                fontSize: '42px',
                fontWeight: '800',
                color: '#111827',
                marginBottom: '24px',
                lineHeight: '1.2',
                letterSpacing: '-0.02em'
              }}>
                Find the right creators.<br />
                Drive real results.
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {[
                  'Access verified creators across categories',
                  'Run end-to-end campaigns with AI',
                  'Track performance in real time',
                  'Get measurable ROI'
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#fef2f2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#dc2626',
                      flexShrink: 0
                    }}>✓</div>
                    <span style={{ fontSize: '16px', color: '#4b5563' }}>{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  padding: '14px 28px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'white',
                  background: '#111827',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                Create a business account →
              </button>
            </div>

            {/* Right - Campaign Performance Card */}
            <div style={{
              background: 'linear-gradient(135deg, #fef3e8 0%, #fde4e8 100%)',
              borderRadius: '24px',
              padding: '40px',
              position: 'relative'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#6b7280', marginBottom: '12px' }}>
                  Campaign Performance
                </div>
                <div style={{ fontSize: '36px', fontWeight: '800', color: '#dc2626', marginBottom: '16px' }}>
                  +62%
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
                  More views
                </div>
                <div style={{
                  height: '80px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '6px',
                  marginBottom: '20px'
                }}>
                  {[45, 60, 50, 75, 65, 90, 100].map((height, idx) => (
                    <div key={idx} style={{
                      flex: 1,
                      height: `${height}%`,
                      background: '#fca5a5',
                      borderRadius: '4px 4px 0 0'
                    }} />
                  ))}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>📍</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>125K</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>Reach</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>❤️</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>18K</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>Engagement</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>📈</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>6.2%</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>Eng. Rate</div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center' }}>
                Last 30 days →
              </div>
            </div>
          </div>
        </section>

        {/* ── For Creators Section ── */}
        <section style={{
          padding: '80px 60px',
          background: '#fdfcfb'
        }}>
          <div style={{
            maxWidth: '1320px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center'
          }}>
            {/* Left - Creator Image */}
            <div style={{
              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
              borderRadius: '24px',
              padding: '40px',
              position: 'relative',
              height: '500px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=faces"
                alt="Creator"
                style={{
                  width: '320px',
                  height: '420px',
                  objectFit: 'cover',
                  borderRadius: '200px 200px 30px 30px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
                }}
              />
              {/* Floating Stats */}
              <div style={{
                position: 'absolute',
                top: '40px',
                right: '40px',
                background: 'white',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>📸 Brand deals</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>12</div>
              </div>
              <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '40px',
                background: 'white',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>💰 Total earnings</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#10b981' }}>₹2.4L</div>
              </div>
              <div style={{
                position: 'absolute',
                bottom: '120px',
                right: '30px',
                background: 'white',
                borderRadius: '12px',
                padding: '10px 14px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#10b981' }}>Verified</span>
              </div>
            </div>

            {/* Right Content */}
            <div>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#dc2626',
                letterSpacing: '0.05em',
                marginBottom: '16px'
              }}>
                FOR CREATORS
              </div>
              <h2 style={{
                fontSize: '42px',
                fontWeight: '800',
                color: '#111827',
                marginBottom: '24px',
                lineHeight: '1.2',
                letterSpacing: '-0.02em'
              }}>
                Collaborate with brands<br />
                you love.
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {[
                  'Get matched with relevant brands',
                  'Receive clear briefs and fair pay',
                  'Track your performance',
                  'Build long-term partnerships'
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#d1fae5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#10b981',
                      flexShrink: 0
                    }}>✓</div>
                    <span style={{ fontSize: '16px', color: '#4b5563' }}>{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  padding: '14px 28px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'white',
                  background: '#111827',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                Join as a creator →
              </button>
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section style={{
          padding: '80px 60px',
          background: 'linear-gradient(135deg, #fef3e8 0%, #fde4e8 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#dc2626',
              letterSpacing: '0.05em',
              marginBottom: '16px'
            }}>
              READY TO GROW?
            </div>
            <h2 style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#111827',
              marginBottom: '16px',
              lineHeight: '1.2',
              letterSpacing: '-0.02em'
            }}>
              Let's create <span style={{ color: '#dc2626', fontStyle: 'italic' }}>bigger stories</span> together.
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              marginBottom: '32px'
            }}>
              Join Influnz and experience a smarter, simpler way to run creator campaigns.
            </p>
            <button
              onClick={() => navigate('/signup')}
              style={{
                padding: '16px 36px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                background: 'linear-gradient(135deg, #dc6b5f 0%, #d14538 100%)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(220, 69, 56, 0.3)'
              }}
            >
              <span>🚀</span>
              Get started →
            </button>
          </div>
          {/* Decorative leaves */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '40px',
            width: '200px',
            height: '200px',
            opacity: 0.3
          }}>
            <div style={{ fontSize: '120px' }}>🍃</div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{
        background: '#111827',
        color: 'white',
        padding: '60px 60px 30px'
      }}>
        <div style={{
          maxWidth: '1320px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            gap: '60px',
            marginBottom: '40px'
          }}>
            {/* Brand Column */}
            <div>
              <img 
                src={logoImg} 
                alt="Influnz" 
                style={{ 
                  height: '32px',
                  marginBottom: '16px',
                  filter: 'brightness(0) invert(1)'
                }}
              />
              <p style={{
                fontSize: '14px',
                color: '#9ca3af',
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                India's first AI-powered creator commerce platform. Connect brands with creators for authentic, measurable campaigns.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['twitter', 'linkedin', 'instagram', 'youtube'].map((social) => (
                  <div key={social} style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#1f2937',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}>
                    {social === 'twitter' && '𝕏'}
                    {social === 'linkedin' && 'in'}
                    {social === 'instagram' && '📷'}
                    {social === 'youtube' && '▶'}
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Column */}
            <div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '16px',
                color: 'white'
              }}>
                Platform
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['How it works', 'Features', 'Pricing', 'Case studies'].map((link) => (
                  <a key={link} href="#" style={{
                    fontSize: '14px',
                    color: '#9ca3af',
                    textDecoration: 'none'
                  }}>
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* For Businesses Column */}
            <div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '16px',
                color: 'white'
              }}>
                For Businesses
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Find creators', 'Campaign tools', 'Analytics', 'Get started'].map((link) => (
                  <a key={link} href="#" style={{
                    fontSize: '14px',
                    color: '#9ca3af',
                    textDecoration: 'none'
                  }}>
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* For Creators Column */}
            <div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '16px',
                color: 'white'
              }}>
                For Creators
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Join as creator', 'Brand deals', 'Resources', 'Community'].map((link) => (
                  <a key={link} href="#" style={{
                    fontSize: '14px',
                    color: '#9ca3af',
                    textDecoration: 'none'
                  }}>
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Company Column */}
            <div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '16px',
                color: 'white'
              }}>
                Company
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['About us', 'Blog', 'Careers', 'Contact'].map((link) => (
                  <a key={link} href="#" style={{
                    fontSize: '14px',
                    color: '#9ca3af',
                    textDecoration: 'none'
                  }}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            paddingTop: '30px',
            borderTop: '1px solid #374151',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              © {new Date().getFullYear()} Influnz. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                <a key={link} href="#" style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  textDecoration: 'none'
                }}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
