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

const FILTER_TABS = ['All', 'Active', 'Pending', 'Draft', 'Completed'];

export default function CampaignListPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredCampaigns = activeFilter === 'All' 
    ? CAMPAIGNS 
    : CAMPAIGNS.filter(c => c.status === activeFilter.toLowerCase());

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
            onClick={() => navigate('/business/campaigns/new')}
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

        {/* Empty State */}
        {filteredCampaigns.length === 0 && (
          <div style={{
            background: 'white',
            border: '2px dashed #e5e7eb',
            borderRadius: 12,
            padding: 60,
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: 48,
              marginBottom: 16
            }}>
              📋
            </div>
            <h3 style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              No campaigns found
            </h3>
            <p style={{
              fontSize: 14,
              color: '#6b7280',
              margin: '0 0 20px 0'
            }}>
              Try adjusting your filter or create a new campaign
            </p>
            <button
              onClick={() => navigate('/business/campaigns/new')}
              style={{
                padding: '10px 18px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              + Create campaign
            </button>
          </div>
        )}
      </div>
    </BusinessLayout>
  );
}
