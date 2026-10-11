import { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import './mobile-row-menu.css';

/**
 * Kebab (⋮) action menu for list rows and cards.
 * Clicks inside never bubble to the row, so rows can stay clickable.
 */
export interface MobileRowMenuItem {
  label: string;
  onSelect: () => void;
  danger?: boolean;
}

interface MobileRowMenuProps {
  label: string;
  items: MobileRowMenuItem[];
  className?: string;
}

export default function MobileRowMenu({ label, items, className }: MobileRowMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className={className ? `mrm ${className}` : 'mrm'}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="mrm__btn"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <MoreVertical size={18} />
      </button>
      {open && (
        <div className="mrm__list" role="menu">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className={`mrm__item${item.danger ? ' mrm__item--danger' : ''}`}
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
