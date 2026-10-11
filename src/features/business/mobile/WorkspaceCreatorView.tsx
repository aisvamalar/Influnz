/**
 * Mobile creator content detail: profile, contract, deliverables and the
 * performance / payments / communication tabs for one campaign creator.
 */
import { useState, type CSSProperties } from 'react';
import {
  ArrowUpRight,
  BadgeCheck,
  Bot,
  Check,
  CircleCheck,
  Clock,
  Download,
  EllipsisVertical,
  FileText,
  Hourglass,
  MapPin,
  Pencil,
  Play,
  Plus,
  Send,
  Sparkles,
} from 'lucide-react';
import PlatformMark from '../../../components/mobile/PlatformMark';
import type { ContentDeliverable, CreatorData } from '../campaignWorkspaceData';
import { ActionSheet, CreatorAvatar, RequestSheet, Sheet, StatusPill, WorkspaceTopBar } from './WorkspaceParts';
import { decisionFor, deliverableStatus, offerApprovalId, setDecision } from './approvalsData';
import {
  DELIVERABLE_LABEL,
  contentPhotoId,
  deliveredCounts,
  downloadUrl,
  instagramUrl,
  photoUrl,
  platformOf,
  splitType,
} from './workspaceUtils';

export type CreatorTab = 'content' | 'performance' | 'payments' | 'communication';

const CREATOR_TABS: { key: CreatorTab; label: string }[] = [
  { key: 'content', label: 'Content' },
  { key: 'performance', label: 'Performance' },
  { key: 'payments', label: 'Payments' },
  { key: 'communication', label: 'Communication' },
];

const DELIVERABLE_TONE: Record<ContentDeliverable['status'], 'green' | 'amber' | 'coral' | 'grey'> = {
  approved: 'green',
  in_review: 'amber',
  revision: 'coral',
  pending: 'grey',
};

const PAYMENT_LABEL: Record<CreatorData['payments']['status'], [string, 'green' | 'amber' | 'grey']> = {
  released: ['Released', 'green'],
  escrow: ['In escrow', 'amber'],
  hold: ['On hold', 'grey'],
};

type SheetState =
  | { kind: 'contract' }
  | { kind: 'request'; id?: string }
  | { kind: 'actions'; deliverable: ContentDeliverable }
  | { kind: 'release' };

export interface CreatorContentViewProps {
  creator: CreatorData;
  /** Campaign content deadline, e.g. "Nov 10". */
  dueDate: string;
  tab: CreatorTab;
  notify: (message: string) => void;
  onBack: () => void;
  onTabChange: (tab: CreatorTab) => void;
  onOpenContent: (deliverableId: string) => void;
}

