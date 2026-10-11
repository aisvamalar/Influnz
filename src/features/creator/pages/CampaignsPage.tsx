import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, Calendar } from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, Button, StatusPill, EmptyState } from '../ui';
import { inr } from '../format';

const ACTIVE_STATES = ['accepted', 'contract_pending', 'active', 'completed'] as const;

export default function CampaignsPage() {
  const navigate = useNavigate();
  const { invitations } = useCreator();

  const campaigns = useMemo(
    () => invitations.filter(i => (ACTIVE_STATES as readonly string[]).includes(i.status)),
    [invitations],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="cr-page-title">Campaigns</h1>
        <p className="cr-page-sub">Track deliverables and progress for every accepted campaign.</p>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <EmptyState
            icon={Briefcase}
            title="No active campaigns yet"
            text="Accept an invitation to start your first campaign."
            action={<Button onClick={() => navigate('/creator/invitations')}>Browse Invitations</Button>}
          />
        </Card>
      ) : (
        <div className="cr-grid cr-grid--2">
          {campaigns.map(c => (
            <Card key={c.id}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--in-charcoal)' }}>{c.brand}</div>
                <StatusPill status={c.status} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: '0.8125rem', color: 'var(--in-gray)', margin: '8px 0 14px' }}>
                <span>{inr(c.agreedRate ?? c.proposedRate)}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Calendar size={13} /> {c.timeline}</span>
              </div>
              <Button variant="ghost" style={{ width: '100%' }} onClick={() => navigate(`/creator/campaigns/${c.id}`)}>
                Open Campaign <ArrowRight size={16} />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
