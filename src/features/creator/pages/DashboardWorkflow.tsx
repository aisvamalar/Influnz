/**
 * Campaign workflow: one campaign from invitation to payment. Each step reads its state
 * from what the creator actually has (status, negotiation messages, contract,
 * deliverables, payments). The Negotiation step only appears when the rate was actually
 * negotiated; a straight accept goes invitation → contract.
 *
 * Three layouts, picked from the panel's own width:
 * - canvas   (wide)   flow chart: invitation (and negotiation) on the left, contract over
 *                     content in the middle, payout on the right, dashed connectors
 * - board    (medium) two or three columns, connectors follow the reading order
 * - timeline (phone)  vertical rail; the current step is open and any step opens on tap
 * Connectors are drawn in one SVG from the measured step positions, so they stay
 * attached whatever the content height or zoom.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, Check, ChevronDown, CircleDashed, Clapperboard, Clock, Clock3, FileText,
  HandCoins, Maximize2, MessagesSquare, Plus, SquarePlay, Wallet, Workflow, X,
} from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { dueLabel, inr, shortDate } from '../format';
import type { Deliverable, DeliverableStatus, Invitation, InvitationStatus, NegotiationMessage } from '../types';
import { Chip, EmptyNote, dueTone, type Tone } from './dashboardBits';

type NodeKey = 'invite' | 'negotiate' | 'contract' | 'content' | 'payment';
type NodeState = 'done' | 'current' | 'next' | 'stopped';
type Mode = 'canvas' | 'board' | 'timeline';
type ButtonLook = 'primary' | 'outline';

interface FlowNode {
  key: NodeKey;
  title: string;
  state: NodeState;
  chip: { label: string; tone: Tone };
  summary: string;
  body: ReactNode;
  action?: { label: string; to: string };
}

/** How far along each invitation status is: 0 invitation … 4 paid out, -1 closed. */
const STEP: Record<InvitationStatus, number> = {
  new: 0, in_negotiation: 1, accepted: 2, contract_pending: 2, active: 3, completed: 4, declined: -1, expired: -1,
};

const DELIVERABLE: Record<DeliverableStatus, { label: string; tone: 'ok' | 'wait' | 'off' | 'bad' }> = {
  not_started: { label: 'Pending', tone: 'off' },
  uploaded: { label: 'Submitted', tone: 'wait' },
  pending_approval: { label: 'In review', tone: 'wait' },
  changes_requested: { label: 'Changes', tone: 'bad' },
  approved: { label: 'Approved', tone: 'ok' },
};

const KEYS: NodeKey[] = ['invite', 'negotiate', 'contract', 'content', 'payment'];

const NODE_COLOR: Record<NodeKey, string> = {
  invite: '#f39a72', negotiate: '#f5a35c', contract: '#4cc07f', content: '#62a8f0', payment: '#f07aa6',
};

/**
 * A negotiation happened once someone moved off the brand's first offer. Opening the
 * chat alone (which shows the brand's opening message) does not count.
 */
function wasNegotiated(inv: Invitation, messages: NegotiationMessage[]): boolean {
  if (inv.status === 'in_negotiation') return true;
  if (messages.some(m => m.sender === 'creator' || m.sender === 'creator_ai')) return true;
  return inv.agreedRate !== undefined && inv.agreedRate !== inv.proposedRate;
}

type CheckItem = { label: string; ok: boolean | 'wait' | 'off' };

function Rows({ rows }: { rows: Array<[string, ReactNode]> }) {
  return (
    <dl className="chd-rows">
      {rows.map(([k, v]) => (
        <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
      ))}
    </dl>
  );
}

function Checks({ items }: { items: CheckItem[] }) {
  return (
    <ul className="chd-checks">
      {items.map(item => (
        <li key={item.label} className={`is-${item.ok === true ? 'ok' : item.ok === false ? 'no' : item.ok}`}>
          <span aria-hidden="true">
            {item.ok === true ? <Check size={10} strokeWidth={3.2} /> : item.ok === false ? <X size={10} strokeWidth={3.2} />
              : item.ok === 'wait' ? <Clock size={10} strokeWidth={2.8} /> : <CircleDashed size={12} />}
          </span>
          {item.label}
        </li>
      ))}
    </ul>
  );
}

