/**
 * Screen 3: Content Submission
 * Creator submits content for review
 */
import { useNavigate, useParams } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';

export default function ContentSubmissionPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <BusinessLayout breadcrumb="Content Submission">
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
            Content Submission
          </h1>
          <p style={{
            fontSize: 16,
            color: '#6b7280',
            margin: 0
          }}>
            The creator has submitted the content for your review.
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
            { icon: '✓', label: 'Campaign Brief', active: true },
            { icon: '✓', label: 'Content Submission', active: true },
            { icon: '📋', label: 'Review & Approval', active: false },
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
                  width: 32,
                  height: 2,
                  background: step.active ? '#10B981' : '#E5E7EB',
                  marginBottom: 24
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Creator Info Card */}
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
            justifyContent: 'space-between'
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
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <div>
                <h3 style={{
                  fontSize: 16,
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

            <div style={{
              padding: '8px 16px',
              background: '#ECFDF5',
              color: '#059669',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#059669'
              }} />
              Submitted
            </div>
          </div>
        </div>

        {/* Submission Details */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20
          }}>
            <h3 style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#1f2937',
              margin: 0
            }}>
              Submitted Content
            </h3>
            <div style={{
              display: 'flex',
              gap: 8
            }}>
              <button style={{
                padding: '8px 16px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                color: '#374151',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}>
                Reels (2)
              </button>
              <button style={{
                padding: '8px 16px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                color: '#374151',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}>
                Captions (2)
              </button>
            </div>
          </div>

          {/* Main Content Card */}
          <div style={{
            background: '#F9FAFB',
            borderRadius: 12,
            padding: 24,
            marginBottom: 20
          }}>
            <div style={{
              display: 'flex',
              gap: 24
            }}>
              {/* Content Preview */}
              <div style={{
                flex: '0 0 280px'
              }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '177.78%',
                  background: '#1f2937',
                  borderRadius: 12,
                  overflow: 'hidden'
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
                  {/* Play button overlay */}
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
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#1f2937">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  
                  {/* Stats overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    right: 12,
                    display: 'flex',
                    gap: 8
                  }}>
                    <div style={{
                      padding: '6px 10px',
                      background: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: 6,
                      color: 'white',
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                        <path d="M7 2L2 12h10L7 2z"/>
                      </svg>
                      7.8M
                    </div>
                    <div style={{
                      padding: '6px 10px',
                      background: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: 6,
                      color: 'white',
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                        <circle cx="7" cy="7" r="5"/>
                      </svg>
                      24.5K
                    </div>
                  </div>
                </div>

                <div style={{
                  marginTop: 12,
                  padding: '12px',
                  background: 'white',
                  borderRadius: 8,
                  border: '1px solid #E5E7EB'
                }}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#1f2937',
                    marginBottom: 8
                  }}>
                    Share with influencer Marketing
                  </div>
                  <button style={{
                    width: '100%',
                    padding: '8px',
                    background: '#EF4444',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'white',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}>
                    Read content
                  </button>
                </div>
              </div>

              {/* Content Details */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 20
                }}>
                  <div style={{
                    padding: '6px 12px',
                    background: '#E1306C',
                    borderRadius: 8,
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <rect x="2" y="2" width="10" height="10" rx="2"/>
                    </svg>
                    Reel 1
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    background: '#FEF3EC',
                    borderRadius: 8,
                    color: '#EA580C',
                    fontSize: 12,
                    fontWeight: 600
                  }}>
                    Chennai café experience with delectable food and great vibes
                  </div>
                </div>

                {/* Additional Files */}
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#1f2937',
                    marginBottom: 12
                  }}>
                    Additional files
                  </h4>
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
                          borderRadius: 8,
                          overflow: 'hidden',
                          cursor: 'pointer'
                        }}
                      >
                        <img
                          src={img}
                          alt={`Additional ${idx + 1}`}
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
                  <button style={{
                    marginTop: 12,
                    width: '100%',
                    padding: '8px',
                    background: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#374151',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}>
                    + 2 more
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => navigate(`/business/campaigns/${id}/collaboration-setup`)}
              style={{
                padding: '10px 20px',
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
              Request changes
            </button>

            <button
              onClick={() => navigate(`/business/campaigns/${id}/review-approval`)}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
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
              Approve Content
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 8l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
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
