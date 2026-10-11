import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import MobileLayout from '../../../components/mobile/MobileLayout';
import MobileCardCreator from '../../../components/mobile/MobileCardCreator';

/**
 * Creators List - Mobile View (Screen 4 from reference)
 * Search, filter, creator cards with status and delivery count
 */
export default function CreatorsListMobile() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const creators = [
    {
      id: 1,
      name: 'Shruti Voigs',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b743?w=100&h=100&fit=crop&crop=face',
      platform: 'instagram' as const,
      followers: '1.2M',
      engagement: '4.8%',
      status: 'approved' as const,
      delivered: 3,
      total: 5
    },
    {
      id: 2,
      name: 'TheFoodieEntrepreneur',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      platform: 'instagram' as const,
      followers: '245K',
      engagement: '5.2%',
      status: 'inreview' as const,
      delivered: 1,
      total: 3
    },
    {
      id: 3,
      name: 'Chennai Food Scene',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      platform: 'instagram' as const,
      followers: '580K',
      engagement: '6.1%',
      status: 'approved' as const,
      delivered: 5,
      total: 5
    },
    {
      id: 4,
      name: 'Travel with Anu',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      platform: 'instagram' as const,
      followers: '890K',
      engagement: '4.5%',
      status: 'pending' as const,
      delivered: 0,
      total: 4
    },
    {
      id: 5,
      name: 'Rahul Vlogs',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      platform: 'youtube' as const,
      followers: '2.1M',
      engagement: '7.8%',
      status: 'approved' as const,
      delivered: 2,
      total: 3
    },
    {
      id: 6,
      name: 'Rajiv Varma',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      platform: 'instagram' as const,
      followers: '456K',
      engagement: '5.7%',
      status: 'approved' as const,
      delivered: 2,
      total: 4
    },
    {
      id: 7,
      name: 'Food Tales',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      platform: 'instagram' as const,
      followers: '320K',
      engagement: '6.3%',
      status: 'approved' as const,
      delivered: 3,
      total: 3
    },
    {
      id: 8,
      name: 'Ronak Vloiids',
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face',
      platform: 'instagram' as const,
      followers: '678K',
      engagement: '5.9%',
      status: 'pending' as const,
      delivered: 0,
      total: 2
    }
  ];

  const filteredCreators = creators.filter(creator =>
    creator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MobileLayout showBottomNav>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: '#111827',
            margin: 0
          }}>
            Creators ({creators.length})
          </h1>
          <button
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <Search 
            size={18} 
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }}
          />
          <input
            type="text"
            placeholder="Search creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              fontSize: '14px',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              background: '#f9fafb',
              fontFamily: 'inherit',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Creator List */}
      <div style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {filteredCreators.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#6b7280'
          }}>
            <p style={{ fontSize: '14px' }}>No creators found</p>
          </div>
        ) : (
          filteredCreators.map((creator) => (
            <MobileCardCreator
              key={creator.id}
              {...creator}
              onClick={() => navigate(`/business/creators/${creator.id}/content`)}
            />
          ))
        )}
      </div>
    </MobileLayout>
  );
}