function Lead({ icon, children, round }: { icon: ReactNode; children: ReactNode; round?: boolean }) {
  return (
    <div className="chd-lead">
      <span className={`chd-glyph${round ? ' is-round' : ''}`} aria-hidden="true">{icon}</span>
      {children}
    </div>
  );
}

function last<T>(list: T[]): T | undefined {
  return list[list.length - 1];
}

/** "Instagram Reel" ×3 → "3 Reels"; mixed formats → "4 pieces". */
function deliverableSummary(inv: Invitation): string {
  const specs = inv.brief.deliverableSpecs;
  const total = specs.reduce((n, s) => n + s.count, 0);
  if (specs.length === 1) {
    const word = specs[0].format.split(' ').pop() ?? 'piece';
    return `${total} ${word}${total === 1 || word.endsWith('s') ? '' : 's'}`;
  }
  return `${total} pieces`;
}

/** "2026-10-18" → "18 Oct 2026" */
function fullDate(iso: string): string {
  const year = iso.slice(0, 4);
  return /^\d{4}$/.test(year) ? `${shortDate(iso)} ${year}` : shortDate(iso);
}

function duration(from: string, to: string): string {
  const a = Date.parse(`${from}T00:00:00`);
  const b = Date.parse(`${to}T00:00:00`);
  if (Number.isNaN(a) || Number.isNaN(b) || b < a) return '—';
  const days = Math.round((b - a) / 86400000) + 1;
  if (days >= 14) return `${Math.round(days / 7)} weeks`;
  return `${days} day${days === 1 ? '' : 's'}`;
}

