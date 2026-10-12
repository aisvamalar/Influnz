import MobileStatusChip from './MobileStatusChip';

interface MobileCardCreatorProps {
  name: string;
  avatar: string;
  platform: 'instagram' | 'youtube';
  followers: string;
  engagement: string;
  status?: 'approved' | 'pending' | 'inreview';
  delivered?: number;
  total?: number;
  onClick: () => void;
}

/**
 * Mobile Creator Card
 * Compact creator card for list views
 */
export default function MobileCardCreator({
  name,
  avatar,
  platform,
  followers,
  engagement,
  status,
  delivered,
  total,
  onClick
}: MobileCardCreatorProps) {
  const platformColor = platform === 'instagram' ? '#E4405F' : '#FF0000';
  const platformLabel = platform === 'instagram' ? 'IG' : 'YT';

  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '14px',
        border: '1px solid #e5e7eb',
        cursor: 'pointer',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start'
      }}
    >
      <div style={{ position: 'relative' }}>
        <img
          src={avatar}
          alt={name}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          right: '-2px',
          background: platformColor,
          borderRadius: '50%',
          width: '18px',
          height: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid white',
          fontSize: '8px',
          fontWeight: '700',
          color: 'white'
        }}>
          {platformLabel}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {name}
        </div>
        <div style={{
          fontSize: '11px',
          color: '#6b7280',
          marginBottom: '6px'
        }}>
          {followers} · {engagement} engagement
        </div>
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          {status && <MobileStatusChip status={status} />}
          {delivered !== undefined && total !== undefined && (
            <span style={{
              fontSize: '10px',
              color: '#6b7280'
            }}>
              {delivered}/{total} delivered
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
