/**
 * Campaigns List Page
 * Exact replica of the reference image design
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';

interface Campaign {
  id: number;
  name: string;
  status: 'active' | 'pending' | 'draft' | 'completed';
  statusLabel: string;
  statusBg: string;
  statusText: string;
  date: string;
  platform: 'Instagram' | 'YouTube';
  platformColor: string;
  creators: number;
  budget: string;
  spent: string;
  percentUsed: number;
}

const CAMPAIGNS: Campaign[] = [];

// Uncomment this to show campaigns list instead of empty state
/*
const CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    name: 'Chennai Café Launch',
    status: 'active',
    statusLabel: 'active',
    statusBg: '#dcfce7',
    statusText: '#166534',
    date: '30 Sep 2026',
    platform: 'Instagram',
    platformColor: '#e11d48',
    creators: 8,
    budget: '₹1,50,000',
    spent: '₹1,02,000',
    percentUsed: 68
  },
  {
    id: 2,
    name: 'Mumbai Fashion Drop',
    status: 'pending',
    statusLabel: 'pending',
    statusBg: '#fef3c7',
    statusText: '#92400e',
    date: '10 Oct 2026',
    platform: 'Instagram',
    platformColor: '#e11d48',
    creators: 0,
    budget: '₹80,000',
    spent: '₹0',
    percentUsed: 0
  },
  {
    id: 3,
    name: 'Bangalore Tech Event',
    status: 'draft',
    statusLabel: 'draft',
    statusBg: '#e0e7ff',
    statusText: '#3730a3',
    date: 'TBD',
    platform: 'YouTube',
    platformColor: '#dc2626',
    creators: 0,
    budget: '₹60,000',
    spent: '₹0',
    percentUsed: 0
  },
  {
    id: 4,
    name: 'Delhi Festive Campaign',
    status: 'completed',
    statusLabel: 'completed',
    statusBg: '#f3e8ff',
    statusText: '#6b21a8',
    date: '15 Sep 2026',
    platform: 'Instagram',
    platformColor: '#e11d48',
    creators: 14,
    budget: '₹2,00,000',
    spent: '₹1,94,000',
    percentUsed: 97
  }
];
*/

const FILTER_TABS = ['All', 'Active', 'Pending', 'Draft', 'Completed'];