function nodesFor(inv: Invitation, ctx: {
  negotiated: boolean;
  messages: NegotiationMessage[];
  signedBy?: string;
  signedAt?: string;
  items: Deliverable[];
  paymentStatus?: string;
}): FlowNode[] {
  const step = STEP[inv.status];
  const closed = step < 0;
  const rate = inv.agreedRate ?? inv.proposedRate;
  const pieces = inv.brief.deliverableSpecs.reduce((n, s) => n + s.count, 0);

  // 1 · Invitation. Accept, negotiate or decline happens here; once a negotiation
  // starts, that step takes over as the current one.
  const deciding = step === 0 && !ctx.negotiated;
  const invite: FlowNode = {
    key: 'invite',
    title: 'Campaign invitation',
    state: closed ? 'stopped' : deciding ? 'current' : 'done',
    chip: closed ? { label: inv.status === 'declined' ? 'Declined' : 'Expired', tone: 'grey' }
      : deciding ? { label: 'New', tone: 'coral' }
        : step <= 1 ? { label: 'Received', tone: 'green' } : { label: 'Accepted', tone: 'green' },
    summary: closed
      ? (inv.status === 'declined' ? 'You declined this invitation' : 'This invitation expired')
      : deciding ? `${inr(inv.proposedRate)} · accept, negotiate or decline` : `${inv.brand} · ${inr(inv.proposedRate)}`,
    body: (
      <>
        <div className="chd-brandbox">
          {inv.image ? <img src={inv.image} alt="" /> : <span className="chd-brandbox__ph" aria-hidden="true">{inv.brand[0]}</span>}
          <span>
            <strong>{inv.brand}{inv.brandVerified && <BadgeCheck size={13} aria-label="Verified brand" />}</strong>
            <small>{inv.brief.title}</small>
          </span>
        </div>
        <ul className="chd-facts">
          <li><HandCoins size={15} aria-hidden="true" /><span>Offer</span><b>{inr(inv.proposedRate)}</b></li>
          <li><Clapperboard size={15} aria-hidden="true" /><span>Deliverables</span><b>{deliverableSummary(inv)}</b></li>
          <li><Clock3 size={15} aria-hidden="true" /><span>Timeline</span><b>{duration(inv.brief.startDate, inv.brief.endDate)}</b></li>
        </ul>
      </>
    ),
    action: { label: deciding ? 'Review offer' : 'View details', to: `/creator/invitations/${inv.id}` },
  };

  // 2 · Negotiation, only when the rate was actually negotiated.
  const offers = ctx.messages.filter(m => m.offer !== undefined && m.sender !== 'system');
  const firstOffer = offers.find(m => m.sender === 'brand')?.offer ?? inv.proposedRate;
  const brandOffer = last(offers.filter(m => m.sender === 'brand'))?.offer;
  const myOffer = last(offers.filter(m => m.sender === 'creator' || m.sender === 'creator_ai'))?.offer;
  const lastSpeaker = last(ctx.messages.filter(m => m.sender !== 'system'))?.sender;
  const chat = <MessagesSquare size={17} strokeWidth={1.8} />;
  let negotiate: FlowNode | null = null;
  if (ctx.negotiated && closed) {
    negotiate = {
      key: 'negotiate', title: 'Negotiation', state: 'stopped',
      chip: { label: 'Ended', tone: 'grey' },
      summary: 'Nothing was agreed',
      body: (
        <>
          <Lead icon={chat} round><Chip tone="grey">No agreement</Chip></Lead>
          <Rows rows={[
            ['First offer', inr(firstOffer)],
            ['Your last offer', myOffer ? inr(myOffer) : '—'],
          ]} />
        </>
      ),
      action: { label: 'View negotiation', to: `/creator/negotiation/${inv.id}` },
    };
  } else if (ctx.negotiated && step <= 1) {
    // Your agent matching the brand's latest offer is a recommendation to accept: your call.
    const recommends = myOffer !== undefined && brandOffer !== undefined && myOffer <= brandOffer;
    const waiting = lastSpeaker !== 'brand' && !recommends;
    negotiate = {
      key: 'negotiate', title: 'Negotiation', state: 'current',
      chip: waiting ? { label: 'Awaiting brand', tone: 'amber' } : { label: 'Your approval', tone: 'amber' },
      summary: myOffer ? `Your offer ${inr(myOffer)}` : 'Talking terms with the brand',
      body: (
        <>
          <Lead icon={chat} round><Chip tone="amber">{waiting ? 'Awaiting brand reply' : 'Awaiting your approval'}</Chip></Lead>
          <Rows rows={[
            ['Brand offer', inr(brandOffer ?? inv.proposedRate)],
            ['Your offer', myOffer ? inr(myOffer) : '—'],
            ['Brand response', waiting ? 'Pending' : 'Replied'],
          ]} />
        </>
      ),
      action: { label: 'View negotiation', to: `/creator/negotiation/${inv.id}` },
    };
  } else if (ctx.negotiated) {
    const gain = rate - firstOffer;
    negotiate = {
      key: 'negotiate', title: 'Negotiation', state: 'done',
      chip: { label: 'Agreed', tone: 'green' },
      summary: gain > 0 ? `Agreed at ${inr(rate)} · +${inr(gain)}` : `Agreed at ${inr(rate)}`,
      body: (
        <>
          <Lead icon={chat} round><Chip tone="green">Terms agreed</Chip></Lead>
          <Rows rows={[
            ['First offer', inr(firstOffer)],
            ['Agreed rate', inr(rate)],
            gain > 0
              ? ['Raised by', <span key="gain" className="chd-gain">+{inr(gain)}</span>]
              : ['Rounds', String(Math.max(1, offers.length - 1))],
          ]} />
        </>
      ),
      action: { label: 'View negotiation', to: `/creator/negotiation/${inv.id}` },
    };
  }

  // 3 · Contract
  const signed = step >= 3 || Boolean(ctx.signedAt);
  const doc = <FileText size={17} strokeWidth={1.8} />;
  const contractChecks: CheckItem[] = [
    { label: 'Terms added', ok: step >= 2 ? true : 'off' },
    { label: 'Usage rights', ok: step >= 2 ? true : 'off' },
    { label: 'Payment schedule', ok: step >= 2 ? true : 'off' },
    { label: signed ? `Signed${ctx.signedBy ? ` by ${ctx.signedBy}` : ''}` : 'Waiting for your review', ok: signed ? true : step >= 2 ? 'wait' : 'off' },
  ];
  const contract: FlowNode = closed || step < 2
    ? {
        key: 'contract', title: 'Contract', state: 'next',
        chip: { label: closed ? 'Closed' : 'Not started', tone: 'grey' },
        summary: closed ? 'Not needed' : 'Drafted once you agree on terms',
        body: <><Lead icon={doc}><Chip tone="grey">{closed ? 'Closed' : 'After agreement'}</Chip></Lead><Checks items={contractChecks} /></>,
      }
    : step === 2 && !signed
      ? {
          key: 'contract', title: 'Contract', state: 'current',
          chip: { label: 'Draft ready', tone: 'green' },
          summary: 'Review the terms and sign',
          body: <><Lead icon={doc}><Chip tone="green">Draft ready</Chip></Lead><Checks items={contractChecks} /></>,
          action: { label: 'Review contract', to: `/creator/contract/${inv.id}` },
        }
      : {
          key: 'contract', title: 'Contract', state: 'done',
          chip: { label: 'Signed', tone: 'green' },
          summary: ctx.signedAt ? `Signed ${shortDate(ctx.signedAt.slice(0, 10))}` : 'Version locked',
          body: <><Lead icon={doc}><Chip tone="green">Signed</Chip></Lead><Checks items={contractChecks} /></>,
          action: { label: 'View contract', to: `/creator/contract/${inv.id}` },
        };

  // 4 · Content delivery
  const items = ctx.items;
  const sent = items.filter(d => d.status === 'uploaded' || d.status === 'pending_approval' || d.status === 'approved').length;
  const total = items.length || pieces;
  const nextItem = items.filter(d => d.status !== 'approved').sort((a, c) => a.dueDate.localeCompare(c.dueDate))[0];
  const revising = items.some(d => d.status === 'changes_requested');
  const lastDue = [...inv.brief.deliverableSpecs].map(s => s.due).sort().pop();
  const pieceList = (
    <ul className="chd-pieces">
      {items.length
        ? items.slice(0, 3).map(d => {
            const look = DELIVERABLE[d.status];
            return (
              <li key={d.id} className={`is-${look.tone}`}>
                <span className="chd-pieces__icon" aria-hidden="true">
                  {look.tone === 'ok' ? <Check size={10} strokeWidth={3.2} />
                    : look.tone === 'bad' ? <X size={10} strokeWidth={3.2} />
                      : look.tone === 'wait' ? <Clock size={10} strokeWidth={2.8} /> : <CircleDashed size={12} />}
                </span>
                <span className="chd-pieces__name">{d.label}</span>
                <span className="chd-pieces__state">{look.label}</span>
              </li>
            );
          })
        : inv.brief.deliverableSpecs.slice(0, 3).map(s => (
            <li key={s.id} className="is-off">
              <span className="chd-pieces__icon" aria-hidden="true"><CircleDashed size={12} /></span>
              <span className="chd-pieces__name">{s.count} × {s.format}</span>
            </li>
          ))}
      {items.length > 3 && <li className="chd-pieces__more">+{items.length - 3} more</li>}
    </ul>
  );
  const meter = (
    <Lead icon={<SquarePlay size={17} strokeWidth={1.8} />}>
      <span className="chd-lead__meter">
        <b>{sent} / {total} deliverables</b>
        <span className="chd-meter" role="progressbar" aria-valuenow={sent} aria-valuemin={0} aria-valuemax={total} aria-label="Deliverables sent">
          <i style={{ width: `${total ? (sent / total) * 100 : 0}%` }} />
        </span>
      </span>
    </Lead>
  );
  const content: FlowNode = step === 3
    ? {
        key: 'content', title: 'Content delivery', state: 'current',
        chip: revising ? { label: 'Changes requested', tone: 'red' } : { label: `${sent} / ${total} sent`, tone: 'blue' },
        summary: nextItem ? `${nextItem.label} · ${dueLabel(nextItem.dueDate)}` : 'Everything is submitted',
        body: (
          <>
            {meter}
            {pieceList}
            {nextItem && (
              <dl className="chd-rows chd-rows--tight">
                <div title={dueLabel(nextItem.dueDate)}>
                  <dt>Deadline</dt>
                  <dd className={`is-${dueTone(nextItem.dueDate)}`}>{fullDate(nextItem.dueDate)}</dd>
                </div>
              </dl>
            )}
          </>
        ),
        action: { label: 'Upload / view', to: `/creator/campaigns/${inv.id}` },
      }
    : step === 4
      ? {
          key: 'content', title: 'Content delivery', state: 'done',
          chip: { label: 'Delivered', tone: 'green' },
          summary: `${total} of ${total} approved`,
          body: <>{meter}{pieceList}</>,
          action: { label: 'Open campaign', to: `/creator/campaigns/${inv.id}` },
        }
      : {
          key: 'content', title: 'Content delivery', state: 'next',
          chip: { label: closed ? 'Closed' : 'After signing', tone: 'grey' },
          summary: closed ? 'Not needed' : `${pieces} pieces to make after signing`,
          body: (
            <>
              {meter}
              {pieceList}
              {lastDue && !closed && <dl className="chd-rows chd-rows--tight"><div><dt>Deadline</dt><dd>{fullDate(lastDue)}</dd></div></dl>}
            </>
          ),
        };

  // 5 · Payment. Anything not paid yet is labelled expected.
  const milestones = inv.brief.milestones.filter(m => m.pct > 0);
  const plan = milestones.length ? milestones : [{ name: 'On approval', pct: 100, date: '' }];
  const paid = ctx.paymentStatus === 'paid';
  const payChip: { label: string; tone: Tone } = closed ? { label: 'Closed', tone: 'grey' }
    : step === 4 ? (paid ? { label: 'Paid', tone: 'green' } : { label: 'Processing', tone: 'blue' })
      : step === 3 ? { label: 'Pending approval', tone: 'pink' } : { label: 'Protected', tone: 'teal' };
  const payment: FlowNode = {
    key: 'payment',
    title: 'Payment',
    state: closed ? 'next' : step === 4 ? (paid ? 'done' : 'current') : 'next',
    chip: payChip,
    summary: closed ? 'No payment due' : paid ? `${inr(rate)} paid` : `${inr(rate)} expected after approval`,
    body: (
      <>
        <Lead icon={<Wallet size={17} strokeWidth={1.8} />}><Chip tone={payChip.tone}>{payChip.label}</Chip></Lead>
        <Rows rows={[
          ...plan.slice(0, 3).map((m, i) => [plan.length > 1 ? `Milestone ${i + 1}` : 'Payout', inr(Math.round((rate * m.pct) / 100))] as [string, ReactNode]),
          [paid ? 'Paid' : 'Expected on', paid ? 'Yes' : inv.brief.endDate ? fullDate(inv.brief.endDate) : '—'],
        ]} />
      </>
    ),
    action: step >= 3 ? { label: 'View payment', to: '/creator/earnings' } : undefined,
  };

  return negotiate ? [invite, negotiate, contract, content, payment] : [invite, contract, content, payment];
}

