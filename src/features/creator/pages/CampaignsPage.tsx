import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, Clapperboard, Search } from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Button, EmptyState } from '../ui';
import { CampaignItem, DueText, Eyebrow, nextDue } from '../campaignParts';
import { inr } from '../format';
import type { Deliverable, Invitation } from '../types';
import '../campaign-ui.css';

type Filter = 'all' | 'active' | 'sign' | 'completed';

const TAKEN = ['accepted', 'contract_pending', 'active', 'completed'];

const TABS: Array<{ key: Filter; label: string; dot?: string }> = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'In progress', dot: '#2fb463' },
  { key: 'sign', label: 'Awaiting contract', dot: '#2c52d6' },
  { key: 'completed', label: 'Completed', dot: '#8b2fd6' },
];

function inFilter(i: Invitation, f: Filter): boolean {
  if (f === 'all') return true;
  if (f === 'active') return i.status === 'active';
  if (f === 'sign') return i.status === 'accepted' || i.status === 'contract_pending';
  return i.status === 'completed';
}

export default function CampaignsPage() {
  const navigate = useNavigate();
  const { invitations, deliverables, ensureDeliverables, payments } = useCreator();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const campaigns = useMemo(() => invitations.filter(i => TAKEN.includes(i.status)), [invitations]);
  useEffect(() => { campaigns.forEach(ensureDeliverables); }, [campaigns, ensureDeliverables]);

  const counts = Object.fromEntries(TABS.map(t => [t.key, campaigns.filter(c => inFilter(c, t.key)).length])) as Record<Filter, number>;

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return campaigns
      .filter(c => inFilter(c, filter) && (!q || `${c.brief.title} ${c.brand}`.toLowerCase().includes(q)))
      .sort((a, b) => (nextDue(a, deliverables[a.id]) ?? '9999').localeCompare(nextDue(b, deliverables[b.id]) ?? '9999'));
  }, [campaigns, filter, query, deliverables]);

  // The single most urgent piece of content across every running campaign.
  const upNext = useMemo(() => {
    let best: { inv: Invitation; item: Deliverable } | null = null;
    campaigns.filter(c => c.status === 'active').forEach(inv => {
      (deliverables[inv.id] ?? []).filter(d => d.status !== 'approved').forEach(item => {
        if (!best || item.dueDate < best.item.dueDate) best = { inv, item };
      });
    });
    return best as { inv: Invitation; item: Deliverable } | null;
  }, [campaigns, deliverables]);

  const allItems = campaigns.flatMap(c => deliverables[c.id] ?? []);
  const delivered = allItems.filter(d => d.status === 'approved').length;
  const upcoming = payments.filter(p => p.status === 'upcoming' || p.status === 'processing' || p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="cx">
      <section className="cx-intro">
        <div>
          <h1 className="cx-intro__title">My campaigns</h1>
          <p className="cx-intro__sub">Every campaign you have taken on, with what you owe the brand and what they owe you.</p>
        </div>
        <div className="cx-intro__stats">
          <div className="cx-kpi"><strong>{campaigns.filter(c => c.status === 'active').length}</strong><span>In progress</span></div>
          <div className="cx-kpi"><strong>{delivered}/{allItems.length}</strong><span>Pieces approved</span></div>
          <div className="cx-kpi"><strong>{inr(upcoming)}</strong><span>Coming to you</span></div>
        </div>
      </section>

      {upNext && (
        <div className="cx-panel" style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', background: 'var(--cr-coral-tint)', borderColor: '#f6d9cf' }}>
          <span className="cx-panel__icon" style={{ background: '#fff' }}><Clapperboard size={18} /></span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Eyebrow>Up next</Eyebrow>
            <div style={{ fontWeight: 700, color: '#18181b' }}>{upNext.item.label}</div>
            <div className="cx-muted" style={{ fontSize: '0.8125rem' }}>{upNext.inv.brief.title} · {upNext.item.format}</div>
          </div>
          <DueText iso={upNext.item.dueDate} />
          <Button small onClick={() => navigate(`/creator/campaigns/${upNext.inv.id}`)}>Open <ArrowRight size={14} /></Button>
        </div>
      )}

      <div className="cx-toolbar" role="tablist" aria-label="Filter campaigns">
        {TABS.map(t => (
          <button
            key={t.key} role="tab" aria-selected={filter === t.key}
            className={`cx-tab${filter === t.key ? ' is-on' : ''}`} onClick={() => setFilter(t.key)}
          >
            {t.dot && <span className="cx-tab__dot" style={{ background: t.dot }} />}
            {t.label} ({counts[t.key]})
          </button>
        ))}
        <div className="cx-toolbar__end">
        <label className="cx-search">
          <Search size={15} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search your campaigns…" aria-label="Search campaigns" />
        </label>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="cx-panel">
          <EmptyState
            icon={Briefcase}
            title={campaigns.length === 0 ? 'No campaigns yet' : 'Nothing matches'}
            text={campaigns.length === 0
              ? 'Accept an invitation to start your first campaign.'
              : 'Try another filter or clear the search.'}
            action={campaigns.length === 0
              ? <Button onClick={() => navigate('/creator/invitations')}>Browse invitations</Button>
              : <Button variant="ghost" onClick={() => { setQuery(''); setFilter('all'); }}>Clear filters</Button>}
          />
        </div>
      ) : (
        <div className="cx-list">
          {shown.map(inv => (
            <CampaignItem key={inv.id} inv={inv} items={deliverables[inv.id]} mode="campaign" onOpen={() => navigate(`/creator/campaigns/${inv.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