export default function CreatorContentView({
  creator,
  dueDate,
  tab,
  notify,
  onBack,
  onTabChange,
  onOpenContent,
}: CreatorContentViewProps) {
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const [released, setReleased] = useState(false);
  const { done, total } = deliveredCounts(creator);
  const pct = total ? Math.round((done / total) * 100) : 0;
  const placeholders = Math.max(0, total - Math.max(done, creator.contentDeliverables.length));
  const hasApproved = creator.contentDeliverables.some((d) => d.status === 'approved');
  const firstName = creator.name.split(' ')[0];
  const close = () => setSheet(null);

  return (
    <>
      <WorkspaceTopBar
        onBack={onBack}
        menu={[
          { label: 'View contract', onSelect: () => setSheet({ kind: 'contract' }) },
          { label: 'Request content', onSelect: () => setSheet({ kind: 'request' }) },
          { label: 'Send reminder', onSelect: () => notify(`Reminder sent to ${creator.name}`) },
        ]}
      />

      <main className="mws-main mws-main--with-bar">
        <section className="mws-profile" aria-labelledby="mws-profile-name">
          <CreatorAvatar creator={creator} size={76} className="mws-profile__avatar" />
          <div className="mws-profile__info">
            <h1 id="mws-profile-name" className="mws-profile__name">
              <span className="mws-profile__name-text">{creator.name}</span>
              {creator.verified && (
                <>
                  <BadgeCheck className="mws-verified" size={18} strokeWidth={2.2} aria-hidden="true" />
                  <span className="mws-sr">Verified</span>
                </>
              )}
            </h1>
            <p className="mws-profile__handle">{creator.handle}</p>
            <p className="mws-profile__stats">
              <strong>{creator.followers}</strong> Followers <span aria-hidden="true">•</span>{' '}
              <strong>{creator.engagement}</strong> Engagement
            </p>
            <div className="mws-profile__foot">
              <span className="mws-profile__loc">
                <MapPin size={14} strokeWidth={2} aria-hidden="true" />
                {creator.location}
              </span>
              <a className="mws-link" href={instagramUrl(creator.handle)} target="_blank" rel="noreferrer">
                View Profile
                <ArrowUpRight size={14} strokeWidth={2.2} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <div className="mws-utabs" role="tablist" aria-label={`${creator.name} sections`}>
          {CREATOR_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={`mws-utabs__item${tab === t.key ? ' is-active' : ''}`}
              onClick={() => onTabChange(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" aria-label={CREATOR_TABS.find((t) => t.key === tab)?.label}>
          {tab === 'content' && (
            <>
              <div className="mws-contract">
                <span className="mws-contract__icon">
                  <FileText size={20} strokeWidth={1.9} aria-hidden="true" />
                </span>
                <span className="mws-contract__text">
                  <strong>Disclosure &amp; contract</strong>
                  <span>
                    <span className={creator.status === 'accepted' ? 'mws-ok' : 'mws-warn'}>
                      {creator.status === 'accepted' ? 'Signed' : 'Awaiting signature'}
                    </span>{' '}
                    • Deliver {total} contents by {dueDate}
                  </span>
                </span>
                <button type="button" className="mws-btn mws-btn--outline mws-btn--sm" onClick={() => setSheet({ kind: 'contract' })}>
                  View Contract
                </button>
              </div>

              <div className="mws-progress-head">
                <h2 className="mws-section__title">
                  Content Deliverables ({done}/{total})
                </h2>
                <span className={`mws-progress-head__pct${pct === 100 ? ' mws-ok' : ''}`}>{pct}%</span>
              </div>
              <div
                className={`mws-bar ${pct === 100 ? 'mws-bar--green' : 'mws-bar--coral'}`}
                role="progressbar"
                aria-label="Deliverables completed"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
                style={{ '--mws-fill': `${pct}%` } as CSSProperties}
              />

              <ul className="mws-delivs">
                {creator.contentDeliverables.map((d, i) => {
                  const { name, detail } = splitType(d.type);
                  const status = deliverableStatus(d);
                  return (
                    <li key={d.id} className="mws-deliv">
                      <button type="button" className="mws-deliv__thumb" onClick={() => onOpenContent(d.id)}>
                        <img src={photoUrl(contentPhotoId(d, i), 132, 172, 'entropy')} alt="" loading="lazy" />
                        <span className="mws-deliv__play" aria-hidden="true">
                          <Play size={14} strokeWidth={2.4} fill="currentColor" />
                        </span>
                        <span className="mws-deliv__dur">{d.duration}</span>
                        <span className="mws-sr">Play {d.title}</span>
                      </button>
                      <div className="mws-deliv__body">
                        <div className="mws-deliv__type">
                          <PlatformMark id={platformOf(d.type)} size={15} />
                          <span className="mws-deliv__type-name">{name}</span>
                          <StatusPill tone={DELIVERABLE_TONE[status]}>{DELIVERABLE_LABEL[status]}</StatusPill>
                        </div>
                        {detail && <span className="mws-deliv__detail">{detail}</span>}
                        <h3 className="mws-deliv__title">{d.title}</h3>
                        <p className={`mws-deliv__date${status === 'approved' ? ' mws-ok' : ' mws-warn'}`}>
                          {status === 'approved' ? (
                            <CircleCheck size={13} strokeWidth={2.2} aria-hidden="true" />
                          ) : (
                            <Clock size={13} strokeWidth={2.2} aria-hidden="true" />
                          )}
                          {d.submittedDate}
                        </p>
                      </div>
                      <div className="mws-deliv__side">
                        <button
                          type="button"
                          className="mws-deliv__more"
                          aria-label={`More actions for ${d.title}`}
                          onClick={() => setSheet({ kind: 'actions', deliverable: d })}
                        >
                          <EllipsisVertical size={18} strokeWidth={2} />
                        </button>
                        <button type="button" className="mws-btn mws-btn--soft mws-btn--sm" onClick={() => onOpenContent(d.id)}>
                          <Play size={12} strokeWidth={2.4} aria-hidden="true" />
                          View
                        </button>
                      </div>
                    </li>
                  );
                })}
                {Array.from({ length: placeholders }, (_, i) => {
                  const n = creator.contentDeliverables.length + i + 1;
                  return (
                    <li key={`pending-${n}`} className="mws-deliv mws-deliv--pending">
                      <span className="mws-deliv__thumb mws-deliv__thumb--empty" aria-hidden="true">
                        <Hourglass size={18} strokeWidth={1.9} />
                      </span>
                      <div className="mws-deliv__body">
                        <div className="mws-deliv__type">
                          <PlatformMark id="instagram" size={15} />
                          <span className="mws-deliv__type-name">Deliverable {n}</span>
                          <StatusPill tone="grey">Pending</StatusPill>
                        </div>
                        <h3 className="mws-deliv__title">Awaiting submission</h3>
                        <p className="mws-deliv__date">Due by {dueDate}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {total === 0 && <p className="mws-empty">No deliverables agreed yet.</p>}

              <button type="button" className="mws-btn mws-btn--dashed mws-btn--block" onClick={() => setSheet({ kind: 'request' })}>
                <Plus size={16} strokeWidth={2.4} aria-hidden="true" />
                Add / Request Revision
              </button>
            </>
          )}

          {tab === 'performance' && <PerformanceTab creator={creator} />}
          {tab === 'payments' && <PaymentsTab creator={creator} released={released} />}
          {tab === 'communication' && <CommunicationTab creator={creator} notify={notify} />}
        </div>
      </main>

      <div className="mws-bar-actions">
        <button type="button" className="mws-btn mws-btn--outline" onClick={() => notify(`Reminder sent to ${creator.name}`)}>
          <Send size={16} strokeWidth={2} aria-hidden="true" />
          Send Reminder
        </button>
        <button
          type="button"
          className="mws-btn mws-btn--primary"
          disabled={released || !hasApproved}
          onClick={() => setSheet({ kind: 'release' })}
        >
          {released ? (
            <>
              <Check size={16} strokeWidth={2.4} aria-hidden="true" />
              Payment Released
            </>
          ) : (
            'Approve & Release Payment'
          )}
        </button>
      </div>

      {sheet?.kind === 'contract' && (
        <Sheet title="Contract summary" onClose={close}>
          <dl className="mws-kv">
            <div className="mws-kv__row">
              <dt>Status</dt>
              <dd>{creator.status === 'accepted' ? 'Signed' : 'Awaiting signature'}</dd>
            </div>
            <div className="mws-kv__row">
              <dt>Agreed fee</dt>
              <dd>{creator.finalOffer}</dd>
            </div>
            <div className="mws-kv__row">
              <dt>Deliverables</dt>
              <dd>{creator.deliverables}</dd>
            </div>
            <div className="mws-kv__row">
              <dt>Deadline</dt>
              <dd>{dueDate}</dd>
            </div>
            <div className="mws-kv__row">
              <dt>Usage rights</dt>
              <dd>{creator.usageRights}</dd>
            </div>
            <div className="mws-kv__row">
              <dt>Exclusivity</dt>
              <dd>{creator.exclusivity}</dd>
            </div>
            <div className="mws-kv__row">
              <dt>Disclosure</dt>
              <dd>#ad or Paid partnership label on every post</dd>
            </div>
          </dl>
        </Sheet>
      )}

      {sheet?.kind === 'request' && (
        <RequestSheet creator={creator} initialId={sheet.id} onClose={close} onSent={notify} />
      )}

      {sheet?.kind === 'actions' && (
        <ActionSheet
          title={sheet.deliverable.title}
          onClose={close}
          actions={[
            {
              label: 'View content',
              icon: <Play size={16} strokeWidth={2} />,
              onSelect: () => onOpenContent(sheet.deliverable.id),
            },
            {
              label: 'Request revision',
              icon: <Pencil size={16} strokeWidth={2} />,
              onSelect: () => setSheet({ kind: 'request', id: sheet.deliverable.id }),
            },
            {
              label: 'Download',
              icon: <Download size={16} strokeWidth={2} />,
              onSelect: () =>
                window.open(
                  downloadUrl(contentPhotoId(sheet.deliverable, creator.contentDeliverables.indexOf(sheet.deliverable))),
                  '_blank',
                  'noopener',
                ),
            },
          ]}
        />
      )}

      {sheet?.kind === 'release' && (
        <Sheet
          title="Approve & release payment"
          onClose={close}
          footer={
            <button
              type="button"
              className="mws-btn mws-btn--primary mws-btn--block"
              onClick={() => {
                setReleased(true);
                close();
                notify(`${creator.payments.totalFee.split(' (')[0]} released to ${firstName}`);
              }}
            >
              Release {creator.payments.totalFee.split(' (')[0]}
            </button>
          }
        >
          <p className="mws-sheet__note">
            Approves the submitted content and releases the milestone payment from escrow to {creator.name}.
          </p>
          <dl className="mws-kv">
            <div className="mws-kv__row">
              <dt>Content approved</dt>
              <dd>
                {creator.contentDeliverables.filter((d) => d.status === 'approved').length}/{total}
              </dd>
            </div>
            <div className="mws-kv__row">
              <dt>Amount</dt>
              <dd>{creator.payments.totalFee}</dd>
            </div>
            <div className="mws-kv__row">
              <dt>TDS deducted</dt>
              <dd>{creator.payments.tdsDeducted}</dd>
            </div>
            <div className="mws-kv__row">
              <dt>Pay to</dt>
              <dd>{creator.payments.accountMasked}</dd>
            </div>
            <div className="mws-kv__row">
              <dt>Invoice</dt>
              <dd>{creator.payments.invoiceId}</dd>
            </div>
          </dl>
        </Sheet>
      )}
    </>
  );
}

function PerformanceTab({ creator }: { creator: CreatorData }) {
  const p = creator.performance;
  const stats = [
    { label: 'Views', value: p.views },
    { label: 'Reach', value: p.reach },
    { label: 'Store visits', value: String(p.visits) },
    { label: 'Engagement', value: p.engagement },
    { label: 'Cost / visit', value: p.cac },
    { label: 'Sales', value: p.sales },
    { label: 'Coupons used', value: String(p.couponsUsed) },
    { label: 'Grade', value: p.grade },
  ];
  return (
    <>
      <dl className="mws-stats">
        {stats.map((s) => (
          <div key={s.label} className="mws-stats__item">
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mws-note">
        <Sparkles size={18} strokeWidth={2} aria-hidden="true" />
        <p>{p.aiNote}</p>
      </div>
    </>
  );
}

function PaymentsTab({ creator, released }: { creator: CreatorData; released: boolean }) {
  const pay = creator.payments;
  const [label, tone] = released ? PAYMENT_LABEL.released : PAYMENT_LABEL[pay.status];
  const rows = [
    { label: 'Total fee', value: pay.totalFee },
    { label: 'Released', value: released ? pay.totalFee.split(' (')[0] : pay.released },
    { label: 'In escrow', value: released ? '₹0' : pay.escrow },
    { label: 'TDS deducted', value: pay.tdsDeducted },
    { label: 'Invoice', value: pay.invoiceId },
    { label: 'Account', value: pay.accountMasked },
  ];
  return (
    <>
      <div className="mws-progress-head">
        <h2 className="mws-section__title">Payment status</h2>
        <StatusPill tone={tone}>{label}</StatusPill>
      </div>
      <dl className="mws-kv">
        {rows.map((r) => (
          <div key={r.label} className="mws-kv__row">
            <dt>{r.label}</dt>
            <dd>{r.value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

function OfferDecision({ creator, notify }: { creator: CreatorData; notify: (message: string) => void }) {
  const approvalId = offerApprovalId(creator);
  const [decision, setLocalDecision] = useState(() => decisionFor(approvalId));

  const decide = (next: 'accepted' | 'declined') => {
    setDecision(approvalId, next);
    setLocalDecision(next);
    notify(
      next === 'accepted'
        ? `Accepted ${creator.creatorAsk} for ${creator.name}`
        : `Kept your ${creator.finalOffer} offer — ${creator.name} has been notified`,
    );
  };

  if (decision) {
    return (
      <p className="mws-decide mws-decide--done" role="status">
        <CircleCheck size={16} strokeWidth={2.2} aria-hidden="true" />
        {decision === 'accepted'
          ? `You accepted ${creator.creatorAsk}. The contract is on its way to ${creator.name}.`
          : `You kept the ${creator.finalOffer} offer. Waiting for ${creator.name} to respond.`}
      </p>
    );
  }

  return (
    <section className="mws-decide" aria-labelledby="mws-decide-title">
      <h3 id="mws-decide-title" className="mws-decide__title">
        <Hourglass size={15} strokeWidth={2.2} aria-hidden="true" />
        Your decision is needed
      </h3>
      <p className="mws-decide__text">
        {creator.name} countered at <strong>{creator.creatorAsk}</strong>. Influnz AI's last offer was{' '}
        <strong>{creator.finalOffer}</strong> for {creator.deliverables}.
      </p>
      <div className="mws-decide__actions">
        <button type="button" className="mws-btn mws-btn--outline" onClick={() => decide('declined')}>
          Keep {creator.finalOffer}
        </button>
        <button type="button" className="mws-btn mws-btn--primary" onClick={() => decide('accepted')}>
          <Check size={16} strokeWidth={2.4} aria-hidden="true" />
          Accept {creator.creatorAsk}
        </button>
      </div>
    </section>
  );
}

function CommunicationTab({ creator, notify }: { creator: CreatorData; notify: (message: string) => void }) {
  return (
    <>
      {creator.status === 'intervene' && <OfferDecision creator={creator} notify={notify} />}
      {creator.steps.length === 0 ? (
        <p className="mws-empty">No messages with {creator.name} yet.</p>
      ) : (
        <ol className="mws-chat">
          {creator.steps.map((s, i) => (
            <li key={i} className={`mws-chat__item mws-chat__item--${s.sender}`}>
              <span className="mws-chat__who">
                {s.sender === 'ai' ? <Bot size={14} strokeWidth={2} aria-hidden="true" /> : null}
                {s.sender === 'ai' ? 'Influnz AI' : creator.name} • {s.time}
              </span>
              <p className="mws-chat__msg">{s.message}</p>
              {s.offer && (
                <span className={`mws-chat__offer mws-chat__offer--${s.offer.type}`}>
                  <span className="mws-chat__offer-title">{s.offer.title}</span>
                  <strong>{s.offer.amount}</strong>
                  <span>
                    {s.offer.deliverables}
                    {s.offer.extra ? ` ${s.offer.extra}` : ''}
                  </span>
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
