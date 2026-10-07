/**
 * Invitation Status Page
 * Exact replica of the reference design
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';

interface Invitation {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  status: 'invited' | 'accepted' | 'negotiating' | 'declined' | 'pending';
  offered: string;
  response: string;
  final: string;
  time: string;
  note: string;
  actionLabel: string;
}

const INVITATIONS: Invitation[] = [
  {
    id: 1,
    name: 'Foodie Tamilian',
    handle: '@foodietamilan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    status: 'accepted',
    offered: '₹10,000',
    response: '₹10,000',
    final: '₹10,000',
    time: '2 hours ago',
    note: 'Accepted at offered price.',
    actionLabel: 'View deal'
  },
  {
    id: 2,
    name: 'Chennai Bites',
    handle: '@chennaibites',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
    status: 'negotiating',
    offered: '₹10,000',
    response: '₹14,500',
    final: '—',
    time: '1 hour ago',
    note: 'Countered at ₹14,500. AI is negotiating within ₹12,000 limit.',
    actionLabel: 'Intervene'
  },
  {
    id: 3,
    name: 'Local Food Guide',
    handle: '@localfoodguide',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    status: 'declined',
    offered: '₹18,000',
    response: '—',
    final: '—',
    time: '3 hours ago',
    note: 'Creator declined. 2 replacement candidates ready.',
    actionLabel: 'Replacements'
  },
  {
    id: 4,
    name: 'Madras Food Trail',
    handle: '@madrasfoodtrail',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
    status: 'accepted',
    offered: '₹6,200',
    response: '—',
    final: '—',
    time: '5 hours ago',
    note: 'Invitation viewed. Awaiting response.',
    actionLabel: 'Send reminder'
  },
  {
    id: 5,
    name: 'Madrasi Eats',
    handle: '@madrasieats',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    status: 'pending',
    offered: '₹7,500',
    response: '—',
    final: '—',
    time: '1 day ago',
    note: 'Invitation not yet viewed.',
    actionLabel: 'View profile'
  }
];

export default function InvitationsPage() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCreator, setSelectedCreator] = useState<Invitation | null>(INVITATIONS[1]); // Chennai Bites selected

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, { bg: string; color: string; icon: string }> = {
      invited: { bg: '#FEF3EC', color: '#F97316', icon: '📨' },
      accepted: { bg: '#ECFDF5', color: '#10B981', icon: '✓' },
      negotiating: { bg: '#FFF7ED', color: '#F59E0B', icon: '⚡' },
      declined: { bg: '#FEE2E2', color: '#EF4444', icon: '✕' },
      pending: { bg: '#EFF6FF', color: '#3B82F6', icon: '⏱' }
    };

    const style = statusStyles[status] || statusStyles.invited;
    
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 10px',
        background: style.bg,
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        color: style.color
      }}>
        <span>{style.icon}</span>
        <span style={{ textTransform: 'capitalize' }}>{status}</span>
      </div>
    );
  };

  return (
    <BusinessLayout breadcrumb="Invitation Status">
      <div style={{ display: 'flex', gap: 24, height: 'calc(100vh - 140px)' }}>
        {/* Left Panel - Invitations List */}
        <div style={{ flex: '0 0 680px', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <h1 style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#1f2937',
              margin: '0 0 4px 0'
            }}>
              Invitation Status
            </h1>
            <p style={{
              fontSize: 14,
              color: '#6b7280',
              margin: 0
            }}>
              Track and manage responses from invited creators in real time.
            </p>
          </div>

          {/* Status Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 10,
            marginBottom: 20
          }}>
            {[
              { key: 'invited', label: 'Invited', count: 5, color: '#F97316', icon: '📨' },
              { key: 'accepted', label: 'Accepted', count: 1, color: '#10B981', icon: '✓' },
              { key: 'negotiating', label: 'Negotiating', count: 1, color: '#F59E0B', icon: '⚡' },
              { key: 'declined', label: 'Declined', count: 1, color: '#EF4444', icon: '✕' },
              { key: 'pending', label: 'Pending', count: 2, color: '#3B82F6', icon: '⏱' }
            ].map(stat => (
              <div
                key={stat.key}
                style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#1f2937',
                  marginBottom: 4
                }}>
                  {stat.count}
                </div>
                <div style={{
                  fontSize: 11,
                  color: '#6b7280',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div style={{
            display: 'flex',
            gap: 6,
            marginBottom: 16,
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: 2
          }}>
            {[
              { key: 'all', label: 'All (5)', dot: '' },
              { key: 'accepted', label: 'Accepted (1)', dot: '#10B981' },
              { key: 'negotiating', label: 'Negotiating (1)', dot: '#F59E0B' },
              { key: 'declined', label: 'Declined (1)', dot: '#EF4444' },
              { key: 'pending', label: 'Pending (2)', dot: '#3B82F6' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: filterStatus === tab.key ? '2px solid #1f2937' : '2px solid transparent',
                  fontSize: 13,
                  fontWeight: filterStatus === tab.key ? 600 : 400,
                  color: filterStatus === tab.key ? '#1f2937' : '#6b7280',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s'
                }}
              >
                {tab.dot && (
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: tab.dot
                  }} />
                )}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Filter Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
            padding: '10px 14px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: 8
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="4.5" stroke="#9ca3af" strokeWidth="1.3"/>
              <path d="M11 11l3.5 3.5" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search creators..."
              style={{
                border: 'none',
                outline: 'none',
                flex: 1,
                fontSize: 14,
                background: 'transparent',
                fontFamily: 'inherit'
              }}
            />
            <button style={{
              padding: '4px 10px',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              fontSize: 12,
              color: '#374151',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 4h10M4 7h6M6 10h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Filter
            </button>
          </div>

          {/* Invitations List */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            {INVITATIONS.map((inv) => (
              <div
                key={inv.id}
                onClick={() => setSelectedCreator(inv)}
                style={{
                  background: 'white',
                  border: selectedCreator?.id === inv.id ? '2px solid #1f2937' : '1px solid #e5e7eb',
                  borderRadius: 10,
                  padding: '14px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12
                }}>
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    style={{
                      width: 16,
                      height: 16,
                      marginTop: 2,
                      cursor: 'pointer',
                      accentColor: '#1f2937'
                    }}
                  />

                  {/* Creator Avatar */}
                  <img
                    src={inv.avatar}
                    alt={inv.name}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />

                  {/* Creator Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 4
                    }}>
                      <div>
                        <div style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: '#1f2937',
                          marginBottom: 2
                        }}>
                          {inv.name}
                        </div>
                        <div style={{
                          fontSize: 12,
                          color: '#9ca3af'
                        }}>
                          {inv.handle}
                        </div>
                      </div>
                      {getStatusBadge(inv.status)}
                    </div>

                    {/* Stats Row */}
                    <div style={{
                      display: 'flex',
                      gap: 16,
                      fontSize: 12,
                      color: '#6b7280',
                      marginBottom: 6
                    }}>
                      <div>
                        <span style={{ fontWeight: 600, color: '#374151' }}>Offered:</span> {inv.offered}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, color: '#374151' }}>Response:</span>{' '}
                        <span style={{ color: inv.status === 'negotiating' ? '#F59E0B' : '#374151', fontWeight: 600 }}>
                          {inv.response}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, color: '#374151' }}>Final:</span>{' '}
                        <span style={{ color: inv.final !== '—' ? '#10B981' : '#374151', fontWeight: 600 }}>
                          {inv.final}
                        </span>
                      </div>
                    </div>

                    {/* Last Update */}
                    <div style={{
                      fontSize: 11,
                      color: '#9ca3af',
                      marginBottom: 8
                    }}>
                      {inv.time} · {inv.note}
                    </div>

                    {/* Action Button */}
                    <button 
                      onClick={() => {
                        if (inv.status === 'accepted') {
                          navigate(`/business/campaigns/${inv.id}/deal-confirmed`);
                        }
                      }}
                      style={{
                        padding: '6px 14px',
                        background: inv.status === 'negotiating' ? '#F59E0B' : '#1f2937',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 500,
                        color: 'white',
                        cursor: 'pointer',
                        fontFamily: 'inherit'
                      }}
                    >
                      {inv.actionLabel}
                    </button>
                  </div>

                  {/* More Button */}
                  <button style={{
                    width: 28,
                    height: 28,
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9ca3af'
                  }}>
                    <svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor">
                      <circle cx="2" cy="2" r="2"/>
                      <circle cx="2" cy="8" r="2"/>
                      <circle cx="2" cy="14" r="2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Creator Details */}
        {selectedCreator && (
          <div style={{
            flex: 1,
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: 24,
            overflow: 'auto'
          }}>
            {/* Close Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <button
                onClick={() => setSelectedCreator(null)}
                style={{
                  width: 32,
                  height: 32,
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            {/* Creator Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <img
                src={selectedCreator.avatar}
                alt={selectedCreator.name}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: 12
                }}
              />
              <h2 style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#1f2937',
                margin: '0 0 4px 0'
              }}>
                {selectedCreator.name}
              </h2>
              <p style={{
                fontSize: 14,
                color: '#9ca3af',
                margin: '0 0 12px 0'
              }}>
                {selectedCreator.handle}
              </p>
              <a
                href="#"
                style={{
                  fontSize: 13,
                  color: '#6366f1',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                @chennaibites
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 9l6-6M9 3v6M3 3h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: 24,
              borderBottom: '1px solid #e5e7eb',
              marginBottom: 20
            }}>
              {['Negotiation', 'Creator Info', 'Notes'].map((tab, idx) => (
                <button
                  key={tab}
                  style={{
                    padding: '10px 0',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: idx === 0 ? '2px solid #ef4444' : '2px solid transparent',
                    fontSize: 14,
                    fontWeight: idx === 0 ? 600 : 400,
                    color: idx === 0 ? '#1f2937' : '#6b7280',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Offer Info Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
              marginBottom: 20
            }}>
              <div style={{
                background: '#f9fafb',
                borderRadius: 8,
                padding: '12px 14px'
              }}>
                <div style={{
                  fontSize: 11,
                  color: '#9ca3af',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  marginBottom: 4
                }}>
                  Offered amount
                </div>
                <div style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#1f2937'
                }}>
                  ₹10,000
                </div>
              </div>
              <div style={{
                background: '#fef3ec',
                borderRadius: 8,
                padding: '12px 14px'
              }}>
                <div style={{
                  fontSize: 11,
                  color: '#9ca3af',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  marginBottom: 4
                }}>
                  Creator asked
                </div>
                <div style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#F97316'
                }}>
                  ₹14,500
                </div>
              </div>
            </div>

            {/* Negotiation Timeline */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: 16
              }}>
                Creator's initial ask
              </h3>
              <div style={{
                fontSize: 13,
                color: '#6b7280',
                lineHeight: 1.6,
                marginBottom: 8
              }}>
                1 hour ago
              </div>
              <p style={{
                fontSize: 14,
                color: '#374151',
                lineHeight: 1.6,
                margin: 0
              }}>
                Thanks! I'd love to collaborate. My fee for this campaign is ₹14,500. Looking forward to working together!
              </p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 12
              }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF6B35, #F28469)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'white'
                }}>
                  AI
                </div>
                <h3 style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#1f2937',
                  margin: 0
                }}>
                  AI analyses
                </h3>
              </div>
              <div style={{
                fontSize: 13,
                color: '#6b7280',
                lineHeight: 1.6,
                marginBottom: 8
              }}>
                1 hour ago
              </div>
              <p style={{
                fontSize: 14,
                color: '#374151',
                lineHeight: 1.6,
                margin: 0
              }}>
                This is <strong style={{ color: '#10B981' }}>45% higher</strong> than your limit. AI can negotiate up to <strong>₹12,000</strong>.
              </p>
            </div>

            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 12
              }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF6B35, #F28469)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'white'
                }}>
                  AI
                </div>
                <h3 style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#1f2937',
                  margin: 0
                }}>
                  AI counter offer sent
                </h3>
              </div>
              <div style={{
                fontSize: 13,
                color: '#6b7280',
                lineHeight: 1.6,
                marginBottom: 8
              }}>
                1 hour ago
              </div>
              <p style={{
                fontSize: 14,
                color: '#374151',
                lineHeight: 1.6,
                margin: 0
              }}>
                Countered with <strong>₹12,000</strong> and highlighted campaign benefits.
              </p>
            </div>

            {/* Send Message Input */}
            <div style={{
              marginTop: 24,
              padding: '16px',
              background: '#fef3ec',
              borderRadius: 10,
              border: '1px solid #fed7aa'
            }}>
              <div style={{
                fontSize: 13,
                color: '#374151',
                marginBottom: 12
              }}>
                Send a message or set a custom offer...
              </div>
              <button style={{
                width: '100%',
                padding: '10px',
                background: '#F97316',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                color: 'white',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 2L7 9M14 2l-4 12-3-5-5-3 12-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </BusinessLayout>
  );
}
