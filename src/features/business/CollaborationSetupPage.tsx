/**
 * Screen 2: Collaboration Setup
 * Setup campaign details, guidelines and access with the creator
 */
import { useNavigate, useParams } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';

export default function CollaborationSetupPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <BusinessLayout breadcrumb="Collaboration Setup">
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 40
        }}>
          <h1 style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#1f2937',
            margin: '0 0 12px 0'
          }}>
            Collaboration Setup
          </h1>
          <p style={{
            fontSize: 16,
            color: '#6b7280',
            margin: 0
          }}>
            Share campaign details, guidelines and access with the creator.
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          marginBottom: 48
        }}>
          {[
            { icon: '✓', label: 'Deal Confirmed', active: true },
            { icon: '📝', label: 'Campaign Brief', active: true },
            { icon: '📋', label: 'Content Approval', active: false },
            { icon: '💰', label: 'Payment', active: false },
            { icon: '📊', label: 'Analytics', active: false }
          ].map((step, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: step.active ? '#10B981' : '#F3F4F6',
                  color: step.active ? 'white' : '#9CA3AF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 600,
                  border: step.active ? 'none' : '2px solid #E5E7EB'
                }}>
                  {step.icon}
                </div>
                <span style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: step.active ? '#1f2937' : '#9ca3af',
                  textAlign: 'center',
                  maxWidth: 100
                }}>
                  {step.label}
                </span>
              </div>
              {idx < 4 && (
                <div style={{
                  width: 40,
                  height: 2,
                  background: step.active ? '#10B981' : '#E5E7EB',
                  marginBottom: 24
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Campaign Card */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24
        }}>
          <h3 style={{
            fontSize: 18,
            fontWeight: 600,
            color: '#1f2937',
            margin: '0 0 16px 0'
          }}>
            Campaign Details
          </h3>

          <div style={{
            display: 'flex',
            gap: 16,
            padding: 20,
            background: '#F9FAFB',
            borderRadius: 10,
            marginBottom: 20
          }}>
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&h=120&fit=crop"
              alt="Campaign"
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
                objectFit: 'cover'
              }}
            />
            <div style={{ flex: 1 }}>
              <h4 style={{
                fontSize: 16,
                fontWeight: 600,
                color: '#1f2937',
                margin: '0 0 8px 0'
              }}>
                Chennai Café Launch
              </h4>
              <p style={{
                fontSize: 14,
                color: '#6b7280',
                margin: '0 0 12px 0',
                lineHeight: 1.5
              }}>
                Grow your cafe sales through local food creators
              </p>
              <div style={{
                display: 'flex',
                gap: 16,
                fontSize: 13,
                color: '#6b7280'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.2"/>
                    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                  Instagram
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                  30 Oct 2026
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                  1 Reel + 2 Stories
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Brief with Creator Section */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24
        }}>
          <h3 style={{
            fontSize: 18,
            fontWeight: 600,
            color: '#1f2937',
            margin: '0 0 16px 0'
          }}>
            Share Brief with Creator
          </h3>

          <div style={{
            display: 'flex',
            gap: 16,
            marginBottom: 20
          }}>
            <div style={{
              flex: 1,
              padding: 16,
              background: '#FEF3EC',
              border: '2px solid #FED7AA',
              borderRadius: 10,
              cursor: 'pointer'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  background: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24
                }}>
                  📝
                </div>
              </div>
              <h4 style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#1f2937',
                textAlign: 'center',
                margin: '0 0 4px 0'
              }}>
                Campaign Brief
              </h4>
              <p style={{
                fontSize: 12,
                color: '#6b7280',
                textAlign: 'center',
                margin: 0
              }}>
                Functional brand awareness and share links
              </p>
            </div>

            <div style={{
              flex: 1,
              padding: 16,
              background: '#F9FAFB',
              border: '2px solid #E5E7EB',
              borderRadius: 10,
              cursor: 'pointer'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  background: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24
                }}>
                  🔗
                </div>
              </div>
              <h4 style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#1f2937',
                textAlign: 'center',
                margin: '0 0 4px 0'
              }}>
                Agreement
              </h4>
              <p style={{
                fontSize: 12,
                color: '#6b7280',
                textAlign: 'center',
                margin: 0
              }}>
                Contract and terms - all formalities
              </p>
            </div>

            <div style={{
              flex: 1,
              padding: 16,
              background: '#F9FAFB',
              border: '2px solid #E5E7EB',
              borderRadius: 10,
              cursor: 'pointer'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  background: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24
                }}>
                  📦
                </div>
              </div>
              <h4 style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#1f2937',
                textAlign: 'center',
                margin: '0 0 4px 0'
              }}>
                Reference materials
              </h4>
              <p style={{
                fontSize: 12,
                color: '#6b7280',
                textAlign: 'center',
                margin: 0
              }}>
                Raw video footage and edit captions
              </p>
            </div>
          </div>

          {/* Deliverables Checklist */}
          <div style={{
            padding: 20,
            background: '#F9FAFB',
            borderRadius: 10
          }}>
            <h4 style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#1f2937',
              margin: '0 0 16px 0'
            }}>
              Deliverables Checklist
            </h4>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              {[
                { icon: '🎬', label: 'Post 1 Instagram Reel', detail: '30-60 sec video showcasing the cafe' },
                { icon: '📸', label: 'Post 2 Instagram Stories', detail: 'Behind-the-scenes + cafe ambiance' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: 12,
                    background: 'white',
                    borderRadius: 8,
                    border: '1px solid #E5E7EB'
                  }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    background: '#FEF3EC',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#1f2937',
                      marginBottom: 4
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: '#6b7280'
                    }}>
                      {item.detail}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 10px',
                    background: '#ECFDF5',
                    color: '#059669',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600
                  }}>
                    Set brief
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Share with Influencer Marketing Manager */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: 20,
          marginBottom: 24
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}>
            <div style={{
              width: 48,
              height: 48,
              background: '#F3F4F6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              flexShrink: 0
            }}>
              👤
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{
                fontSize: 15,
                fontWeight: 600,
                color: '#1f2937',
                margin: '0 0 4px 0'
              }}>
                Share with Influencer Marketing Manager
              </h4>
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

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => navigate(-1)}
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
            onClick={() => navigate(`/business/campaigns/${id}/content-submission`)}
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
            Send to Creator
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </BusinessLayout>
  );
}
