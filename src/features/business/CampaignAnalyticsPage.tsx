import { useNavigate } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';

export default function CampaignAnalyticsPage() {
  const navigate = useNavigate();

  return (
    <BusinessLayout breadcrumb="Campaigns / Analytics">
      <div style={{ 
        padding: '32px', 
        maxWidth: '1200px', 
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#111827',
            marginBottom: '8px'
          }}>
            Campaign Analytics
          </h1>
          <p style={{ 
            fontSize: '15px', 
            color: '#6b7280' 
          }}>
            Performance metrics and insights for Chennai Café Launch
          </p>
        </div>

        {/* Progress Steps - All Complete */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '40px',
          padding: '20px',
          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
          borderRadius: '12px',
          border: '2px solid #10b981'
        }}>
          {[
            { num: 1, label: 'Deal Confirmed' },
            { num: 2, label: 'Setup' },
            { num: 3, label: 'Content' },
            { num: 4, label: 'Review' },
            { num: 5, label: 'Payment' },
            { num: 6, label: 'Analytics' }
          ].map((step, idx) => (
            <div key={step.num} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#10b981',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  ✓
                </div>
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: '600',
                  color: '#065f46'
                }}>
                  {step.label}
                </span>
              </div>
              {idx < 5 && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.4 }}>
                  <path d="M6 12L10 8L6 4" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Success Banner */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '16px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
        }}>
          <div style={{
            fontSize: '48px'
          }}>
            🎉
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: 'white',
              marginBottom: '4px'
            }}>
              Campaign Successfully Completed!
            </h2>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0
            }}>
              Payment released • Content published • All milestones achieved
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '20px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'Total Reach', value: '2.4M', change: '+24%', icon: '👥', color: '#3b82f6' },
            { label: 'Engagement', value: '156K', change: '+18%', icon: '❤️', color: '#ec4899' },
            { label: 'Video Views', value: '890K', change: '+32%', icon: '▶️', color: '#8b5cf6' },
            { label: 'ROI', value: '4.2x', change: '+15%', icon: '📈', color: '#10b981' }
          ].map((metric) => (
            <div
              key={metric.label}
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{ 
                fontSize: '32px',
                marginBottom: '12px'
              }}>
                {metric.icon}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                {metric.label}
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '8px'
              }}>
                {metric.value}
              </div>
              <div style={{
                display: 'inline-block',
                padding: '4px 10px',
                background: `${metric.color}15`,
                color: metric.color,
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {metric.change}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {/* Performance Over Time Chart */}
          <div style={{
            background: 'white',
            padding: '28px',
            borderRadius: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '24px'
            }}>
              Performance Over Time
            </h3>
            
            {/* Mock Chart */}
            <div style={{ 
              position: 'relative',
              height: '240px',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '16px',
              paddingTop: '20px'
            }}>
              {[65, 78, 82, 95, 88, 92, 100].map((height, idx) => (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '100%',
                    height: `${height}%`,
                    background: `linear-gradient(180deg, ${idx === 6 ? '#10b981' : '#3b82f6'} 0%, ${idx === 6 ? '#059669' : '#2563eb'} 100%)`,
                    borderRadius: '8px 8px 0 0',
                    position: 'relative',
                    transition: 'all 0.3s'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-24px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {Math.floor(height * 10)}K
                    </div>
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    Day {idx + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div style={{ 
              display: 'flex', 
              gap: '24px',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  background: '#3b82f6'
                }} />
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Views</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  background: '#10b981'
                }} />
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Peak Performance</span>
              </div>
            </div>
          </div>

          {/* Audience Demographics */}
          <div style={{
            background: 'white',
            padding: '28px',
            borderRadius: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '24px'
            }}>
              Audience
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { label: '18-24', value: 35, color: '#3b82f6' },
                { label: '25-34', value: 45, color: '#8b5cf6' },
                { label: '35-44', value: 15, color: '#ec4899' },
                { label: '45+', value: 5, color: '#f59e0b' }
              ].map((demo) => (
                <div key={demo.label}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>
                      {demo.label}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: demo.color }}>
                      {demo.value}%
                    </span>
                  </div>
                  <div style={{
                    height: '8px',
                    background: '#f3f4f6',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${demo.value}%`,
                      height: '100%',
                      background: demo.color,
                      borderRadius: '4px',
                      transition: 'width 0.5s'
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Gender Split */}
            <div style={{
              marginTop: '28px',
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px'
              }}>
                Gender Split
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  flex: 1,
                  padding: '16px',
                  background: '#eff6ff',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>👩</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6' }}>58%</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Female</div>
                </div>
                <div style={{
                  flex: 1,
                  padding: '16px',
                  background: '#f0fdf4',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>👨</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>42%</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Male</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Breakdown */}
        <div style={{
          background: 'white',
          padding: '28px',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          marginBottom: '32px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '24px'
          }}>
            Engagement Breakdown
          </h3>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '20px'
          }}>
            {[
              { label: 'Likes', value: '89.2K', icon: '❤️', percent: 92 },
              { label: 'Comments', value: '12.4K', icon: '💬', percent: 78 },
              { label: 'Shares', value: '8.9K', icon: '↗️', percent: 85 },
              { label: 'Saves', value: '15.3K', icon: '🔖', percent: 88 },
              { label: 'Click Rate', value: '4.2%', icon: '🔗', percent: 95 }
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                  {stat.icon}
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '4px'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '12px'
                }}>
                  {stat.label}
                </div>
                <div style={{
                  height: '4px',
                  background: '#f3f4f6',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${stat.percent}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                    borderRadius: '2px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex',
          gap: '16px',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => navigate('/business/campaigns')}
            style={{
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: '600',
              color: '#6b7280',
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            ← Back to Campaigns
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              style={{
                padding: '14px 24px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#3b82f6',
                background: 'white',
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#eff6ff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'white';
              }}
            >
              Download Report
            </button>
            <button
              onClick={() => navigate('/business/dashboard')}
              style={{
                padding: '14px 28px',
                fontSize: '15px',
                fontWeight: '600',
                color: 'white',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
            >
              Complete Campaign ✓
            </button>
          </div>
        </div>
      </div>
    </BusinessLayout>
  );
}
