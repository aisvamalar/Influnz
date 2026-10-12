import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import MobileBottomNav from '../../../components/mobile/MobileBottomNav';
import UiIcon from '../../../components/UiIcon';

/**
 * Mobile Campaign Details Page (Screen 3)
 * Shows campaign overview with hero image, stats, and tabs
 */
export default function CampaignDetailsPageMobile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'creators' | 'content' | 'performance'>('overview');

  return (
    <div style={{
      background: '#f5f5f5',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
      {/* Hero Image with Back Button */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '280px',
        background: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        {/* Status Bar */}
        <div style={{
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13px',
          fontWeight: '600',
          color: 'white'
        }}>
          <span>9:41</span>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
              <path d="M0 4h3v4H0V4zm5 0h3v4H5V4zm5 0h3v4h-3V4zm5-1h3v6h-3V3z"/>
            </svg>
            <svg width="15" height="12" viewBox="0 0 15 12" fill="white">
              <path d="M1 11c0-.5.4-.9.9-.9.3 0 .6.1.8.3l1.7 1.3c1-.7 2.3-1.2 3.6-1.2s2.6.5 3.6 1.2l1.7-1.3c.2-.2.5-.3.8-.3.5 0 .9.4.9.9v.5c0 .3-.2.6-.5.8l-2 1.5c-.6.5-1.4.7-2.1.7h-1.6c-.7 0-1.5-.2-2.1-.7l-2-1.5c-.3-.2-.5-.5-.5-.8V11z"/>
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="white">
              <rect x="2" y="2" width="18" height="8" rx="2" stroke="white" fill="white"/>
              <rect x="22" y="4" width="2" height="4" rx="1"/>
            </svg>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/business/campaigns')}
          style={{
            position: 'absolute',
            top: '56px',
            left: '16px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          <ChevronLeft size={24} color="#111827" />
        </button>

        {/* Three Dots Menu */}
        <button
          style={{
            position: 'absolute',
            top: '56px',
            right: '16px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            fontSize: '20px',
            color: '#111827'
          }}
        >
          ⋮
        </button>
      </div>

      {/* Campaign Info Card */}
      <div style={{
        background: 'white',
        borderRadius: '20px 20px 0 0',
        marginTop: '-20px',
        position: 'relative',
        zIndex: 1,
        padding: '20px 16px'
      }}>
        {/* Campaign Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px'
        }}>
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '800',
              color: '#1e293b',
              marginBottom: '8px',
              margin: 0
            }}>
              Chennai Café Launch
            </h1>

            {/* Status Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              background: '#dcfce7',
              color: '#16a34a',
              marginBottom: '8px'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#16a34a'
              }}/>
              Active
            </div>

            {/* Platform & Date */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                </svg>
              </div>
              <span style={{ fontWeight: '500' }}>Instagram • Oct 24 - Nov 15</span>
            </div>
          </div>

          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: '#9ca3af',
              fontSize: '20px',
              lineHeight: 1
            }}
          >
            ⋮
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '24px',
          borderBottom: '2px solid #f3f4f6',
          marginBottom: '20px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'creators', label: 'Creators' },
            { key: 'content', label: 'Content' },
            { key: 'performance', label: 'Performance' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '15px',
                fontWeight: '600',
                color: activeTab === tab.key ? '#dc2626' : '#9ca3af',
                padding: '12px 0',
                borderBottom: activeTab === tab.key ? '2px solid #dc2626' : '2px solid transparent',
                marginBottom: '-2px',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Budget Section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            fontSize: '32px',
            fontWeight: '800',
            color: '#1e293b',
            marginBottom: '4px'
          }}>
            ₹1,50,000
          </div>
          <div style={{
            fontSize: '13px',
            color: '#6b7280',
            marginBottom: '12px'
          }}>
            Total Budget
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '8px',
            background: '#f3f4f6',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
            <div style={{
              width: '68%',
              height: '100%',
              background: 'linear-gradient(90deg, #fca5a5 0%, #ef4444 100%)',
              borderRadius: '4px'
            }} />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '13px'
          }}>
            <span style={{ color: '#6b7280' }}>₹1,02,000 spent</span>
            <span style={{ fontWeight: '700', color: '#1e293b' }}>68%</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {[
            { value: '8', label: 'Creators' },
            { value: '12', label: 'Deliverables' },
            { value: '3', label: 'Published' }
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                textAlign: 'center',
                padding: '16px 12px',
                background: '#f9fafb',
                borderRadius: '12px'
              }}
            >
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1e293b',
                marginBottom: '4px'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* AI Compliance */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          background: '#fef2f2',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}><UiIcon name="target" /></div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '800',
              color: '#1e293b',
              marginBottom: '2px'
            }}>
              96%
            </div>
            <div style={{
              fontSize: '13px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              AI Compliance
            </div>
          </div>
        </div>

        {/* Campaign Goal */}
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '8px',
            margin: 0
          }}>
            Campaign Goal
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            lineHeight: '1.6',
            margin: 0,
            marginBottom: '16px'
          }}>
            Increase brand awareness and drive foot-fall through Instagram Reels and Stories.
          </p>

          {/* View AI Strategy Button */}
          <button
            onClick={() => navigate(`/business/campaigns/${id}/strategy`)}
            style={{
              width: '100%',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '14px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            View AI Strategy
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav activeItem="campaigns" />
    </div>
  );
}
