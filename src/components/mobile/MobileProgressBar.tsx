interface MobileProgressBarProps {
  current: number;
  total: number;
  showPercentage?: boolean;
  color?: string;
}

/**
 * Mobile Progress Bar
 * Visual progress indicator with optional percentage
 */
export default function MobileProgressBar({ 
  current, 
  total, 
  showPercentage = true,
  color = '#dc2626'
}: MobileProgressBarProps) {
  const percentage = Math.min(Math.round((current / total) * 100), 100);

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        width: '100%',
        height: '6px',
        background: '#e5e7eb',
        borderRadius: '3px',
        overflow: 'hidden',
        marginBottom: showPercentage ? '6px' : '0'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: color,
          borderRadius: '3px',
          transition: 'width 0.3s ease'
        }} />
      </div>
      {showPercentage && (
        <div style={{
          fontSize: '10px',
          color: '#6b7280',
          textAlign: 'right'
        }}>
          {percentage}% complete
        </div>
      )}
    </div>
  );
}
