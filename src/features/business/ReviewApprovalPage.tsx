/**
 * Screen 4: Review & Approval
 * Review the submitted content and provide approval
 */
import { useNavigate, useParams } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';

export default function ReviewApprovalPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <BusinessLayout breadcrumb="Review & Approval">
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
            Review & Approval
          </h1>
          <p style={{
            fontSize: 16,
            color: '#6b7280',
            margin: 0
          }}>
            Review the submitted content and provide your approval.
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          marginBottom: 48
        }}>
          {[
            { icon: '✓', label: 'Deal Confirmed', active: true },
            { icon: '✓', label: 'Campaign Brief', active: true },
            { icon: '✓', label: 'Content Submission', active: true },
            { icon: '✓', label: 'Review & Approval', active: true },
            { icon: '💰', label: 'Payment', active: false },
            { icon: '📊', label: 'Analytics', active: false }
          ].map((step, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
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
                  fontSize: 11,
                  fontWeight: 500,
                  color: step.active ? '#1f2937' : '#9ca3af',
                  textAlign: 'center',
                  maxWidth: 80
                }}>
                  {step.label}
                </span>
              </div>
              {idx < 5 && (
                <div style={{
                  width: 24,
                  height: 2,
                  background: step.active ? '#10B981' : '#E5E7EB',
                  marginBottom: 24
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: 24,
          marginBottom: 24
        }}>
          {/* Left: Content Preview */}
          <div>
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: 16,
              marginBottom: 16
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '177.78%',
                background: '#1f2937',
                borderRadius: 12,
                overflow: 'hidden',
                marginBottom: 16
              }}>
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=700&fit=crop"
                  alt="Content"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                {/* Play button */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 64,
                  height: 64,
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1f2937">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>

              {/* Additional thumbnails */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 8
              }}>
                {[
                  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=150&h=150&fit=crop',
                  'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=150&h=150&fit=crop',
                  'https://images.unsplash.com/photo-1574484284002-952d92456975?w=150&h=150&fit=crop',
                  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=150&h=150&fit=crop'
                ].map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      paddingBottom: '100%',
                      borderRadius: 6,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: '2px solid transparent'
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx + 1}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Share card */}
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: 16
            }}>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: 12
              }}>
                Share with Influencer Marketing
              </div>
              <button style={{
                width: '100%',
                padding: '10px',
                background: '#EF4444',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                color: 'white',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}>
                Send Invitation
              </button>
            </div>
          </div>

          {/* Right: Content Details and Review */}
          <div>
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: 24
            }}>
              <h3 style={{
                fontSize: 18,
                fontWeight: 600,
                color: '#1f2937',
                margin: '0 0 20px 0'
              }}>
                Content Details
              </h3>

              {/* Campaign and Creator Info */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 20,
                marginBottom: 24,
                padding: 20,
                background: '#F9FAFB',
                borderRadius: 10
              }}>
                <div>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#9ca3af',
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
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: 6
                  }}>
                    Creator
                  </div>
                  <div style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#1f2937'
                  }}>
                    Chennai Bites @chennaibites
                  </div>
                </div>

                <div>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: 6
                  }}>
                    Platform
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
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: 6
                  }}>
                    Submitted on
                  </div>
                  <div style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#1f2937'
                  }}>
                    15 Oct 2026, 2:30 PM
                  </div>
                </div>

                <div>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#9ca3af',
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

                <div>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: 6
                  }}>
                    Duration
                  </div>
                  <div style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#1f2937'
                  }}>
                    A cozy cafe experience with delicious food...
                  </div>
                </div>
              </div>

              {/* Feedback / Comments Section */}
              <div style={{
                marginBottom: 24
              }}>
                <h4 style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#1f2937',
                  marginBottom: 12
                }}>
                  Feedback / Optional
                </h4>
                <textarea
                  placeholder="Add your feedback for the creator..."
                  style={{
                    width: '100%',
                    minHeight: 100,
                    padding: 12,
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 14,
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: 12
              }}>
                <button
                  onClick={() => navigate(`/business/campaigns/${id}/content-submission`)}
                  style={{
                    flex: 1,
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
                  Request Changes
                </button>

                <button
                  onClick={() => navigate(`/business/campaigns/${id}/payment-processing`)}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    color: 'white',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Approve Content
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom info card */}
        <div style={{
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
            Sign out
          </button>
        </div>
      </div>
    </BusinessLayout>
  );
}
