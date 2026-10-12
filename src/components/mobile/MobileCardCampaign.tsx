import MobileStatusChip from './MobileStatusChip';
import MobileProgressBar from './MobileProgressBar';

interface MobileCardCampaignProps {
  name: string;
  image: string;
  platform: string;
  creators: number;
  status: 'active' | 'pending' | 'completed';
  spent: string;
  budget: string;
  progress: number;
  onClick: () => void;
}

/**
 * Mobile Campaign Card
 * Compact campaign card for list views
 */
export default function MobileCardCampaign({
  name,
  image,
  platform,
  creators,
  status,
  spent,
  budget,
  progress,
  onClick
}: MobileCardCampaignProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '14px',
        border: '1px solid #e5e7eb',
        cursor: 'pointer'
      }}
    >
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <img
          src={image}
          alt={name}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '8px',
            objectFit: 'cover',
            flexShrink: 0
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '4px'
          }}>
            {name}
          </div>
          <div style={{
            fontSize: '11px',
            color: '#6b7280',
            marginBottom: '6px'
          }}>
            {platform} · {creators} creators
          </div>
          <MobileStatusChip status={status} />
        </div>
      </div>

      {progress > 0 && (
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            marginBottom: '6px'
          }}>
            <span style={{ color: '#6b7280' }}>Budget</span>
            <span style={{ fontWeight: '600', color: '#111827' }}>
              {spent} / {budget}
            </span>
          </div>
          <MobileProgressBar 
            current={progress} 
            total={100} 
            color={status === 'active' ? '#16a34a' : '#f59e0b'}
          />
        </>
      )}
    </div>
  );
}