export default function CampaignListPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredCampaigns = activeFilter === 'All' 
    ? CAMPAIGNS 
    : CAMPAIGNS.filter(c => c.status === activeFilter.toLowerCase());

  // Show empty state if no campaigns exist
  const hasCampaigns = CAMPAIGNS.length > 0;

  if (!hasCampaigns) {
    return (
      <BusinessLayout breadcrumb="Campaigns">
        <div style={{
          minHeight: 'calc(100vh - 120px)',
          background: '#FAFAFA',
          padding: '80px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background gradient circles */}
          <div style={{
            position: 'absolute',
            width: 600,
            height: 600,
            top: '-200px',
            left: '-100px',
            background: 'radial-gradient(circle, rgba(254, 226, 226, 0.4) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            width: 500,
            height: 500,
            bottom: '-150px',
            right: '-100px',
            background: 'radial-gradient(circle, rgba(254, 215, 170, 0.3) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          {/* Main illustration area */}
          <div style={{
            position: 'relative',
            width: 500,
            height: 300,
            marginBottom: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Background shape */}
            <div style={{
              position: 'absolute',
              width: 350,
              height: 250,
              background: 'linear-gradient(135deg, rgba(254, 243, 236, 0.8) 0%, rgba(254, 226, 210, 0.6) 100%)',
              borderRadius: '50% 30% 50% 30%',
              filter: 'blur(25px)',
              opacity: 0.7
            }} />

            {/* Main card */}
            <div style={{
              position: 'relative',
              width: 220,
              height: 260,
              background: 'white',
              borderRadius: 16,
              boxShadow: '0 20px 60px rgba(251, 113, 133, 0.12), 0 10px 30px rgba(0, 0, 0, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '30px 20px',
              transform: 'rotate(-2deg)',
              border: '2px solid rgba(254, 215, 170, 0.3)',
              zIndex: 3
            }}>
              {/* Megaphone container */}
              <div style={{
                width: 100,
                height: 100,
                background: 'linear-gradient(135deg, #FFF5F0 0%, #FFEDD5 100%)',
                borderRadius: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                boxShadow: '0 4px 16px rgba(251, 146, 60, 0.08)'
              }}>
                <span style={{ fontSize: 48 }}>📣</span>
              </div>

              {/* Lines */}
              <div style={{
                width: 120,
                height: 6,
                background: 'linear-gradient(90deg, #FED7AA 0%, #FDBA74 100%)',
                borderRadius: 3,
                marginBottom: 8
              }} />
              <div style={{
                width: 100,
                height: 6,
                background: 'linear-gradient(90deg, #FED7AA 0%, #FDBA74 100%)',
                borderRadius: 3,
                opacity: 0.7,
                marginBottom: 8
              }} />
              <div style={{
                width: 80,
                height: 6,
                background: 'linear-gradient(90deg, #FED7AA 0%, #FDBA74 100%)',
                borderRadius: 3,
                opacity: 0.5
              }} />
            </div>

            {/* Instagram icon */}
            <div style={{
              position: 'absolute',
              top: 20,
              left: 40,
              width: 64,
              height: 64,
              background: '#E1306C',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(225, 48, 108, 0.25)',
              zIndex: 2
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2" fill="none"/>
                <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" fill="none"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
              </svg>
            </div>

            {/* YouTube icon */}
            <div style={{
              position: 'absolute',
              top: 30,
              right: 30,
              width: 64,
              height: 64,
              background: '#FF0000',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(255, 0, 0, 0.25)',
              zIndex: 2
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M10 8l6 4-6 4V8z"/>
              </svg>
            </div>

            {/* Chart icon */}
            <div style={{
              position: 'absolute',
              top: 20,
              right: 130,
              width: 48,
              height: 48,
              background: 'white',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
              zIndex: 2
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="14" width="3" height="6" fill="#FB923C" rx="1"/>
                <rect x="10.5" y="9" width="3" height="11" fill="#FB923C" rx="1"/>
                <rect x="17" y="4" width="3" height="16" fill="#FB923C" rx="1"/>
              </svg>
            </div>

            {/* User icon */}
            <div style={{
              position: 'absolute',
              bottom: 30,
              left: 70,
              width: 48,
              height: 48,
              background: 'white',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
              zIndex: 2
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="#FB923C"/>
                <path d="M4 20c0-4 3-6 8-6s8 2 8 6" stroke="#FB923C" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Decorative dots */}
            {[
              { size: 12, color: '#FCA5A5', top: 100, left: 20 },
              { size: 8, color: '#FB923C', top: 180, right: 60 },
              { size: 10, color: '#FDBA74', bottom: 50, right: 20 },
              { size: 14, color: '#FED7AA', top: 60, right: 150 },
              { size: 6, color: '#F97316', bottom: 100, left: 140 }
            ].map((dot, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: dot.size,
                  height: dot.size,
                  background: dot.color,
                  borderRadius: '50%',
                  top: dot.top,
                  left: dot.left,
                  right: dot.right,
                  bottom: dot.bottom,
                  opacity: 0.6,
                  zIndex: 1
                }}
              />
            ))}
          </div>

          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            padding: '6px 14px',
            background: 'rgba(220, 38, 38, 0.06)',
            border: '1px solid rgba(220, 38, 38, 0.08)',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            color: '#DC2626',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginBottom: 24
          }}>
            NO CAMPAIGNS YET
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: 42,
            fontWeight: 700,
            color: '#111827',
            textAlign: 'center',
            margin: '0 0 16px 0',
            lineHeight: 1.2,
            letterSpacing: '-0.02em'
          }}>
            Ready to launch your next <span style={{ color: '#EF4444' }}>campaign?</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 17,
            color: '#6B7280',
            textAlign: 'center',
            margin: '0 0 40px 0',
            maxWidth: 480,
            lineHeight: 1.6
          }}>
            Create a campaign and start collaborating with creators<br />
            to grow your brand.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/business/campaigns/create')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 50,
              fontSize: 17,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 10px 30px rgba(239, 68, 68, 0.25), 0 4px 12px rgba(239, 68, 68, 0.15)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '-0.01em'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 14px 40px rgba(239, 68, 68, 0.3), 0 6px 16px rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(239, 68, 68, 0.25), 0 4px 12px rgba(239, 68, 68, 0.15)';
            }}
          >
            <div style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 2v8M2 6h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            New Campaign
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 5l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Features */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 48,
            marginTop: 64,
            fontSize: 14,
            color: '#6B7280'
          }}>
            {[
              'Find the right creators',
              'Plan & collaborate',
              'Track performance'
            ].map((text, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <div style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#EF4444'
                }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </BusinessLayout>
    );
  }

  return (
    <BusinessLayout breadcrumb="Campaigns">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
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
              Campaigns
            </h1>
            <p style={{
              fontSize: 14,
              color: '#6b7280',
              margin: 0
            }}>
              {CAMPAIGNS.length} campaigns total
            </p>
          </div>

          <button
            onClick={() => navigate('/business/campaigns/create')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 18px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
            onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}
          >
            + New campaign
          </button>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: 2
        }}>
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              style={{
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 500,
                border: 'none',
                background: 'transparent',
                color: activeFilter === tab ? '#1f2937' : '#6b7280',
                cursor: 'pointer',
                fontFamily: 'inherit',
                position: 'relative',
                borderBottom: activeFilter === tab ? '2px solid #ef4444' : '2px solid transparent',
                transition: 'all 0.15s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Campaigns List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              onClick={() => navigate(`/business/campaigns/${campaign.id}`)}
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 20,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Campaign Header */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: campaign.percentUsed > 0 ? 16 : 0
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 8
                  }}>
                    <h3 style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: '#1f2937',
                      margin: 0
                    }}>
                      {campaign.name}
                    </h3>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '3px 10px',
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 600,
                      background: campaign.statusBg,
                      color: campaign.statusText
                    }}>
                      <div style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: campaign.statusText
                      }} />
                      {campaign.statusLabel}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    fontSize: 13,
                    color: '#6b7280'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="1" y="2.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.1"/>
                        <path d="M4 1v2M10 1v2M1 5.5h12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                      </svg>
                      {campaign.date}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: campaign.platformColor,
                      fontWeight: 500
                    }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                        <rect x="2" y="2" width="10" height="10" rx="3"/>
                      </svg>
                      {campaign.platform}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM3 11c0-2 1.5-3 4-3s4 1 4 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                      </svg>
                      {campaign.creators} creators
                    </div>
                  </div>
                </div>

                <div style={{
                  textAlign: 'right'
                }}>
                  <div style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: '#1f2937',
                    marginBottom: 2
                  }}>
                    {campaign.budget}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: '#9ca3af'
                  }}>
                    Spent: {campaign.spent}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {campaign.percentUsed > 0 && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                    fontSize: 12,
                    color: '#6b7280'
                  }}>
                    <span>Budget used</span>
                    <span style={{ fontWeight: 600 }}>{campaign.percentUsed}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: 6,
                    background: '#f3f4f6',
                    borderRadius: 3,
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${campaign.percentUsed}%`,
                      height: '100%',
                      background: campaign.percentUsed >= 90 ? '#ef4444' : 
                                 campaign.percentUsed >= 70 ? '#f59e0b' : '#10b981',
                      borderRadius: 3,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </BusinessLayout>
  );
}
