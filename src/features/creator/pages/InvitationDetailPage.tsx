import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, BadgeCheck, MapPin, Calendar, ShieldCheck, Sparkles,
  Check, X, MessageSquare, Target, RefreshCw, Clock,
} from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, Button, StatusPill, ProgressBar, Toast, EmptyState } from '../ui';
import { inr } from '../format';
import type { MatchBreakdown } from '../types';

const MATCH_LABELS: Record<keyof MatchBreakdown, string> = {
  audience: 'Audience fit',
  location: 'Location match',
  category: 'Category match',
  performance: 'Performance',
  rate: 'Rate alignment',
};

export default function InvitationDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { getInvitation, updateInvitation } = useCreator();
  const inv = getInvitation(id);
  const [toast, setToast] = useState<string | null>(null);

  if (!inv) {
    return (
      <Card>
        <EmptyState icon={X} title="Invitation not found" text="This invitation may have expired or been removed."
          action={<Button variant="ghost" onClick={() => navigate('/creator/invitations')}>Back to Invitations</Button>} />
      </Card>
    );
  }

  const flash = (msg: string) => { setToast(msg); window.setTimeout(() => setToast(null), 2600); };

  const accept = () => {
    updateInvitation(inv.id, { status: 'accepted', agreedRate: inv.agreedRate ?? inv.proposedRate });
    flash('Offer accepted — opening Deal Room');
    window.setTimeout(() => navigate(`/creator/deal/${inv.id}`), 700);
  };

  const decline = () => {
    updateInvitation(inv.id, { status: 'declined' });
    flash('Invitation declined');
    window.setTimeout(() => navigate('/creator/invitations'), 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <button className="cr-nav-link" style={{ width: 'auto', padding: '6px 10px', color: 'var(--in-gray)' }} onClick={() => navigate('/creator/invitations')}>
        <ArrowLeft size={16} /> Back to Invitations
      </button>

      {/* Header */}
      <Card>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            {inv.selectedForYou && (
              <span className="cr-chip cr-chip--static" style={{ background: 'rgba(242,132,107,0.1)', borderColor: 'var(--in-coral)', color: 'var(--in-coral-text)', marginBottom: 10 }}>
                <Sparkles size={13} /> Selected for you
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--in-charcoal)' }}>{inv.brand}</span>
              {inv.brandVerified && <BadgeCheck size={20} style={{ color: 'var(--in-coral-text)' }} />}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: '0.8125rem', color: 'var(--in-gray)', marginTop: 6 }}>
              <span>{inv.category}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {inv.location}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> {inv.timeline}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <StatusPill status={inv.status} />
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--in-charcoal)', marginTop: 8 }}>{inr(inv.agreedRate ?? inv.proposedRate)}</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--in-success)' }}>{inv.matchPct}% match</div>
          </div>
        </div>
      </Card>

      <div className="cr-grid cr-grid--2">
        {/* Objective + why selected */}
        <Card>
          <div className="cr-card__title" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Target size={18} style={{ color: 'var(--in-coral-text)' }} /> Campaign Objective
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--in-charcoal)', lineHeight: 1.55 }}>{inv.objective}</p>
          <div className="cr-card__title" style={{ margin: '18px 0 10px' }}>Why you were selected</div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
            {inv.whySelected.map((w, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', color: 'var(--in-charcoal)' }}>
                <Check size={16} style={{ color: 'var(--in-success)', flexShrink: 0 }} /> {w}
              </li>
            ))}
          </ul>
        </Card>

        {/* Match breakdown */}
        <Card>
          <div className="cr-card__title" style={{ marginBottom: 14 }}>Match Breakdown</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(Object.keys(MATCH_LABELS) as (keyof MatchBreakdown)[]).map(key => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--in-gray)' }}>{MATCH_LABELS[key]}</span>
                  <span style={{ fontWeight: 700, color: 'var(--in-charcoal)' }}>{inv.matchBreakdown[key]}%</span>
                </div>
                <ProgressBar value={inv.matchBreakdown[key]} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Deliverables + terms */}
      <div className="cr-grid cr-grid--2">
        <Card>
          <div className="cr-card__title" style={{ marginBottom: 12 }}>Deliverables</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {inv.deliverables.map((d, i) => <span key={i} className="cr-chip cr-chip--static">{d}</span>)}
          </div>
        </Card>
        <Card>
          <div className="cr-card__title" style={{ marginBottom: 12 }}>Terms</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem' }}>
            <TermRow icon={ShieldCheck} label="Usage rights" value={inv.usageRights} />
            <TermRow icon={Clock} label="Exclusivity" value={`${inv.exclusivityDays} days`} />
            <TermRow icon={RefreshCw} label="Revisions" value={String(inv.revisions)} />
            <TermRow icon={ShieldCheck} label="Payment" value={inv.paymentProtected ? 'Protected in escrow' : 'Standard'} />
          </div>
        </Card>
      </div>

      {/* Actions */}
      {(inv.status === 'new' || inv.status === 'in_negotiation') && (
        <Card>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <Button onClick={accept} style={{ flex: 1, minWidth: 140 }}><Check size={16} /> Accept Offer</Button>
            <Button variant="ghost" onClick={() => navigate(`/creator/negotiation/${inv.id}`)} style={{ flex: 1, minWidth: 140 }}>
              <MessageSquare size={16} /> Negotiate with AI
            </Button>
            <Button variant="danger" onClick={decline} style={{ flex: 1, minWidth: 140 }}><X size={16} /> Decline</Button>
          </div>
        </Card>
      )}

      {toast && <Toast message={toast} icon={Check} />}
    </div>
  );
}

function TermRow({ icon: Icon, label, value }: { icon: typeof ShieldCheck; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon size={16} style={{ color: 'var(--in-gray)', flexShrink: 0 }} />
      <span style={{ color: 'var(--in-gray)' }}>{label}</span>
      <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--in-charcoal)', textAlign: 'right' }}>{value}</span>
    </div>
  );
}
