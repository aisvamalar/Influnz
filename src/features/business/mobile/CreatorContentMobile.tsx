import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../../../components/mobile/MobileLayout';
import MobileHeader from '../../../components/mobile/MobileHeader';
import MobileStatusChip from '../../../components/mobile/MobileStatusChip';
import { Play } from 'lucide-react';

/**
 * Creator Content List - Mobile View (Screen 5 from reference)
 * Creator profile header, tabs (Content/Performance/Payments), content grid
 */
export default function CreatorContentMobile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'content' | 'performance' | 'payments'>('content');

  const creator = {
    name: 'Shruti Voigs',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b743?w=100&h=100&fit=crop&crop=face',
    followers: '1.2M',
    engagement: '4.8%'
  };

  const content = [
    {
      id: 1,
      type: 'reel',
      thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=300&fit=crop',
      status: 'approved' as const,
      views: '250K',
      duration: '0:45'
    },
    {
      id: 2,
      type: 'story',
      thumbnail: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=300&fit=crop',
      status: 'inreview' as const,
      views: '89K',
      duration: '0:15'
    },
    {
      id: 3,
      type: 'reel',
      thumbnail: 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?w=200&h=300&fit=crop',
      status: 'approved' as const,
      views: '312K',
      duration: '0:52'
    },
    {
      id: 4,
      type: 'reel',
      thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=300&fit=crop',
      status: 'pending' as const,
      views: '-',
      duration: '0:38'
    },
    {
      id: 5,
      type: 'story',
      thumbnail: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=200&h=300&fit=crop',
      status: 'approved' as const,
      views: '125K',
      duration: '0:20'
    }
  ];

  const tabs = [
    { id: 'content' as const, label: 'Content' },
    { id: 'performance' as const, label: 'Performance' },
    { id: 'payments' as const, label: 'Payments' }
  ];

  return (
    <MobileLayout>
      <MobileHeader title="Creator" />

      {/* Creator Profile Header */}
      <div style={{
        background: 'white',
        padding: '16px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <div style={{ position: 'relative' }}>
            <img
              src={creator.avatar}
              alt={creator.name}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              background: '#E4405F',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white',
              fontSize: '9px',
              fontWeight: '700',
              color: 'white'
            }}>
              IG
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '800',
              color: '#111827',
              margin: 0,
              marginBottom: '4px'
            }}>
              {creator.name}
            </h2>
            <div style={{
              fontSize: '12px',
              color: '#6b7280'
            }}>
              {creator.followers} followers · {creator.engagement} engagement
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        position: 'sticky',
        top: 0,
        zIndex: 90
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '14px',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              color: activeTab === tab.id ? '#dc2626' : '#6b7280',
              borderBottom: activeTab === tab.id ? '2px solid #dc2626' : '2px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div style={{ padding: '16px' }}>
          {/* Filter Chips */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'none'
          }}>
            {['All (8)', 'Reels (5)', 'Stories (3)', 'Approved', 'Pending'].map((filter) => (
              <button
                key={filter}
                style={{
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                  background: filter === 'All (8)' ? '#dc2626' : '#f3f4f6',
                  color: filter === 'All (8)' ? 'white' : '#6b7280'
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {content.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/business/content/${item.id}`)}
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  aspectRatio: '9/16'
                }}
              >
                <img
                  src={item.thumbnail}
                  alt={`Content ${item.id}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />

                {/* Status Badge */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px'
                }}>
                  <MobileStatusChip status={item.status} />
                </div>

                {/* Play Icon & Duration */}
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  right: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    background: 'rgba(0,0,0,0.6)',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Play size={12} color="white" fill="white" />
                    <span style={{
                      fontSize: '11px',
                      color: 'white',
                      fontWeight: '600'
                    }}>
                      {item.views}
                    </span>
                  </div>
                  <div style={{
                    background: 'rgba(0,0,0,0.6)',
                    borderRadius: '6px',
                    padding: '4px 8px'
                  }}>
                    <span style={{
                      fontSize: '11px',
                      color: 'white',
                      fontWeight: '600'
                    }}>
                      {item.duration}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Tab Placeholder */}
      {activeTab === 'performance' && (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <p>Performance metrics will be displayed here</p>
        </div>
      )}

      {/* Payments Tab Placeholder */}
      {activeTab === 'payments' && (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <p>Payment information will be displayed here</p>
        </div>
      )}
    </MobileLayout>
  );
}
