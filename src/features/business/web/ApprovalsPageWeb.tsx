/**
 * Content Review / Approvals Page
 * Exact replica of the reference image design
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';

interface ContentItem {
  id: string;
  type: 'Reel' | 'Story';
  creator: string;
  campaign: string;
  submittedDate: string;
  status: 'Pending';
  duration: string;
  thumbnail: string;
}

const CONTENT_ITEMS: ContentItem[] = [
  {
    id: '1',
    type: 'Reel',
    creator: 'Foodie Tamilian',
    campaign: 'Chennai Café Launch',
    submittedDate: '22 Sep 2026',
    status: 'Pending',
    duration: '0:28',
    thumbnail: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=600&fit=crop'
  },
  {
    id: '2',
    type: 'Story',
    creator: 'Foodie Tamilian',
    campaign: 'Chennai Café Launch',
    submittedDate: '22 Sep 2026',
    status: 'Pending',
    duration: '0:15',
    thumbnail: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=600&fit=crop'
  }
];

const THUMBNAILS = [
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=200&h=120&fit=crop',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=120&fit=crop',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=120&fit=crop',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&h=120&fit=crop',
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200&h=120&fit=crop',
  'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=200&h=120&fit=crop'
];

export default function ApprovalsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Reel — Foodie Tamilian');
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeItem = CONTENT_ITEMS[0];

  return (
    <BusinessLayout breadcrumb="Content Review">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16,
          fontSize: 14,
          color: '#6b7280'
        }}>
          <span>Influnz</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Approvals</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ color: '#1f2937', fontWeight: 500 }}>Content Review</span>
        </div>

        {/* Page Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24
        }}>
          <div>
            <h1 style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#1f2937',
              margin: '0 0 4px 0'
            }}>
              Content Review
            </h1>
            <p style={{
              fontSize: 14,
              color: '#6b7280',
              margin: 0
            }}>
              2 items pending your approval for Chennai Café Launch.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{
              padding: '8px 12px',
              background: 'none',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              color: '#6b7280',
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5l3-3m0 0l3 3m-3-3v6m6 2H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              1 of 2
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13 7.5l-3 3m0 0l-3-3m3 3v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              onClick={() => navigate('/business/approvals')}
              style={{
                padding: '8px 14px',
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              View all approvals
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24
        }}>
          {CONTENT_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(`${item.type} — ${item.creator}`)}
              style={{
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 500,
                border: `1px solid ${activeTab === `${item.type} — ${item.creator}` ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: 8,
                background: activeTab === `${item.type} — ${item.creator}` ? '#fef2f2' : 'white',
                color: activeTab === `${item.type} — ${item.creator}` ? '#ef4444' : '#6b7280',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              {item.type} {idx + 1} — {item.creator}
            </button>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: 24
        }}>
          {/* Left Column - Video Preview */}
          <div>
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: 24
            }}>
              {/* Creator Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #fde68a, #fbbf24)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#92400e'
                  }}>
                    F
                  </div>
                  <div>
                    <div style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: '#1f2937',
                      marginBottom: 2
                    }}>
                      Foodie Tamilian — Reel
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: '#6b7280'
                    }}>
                      Chennai Café Launch campaign
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 13,
                    color: '#6b7280'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="2.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.1"/>
                      <path d="M4 1v2M10 1v2M1 5.5h12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                    </svg>
                    22 Sep 2026
                  </div>
                  <span style={{ fontSize: 12, color: '#d1d5db' }}>Submitted on</span>
                  <div style={{
                    padding: '4px 10px',
                    background: '#fef3c7',
                    color: '#92400e',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                      <circle cx="5" cy="5" r="4"/>
                    </svg>
                    Pending
                  </div>
                  <button style={{
                    padding: 4,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                      <circle cx="9" cy="4" r="1.5"/>
                      <circle cx="9" cy="9" r="1.5"/>
                      <circle cx="9" cy="14" r="1.5"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Video Player */}
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: 480,
                margin: '0 auto 20px',
                aspectRatio: '9/16',
                background: '#000',
                borderRadius: 12,
                overflow: 'hidden'
              }}>
                <img
                  src={activeItem.thumbnail}
                  alt="Content preview"
                  style={{
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
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)'
                }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="white">
                    <path d="M10 7l12 7-12 7V7z"/>
                  </svg>
                </div>

                {/* Duration badge */}
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  padding: '4px 8px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  backdropFilter: 'blur(8px)'
                }}>
                  {activeItem.duration}
                </div>

                {/* Video controls */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 12,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}>
                  <div style={{
                    flex: 1,
                    height: 4,
                    background: 'rgba(255,255,255,0.3)',
                    borderRadius: 2,
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '20%',
                      height: '100%',
                      background: 'white',
                      borderRadius: 2
                    }}/>
                  </div>
                  <span style={{
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 500
                  }}>
                    0:06 / 0:28
                  </span>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    padding: 4,
                    cursor: 'pointer',
                    display: 'flex'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                      <path d="M2 2h5v5H2V2zm9 0h5v5h-5V2zM2 11h5v5H2v-5zm9 0h5v5h-5v-5z"/>
                    </svg>
                  </button>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    padding: 4,
                    cursor: 'pointer',
                    display: 'flex'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                      <path d="M2 3h14v12H2V3z"/>
                    </svg>
                  </button>
                </div>

                {/* Navigation arrows */}
                <button
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(8px)',
                    opacity: currentIndex === 0 ? 0.3 : 1
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12 6l-4 4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <button
                  onClick={() => setCurrentIndex(Math.min(5, currentIndex + 1))}
                  disabled={currentIndex === 5}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(8px)',
                    opacity: currentIndex === 5 ? 0.3 : 1
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M8 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Thumbnail Gallery */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: 8
              }}>
                {THUMBNAILS.map((thumb, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      aspectRatio: '16/9',
                      borderRadius: 8,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: currentIndex === idx ? '2px solid #ef4444' : '2px solid transparent',
                      opacity: currentIndex === idx ? 1 : 0.6,
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = currentIndex === idx ? '1' : '0.6'}
                  >
                    <img
                      src={thumb}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: 12,
                marginTop: 20
              }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 16px',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#374151',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2v12M4 10l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download
                </button>

                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 16px',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#374151',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 5v6m3-3H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  View in new tab
                </button>

                <div style={{ flex: 1 }}/>

                <button style={{
                  padding: '10px 18px',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#374151',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}>
                  Request changes
                </button>

                <button style={{
                  padding: '10px 18px',
                  background: '#1f2937',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'white',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}>
                  Send reminder
                </button>

                <button style={{
                  padding: '10px 18px',
                  background: '#1f2937',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'white',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}>
                  Approve content
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - AI Analysis & Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* AI Analysis */}
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: 20
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                  <span style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#1f2937'
                  }}>
                    AI Analysis
                  </span>
                </div>

                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  border: '3px solid #10b981',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f0fdf4'
                }}>
                  <span style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#10b981'
                  }}>
                    96
                  </span>
                  <span style={{
                    fontSize: 9,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Score
                  </span>
                </div>
              </div>

              {/* Analysis Metrics */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Brand Alignment', value: 98, color: '#10b981' },
                  { label: 'Content Quality', value: 96, color: '#10b981' },
                  { label: 'Audience Fit', value: 94, color: '#10b981' },
                  { label: 'Policy Compliance', value: 100, color: '#10b981' }
                ].map((metric, idx) => (
                  <div key={idx}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 6
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 13,
                        color: '#374151'
                      }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="5" stroke={metric.color} strokeWidth="1.5"/>
                          <path d="M5 7l1.5 1.5L10 5" stroke={metric.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {metric.label}
                      </div>
                      <span style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#1f2937'
                      }}>
                        {metric.value}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: 6,
                      background: '#f3f4f6',
                      borderRadius: 3,
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${metric.value}%`,
                        height: '100%',
                        background: metric.color,
                        borderRadius: 3
                      }}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Success Message */}
              <div style={{
                marginTop: 16,
                padding: '12px 14px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10
              }}>
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l2.5 2.5L10 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#065f46',
                    marginBottom: 2
                  }}>
                    Looks great!
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: '#047857',
                    lineHeight: 1.5
                  }}>
                    Content aligns well with your brand and campaign goals.
                  </div>
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: 20
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M2 8h8M2 12h10" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#1f2937'
                }}>
                  Content Details
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { icon: '📝', label: 'Type', value: 'Reel (0:28)' },
                  { icon: '👤', label: 'Creator', value: 'Foodie Tamilian' },
                  { icon: '🎯', label: 'Campaign', value: 'Chennai Café Launch' },
                  { icon: '📅', label: 'Submitted on', value: '22 Sep 2026, 10:24 AM' },
                  { icon: '⭐', label: 'Creator reach', value: '320K followers' },
                  { icon: '📊', label: 'Content', value: '1 Reel + 2 Stories' }
                ].map((detail, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10
                  }}>
                    <span style={{
                      fontSize: 16,
                      width: 20,
                      flexShrink: 0
                    }}>
                      {detail.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 12,
                        color: '#9ca3af',
                        marginBottom: 2
                      }}>
                        {detail.label}
                      </div>
                      <div style={{
                        fontSize: 14,
                        color: '#1f2937',
                        fontWeight: 500
                      }}>
                        {detail.value}
                      </div>
                    </div>
                  </div>
                ))}

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10
                }}>
                  <span style={{
                    fontSize: 16,
                    width: 20,
                    flexShrink: 0
                  }}>
                    💬
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 12,
                      color: '#9ca3af',
                      marginBottom: 2
                    }}>
                      Caption
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: '#1f2937',
                      lineHeight: 1.6
                    }}>
                      A cozy café experience in the heart of ...
                      <button style={{
                        marginLeft: 4,
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer',
                        padding: 0
                      }}>
                        Show more
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BusinessLayout>
  );
}
