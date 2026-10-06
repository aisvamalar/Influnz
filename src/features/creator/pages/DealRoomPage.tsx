import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Handshake, ShieldCheck, Clock, RefreshCw, Calendar, X, ArrowRight, CheckCircle2,
} from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, Button, StatusPill, EmptyState } from '../ui';
import { inr } from '../format';

export default function DealRoomPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { getInvitation, ensureContract } = useCreator();
  const inv = getInvitation(id);

  useEffect(() => { if (inv) ensureContract(inv); }, [inv, ensureContract]);

  if (!inv) {
    return (
      <Card>
        <EmptyState icon={X} title="Deal not found" text="This deal is no longer available."
          action={<Button variant="ghost" onClick={() => navigate('/creator/invitations')}>Back to Invitations</Button>} />
      </Card>
    );
  }

  const rate = inv.agreedRate ?? inv.proposedRate;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <button className="cr-nav-link" style={{ width: 'auto', padding: '6px 10px', color: 'var(--in-gray)' }} onClick={() => navigate(`/creator/invitations/${inv.id}`)}>
        <ArrowLeft size={16} /> Back to Invitation
      </button>

      <div>
        <h1 className="cr-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Handshake size={22} style={{ color: 'var(--in-coral-text)' }} /> Deal Room · {inv.brand}
        </h1>
        <p className="cr-page-sub">Review the final agreed terms before signing the contract.</p>
      </div>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--in-charcoal)' }}>{inr(rate)}</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--in-gray)' }}>agreed rate</span>
          </div>
          <StatusPill status={inv.status} />
        </div>

        <div className="cr-card__title" style={{ marginBottom: 10 }}>Deliverables</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {inv.deliverables.map((d, i) => <span key={i} className="cr-chip cr-chip--static">{d}</span>)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem' }}>
          <TermRow icon={Calendar} label="Timeline" value={inv.timeline} />
          <TermRow icon={ShieldCheck} label="Usage rights" value={inv.usageRights} />
          <TermRow icon={Clock} label="Exclusivity" value={`${inv.exclusivityDays} days`} />
          <TermRow icon={RefreshCw} label="Revisions" value={String(inv.revisions)} />
          <TermRow icon={ShieldCheck} label="Payment" value={inv.paymentProtected ? 'Protected in escrow' : 'Standard'} />
        </div>
      </Card>

      <Card style={{ background: 'linear-gradient(135deg, rgba(124,196,164,0.12), rgba(90,155,212,0.08))', border: '1px solid rgba(124,196,164,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', color: 'var(--in-charcoal)' }}>
          <CheckCircle2 size={18} style={{ color: 'var(--in-success)' }} />
          <span>Both parties have agreed. Generate and sign the contract to start the campaign.</span>
        </div>
      </Card>

      <div className="cr-onboarding__actions" style={{ justifyContent: 'flex-end' }}>
        <Button onClick={() => navigate(`/creator/contract/${inv.id}`)}>
          Proceed to Contract <ArrowRight size={16} />
        </Button>
      </div>
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
