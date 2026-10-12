interface MobileStatusChipProps {
  status: 'active' | 'pending' | 'completed' | 'approved' | 'rejected' | 'inreview';
  label?: string;
}

/**
 * Mobile Status Chip
 * Colored badge for status indicators
 */
export default function MobileStatusChip({ status, label }: MobileStatusChipProps) {
  const statusConfig: Record<string, { bg: string; color: string; text: string }> = {
    active: { bg: '#dcfce7', color: '#16a34a', text: 'Active' },
    pending: { bg: '#fef3c7', color: '#f59e0b', text: 'Pending' },
    completed: { bg: '#dbeafe', color: '#2563eb', text: 'Completed' },
    approved: { bg: '#dcfce7', color: '#16a34a', text: 'Approved' },
    rejected: { bg: '#fee2e2', color: '#dc2626', text: 'Rejected' },
    inreview: { bg: '#fef3c7', color: '#f59e0b', text: 'In Review' }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const displayText = label || config.text;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '600',
      background: config.bg,
      color: config.color
    }}>
      {displayText}
    </span>
  );
}
