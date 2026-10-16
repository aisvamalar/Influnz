import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Search } from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Button, EmptyState } from '../ui';
import { CampaignItem } from '../campaignParts';
import { compact, daysUntil, inr } from '../format';
import type { Invitation } from '../types';
import '../campaign-ui.css';

type Filter = 'all' | 'new' | 'in_negotiation' | 'accepted' | 'declined';
type Sort = 'match' | 'payout' | 'deadline';

const TABS: Array<{ key: Filter; label: string; dot?: string }> = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New', dot: '#f0735a' },
  { key: 'in_negotiation', label: 'Negotiating', dot: '#f5a623' },
  { key: 'accepted', label: 'Accepted', dot: '#2fb463' },
  { key: 'declined', label: 'Declined', dot: '#a1a1aa' },
];

const TAKEN = ['accepted', 'contract_pending', 'active', 'completed'];

function matchesFilter(i: Invitation, f: Filter): boolean {
  if (f === 'all') return true;
  if (f === 'accepted') return TAKEN.includes(i.status);
  if (f === 'declined') return i.status === 'declined' || i.status === 'expired';
  return i.status === f;
}

const SORTS: Array<{ key: Sort; label: string }> = [
  { key: 'match', label: 'Best match' },
  { key: 'payout', label: 'Highest payout' },
  { key: 'deadline', label: 'Closest deadline' },
];

export default function InvitationsPage() {
  const navigate = useNavigate();
  const { invitations } = useCreator();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('match');

  const fresh = invitations.filter(i => i.status === 'new');
  const counts = useMemo(
    () => Object.fromEntries(TABS.map(t => [t.key, invitations.filter(i => matchesFilter(i, t.key)).length])) as Record<Filter, number>,
    [invitations],
  );

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = invitations.filter(i => matchesFilter(i, filter)
      && (!q || `${i.brief.title} ${i.brand} ${i.category} ${i.location}`.toLowerCase().includes(q)));
    const byDeadline = (i: Invitation) => i.brief.deliverableSpecs.map(d => d.due).sort()[0] ?? '9999';
    return [...list].sort((a, b) => {
      if (sort === 'payout') return (b.agreedRate ?? b.proposedRate) - (a.agreedRate ?? a.proposedRate);
      if (sort === 'deadline') return byDeadline(a).localeCompare(byDeadline(b));
      return b.matchPct - a.matchPct;
    });
  }, [invitations, filter, query, sort]);

  const best = fresh.reduce((m, i) => Math.max(m, i.matchPct), 0);
  const potential = fresh.reduce((s, i) => s + i.proposedRate, 0);
  const soonest = fresh.map(i => i.brief.deliverableSpecs.map(d => d.due).sort()[0]).filter(Boolean).sort()[0];

  return (
    <div className="cx">
      <section className="cx-intro">
        <div>
          <h1 className="cx-intro__title">Campaign invitations</h1>
          <p className="cx-intro__sub">
            Campaigns brands have published, matched to your topics, audience and rates. Review the brief and accept, negotiate or pass.
          </p>
        </div>
        <div className="cx-intro__stats">
          <div className="cx-kpi"><strong>{fresh.length}</strong><span>New for you</span></div>
          <div className="cx-kpi"><strong>{best ? `${best}%` : '—'}</strong><span>Best match</span></div>
          <div className="cx-kpi"><strong>{potential ? `₹${compact(potential)}` : '—'}</strong><span>Open payouts</span></div>
        </div>
      </section>

      <div className="cx-toolbar" role="tablist" aria-label="Filter invitations">
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
          <input
            value={query} onChange={e => setQuery(e.target.value)} placeholder="Search campaigns, brands…"
            aria-label="Search invitations"
          />
        </label>
        <select className="cx-select" value={sort} onChange={e => setSort(e.target.value as Sort)} aria-label="Sort invitations">
          {SORTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        </div>
      </div>

      {soonest && filter !== 'declined' && fresh.length > 0 && daysUntil(soonest) <= 10 && (
        <p className="cx-muted" style={{ margin: '-6px 0 0', fontSize: '0.8125rem' }}>
          The earliest content deadline in your new invites is in {Math.max(0, daysUntil(soonest))} days, so reply soon. Open payouts total {inr(potential)}.
        </p>
      )}

      {shown.length === 0 ? (
        <div className="cx-panel">
          <EmptyState
            icon={Mail}
            title={invitations.length === 0 ? 'No campaigns published yet' : 'Nothing matches'}
            text={invitations.length === 0
              ? 'When a business publishes a campaign, it appears here with your payout and deliverables.'
              : 'Try another filter or clear the search.'}
            action={query || filter !== 'all' ? <Button variant="ghost" onClick={() => { setQuery(''); setFilter('all'); }}>Clear filters</Button> : undefined}
          />
        </div>
      ) : (
        <div className="cx-list">
          {shown.map(inv => (
            <CampaignItem key={inv.id} inv={inv} mode="invite" onOpen={() => navigate(`/creator/invitations/${inv.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
