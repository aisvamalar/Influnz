/**
 * Shared building blocks for the mobile campaign workspace screens.
 */
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowLeft, EllipsisVertical, X } from 'lucide-react';
import logoImg from '../../../assets/logo.png';
import type { CreatorData } from '../campaignWorkspaceData';
import { avatarUrl, creatorInitials } from './workspaceUtils';

export interface MenuAction {
  label: string;
  onSelect: () => void;
  icon?: ReactNode;
  danger?: boolean;
}

export interface CreatorAvatarProps {
  creator: CreatorData;
  size: number;
  className?: string;
}

/** Round creator photo, falling back to initials when the photo can't load. */
export function CreatorAvatar({ creator, size, className = '' }: CreatorAvatarProps) {
  const src = avatarUrl(creator, size * 2);
  const [failed, setFailed] = useState(false);
  const sizeVar = { '--mws-size': `${size}px` } as CSSProperties;

  if (!src || failed) {
    return (
      <span className={`mws-avatar mws-avatar--initials ${className}`} style={sizeVar} aria-hidden="true">
        {creatorInitials(creator.name)}
      </span>
    );
  }
  return (
    <img
      className={`mws-avatar ${className}`}
      style={sizeVar}
      src={src}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export interface StatusPillProps {
  tone: 'green' | 'amber' | 'blue' | 'grey' | 'coral';
  children: ReactNode;
}

export function StatusPill({ tone, children }: StatusPillProps) {
  return <span className={`mws-pill mws-pill--${tone}`}>{children}</span>;
}

export interface WorkspaceTopBarProps {
  onBack: () => void;
  menu: MenuAction[];
}

/** Back, brand and an overflow menu. */
export function WorkspaceTopBar({ onBack, menu }: WorkspaceTopBarProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
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
    <header className="mws-top">
      <button type="button" className="mws-circle" aria-label="Back" onClick={onBack}>
        <ArrowLeft size={20} strokeWidth={2} />
      </button>
      <div className="mws-top__brand">
        <img src={logoImg} alt="Influnz" className="mws-top__logo" />
        <span className="mws-top__badge">BUSINESS</span>
      </div>
      <div className="mws-menu-wrap" ref={wrapRef}>
        <button
          type="button"
          className="mws-circle"
          aria-label="More options"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <EllipsisVertical size={20} strokeWidth={2} />
        </button>
        {open && (
          <div className="mws-menu" role="menu">
            {menu.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                className={`mws-menu__item${item.danger ? ' mws-menu__item--danger' : ''}`}
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

export interface SheetProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

/** Bottom sheet. The dialog role sits on the full-screen layer because mobile-responsive.css stretches [role="dialog"]. */
export function Sheet({ title, onClose, children, footer }: SheetProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="mws-sheet" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button type="button" className="mws-sheet__scrim" aria-label="Close" tabIndex={-1} onClick={onClose} />
      <div className="mws-sheet__panel" ref={panelRef} tabIndex={-1}>
        <span className="mws-sheet__grip" aria-hidden="true" />
        <div className="mws-sheet__head">
          <h2 id={titleId} className="mws-sheet__title">
            {title}
          </h2>
          <button type="button" className="mws-sheet__close" aria-label="Close" onClick={onClose}>
            <X size={18} strokeWidth={2} />
          </button>
        </div>
        <div className="mws-sheet__body">{children}</div>
        {footer && <div className="mws-sheet__foot">{footer}</div>}
      </div>
    </div>
  );
}

export interface ActionSheetProps {
  title: string;
  actions: MenuAction[];
  onClose: () => void;
}

export function ActionSheet({ title, actions, onClose }: ActionSheetProps) {
  return (
    <Sheet title={title} onClose={onClose}>
      <ul className="mws-actions">
        {actions.map((a) => (
          <li key={a.label}>
            <button
              type="button"
              className={`mws-actions__item${a.danger ? ' mws-actions__item--danger' : ''}`}
              onClick={() => {
                onClose();
                a.onSelect();
              }}
            >
              <span className="mws-actions__icon">{a.icon}</span>
              {a.label}
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}

export interface RequestSheetProps {
  creator: CreatorData;
  /** Deliverable to pre-select; omit to request new content. */
  initialId?: string;
  onClose: () => void;
  onSent: (message: string) => void;
}

/** Ask a creator for a revision of a deliverable, or for additional content. */
export function RequestSheet({ creator, initialId, onClose, onSent }: RequestSheetProps) {
  const [target, setTarget] = useState(initialId ?? 'new');
  const [note, setNote] = useState('');
  const noteId = useId();
  const options = [
    ...creator.contentDeliverables.map((d) => ({ id: d.id, label: d.title })),
    { id: 'new', label: 'New content' },
  ];

  const send = () => {
    const picked = creator.contentDeliverables.find((d) => d.id === target);
    onSent(picked ? `Revision requested for “${picked.title}”` : `Content request sent to ${creator.name}`);
    onClose();
  };

  return (
    <Sheet
      title="Add / Request revision"
      onClose={onClose}
      footer={
        <button type="button" className="mws-btn mws-btn--primary mws-btn--block" disabled={!note.trim()} onClick={send}>
          Send request
        </button>
      }
    >
      <p className="mws-sheet__label">What is this about?</p>
      <div className="mws-choice" role="radiogroup" aria-label="Request for">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={target === o.id}
            className={`mws-choice__item${target === o.id ? ' is-active' : ''}`}
            onClick={() => setTarget(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
      <label className="mws-sheet__label" htmlFor={noteId}>
        Message to {creator.name}
      </label>
      <textarea
        id={noteId}
        className="mws-textarea"
        rows={4}
        placeholder={target === 'new' ? 'Describe the extra content you need…' : 'What should be changed?'}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    </Sheet>
  );
}
