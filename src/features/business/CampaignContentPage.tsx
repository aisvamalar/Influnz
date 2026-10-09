/**
 * Campaign Content Page - Master-Detail Interface
 * LEFT: Creator List | RIGHT: Selected Creator Workspace
 */
import { useState } from 'react';
import BusinessLayout from './BusinessLayout';

interface Deliverable {
  id: string;
  type: string;
  duration: string;
  title: string;
  status: 'approved' | 'pending' | 'in-review' | 'not-started';
  submittedDate?: string;
  thumbnail?: string;
  videoUrl?: string;
}

interface Creator {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  platform: string;
  followers: string;
  engagementRate: string;
  contractStatus: 'approved' | 'in-review' | 'pending' | 'completed' | 'not-started';
  deliverables: Deliverable[];
}

const CREATORS: Creator[] = [
  {
    id: 1,
    name: 'Shruti Vlogs',
    handle: '@shrutivlogs',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    platform: 'Instagram',
    followers: '320K',
    engagementRate: '4.2%',
    contractStatus: 'approved',
    deliverables: [
      {
        id: '1-1',
        type: 'Instagram Reel',
        duration: '30-60s',
        title: 'Café Experience Reel',
        status: 'approved',
        submittedDate: '25 Oct 2026',
        thumbnail: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=700&fit=crop',
        videoUrl: 'sample.mp4'
      },
      {
        id: '1-2',
        type: 'Story',
        duration: '15s',
        title: 'Behind the scenes',
        status: 'approved',
        submittedDate: '25 Oct 2026'
      },
      {
        id: '1-3',
        type: 'Story',
        duration: '15s',
        title: 'Menu highlights',
        status: 'approved',
        submittedDate: '25 Oct 2026'
      }
    ]
  },
  {
    id: 2,
    name: 'Food Tales',
    handle: '@thefoodgram.hv',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
    platform: 'Instagram',
    followers: '180K',
    engagementRate: '5.8%',
    contractStatus: 'in-review',
    deliverables: [
      {
        id: '2-1',
        type: 'Instagram Reel',
        duration: '30-60s',
        title: 'Coffee brewing process',
        status: 'in-review',
        submittedDate: '24 Oct 2026'
      },
      {
        id: '2-2',
        type: 'Story',
        duration: '15s',
        title: 'Latte art showcase',
        status: 'pending'
      }
    ]
  },
  {
    id: 3,
    name: 'Rohit Visuals',
    handle: '@rohitvisuals',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
    platform: 'Instagram',
    followers: '95K',
    engagementRate: '3.5%',
    contractStatus: 'pending',
    deliverables: [
      {
        id: '3-1',
        type: 'Instagram Reel',
        duration: '30-60s',
        title: 'Café ambiance',
        status: 'not-started'
      }
    ]
  },
  {
    id: 4,
    name: 'Chennai Explorer',
    handle: '@chennaiexplorer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    platform: 'Instagram',
    followers: '120K',
    engagementRate: '4.8%',
    contractStatus: 'not-started',
    deliverables: [
      {
        id: '4-1',
        type: 'Instagram Reel',
        duration: '30-60s',
        title: 'Location review',
        status: 'not-started'
      }
    ]
  }
];

