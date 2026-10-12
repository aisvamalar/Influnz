import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import { ReactNode } from 'react';

interface MobileHeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  rightAction?: ReactNode;
}

/**
 * Mobile Header Component
 * Top bar with back button, title, and optional right actions
 */
export default function MobileHeader({ 
  title, 
  onBack, 
  showBack = true,
  rightAction 
}: MobileHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        {showBack && (
          <button
            onClick={handleBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              color: '#111827'
            }}
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#111827',
          margin: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {title}
        </h1>
      </div>
      {rightAction || (
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            color: '#6b7280'
          }}
          aria-label="More options"
        >
          <MoreVertical size={20} />
        </button>
      )}
    </div>
  );
}