function lookFor(node: FlowNode): ButtonLook {
  return node.state === 'current' ? 'primary' : 'outline';
}

interface Edge { key: string; d: string; color: string; a: [number, number]; b: [number, number] }

export default function DashboardWorkflow({ campaigns, invites }: { campaigns: Invitation[]; invites: Invitation[] }) {
  const { negotiations, contracts, deliverables, payments } = useCreator();
  const all = [...campaigns, ...invites];
  const [picked, setPicked] = useState<string | undefined>(undefined);
  const inv = all.find(i => i.id === picked) ?? all[0];
  const messages = inv ? negotiations[inv.id] ?? [] : [];
  const negotiated = Boolean(inv && wasNegotiated(inv, messages));
  const keys = negotiated ? KEYS : KEYS.filter(k => k !== 'negotiate');

  const canvasRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Partial<Record<NodeKey, HTMLElement | null>>>({});
  const [mode, setMode] = useState<Mode>('timeline');
  const [edges, setEdges] = useState<Edge[]>([]);
  const [tick, setTick] = useState(0);
  // Phone timeline: which step is open. null follows the current step; 'none' closes all.
  const [opened, setOpened] = useState<NodeKey | 'none' | null>(null);

  useEffect(() => { setOpened(null); }, [inv?.id]);

  // Pick the layout from the canvas width, and redraw connectors whenever anything resizes.
  // Five steps need a wider canvas than four before they sit side by side.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      setMode(w >= (negotiated ? 840 : 680) ? 'canvas' : w >= 470 ? 'board' : 'timeline');
      setTick(t => t + 1);
    });
    ro.observe(el);
    KEYS.forEach(k => { const n = nodeRefs.current[k]; if (n) ro.observe(n); });
    return () => ro.disconnect();
  }, [inv?.id, negotiated]);

  const measure = useCallback(() => {
    const el = canvasRef.current;
    if (!el || mode === 'timeline') { setEdges([]); return; }
    const c = el.getBoundingClientRect();
    const zoom = el.offsetWidth ? c.width / el.offsetWidth : 1;
    const box = (k: NodeKey) => {
      const n = nodeRefs.current[k];
      if (!n) return null;
      const r = n.getBoundingClientRect();
      return { l: (r.left - c.left) / zoom, t: (r.top - c.top) / zoom, w: r.width / zoom, h: r.height / zoom };
    };
    const order = negotiated ? KEYS : KEYS.filter(k => k !== 'negotiate');
    const next: Edge[] = [];
    order.slice(0, -1).forEach((from, i) => {
      const to = order[i + 1];
      const color = NODE_COLOR[from];
      const a = box(from);
      const b = box(to);
      if (!a || !b) return;
      const sameRow = b.l >= a.l + a.w - 4 && b.t < a.t + a.h && b.t + b.h > a.t;
      if (sameRow) {
        const x1 = a.l + a.w; const y1 = a.t + Math.min(a.h / 2, 150);
        const x2 = b.l; const y2 = b.t + Math.min(b.h / 2, 150);
        const dx = Math.max(14, (x2 - x1) / 2);
        next.push({ key: `${from}-${to}`, color, a: [x1, y1], b: [x2, y2], d: `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}` });
      } else {
        // Next row (or stacked in the same column): leave from the bottom, arrive at the top.
        const x1 = a.l + a.w / 2; const y1 = a.t + a.h;
        const x2 = b.l + b.w / 2; const y2 = b.t;
        const my = (y1 + y2) / 2;
        next.push({ key: `${from}-${to}`, color, a: [x1, y1], b: [x2, y2], d: `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}` });
      }
    });
    setEdges(next);
  }, [mode, negotiated]);

  useLayoutEffect(() => { measure(); }, [measure, tick, inv?.id]);

  if (!inv) {
    return (
      <section className="chd-panel chd-flow" aria-labelledby="chd-flow-title">
        <FlowHead />
        <EmptyNote icon={Workflow} title="No campaigns yet">
          When a brand invites you, you can follow it here from the offer to your payout.
        </EmptyNote>
      </section>
    );
  }

  const contract = contracts[inv.id];
  const nodes = nodesFor(inv, {
    negotiated,
    messages,
    signedBy: contract?.signedName,
    signedAt: contract?.signedAt,
    items: deliverables[inv.id] ?? [],
    paymentStatus: payments.find(p => p.campaignId === inv.id)?.status,
  });
  const running = campaigns.some(c => c.id === inv.id);
  const timeline = mode === 'timeline';
  const openKey = opened === 'none' ? null : opened ?? nodes.find(n => n.state === 'current')?.key ?? null;

  return (
    <section className="chd-panel chd-flow" aria-labelledby="chd-flow-title">
      <FlowHead>
        <label className="chd-select">
          <select value={inv.id} onChange={e => setPicked(e.target.value)} aria-label="Show campaign">
            {campaigns.length > 0 && (
              <optgroup label="Campaigns">
                {campaigns.map(c => <option key={c.id} value={c.id}>{c.brief.title} · {c.brand}</option>)}
              </optgroup>
            )}
            {invites.length > 0 && (
              <optgroup label="Invitations">
                {invites.map(c => <option key={c.id} value={c.id}>{c.brief.title} · {c.brand}</option>)}
              </optgroup>
            )}
          </select>
          <ChevronDown size={16} aria-hidden="true" />
        </label>
        <Link to="/creator/invitations" className="chd-iconbtn" aria-label="Browse invitations" title="Browse invitations">
          <Plus size={18} strokeWidth={2} />
        </Link>
        <Link
          to={running ? `/creator/campaigns/${inv.id}` : `/creator/invitations/${inv.id}`}
          className="chd-iconbtn"
          aria-label="Open full view"
          title="Open full view"
        >
          <Maximize2 size={16} strokeWidth={2} />
        </Link>
      </FlowHead>

      <div ref={canvasRef} className={`chd-canvas is-${mode} has-${keys.length}`}>
        {edges.length > 0 && (
          <svg className="chd-canvas__wires" aria-hidden="true">
            {edges.map(e => (
              <g key={e.key}>
                <path d={e.d} stroke={e.color} />
                <circle cx={e.a[0]} cy={e.a[1]} r={4.5} fill={e.color} />
                <circle cx={e.b[0]} cy={e.b[1]} r={4.5} fill={e.color} />
              </g>
            ))}
          </svg>
        )}

        {nodes.map(n => {
          const isOpen = !timeline || n.key === openKey;
          const bodyId = `chd-step-${n.key}`;
          const head = (
            <>
              <span className="chd-node__row">
                <i className="chd-node__dot" aria-hidden="true" />
                <span className="chd-node__name">{n.title}</span>
                <span className="chd-node__chip"><Chip tone={n.chip.tone}>{n.chip.label}</Chip></span>
                {timeline && <ChevronDown className="chd-node__chev" size={18} strokeWidth={2} aria-hidden="true" />}
              </span>
              <span className="chd-node__summary">{n.summary}</span>
            </>
          );
          return (
            <article
              key={n.key}
              ref={el => { nodeRefs.current[n.key] = el; }}
              className={`chd-node chd-node--${n.key} is-${n.state}${isOpen ? ' is-open' : ''}`}
              aria-current={n.state === 'current' ? 'step' : undefined}
            >
              <h3 className="chd-node__head">
                {timeline ? (
                  <button
                    type="button"
                    className="chd-node__toggle"
                    aria-expanded={isOpen}
                    aria-controls={bodyId}
                    onClick={() => setOpened(isOpen ? 'none' : n.key)}
                  >
                    {head}
                  </button>
                ) : head}
              </h3>
              <div className="chd-node__more" id={bodyId}>
                <div className="chd-node__body">{n.body}</div>
                {n.action && (
                  <Link to={n.action.to} className={`chd-pill chd-pill--${lookFor(n)}`}>
                    {n.action.label} <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function FlowHead({ children }: { children?: ReactNode }) {
  return (
    <div className="chd-flow__head">
      <span className="chd-flow__mark" aria-hidden="true"><Workflow size={18} strokeWidth={2} /></span>
      <div className="chd-flow__titles">
        <h2 id="chd-flow-title">Campaign workflow</h2>
        <p>Every step from invitation to payout</p>
      </div>
      {children && <div className="chd-flow__tools">{children}</div>}
    </div>
  );
}
