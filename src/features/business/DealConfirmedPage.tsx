/**
 * Screen 1: Deal Confirmed
 * Shows deal confirmation with creator details and next steps
 */
import { useNavigate, useParams } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';

export default function DealConfirmedPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <BusinessLayout breadcrumb="Deal Confirmed">
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Success Illustration */}
        <div style={{
          textAlign: 'center',
          marginBottom: 48,
          position: 'relative'
        }}>
          {/* Confetti decoration */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: i % 2 === 0 ? 8 : 6,
                height: i % 2 === 0 ? 8 : 6,
                background: ['#FCA5A5', '#FBBF24', '#34D399', '#60A5FA', '#F472B6'][i % 5],
                borderRadius: '50%',
                top: `${20 + (i * 8)}%`,
                left: `${20 + (i * 6)}%`,
                opacity: 0.6,
                transform: `rotate(${i * 30}deg)`
              }}
            />
          ))}

          {/* Main celebration icon */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            background: 'linear-gradient(135deg, #FEF3EC 0%, #FFEDD5 100%)',
            borderRadius: '50%',
            marginBottom: 24,
            position: 'relative',
            boxShadow: '0 8px 32px rgba(251, 146, 60, 0.15)'
          }}>
            <div style={{ fontSize: 56 }}>🎉</div>
            
            {/* Checkmark badge */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 48,
              height: 48,
              background: '#10B981',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid white',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <h1 style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#1f2937',
            margin: '0 0 12px 0'
          }}>
            Deal Confirmed!
          </h1>

          <p style={{
            fontSize: 16,
            color: '#6b7280',
            margin: 0
          }}>
            The creator has accepted your offer. Let's set up the collaboration.
          </p>
        </div>

        {/* Creator Card */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: 24,
          marginBottom: 32
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16
            }}>
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces"
                alt="Chennai Bites"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <div>
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#1f2937',
                  margin: '0 0 4px 0'
                }}>
                  Chennai Bites
                </h3>
                <p style={{
                  fontSize: 14,
                  color: '#9ca3af',
                  margin: 0
                }}>
                  @chennaibites
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/business/creators/${id}`)}
              style={{
                padding: '8px 16px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: '#374151',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              View profile
            </button>
          </div>

          {/* Deal Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
            padding: 20,
            background: '#f9fafb',
            borderRadius: 8
          }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 6
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="#E1306C">
                  <rect x="2" y="2" width="12" height="12" rx="3"/>
                </svg>
                <span style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Platform
                </span>
              </div>
              <div style={{
                fontSize: 15,
                fontWeight: 600,
                color: '#1f2937'
              }}>
                Instagram
              </div>
            </div>

            <div>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 6
              }}>
                Total followers
              </div>
              <div style={{
                fontSize: 15,
                fontWeight: 600,
                color: '#1f2937'
              }}>
                14.5K Followers
              </div>
            </div>

            <div>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 6
              }}>
                Campaign
              </div>
              <div style={{
                fontSize: 15,
                fontWeight: 600,
                color: '#1f2937'
              }}>
                Chennai Café Launch
              </div>
            </div>

            <div>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 6
              }}>
                Deliverables
              </div>
              <div style={{
                fontSize: 15,
                fontWeight: 600,
                color: '#1f2937'
              }}>
                1 Reel + 2 Stories
              </div>
            </div>
          </div>
        </div>

        {/* Deal Summary Card */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: 24,
          marginBottom: 32
        }}>
          <h3 style={{
            fontSize: 16,
            fontWeight: 600,
            color: '#1f2937',
            margin: '0 0 20px 0'
          }}>
            Deal Summary
          </h3>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: 14, color: '#6b7280' }}>Campaign</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>
                Chennai Café Launch
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: 14, color: '#6b7280' }}>Creator</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>
                @chennaibites
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: 14, color: '#6b7280' }}>Deliverables</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>
                1 Reel + 2 Stories
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 16,
              borderTop: '1px solid #e5e7eb'
            }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1f2937' }}>
                Total Amount
              </span>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#10B981' }}>
                ₹10,000
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center'
        }}>
          <button
            onClick={() => navigate('/business/invitations')}
            style={{
              padding: '12px 24px',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 500,
              color: '#374151',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            Sign out
          </button>

          <button
            onClick={() => navigate(`/business/campaigns/${id}/collaboration-setup`)}
            style={{
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              color: 'white',
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            Continue to Collaboration Setup
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Bottom info card */}
        <div style={{
          marginTop: 32,
          padding: '16px 20px',
          background: '#FEF3EC',
          border: '1px solid #FED7AA',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <div style={{
            width: 40,
            height: 40,
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            flexShrink: 0
          }}>
            👤
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#1f2937',
              margin: '0 0 4px 0'
            }}>
              Share with Influencer Marketing Manager
            </p>
            <p style={{
              fontSize: 13,
              color: '#6b7280',
              margin: 0
            }}>
              @InfluencerMarketing
            </p>
          </div>
          <button style={{
            padding: '8px 16px',
            background: '#EF4444',
            border: 'none',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            color: 'white',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}>
            Send Invitation
          </button>
        </div>
      </div>
    </BusinessLayout>
  );
}
