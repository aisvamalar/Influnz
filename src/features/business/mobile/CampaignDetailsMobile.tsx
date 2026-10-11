import { useNavigate, useParams } from 'react-router-dom';
import MobileLayout from '../../../components/mobile/MobileLayout';
import MobileHeader from '../../../components/mobile/MobileHeader';
import MobileStatusChip from '../../../components/mobile/MobileStatusChip';
import MobileProgressBar from '../../../components/mobile/MobileProgressBar';
import { Calendar, DollarSign, Users, Target, Sparkles } from 'lucide-react';

/**
 * Campaign Details - Mobile View (Screen 3 from reference)
 * Campaign cover, status, stats, creator count, AI strategy action
 */
export default function CampaignDetailsMobile() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - would come from API
  const campaign = {
    name: 'Chennai Café Launch',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=400&fit=crop',
    status: 'active' as const,
    platform: 'Instagram',
    startDate: '1 Sep 2024',
    endDate: '30 Sep 2024',
    budget: '₹1,50,000',
    spent: '₹1,02,000',
    progress: 68,
    creators: { total: 8, accepted: 5, pending: 2, declined: 1 },
    goal: 'Drive foot traffic and awareness for the new café launch in Chennai with authentic local creator content'
  };

  return (
    <MobileLayout>
      <MobileHeader title="Campaign Details" />

      {/* Campaign Cover Image */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '200px',
        overflow: 'hidden'
      }}>
        <img
          src={campaign.image}
          alt={campaign.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px'
        }}>
          <MobileStatusChip status={campaign.status} />
        </div>
      </div>

      {/* Campaign Info */}
      <div style={{ padding: '16px' }}>
        {/* Title & Platform */}
        <div style={{ marginBottom: '16px' }}>
          <h1 style={{
            fontSize: '22px',
            fontWeight: '800',
            color: '#111827',
            marginBottom: '6px',
            margin: 0
          }}>
            {campaign.name}
          </h1>
          <div style={{
            fontSize: '13px',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            {campaign.platform}
          </div>
        </div>

        {/* Date Range */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '14px',
          border: '1px solid #e5e7eb',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#fef2f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={18} color="#dc2626" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '11px',
              color: '#6b7280',
              marginBottom: '2px'
            }}>
              Duration
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#111827'
            }}>
              {campaign.startDate} - {campaign.endDate}
            </div>
          </div>
        </div>

        {/* Budget & Spending */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '14px',
          border: '1px solid #e5e7eb',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={18} color="#dc2626" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '11px',
                color: '#6b7280',
                marginBottom: '2px'
              }}>
                Total Budget
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '800',
                color: '#111827'
              }}>
                {campaign.budget}
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            marginBottom: '8px'
          }}>
            <span style={{ color: '#6b7280' }}>Spent</span>
            <span style={{ fontWeight: '700', color: '#111827' }}>
              {campaign.spent}
            </span>
          </div>
          
          <MobileProgressBar 
            current={campaign.progress} 
            total={100}
            color="#16a34a"
          />
        </div>

        {/* Creators Stats */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '14px',
          border: '1px solid #e5e7eb',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '14px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={18} color="#dc2626" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '11px',
                color: '#6b7280',
                marginBottom: '2px'
              }}>
                Creators
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '800',
                color: '#111827'
              }}>
                {campaign.creators.total}
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#16a34a',
                marginBottom: '2px'
              }}>
                {campaign.creators.accepted}
              </div>
              <div style={{
                fontSize: '10px',
                color: '#6b7280'
              }}>
                Accepted
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#f59e0b',
                marginBottom: '2px'
              }}>
                {campaign.creators.pending}
              </div>
              <div style={{
                fontSize: '10px',
                color: '#6b7280'
              }}>
                Pending
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#dc2626',
                marginBottom: '2px'
              }}>
                {campaign.creators.declined}
              </div>
              <div style={{
                fontSize: '10px',
                color: '#6b7280'
              }}>
                Declined
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Goal */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '14px',
          border: '1px solid #e5e7eb',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target size={18} color="#dc2626" />
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#111827'
            }}>
              Campaign Goal
            </div>
          </div>
          <p style={{
            fontSize: '13px',
            color: '#4b5563',
            lineHeight: '1.5',
            margin: 0
          }}>
            {campaign.goal}
          </p>
        </div>

        {/* AI Strategy Button */}
        <button
          onClick={() => navigate(`/business/campaigns/${id}/ai-strategy`)}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #dc6b5f 0%, #d14538 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '14px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '12px',
            boxShadow: '0 4px 12px rgba(220,107,95,0.3)'
          }}
        >
          <Sparkles size={18} />
          View AI Strategy
        </button>

        {/* View Creators Button */}
        <button
          onClick={() => navigate(`/business/campaigns/${id}/content`)}
          style={{
            width: '100%',
            background: 'white',
            color: '#111827',
            border: '2px solid #e5e7eb',
            borderRadius: '10px',
            padding: '14px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          View Creators & Content
        </button>
      </div>
    </MobileLayout>
  );
}
