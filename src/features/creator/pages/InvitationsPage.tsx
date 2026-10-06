import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, MapPin, BadgeCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, Button, StatusPill, EmptyState, Tabs } from '../ui';
import { inr } from '../format';
import type { Invitation } from '../types';

type Filter = 'all' | 'new' | 'in_negotiation' | 'accepted';

const TABS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'in_negotiation', label: 'In Negotiation' },
  { key: 'accepted', label: 'Accepted' },
];

export default function InvitationsPage() {
  const navigate = useNavigate();
  const { invitations } = useCreator();
  const [filter, setFilter] = useState<Filter>('all');

  const counts = useMemo(() => ({
    all: invitations.length,
    new: invitations.filter(i => i.status === 'new').length,
    in_negotiation: invitations.filter(i => i.status === 'in_negotiation').length,
    accepted: invitations.filter(i => i.status === 'accepted' || i.status === 'contract_pending').length,
  }), [invitations]);

  const filtered = useMemo(() => {
    if (filter === 'all') return invitations;
    if (filter === 'accepted') return invitations.filter(i => i.status === 'accepted' || i.status === 'contract_pending');
    return invitations.filter(i => i.status === filter);
  }, [invitations, filter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="cr-page-title">Campaign Invitations</h1>
        <p className="cr-page-sub">Opportunities matched to your audience and content style.</p>
      </div>

      <Tabs
        tabs={TABS.map(t => ({ ...t, count: counts[t.key] }))}
        active={filter}
        onChange={setFilter}
      />

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={Mail} title="Nothing here yet" text="We're continuously matching you with brands that fit your profile." />
        </Card>
      ) : (
        <div className="cr-grid cr-grid--2">
          {filtered.map(inv => <InvitationCard key={inv.id} inv={inv} onOpen={() => navigate(`/creator/invitations/${inv.id}`)} />)}
        </div>
      )}
    </div>
  );
}

function InvitationCard({ inv, onOpen }: { inv: Invitation; onOpen: () => void }) {
  return (
    <Card>
      {inv.selectedForYou && (
        <span className="cr-chip cr-chip--static" style={{ background: 'rgba(242,132,107,0.1)', borderColor: 'var(--in-coral)', color: 'var(--in-coral-text)', marginBottom: 12 }}>
          <Sparkles size={13} /> Selected for you
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--in-charcoal)' }}>{inv.brand}</span>
            {inv.brandVerified && <BadgeCheck size={16} style={{ color: 'var(--in-coral-text)' }} />}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: '0.8125rem', color: 'var(--in-gray)', marginTop: 4 }}>
            <span>{inv.category}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {inv.location}</span>
          </div>
        </div>
        <StatusPill status={inv.status} />
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '14px 0' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--in-charcoal)' }}>{inr(inv.agreedRate ?? inv.proposedRate)}</span>
        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--in-success)' }}>{inv.matchPct}% match</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {inv.deliverables.map((d, i) => (
          <span key={i} className="cr-chip cr-chip--static" style={{ fontSize: '0.75rem' }}>{d}</span>
        ))}
      </div>

      <Button style={{ width: '100%' }} onClick={onOpen}>View Details <ArrowRight size={16} /></Button>
    </Card>
  );
}