export default function CampaignContentPage() {
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(CREATORS[0]);
  const [selectedContent, setSelectedContent] = useState<Deliverable | null>(CREATORS[0].deliverables[0]);
  const [activeTab, setActiveTab] = useState<'content' | 'performance' | 'payments'>('content');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return { bg: '#d1fae5', text: '#065f46', dot: '#10b981' };
      case 'in-review': return { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' };
      case 'pending': return { bg: '#dbeafe', text: '#1e3a8a', dot: '#3b82f6' };
      case 'completed': return { bg: '#d1fae5', text: '#065f46', dot: '#10b981' };
      default: return { bg: '#f3f4f6', text: '#374151', dot: '#9ca3af' };
    }
  };

  const filteredCreators = filterStatus === 'all'
    ? CREATORS
    : CREATORS.filter(c => c.contractStatus === filterStatus);

  return (
    <BusinessLayout breadcrumb="Campaigns / Chennai Café Launch / Content">
      <div style={{ display: 'flex', height: 'calc(100vh - 140px)', gap: 0 }}>
        {/* LEFT PANEL: Creator List */}
        <div style={{
          width: '280px',
          borderRight: '1px solid #e5e7eb',
          background: '#fafafa',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #e5e7eb', background: 'white' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#111827',
                margin: 0
              }}>
                Creators ({CREATORS.length})
              </h2>
              <button style={{
                padding: '6px',
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                borderRadius: '6px'
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 5h14M2 9h10M2 13h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Filter Tabs */}
            <div style={{
              display: 'flex',
              gap: '4px',
              background: '#f3f4f6',
              padding: '3px',
              borderRadius: '8px'
            }}>
              {[
                { label: 'All', value: 'all', count: 8 },
                { label: 'Approved', value: 'approved', count: 1 },
                { label: 'In Review', value: 'in-review', count: 2 },
                { label: 'Pending', value: 'pending', count: 3 }
              ].map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setFilterStatus(tab.value)}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    background: filterStatus === tab.value ? 'white' : 'transparent',
                    color: filterStatus === tab.value ? '#111827' : '#6b7280',
                    boxShadow: filterStatus === tab.value ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Creator List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            background: 'white'
          }}>
            {filteredCreators.map((creator) => {
              const isSelected = selectedCreator?.id === creator.id;
              const statusColors = getStatusColor(creator.contractStatus);
              
              return (
                <div
                  key={creator.id}
                  onClick={() => {
                    setSelectedCreator(creator);
                    setSelectedContent(creator.deliverables[0]);
                  }}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer',
                    background: isSelected ? '#fafafa' : 'white',
                    borderLeft: isSelected ? '3px solid #dc2626' : '3px solid transparent',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => !isSelected && (e.currentTarget.style.background = '#fafafa')}
                  onMouseLeave={e => !isSelected && (e.currentTarget.style.background = 'white')}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#111827',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {creator.name}
                        </div>
                        {creator.contractStatus === 'approved' && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="7" fill="#10b981"/>
                            <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        marginBottom: '8px'
                      }}>
                        {creator.handle}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          fontSize: '11px',
                          color: '#6b7280'
                        }}>
                          📸 {creator.platform}
                        </span>
                        <span style={{ color: '#d1d5db' }}>•</span>
                        <span style={{
                          fontSize: '11px',
                          color: '#6b7280'
                        }}>
                          {creator.followers}
                        </span>
                      </div>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        background: statusColors.bg
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: statusColors.dot
                        }} />
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          color: statusColors.text,
                          textTransform: 'capitalize'
                        }}>
                          {creator.contractStatus}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#9ca3af',
                        marginTop: '6px'
                      }}>
                        {creator.deliverables.length}/3 delivered
                      </div>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M8 6l4 4-4 4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL: Creator Workspace */}
        {selectedCreator && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: 'white',
            overflow: 'hidden'
          }}>
            {/* Creator Header */}
            <div style={{
              padding: '20px 32px',
              borderBottom: '1px solid #e5e7eb',
              background: 'white'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={selectedCreator.avatar}
                    alt={selectedCreator.name}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <h2 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#111827',
                        margin: 0
                      }}>
                        {selectedCreator.name}
                      </h2>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="8" fill="#10b981"/>
                        <path d="M6 9l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      {selectedCreator.handle}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '2px'
                    }}>
                      Followers
                    </div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#111827'
                    }}>
                      {selectedCreator.followers}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '2px'
                    }}>
                      Engagement
                    </div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#111827'
                    }}>
                      {selectedCreator.engagementRate}
                    </div>
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: '#d1fae5'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#10b981'
                    }} />
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#065f46'
                    }}>
                      Approved
                    </span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M4 7l3 3 3-3" stroke="#065f46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      padding: '8px',
                      background: 'none',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#6b7280'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 14l10-10M14 10V4H8"/>
                      </svg>
                    </button>
                    <button style={{
                      padding: '8px',
                      background: 'none',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#6b7280'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                        <circle cx="9" cy="4" r="1.5"/>
                        <circle cx="9" cy="9" r="1.5"/>
                        <circle cx="9" cy="14" r="1.5"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{
                display: 'flex',
                gap: '32px',
                borderBottom: '2px solid #f3f4f6',
                marginTop: '16px'
              }}>
                {[
                  { key: 'content' as const, label: 'Content' },
                  { key: 'performance' as const, label: 'Performance' },
                  { key: 'payments' as const, label: 'Payments' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    style={{
                      padding: '12px 0',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      color: activeTab === tab.key ? '#dc2626' : '#6b7280',
                      borderBottom: activeTab === tab.key ? '2px solid #dc2626' : '2px solid transparent',
                      marginBottom: '-2px',
                      transition: 'all 0.15s'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px'
            }}>
              {activeTab === 'content' && selectedContent && (
                <div style={{
                  maxWidth: '100%',
                  width: '100%',
                  margin: 0
                }}>
                  {/* Back to list */}
                  <button
                    onClick={() => setSelectedContent(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      background: 'none',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#6b7280',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      marginBottom: '20px'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M8 11L5 7l3-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Back to list
                  </button>

                  {/* Content Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '24px'
                  }}>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <h3 style={{
                          fontSize: '22px',
                          fontWeight: '700',
                          color: '#111827',
                          margin: 0
                        }}>
                          {selectedContent.title}
                        </h3>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          background: '#d1fae5',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#065f46'
                        }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="5" fill="currentColor"/>
                            <path d="M4 6l1.5 1.5L8.5 4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Approved
                        </span>
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        {selectedContent.type} ({selectedContent.duration}) • Submitted on {selectedContent.submittedDate}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#6b7280'
                    }}>
                      1 of 3
                    </div>
                  </div>

                  {/* Video Preview - Vertical Instagram Reel Format */}
                  {selectedContent.thumbnail && (
                    <div style={{
                      position: 'relative',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      marginBottom: '24px',
                      background: '#000',
                      width: '380px',
                      height: '680px',
                      margin: '0 auto 24px'
                    }}>
                      <img
                        src={selectedContent.thumbnail}
                        alt="Content preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          display: 'block'
                        }}
                      />
                      <button style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                      }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#111827">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </button>
                      <div style={{
                        position: 'absolute',
                        bottom: '16px',
                        left: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                          <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5" fill="none"/>
                          <path d="M8 4v4l3 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        0:00 / 0:45
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: '16px',
                        right: '16px',
                        display: 'flex',
                        gap: '8px'
                      }}>
                        <button style={{
                          padding: '8px',
                          background: 'rgba(0, 0, 0, 0.6)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          cursor: 'pointer'
                        }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                            <path d="M2 5v6l4-3-4-3zM8 5v6l4-3-4-3z"/>
                          </svg>
                        </button>
                        <button style={{
                          padding: '8px',
                          background: 'rgba(0, 0, 0, 0.6)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          cursor: 'pointer'
                        }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                            <path d="M3 3h10v10H3z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Centered Video with Actions Below */}
                  <div style={{
                    maxWidth: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    {/* Feedback & Approval Timeline - Above Video */}
                    <div style={{
                      width: '100%',
                      maxWidth: '800px',
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '24px'
                    }}>
                      <h5 style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#111827',
                        marginBottom: '16px'
                      }}>
                        Feedback & Approval
                      </h5>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '12px',
                        marginBottom: '16px'
                      }}>
                        {[
                          { icon: '✅', label: 'Content submitted', date: '10 Oct 2026, 09:42 AM' },
                          { icon: '✅', label: 'AI compliance check passed', date: '10 Oct 2026, 09:42 AM' },
                          { icon: '✅', label: 'Business approved', date: '23 Oct 2026, 11:32 AM' },
                          { icon: '⏳', label: 'Payment scheduled', date: '30 Oct 2026' }
                        ].map((item, idx) => (
                          <div key={idx} style={{
                            padding: '14px',
                            background: idx < 3 ? '#f9fafb' : 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            textAlign: 'center'
                          }}>
                            <div style={{
                              fontSize: '20px',
                              marginBottom: '8px'
                            }}>
                              {item.icon}
                            </div>
                            <div style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#374151',
                              marginBottom: '4px'
                            }}>
                              {item.label}
                            </div>
                            <div style={{
                              fontSize: '11px',
                              color: '#9ca3af'
                            }}>
                              {item.date}
                            </div>
                          </div>
                        ))}
                      </div>
                      <textarea
                        placeholder="Add a comment..."
                        style={{
                          width: '100%',
                          minHeight: '70px',
                          padding: '12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    {/* Action Buttons - Above Video */}
                    <div style={{
                      width: '100%',
                      maxWidth: '800px',
                      display: 'flex',
                      gap: '12px',
                      marginBottom: '24px'
                    }}>
                      <button style={{
                        flex: 1,
                        padding: '14px 20px',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
                          <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="1.5" fill="none"/>
                          <path d="M6.5 9l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Approve & Release Payment
                      </button>
                      <button style={{
                        flex: 1,
                        padding: '14px 20px',
                        background: 'white',
                        color: '#dc2626',
                        border: '1.5px solid #dc2626',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M13 5L5 13M5 5l8 8"/>
                        </svg>
                        Request Revision
                      </button>
                      <button style={{
                        padding: '14px 20px',
                        background: 'white',
                        color: '#6b7280',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M9 3v12M3 9h12"/>
                        </svg>
                        Download
                      </button>
                      <button style={{
                        padding: '14px 20px',
                        background: 'white',
                        color: '#6b7280',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M5 13l8-8M13 9V5H9"/>
                        </svg>
                        View on IG
                      </button>
                    </div>
                  </div>

                  {/* Two Column Layout - AI Compliance & Content Details */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    maxWidth: '800px',
                    margin: '0 auto',
                    width: '100%'
                  }}>
                      {/* AI Compliance Check */}
                      <div style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '20px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '16px'
                        }}>
                          <h4 style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#111827',
                            margin: 0
                          }}>
                            AI Compliance Check
                          </h4>
                          <div style={{
                            fontSize: '24px',
                            fontWeight: '800',
                            color: '#10b981'
                          }}>
                            98%
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {[
                            { label: 'Brand tag (@ChennaiCafe)', status: 'found' },
                            { label: 'Paid disclosure (#ad)', status: 'found' },
                            { label: 'Product shown clearly', status: 'found' },
                            { label: 'Audio clear', status: 'good' },
                            { label: 'No misleading claims', status: 'clear' },
                            { label: 'Format & duration', status: '0:45 (Valid)' }
                          ].map((item) => (
                            <div key={item.label} style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                  <circle cx="9" cy="9" r="8" fill="#10b981"/>
                                  <path d="M6 9l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span style={{
                                  fontSize: '14px',
                                  color: '#374151'
                                }}>
                                  {item.label}
                                </span>
                              </div>
                              <span style={{
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#10b981'
                              }}>
                                {item.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Content Details */}
                      <div style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '20px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '16px'
                        }}>
                          <h4 style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#111827',
                            margin: 0
                          }}>
                            Content Details
                          </h4>
                          <button style={{
                            padding: '6px 12px',
                            background: 'none',
                            border: 'none',
                            color: '#dc2626',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M2 10v2h2l7-7-2-2-7 7z"/>
                              <path d="M9 3l2 2"/>
                            </svg>
                            Edit
                          </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div>
                            <div style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#6b7280',
                              marginBottom: '6px'
                            }}>
                              Caption
                            </div>
                            <div style={{
                              fontSize: '14px',
                              color: '#374151',
                              lineHeight: '1.6'
                            }}>
                              The perfect café spot in Chennai! ☕💛<br />
                              Great food, cozy vibes and a must visit!<br />
                              #ad #ChennaiCafe
                            </div>
                          </div>
                          <div>
                            <div style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#6b7280',
                              marginBottom: '6px'
                            }}>
                              Hashtags
                            </div>
                            <div style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '8px'
                            }}>
                              {['#ChennaiCafe', '#ChennaiFood', '#CafeVibes', '+2'].map(tag => (
                                <span key={tag} style={{
                                  padding: '4px 10px',
                                  background: '#f3f4f6',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  color: '#4b5563'
                                }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#6b7280',
                              marginBottom: '6px'
                            }}>
                              Location
                            </div>
                            <div style={{
                              fontSize: '14px',
                              color: '#374151'
                            }}>
                              Chennai, TN
                            </div>
                          </div>
                          <div>
                            <div style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#6b7280',
                              marginBottom: '6px'
                            }}>
                              Posted on
                            </div>
                            <div style={{
                              fontSize: '14px',
                              color: '#374151'
                            }}>
                              25 Oct 2026, 11:52 AM
                            </div>
                          </div>
                          <div>
                            <div style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#6b7280',
                              marginBottom: '6px'
                            }}>
                              Engagement (live)
                            </div>
                            <div style={{
                              display: 'flex',
                              gap: '20px'
                            }}>
                              {[
                                { icon: '❤️', value: '8.2K' },
                                { icon: '💬', value: '542' },
                                { icon: '📤', value: '312' },
                                { icon: '🔖', value: '186' }
                              ].map(stat => (
                                <div key={stat.icon} style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}>
                                  <span style={{ fontSize: '16px' }}>{stat.icon}</span>
                                  <span style={{
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    color: '#111827'
                                  }}>
                                    {stat.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              )}

              {/* Deliverables List (when no content selected) */}
              {activeTab === 'content' && !selectedContent && (
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '16px'
                  }}>
                    Deliverables ({selectedCreator.deliverables.length}/3 completed)
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '16px'
                  }}>
                    {selectedCreator.deliverables.map((deliverable) => {
                      const statusColors = getStatusColor(deliverable.status);
                      return (
                        <div
                          key={deliverable.id}
                          style={{
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            padding: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onClick={() => setSelectedContent(deliverable)}
                          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                          onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                        >
                          {deliverable.thumbnail && (
                            <div style={{
                              width: '100%',
                              height: '180px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              marginBottom: '12px',
                              background: '#f3f4f6',
                              position: 'relative'
                            }}>
                              <img
                                src={deliverable.thumbnail}
                                alt={deliverable.title}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                              <div style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                padding: '4px 8px',
                                background: 'rgba(0, 0, 0, 0.7)',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '600',
                                color: 'white'
                              }}>
                                {deliverable.duration}
                              </div>
                            </div>
                          )}
                          <div style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#111827',
                            marginBottom: '4px'
                          }}>
                            {deliverable.title}
                          </div>
                          <div style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            marginBottom: '10px'
                          }}>
                            {deliverable.type}
                          </div>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            background: statusColors.bg
                          }}>
                            <div style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: statusColors.dot
                            }} />
                            <span style={{
                              fontSize: '11px',
                              fontWeight: '600',
                              color: statusColors.text,
                              textTransform: 'capitalize'
                            }}>
                              {deliverable.status.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Other Tabs Placeholder */}
              {(activeTab === 'performance' || activeTab === 'payments') && (
                <div style={{
                  textAlign: 'center',
                  padding: '60px',
                  color: '#6b7280'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    {activeTab === 'performance' ? '📊' : '💳'}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>
                    {activeTab === 'performance' ? 'Performance' : 'Payments'} data coming soon
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </BusinessLayout>
  );
}
