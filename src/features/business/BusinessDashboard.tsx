/**
 * Business Dashboard - Exact replica of reference image
 * Matches every pixel, spacing, color, and dimension from the uploaded image
 */
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import BusinessLayout from './BusinessLayout';

// Mock data matching the reference image
const CAMPAIGNS = [
  {
    id: 1,
    name: 'Chennai Café Launch',
    status: 'active',
    budget: '₹1,50,000',
    spent: '₹1,02,000',
    fill: 68,
    creators: 8,
    deadline: '30 Sep',
    thumbUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop&crop=center',
    thumbAlt: 'Café interior',
  },
  {
    id: 2,
    name: 'Mumbai Fashion Drop',
    status: 'pending',
    budget: '₹80,000',
    spent: '₹0',
    fill: 0,
    creators: 0,
    deadline: '10 Oct',
    thumbUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop&crop=center',
    thumbAlt: 'Fashion display',
  },
  {
    id: 3,
    name: 'Bangalore Tech Event',
    status: 'draft',
    budget: '₹60,000',
    spent: '₹0',
    fill: 0,
    creators: 0,
    deadline: 'TBD',
    thumbUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=200&fit=crop&crop=center',
    thumbAlt: 'Tech setup',
  },
];

const PENDING_ITEMS = [
  {
    type: 'content',
    creator: 'Foodie Tamilan',
    campaign: 'Chennai Café Launch',
    action: 'Review content',
    thumbUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    thumbAlt: 'Creator profile',
  },
  {
    type: 'counter',
    creator: 'Chennai Bites',
    campaign: 'Chennai Café Launch',
    action: 'Review counter offer',
    thumbUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b743?w=200&h=200&fit=crop&crop=face',
    thumbAlt: 'Creator profile',
  },
  {
    type: 'content',
    creator: 'Madras Food Trail',
    campaign: 'Chennai Café Launch',
    action: 'Review content',
    thumbUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    thumbAlt: 'Creator profile',
  },
];
// Status pill component
function StatusPill({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; text: string }> = {
    active: { bg: '#dcfce7', color: '#16a34a', text: 'Active' },
    pending: { bg: '#fef3c7', color: '#d97706', text: 'Pending' },
    draft: { bg: '#e0e7ff', color: '#4338ca', text: 'Draft' },
  };
  const s = styles[status] ?? styles.draft;
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '2px 8px',
      borderRadius: '12px',
      background: s.bg,
      color: s.color,
      fontSize: '11px',
      fontWeight: '500',
    }}>
      <span style={{
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        background: s.color,
      }} />
      {s.text}
    </span>
  );
}

