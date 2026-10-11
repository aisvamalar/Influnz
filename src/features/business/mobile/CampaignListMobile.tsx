import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import MobileLayout from '../../../components/mobile/MobileLayout';
import MobileCardCampaign from '../../../components/mobile/MobileCardCampaign';

/**
 * Campaign List - Mobile View (Screen 2 from reference)
 * Search, filters, campaign cards with thumbnails and progress
 */
export default function CampaignListMobile() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all');

  const campaigns = [
    {
      id: 1,
      name: 'Chennai Café Launch',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&h=100&fit=crop',
      platform: 'Instagram',
      creators: 5,
      status: 'active' as const,
      spent: '₹1,02,000',
      budget: '₹1,50,000',
      progress: 68
    },
    {
      id: 2,
      name: 'Diwali Collection',
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=100&h=100&fit=crop',
      platform: 'Instagram',
      creators: 8,
      status: 'pending' as const,
      spent: '₹0',
      budget: '₹2,00,000',
      progress: 0
    },
    {
      id: 3,
      name: 'Summer Drinks',
      image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=100&h=100&fit=crop',
      platform: 'Instagram',
      creators: 6,
      status: 'active' as const,
      spent: '₹45,000',
      budget: '₹80,000',
      progress: 56
    },
    {
      id: 4,
      name: 'New Menu Launch',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop',
      platform: 'Instagram',
      creators: 4,
      status: 'completed' as const,
      spent: '₹1,20,000',
      budget: '₹1,20,000',
      progress: 100
    }
  ];

  const filterButtons = [
    { id: 'all' as const, label: 'All', count: campaigns.length },
    { id: 'active' as const, label: 'Active', count: campaigns.filter(c => c.status === 'active').length },
    { id: 'pending' as const, label: 'Pending', count: campaigns.filter(c => c.status === 'pending').length },
    { id: 'completed' as const, label: 'Completed', count: campaigns.filter(c => c.status === 'completed').length }
  ];

  const filteredCampaigns = activeFilter === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.status === activeFilter);

  return (
    <MobileLayout showBottomNav activeNavItem="campaigns">
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
            Campaigns
          </h1>
          <button
            onClick={() => navigate('/business/campaigns/new')}
            style={{
              background: 'linear-gradient(135deg, #dc6b5f 0%, #d14538 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(220,107,95,0.3)'
            }}
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{
          position: 'relative',
          marginBottom: '12px'
        }}>
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
            placeholder="Search campaigns..."
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

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
          scrollbarWidth: 'none'
        }}>
          {filterButtons.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: '600',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                background: activeFilter === filter.id ? '#dc2626' : '#f3f4f6',
                color: activeFilter === filter.id ? 'white' : '#6b7280'
              }}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Campaign List */}
      <div style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {filteredCampaigns.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#6b7280'
          }}>
            <p style={{ fontSize: '14px' }}>No campaigns found</p>
          </div>
        ) : (
          filteredCampaigns.map((campaign) => (
            <MobileCardCampaign
              key={campaign.id}
              {...campaign}
              onClick={() => navigate(`/business/campaigns/${campaign.id}`)}
            />
          ))
        )}
      </div>
    </MobileLayout>
  );
}
