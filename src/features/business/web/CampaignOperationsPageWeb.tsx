/**
 * Campaign Operations — Chennai Café Launch
 * Exact replica matching the reference image
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';

interface Creator {
  id: number;
  name: string;
  avatar: string;
  content: string;
  followers: string;
  status: string;
  statusBg: string;
  statusText: string;
  contentProgress: string;
  dueDate: string;
  amount: string;
  paymentStatus: string;
  paymentBg: string;
  paymentText: string;
  action: string;
}

const CREATORS: Creator[] = [
  {
    id: 1,
    name: 'Foodie Tamilian',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    content: '1 Reel + 2 Stories',
    followers: '320K followers',
    status: 'Content Submitted',
    statusBg: '#fef3c7',
    statusText: '#92400e',
    contentProgress: '3/3',
    dueDate: '22 Sep 2026',
    amount: '₹10,000',
    paymentStatus: 'Pending',
    paymentBg: '#fef3c7',
    paymentText: '#92400e',
    action: 'review'
  },
  {
    id: 2,
    name: 'Chennai Bites',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
    content: '1 Reel + 3 Stories',
    followers: '180K followers',
    status: 'In Progress',
    statusBg: '#dbeafe',
    statusText: '#1e40af',
    contentProgress: '2/4',
    dueDate: '24 Sep 2026',
    amount: '₹11,500',
    paymentStatus: 'Committed',
    paymentBg: '#d1fae5',
    paymentText: '#065f46',
    action: 'reminder'
  },
  {
    id: 3,
    name: 'Madras Food Trail',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
    content: '2 Reels',
    followers: '95K followers',
    status: 'Contracted',
    statusBg: '#f3f4f6',
    statusText: '#374151',
    contentProgress: '0/2',
    dueDate: '26 Sep 2026',
    amount: '₹6,200',
    paymentStatus: 'Reserved',
    paymentBg: '#f3f4f6',
    paymentText: '#374151',
    action: 'awaiting'
  },
  {
    id: 4,
    name: 'Madrasi Eats',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    content: '1 Reel + 1 Story',
    followers: '120K followers',
    status: 'In Progress',
    statusBg: '#dbeafe',
    statusText: '#1e40af',
    contentProgress: '1/2',
    dueDate: '28 Sep 2026',
    amount: '₹7,500',
    paymentStatus: 'Reserved',
    paymentBg: '#f3f4f6',
    paymentText: '#374151',
    action: 'reminder'
  }
];

const TABS = ['Creators', 'Content', 'Timeline', 'Messages', 'Analytics'];

export default function CampaignOperationsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Creators');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BusinessLayout breadcrumb="Campaigns">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Back Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: '1px solid #e5e7eb'
        }}>
          <button
            onClick={() => navigate('/business/campaigns')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 8px',
              background: 'none',
              border: 'none',
              color: '#6b7280',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              borderRadius: 6,
              fontFamily: 'inherit'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M8.75 10.5L5.25 7l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Campaign Operations
          </button>
        </div>

        {/* Page Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 20
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <h1 style={{
                fontSize: 28,
                fontWeight: 700,
                color: '#1f2937',
                margin: 0
              }}>
                Chennai Café Launch
              </h1>
              <button style={{
                padding: 4,
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                  <path d="M12.854 2.146a.5.5 0 0 0-.708 0L10.5 3.793 7.354.646a.5.5 0 0 0-.708.708L9.793 4.5 6.646 7.646a.5.5 0 0 0 .708.708L10.5 5.207l3.146 3.147a.5.5 0 0 0 .708-.708L11.207 4.5l2.147-2.146a.5.5 0 0 0 0-.708z" transform="scale(1.2)"/>
                  <path d="M2 11.5v3a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-3" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                </svg>
              </button>
            </div>
            <p style={{
              fontSize: 14,
              color: '#6b7280',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              Campaign workspace
              <span style={{ color: '#d1d5db' }}>•</span>
              4 creators contracted
              <span style={{ color: '#d1d5db' }}>•</span>
              Due 30 Sep 2026
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              background: '#d1fae5',
              borderRadius: 16,
              fontSize: 12,
              fontWeight: 600,
              color: '#065f46'
            }}>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#10b981'
              }} />
              Active
            </div>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              background: '#1f2937',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="5" y="2" width="4" height="10" rx="1" fill="white"/>
              </svg>
              Pause campaign
            </button>
            <button style={{
              padding: '8px 10px',
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer'
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="4" r="1.5"/>
                <circle cx="10" cy="10" r="1.5"/>
                <circle cx="10" cy="16" r="1.5"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Budget Overview Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
          marginBottom: 20
        }}>
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            padding: 18
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="4" width="14" height="12" rx="2" stroke="#ef4444" strokeWidth="1.5"/>
                  <path d="M7 8h6M7 12h4" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 4
            }}>
              TOTAL BUDGET
            </div>
            <div style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#1f2937'
            }}>
              ₹1,50,000
            </div>
          </div>

          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            padding: 18
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="6" stroke="#ef4444" strokeWidth="1.5"/>
                  <path d="M10 7v6" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 4
            }}>
              COMMITTED
            </div>
            <div style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#1f2937',
              marginBottom: 2
            }}>
              ₹35,200
            </div>
            <div style={{
              fontSize: 12,
              color: '#9ca3af'
            }}>
              23% of budget
            </div>
          </div>

          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            padding: 18
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 8l4 4 4-4" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 4v8" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 4
            }}>
              RELEASED
            </div>
            <div style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#1f2937',
              marginBottom: 2
            }}>
              ₹0
            </div>
            <div style={{
              fontSize: 12,
              color: '#9ca3af'
            }}>
              0% of budget
            </div>
          </div>

          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            padding: 18
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 7h12l-1.5 9H5.5L4 7z" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M7 7V5a3 3 0 0 1 6 0v2" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 4
            }}>
              AVAILABLE
            </div>
            <div style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#1f2937',
              marginBottom: 2
            }}>
              ₹1,14,800
            </div>
            <div style={{
              fontSize: 12,
              color: '#9ca3af'
            }}>
              77% remaining
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: 10,
          padding: 16,
          marginBottom: 20
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
            fontSize: 12,
            color: '#6b7280'
          }}>
            <span>68% of budget allocated • ₹1,02,000 spent</span>
            <span style={{
              background: '#f3f4f6',
              padding: '2px 10px',
              borderRadius: 12,
              fontWeight: 500
            }}>
              Budget: ₹1,50,000
            </span>
          </div>
          <div style={{
            width: '100%',
            height: 10,
            background: '#f3f4f6',
            borderRadius: 5,
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: '68%',
              background: 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)',
              borderRadius: 5
            }} />
            <div style={{
              position: 'absolute',
              right: 'calc(32% - 20px)',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 10,
              fontWeight: 700,
              color: 'white'
            }}>
              68%
            </div>
          </div>
        </div>

        {/* Tabs and Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20
        }}>
          <div style={{
            display: 'flex',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: 3
          }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '7px 16px',
                  fontSize: 14,
                  fontWeight: 500,
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  background: activeTab === tab ? 'white' : 'transparent',
                  color: activeTab === tab ? '#1f2937' : '#6b7280',
                  boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              minWidth: 240
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="4.5" stroke="#9ca3af" strokeWidth="1.3"/>
                <path d="M11 11l3.5 3.5" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  flex: 1,
                  fontSize: 14,
                  background: 'transparent',
                  fontFamily: 'inherit',
                  color: '#1f2937'
                }}
              />
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 12px',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              cursor: 'pointer'
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M2 8h8M2 12h6" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Sort by</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 5l3 3 3-3" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Creators Table */}
        {activeTab === 'Creators' && (
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            overflow: 'hidden'
          }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '40px 2fr 140px 120px 120px 110px 140px 180px',
              gap: 12,
              alignItems: 'center',
              padding: '14px 20px',
              background: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontSize: 12,
              fontWeight: 600,
              color: '#6b7280'
            }}>
              <input type="checkbox" style={{ cursor: 'pointer' }} />
              <div>Creator</div>
              <div>Status</div>
              <div>Content</div>
              <div>Due date</div>
              <div>Amount</div>
              <div>Payment status</div>
              <div>Actions</div>
            </div>

            {/* Table Rows */}
            {CREATORS.map((creator, idx) => (
              <div
                key={creator.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 2fr 140px 120px 120px 110px 140px 180px',
                  gap: 12,
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderBottom: idx < CREATORS.length - 1 ? '1px solid #f3f4f6' : 'none',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                {/* Checkbox */}
                <input type="checkbox" style={{ cursor: 'pointer' }} />

                {/* Creator Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #f3f4f6'
                    }}
                  />
                  <div>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#1f2937',
                      marginBottom: 2
                    }}>
                      {creator.name}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: '#9ca3af'
                    }}>
                      {creator.content} • {creator.followers}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 10px',
                    borderRadius: 14,
                    fontSize: 12,
                    fontWeight: 500,
                    background: creator.statusBg,
                    color: creator.statusText
                  }}>
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: creator.statusText
                    }} />
                    {creator.status}
                  </span>
                </div>

                {/* Content Progress */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 14,
                  color: '#374151'
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="3" width="12" height="10" rx="2" stroke="#9ca3af" strokeWidth="1.2"/>
                    <circle cx="8" cy="8" r="2" fill="#9ca3af"/>
                  </svg>
                  {creator.contentProgress}
                </div>

                {/* Due Date */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 14,
                  color: '#374151'
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="2.5" width="12" height="10" rx="1.5" stroke="#9ca3af" strokeWidth="1.2"/>
                    <path d="M4 1v2M10 1v2M1 5.5h12" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  {creator.dueDate.substring(0, 11)}
                </div>

                {/* Amount */}
                <div style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#1f2937'
                }}>
                  {creator.amount}
                </div>

                {/* Payment Status */}
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 500,
                    background: creator.paymentBg,
                    color: creator.paymentText
                  }}>
                    {creator.paymentStatus}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {creator.action === 'review' && (
                    <button
                      onClick={() => navigate('/business/approvals')}
                      style={{
                        padding: '7px 14px',
                        background: '#1f2937',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontFamily: 'inherit'
                      }}
                    >
                      Review content
                    </button>
                  )}
                  {creator.action === 'reminder' && (
                    <button style={{
                      padding: '7px 14px',
                      background: '#f9fafb',
                      color: '#374151',
                      border: '1px solid #e5e7eb',
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}>
                      Send reminder
                    </button>
                  )}
                  {creator.action === 'awaiting' && (
                    <span style={{
                      fontSize: 13,
                      color: '#9ca3af'
                    }}>
                      Awaiting start
                    </span>
                  )}
                  <button style={{
                    padding: 6,
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="8" cy="3" r="1.2"/>
                      <circle cx="8" cy="8" r="1.2"/>
                      <circle cx="8" cy="13" r="1.2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Other Tabs Content */}
        {activeTab !== 'Creators' && (
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            padding: 60,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>
              {activeTab === 'Content' ? '📝' : 
               activeTab === 'Timeline' ? '📅' : 
               activeTab === 'Messages' ? '💬' : '📊'}
            </div>
            <h3 style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              {activeTab} Section
            </h3>
            <p style={{
              fontSize: 14,
              color: '#6b7280',
              margin: 0
            }}>
              This section is currently under development
            </p>
          </div>
        )}
      </div>
    </BusinessLayout>
  );
}