// Type pill for approvals
function TypePill({ type }: { type: string }) {
  if (type === 'content') {
    return (
      <span style={{
        padding: '2px 8px',
        borderRadius: '12px',
        background: '#fef3c7',
        color: '#d97706',
        fontSize: '11px',
        fontWeight: '500',
      }}>
        Content Review
      </span>
    );
  }
  return (
    <span style={{
      padding: '2px 8px',
      borderRadius: '12px',
      background: '#e0e7ff',
      color: '#4338ca',
      fontSize: '11px',
      fontWeight: '500',
    }}>
      Counter Offer
    </span>
  );
}
export default function BusinessDashboard() {
  const { state } = useAuth();
  const navigate = useNavigate();
  const name = state.user?.businessName ?? 'Demo Business';

  return (
    <BusinessLayout breadcrumb="Dashboard">
      
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '16px',
        gap: '16px',
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937',
            lineHeight: '32px',
            margin: '0',
            letterSpacing: '-0.025em',
          }}>
            Good evening, {name}
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '4px 0 0 0',
            lineHeight: '20px',
          }}>
            Here's what's happening across your campaigns today.
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <button
            onClick={() => navigate('/business/campaigns')}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              background: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            View all campaigns
          </button>
          <button
            onClick={() => navigate('/business/campaigns/new')}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'white',
              background: '#1f2937',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            New campaign
          </button>
        </div>
      </div>
      {/* AI Assistant Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        background: '#fef3c7',
        border: '1px solid #fbbf24',
        borderRadius: '8px',
        marginBottom: '20px',
        gap: '12px',
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
          <path d="M8 2l1.5 4h4l-3 2.5 1 4L8 10.5l-3.5 2 1-4-3-2.5h4L8 2z" fill="#f59e0b"/>
        </svg>
        <span style={{
          fontSize: '14px',
          color: '#1f2937',
          flex: 1,
          fontWeight: '400',
        }}>
          <strong style={{ fontWeight: '600' }}>AI assistant:</strong> You have 3 pending approvals and 1 creator slot to fill.
        </span>
        <button
          onClick={() => navigate('/business/approvals')}
          style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#f59e0b',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            padding: '0',
          }}
        >
          View approvals →
        </button>
        <button
          style={{
            fontSize: '16px',
            color: '#6b7280',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0 0 0 8px',
          }}
        >
          ×
        </button>
      </div>
      {/* KPI Cards - First Row (3 cards) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '16px',
      }}>
        
        {/* Active campaigns */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 4h14M3 10h14M3 16h14" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{
              fontSize: '12px',
              color: '#6b7280',
              fontWeight: '500',
              lineHeight: '16px',
            }}>
              Active campaigns
            </span>
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '32px',
            marginBottom: '8px',
          }}>
            3
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <span style={{
                fontSize: '12px',
                color: '#059669',
                fontWeight: '600',
              }}>
                ↑ +1
              </span>
              <span style={{
                fontSize: '12px',
                color: '#9ca3af',
                marginLeft: '4px',
              }}>
                vs last month
              </span>
            </div>
            <svg width="40" height="24" viewBox="0 0 40 24">
              {[6, 10, 8, 14, 12, 18].map((h, i) => (
                <rect
                  key={i}
                  x={i * 6 + 2}
                  y={24 - h}
                  width="4"
                  height={h}
                  rx="2"
                  fill={i === 5 ? "#ef4444" : "#fca5a5"}
                />
              ))}
            </svg>
          </div>
        </div>
        {/* Total spend */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="6" width="14" height="9" rx="2" stroke="#ef4444" strokeWidth="1.5"/>
                <path d="M3 9h14" stroke="#ef4444" strokeWidth="1.3"/>
              </svg>
            </div>
            <span style={{
              fontSize: '12px',
              color: '#6b7280',
              fontWeight: '500',
            }}>
              Total spend
            </span>
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '8px',
          }}>
            ₹1.02L
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <span style={{
                fontSize: '12px',
                color: '#059669',
                fontWeight: '600',
              }}>
                ↑ 68%
              </span>
              <span style={{
                fontSize: '12px',
                color: '#9ca3af',
                marginLeft: '4px',
              }}>
                of ₹1.5L budget used
              </span>
            </div>
            <svg width="40" height="24" viewBox="0 0 40 24">
              <polyline
                points="0,18 8,14 16,16 24,10 32,12 40,6"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        {/* Pending approvals */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9 12l2 2 4-4" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="10" cy="10" r="7" stroke="#ef4444" strokeWidth="1.5"/>
              </svg>
            </div>
            <span style={{
              fontSize: '12px',
              color: '#6b7280',
              fontWeight: '500',
            }}>
              Pending approvals
            </span>
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '8px',
          }}>
            3
          </div>
          <div>
            <span style={{
              fontSize: '12px',
              color: '#9ca3af',
            }}>
              need your attention
            </span>
          </div>
        </div>
      </div>
      {/* Second row - 2 cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '24px',
        maxWidth: '66.666%',
      }}>
        
        {/* Creators active */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="7" cy="5" r="3" stroke="#ef4444" strokeWidth="1.5"/>
                <path d="M1 17c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="14" cy="6" r="2" stroke="#ef4444" strokeWidth="1.2"/>
                <path d="M16 17c0-2-.8-3.5-2.2-4.2" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{
              fontSize: '12px',
              color: '#6b7280',
              fontWeight: '500',
            }}>
              Creators active
            </span>
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '8px',
          }}>
            8
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <span style={{
                fontSize: '12px',
                color: '#059669',
                fontWeight: '600',
              }}>
                ↑ +3
              </span>
              <span style={{
                fontSize: '12px',
                color: '#9ca3af',
                marginLeft: '4px',
              }}>
                confirmed deals
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
            }}>
              {['#ef4444', '#f97316', '#eab308', '#22c55e'].map((color, i) => (
                <div
                  key={i}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: color,
                    border: '2px solid white',
                    marginLeft: i === 0 ? 0 : '-6px',
                    position: 'relative',
                    zIndex: 4 - i,
                  }}
                />
              ))}
              <span style={{
                fontSize: '11px',
                color: '#6b7280',
                marginLeft: '6px',
                fontWeight: '500',
              }}>
                +5
              </span>
            </div>
          </div>
        </div>
        {/* Avg. campaign fit */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7" stroke="#ef4444" strokeWidth="1.5"/>
                <circle cx="10" cy="10" r="3" stroke="#ef4444" strokeWidth="1.5"/>
                <circle cx="10" cy="10" r="1" fill="#ef4444"/>
              </svg>
            </div>
            <span style={{
              fontSize: '12px',
              color: '#6b7280',
              fontWeight: '500',
            }}>
              Avg. campaign fit
            </span>
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '8px',
          }}>
            91%
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <span style={{
                fontSize: '12px',
                color: '#059669',
                fontWeight: '600',
              }}>
                ↑ +2%
              </span>
              <span style={{
                fontSize: '12px',
                color: '#9ca3af',
                marginLeft: '4px',
              }}>
                creator match score
              </span>
            </div>
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="12" fill="none" stroke="#fee2e2" strokeWidth="4"/>
              <circle
                cx="16" cy="16" r="12" fill="none"
                stroke="#ef4444" strokeWidth="4"
                strokeDasharray="68.7 6.8"
                strokeLinecap="round"
                transform="rotate(-90 16 16)"
              />
            </svg>
          </div>
        </div>
      </div>
      {/* Two-column layout for Campaigns and Pending Approvals */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
      }}>
        
        {/* Campaigns Section */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '16px 20px 12px',
            borderBottom: '1px solid #f3f4f6',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 2px 0',
                }}>
                  Campaigns
                </h3>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  margin: '0',
                }}>
                  3 campaigns in progress
                </p>
              </div>
              <button
                onClick={() => navigate('/business/campaigns')}
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#ef4444',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                View all
              </button>
            </div>
          </div>

          <div>
            {CAMPAIGNS.map((campaign, index) => (
              <div
                key={campaign.id}
                onClick={() => navigate(`/business/campaigns/${campaign.id}`)}
                style={{
                  padding: '16px 20px',
                  borderBottom: index < CAMPAIGNS.length - 1 ? '1px solid #f3f4f6' : 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '12px',
                }}>
                  <img
                    src={campaign.thumbUrl}
                    alt={campaign.thumbAlt}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '6px',
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                    }}>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1f2937',
                        margin: '0',
                        lineHeight: '20px',
                      }}>
                        {campaign.name}
                      </h4>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}>
                        <StatusPill status={campaign.status} />
                        <button style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#9ca3af',
                          padding: '2px',
                        }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="3" cy="8" r="1" fill="currentColor"/>
                            <circle cx="8" cy="8" r="1" fill="currentColor"/>
                            <circle cx="13" cy="8" r="1" fill="currentColor"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '12px',
                      color: '#6b7280',
                      marginBottom: '8px',
                    }}>
                      <span>Budget: {campaign.budget}</span>
                      <span>Spent: {campaign.spent}</span>
                      <span>{campaign.creators} creators</span>
                    </div>
                  </div>
                </div>
                
                {campaign.fill > 0 && (
                  <div style={{ marginLeft: '52px' }}>
                    <div style={{
                      height: '4px',
                      background: '#f3f4f6',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      marginBottom: '4px',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${campaign.fill}%`,
                        background: '#ef4444',
                        borderRadius: '2px',
                      }} />
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      color: '#9ca3af',
                    }}>
                      <span>{campaign.fill}% budget used</span>
                      <span>Due: {campaign.deadline}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Pending Approvals Section */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '16px 20px 12px',
            borderBottom: '1px solid #f3f4f6',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 2px 0',
                }}>
                  Pending Approvals
                </h3>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  margin: '0',
                }}>
                  3 items need your review
                </p>
              </div>
              <button
                onClick={() => navigate('/business/approvals')}
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#ef4444',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                View all
              </button>
            </div>
          </div>

          <div>
            {PENDING_ITEMS.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate('/business/approvals')}
                style={{
                  padding: '16px 20px',
                  borderBottom: index < PENDING_ITEMS.length - 1 ? '1px solid #f3f4f6' : 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <img
                    src={item.thumbUrl}
                    alt={item.thumbAlt}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '2px',
                    }}>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1f2937',
                        margin: '0',
                      }}>
                        {item.creator}
                      </h4>
                      <button style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af',
                        padding: '2px',
                      }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="3" cy="8" r="1" fill="currentColor"/>
                          <circle cx="8" cy="8" r="1" fill="currentColor"/>
                          <circle cx="13" cy="8" r="1" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                    <p style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      margin: '0 0 6px 0',
                    }}>
                      {item.campaign}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <TypePill type={item.type} />
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          navigate('/business/approvals');
                        }}
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: 'white',
                          background: '#1f2937',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                      >
                        {item.action}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BusinessLayout>
  );
}