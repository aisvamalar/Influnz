import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import PaymentSetupForm from './PaymentSetupForm';
import './business-profile.css';

interface PaymentSetupModalProps {
  open: boolean;
  reason?: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function PaymentSetupModal({ open, reason, onClose, onSaved }: PaymentSetupModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="bp-modal" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bp-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="bp-pay-title">
        <div className="bp-modal__head">
          <div>
            <h2 className="bp-modal__title" id="bp-pay-title">Set up payments</h2>
            <p className="bp-modal__sub">
              {reason ?? 'We need these details once, before your first payment to a creator. They appear on your invoices.'}
            </p>
          </div>
          <button type="button" className="bp-modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <PaymentSetupForm onCancel={onClose} onSaved={onSaved} submitLabel="Save and continue" />
      </div>
    </div>,
    document.body,
  );
}
