/**
 * Content review drawer for the campaign workspace.
 * Follows the deliverable lifecycle: submitted → AI check → business review →
 * approved or changes requested → payment release → performance → reputation.
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BadgeCheck, Bookmark, Bot, CalendarDays, Camera, Check, ChevronLeft, ChevronRight, CircleCheck, Clock,
  Download, ExternalLink, Eye, FileText, Heart, History, LoaderCircle, MapPin, Maximize, MessageCircle,
  Pencil, Play, Send, Share2, ShieldCheck, Sparkles, Star, TrendingUp, TriangleAlert, User, Users, Volume2,
  Wallet, X,
} from 'lucide-react';
import PaymentSetupModal from '../profile/PaymentSetupModal';
import { maskTail, profileProgress, useBusinessProfile } from '../businessProfile';
import type { ContentDeliverable, CreatorData } from '../campaignWorkspaceData';
import './content-review-drawer.css';

const REEL_PHOTOS = [
  'photo-1495474472287-4d71bcdd2085',
  'photo-1554118811-1e0d58224f24',
  'photo-1509042239860-f550ce710b93',
  'photo-1501339847302-ac426a4a7cbb',
  'photo-1511920170033-f8396924c348',
  'photo-1517248135467-4c7edcad34c4',
].map((id) => `https://images.unsplash.com/${id}?w=720&h=1280&fit=crop&auto=format&q=75`);

const PORTRAIT = (id: string) => `https://images.unsplash.com/${id}?w=160&h=160&fit=crop&crop=faces&auto=format&q=70`;

const CREATOR_PORTRAITS: Record<string, string> = {
  shruti: PORTRAIT('photo-1494790108377-be9c29b29330'),
  pranav: PORTRAIT('photo-1507003211169-0a1dd7228f2d'),
  explorer: PORTRAIT('photo-1500648767791-00dcc994a43e'),
  anu: PORTRAIT('photo-1438761681033-6461ffad8d80'),
  rohit: PORTRAIT('photo-1506794778202-cad84cf45f1d'),
  foodtales: PORTRAIT('photo-1534528741775-53994a69daeb'),
  madras: PORTRAIT('photo-1531427186611-ecfd6d936c79'),
  cafe: PORTRAIT('photo-1544005313-94ddf0286df2'),
};

const REVISIONS_INCLUDED = 2;

const CHANGE_AREAS = [
  'Brand mention',
  'Call to action',
  'Paid disclosure (#ad)',
  'Product visibility',
  'Audio / music',
  'Caption & hashtags',
  'Length / format',
];

const COMPLIANCE_LABELS: { key: keyof ContentDeliverable['checks']; label: string }[] = [
  { key: 'brandTag', label: 'Brand tag (@ChennaiCafe)' },
  { key: 'paidDisclosure', label: 'Paid disclosure (#ad)' },
  { key: 'productShown', label: 'Product shown clearly' },
  { key: 'audioClear', label: 'Audio clear' },
  { key: 'noMisleading', label: 'No misleading claims' },
  { key: 'formatDuration', label: 'Format & duration' },
];

type ReviewStage = 'in_progress' | 'business_review' | 'changes_requested' | 'approved';
type PaymentStage = 'committed' | 'pending_release' | 'processing' | 'paid';
type DrawerTab = 'content' | 'performance' | 'payments' | 'activity';

interface ActivityEvent {
  id: number;
  actor: 'ai' | 'you' | 'creator' | 'system';
  text: string;
  time: string;
}

interface ChangeRequest {
  areas: string[];
  note: string;
  timestamp: string;
  dueDays: number;
  amendment: boolean;
}

interface Rating {
  quality: number;
  communication: number;
  timeliness: number;
}

export interface ReviewRecord {
  stage: ReviewStage;
  payment: PaymentStage;
  revisionsUsed: number;
  request?: ChangeRequest;
  rating?: Rating;
  events: ActivityEvent[];
}

export type ReviewMap = Record<string, ReviewRecord>;

let eventId = 1000;
const event = (actor: ActivityEvent['actor'], text: string, time = 'Just now'): ActivityEvent => ({
  id: eventId++,
  actor,
  text,
  time,
});

const toNumber = (value: string) => Number(value.replace(/[^\d]/g, '')) || 0;
const inr = (value: number) => `₹${value.toLocaleString('en-IN')}`;
const passes = (value: string) => /found|good|clear|valid/i.test(value);

export function initialReview(creator: CreatorData, deliverable: ContentDeliverable): ReviewRecord {
  const submitted = deliverable.submittedDate.replace('Submitted on ', '');
  const events = [
    event('creator', `${creator.name} submitted “${deliverable.title}”`, submitted),
    event('ai', `AI compliance check finished: ${deliverable.complianceScore}% of requirements met`, submitted),
  ];
  if (deliverable.status === 'approved') {
    const paid = creator.payments.status === 'released';
    events.push(event('you', 'You approved the content', deliverable.postedOn));
    if (paid) events.push(event('system', `Payment released to ${creator.payments.accountMasked}`, deliverable.postedOn));
    return { stage: 'approved', payment: paid ? 'paid' : 'pending_release', revisionsUsed: 0, events };
  }
  if (deliverable.status === 'revision') {
    return { stage: 'changes_requested', payment: 'committed', revisionsUsed: 1, events };
  }
  return {
    stage: deliverable.status === 'pending' ? 'in_progress' : 'business_review',
    payment: 'committed',
    revisionsUsed: 0,
    events,
  };
}

const STAGE_BADGE: Record<ReviewStage, { label: string; tone: string }> = {
  in_progress: { label: 'In progress', tone: 'muted' },
  business_review: { label: 'Needs your review', tone: 'amber' },
  changes_requested: { label: 'Changes requested', tone: 'amber' },
  approved: { label: 'Approved', tone: 'green' },
};

interface ContentReviewDrawerProps {
  creator: CreatorData;
  initialIndex: number;
  photoOffset: number;
  reviews: ReviewMap;
  onReviewChange: (deliverableId: string, update: (record: ReviewRecord) => ReviewRecord) => void;
  onClose: () => void;
}

export default function ContentReviewDrawer({
  creator,
  initialIndex,
  photoOffset,
  reviews,
  onReviewChange,
  onClose,
}: ContentReviewDrawerProps) {
  const navigate = useNavigate();
  const profile = useBusinessProfile();
  const { paymentsDone } = profileProgress(profile);

  const deliverables = creator.contentDeliverables;
  const [index, setIndex] = useState(Math.min(initialIndex, Math.max(deliverables.length - 1, 0)));
  const [tab, setTab] = useState<DrawerTab>('content');
  const [frame, setFrame] = useState(0);
  const [sheet, setSheet] = useState<'approve' | 'revise' | null>(null);
  const [setupOpen, setSetupOpen] = useState(false);
  const [toast, setToast] = useState('');

  const deliverable = deliverables[index];
  const record = deliverable ? reviews[deliverable.id] ?? initialReview(creator, deliverable) : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !sheet && !setupOpen) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, sheet, setupOpen]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  if (!deliverable || !record) return null;

  const update = (fn: (r: ReviewRecord) => ReviewRecord) => onReviewChange(deliverable.id, fn);

  const milestone = Math.round(toNumber(creator.payments.totalFee) / Math.max(deliverables.length, 1));
  const tds = Math.round(milestone * 0.01);
  const net = milestone - tds;
  const payingFrom = profile.payments.bank.account
    ? `Bank ${maskTail(profile.payments.bank.account)}`
    : profile.payments.bank.upi || 'Your business account';

  const frames = [0, 1, 2, 3].map((i) => REEL_PHOTOS[(photoOffset + index + i) % REEL_PHOTOS.length]);
  const approvedCount = deliverables.filter(
    (d) => (reviews[d.id] ?? initialReview(creator, d)).stage === 'approved',
  ).length;
  const badge = STAGE_BADGE[record.stage];
  const portrait = CREATOR_PORTRAITS[creator.id] ?? creator.largeAvatar ?? creator.avatar;
  const published = record.stage === 'approved' && !/draft/i.test(deliverable.postedOn);

  const goTo = (next: number) => {
    setIndex(next);
    setFrame(0);
    setSheet(null);
  };

  const releasePayment = () => {
    update((r) => ({
      ...r,
      payment: 'processing',
      events: [...r.events, event('you', `You released ${inr(net)} to ${creator.name}`)],
    }));
    window.setTimeout(() => {
      update((r) => ({
        ...r,
        payment: 'paid',
        events: [...r.events, event('system', `Payment of ${inr(net)} paid to ${creator.payments.accountMasked}`)],
      }));
    }, 1800);
  };

  const approve = (release: boolean) => {
    update((r) => ({
      ...r,
      stage: 'approved',
      payment: 'pending_release',
      events: [...r.events, event('you', `You approved “${deliverable.title}”`)],
    }));
    if (release) releasePayment();
    setSheet(null);
    setToast(release ? 'Content approved. Payment is processing.' : 'Content approved. Payment is waiting for release.');
  };

  const requestChanges = (request: ChangeRequest) => {
    update((r) => ({
      ...r,
      stage: 'changes_requested',
      revisionsUsed: request.amendment ? r.revisionsUsed : r.revisionsUsed + 1,
      request,
      events: [
        ...r.events,
        event(
          'you',
          request.amendment
            ? `You proposed an amendment: ${request.areas.join(', ')}`
            : `You requested changes: ${request.areas.join(', ')}`,
        ),
      ],
    }));
    setSheet(null);
    setToast(request.amendment ? 'Amendment sent for creator consent.' : `Change request sent to ${creator.name}.`);
  };

  const sendMessage = (text: string) => {
    update((r) => ({ ...r, events: [...r.events, event('you', `Message: “${text}”`)] }));
  };

  return (
    <>
      <div className="crd-backdrop" onClick={onClose} />
      <aside className="crd" role="dialog" aria-modal="true" aria-label={`Review ${deliverable.title}`}>
        <header className="crd-top">
          <div className="crd-who">
            <img src={portrait} alt="" className="crd-who__avatar" />
            <div>
              <strong>
                {creator.name}
                {creator.verified && <BadgeCheck size={16} className="crd-verified" aria-label="Verified" />}
              </strong>
              <span>
                {creator.handle}
                <i aria-hidden="true">·</i>
                <Users size={12} /> {creator.followers}
                <i aria-hidden="true">·</i>
                <MapPin size={12} /> {creator.location}
              </span>
            </div>
          </div>
          <div className="crd-top__right">
            <div className="crd-progress">
              <span><b>{approvedCount}</b> of {deliverables.length} deliverables approved</span>
              <i><b style={{ width: `${(approvedCount / deliverables.length) * 100}%` }} /></i>
            </div>
            <div className="crd-pager">
              <button type="button" aria-label="Previous deliverable" disabled={index === 0} onClick={() => goTo(index - 1)}>
                <ChevronLeft size={16} />
              </button>
              <span>{index + 1} of {deliverables.length}</span>
              <button
                type="button"
                aria-label="Next deliverable"
                disabled={index === deliverables.length - 1}
                onClick={() => goTo(index + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <button type="button" className="crd-close" aria-label="Close" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </header>

        <nav className="crd-tabs" role="tablist">
          {(
            [
              ['content', 'Review', Eye],
              ['performance', 'Performance', TrendingUp],
              ['payments', 'Payment', Wallet],
              ['activity', 'Activity', History],
            ] as const
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={`crd-tab${tab === key ? ' is-active' : ''}`}
              onClick={() => setTab(key)}
            >
              <Icon size={15} />
              {label}
              {key === 'activity' && <em>{record.events.length}</em>}
            </button>
          ))}
        </nav>

        <div className="crd-body">
          <div className="crd-media">
            <div className="crd-reel">
              <img src={frames[frame]} alt={`${deliverable.title} preview`} />
              <div className="crd-reel__top">
                <span><Camera size={13} /> {deliverable.type.split(' (')[0].replace('Instagram ', '')}</span>
                <span>{deliverable.duration}</span>
              </div>
              <button type="button" className="crd-reel__play" aria-label="Play">
                <Play size={22} fill="currentColor" />
              </button>
              <div className="crd-reel__foot">
                <div className="crd-reel__author">
                  <img src={portrait} alt="" />
                  <strong>{creator.handle.replace('@', '')}</strong>
                  <span>Paid partnership</span>
                </div>
                <p>{deliverable.caption}</p>
                <div className="crd-reel__bar">
                  <span>0:00 / {deliverable.duration}</span>
                  <i><b /></i>
                  <Volume2 size={15} />
                  <Maximize size={14} />
                </div>
              </div>
            </div>
            <div className="crd-frames">
              {frames.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`Frame ${i + 1}`}
                  className={`crd-frame${frame === i ? ' is-active' : ''}`}
                  onClick={() => setFrame(i)}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
            <div className="crd-media__actions">
              <button type="button" className="crd-btn crd-btn--ghost" onClick={() => alert('Downloading the original file…')}>
                <Download size={15} /> Download
              </button>
              <button type="button" className="crd-btn crd-btn--ghost" onClick={() => window.open('https://instagram.com', '_blank')}>
                <ExternalLink size={15} /> Open on Instagram
              </button>
            </div>
          </div>

          <div className="crd-main">
            <div className="crd-title">
              <div>
                <span className={`crd-badge crd-badge--${badge.tone}`}>{badge.label}</span>
                <h2>{deliverable.title}</h2>
                <div className="crd-meta">
                  <span><Camera size={13} /> {deliverable.type}</span>
                  <span><CalendarDays size={13} /> {deliverable.submittedDate.replace('Submitted on ', 'Submitted ')}</span>
                  <span><ShieldCheck size={13} /> AI score {deliverable.complianceScore}%</span>
                </div>
              </div>
            </div>

            {tab === 'content' && (
              <ContentTab
                creator={creator}
                deliverable={deliverable}
                record={record}
                net={net}
                paymentsDone={paymentsDone}
                onApprove={() => setSheet('approve')}
                onRevise={() => setSheet('revise')}
                onRelease={() => (paymentsDone ? releasePayment() : setSetupOpen(true))}
                onRemind={() => {
                  update((r) => ({ ...r, events: [...r.events, event('you', `Reminder sent to ${creator.name}`)] }));
                  setToast(`Reminder sent to ${creator.name}.`);
                }}
                onResubmitted={() => {
                  update((r) => ({
                    ...r,
                    stage: 'business_review',
                    events: [...r.events, event('creator', `${creator.name} resubmitted the content`)],
                  }));
                  setToast('Resubmission received. It is ready for review.');
                }}
                onRate={(rating) => {
                  update((r) => ({
                    ...r,
                    rating,
                    events: [...r.events, event('you', `You rated ${creator.name}`)],
                  }));
                  setToast('Thanks. Your rating updates the creator’s reputation.');
                }}
              />
            )}

            {tab === 'performance' && (
              <PerformanceTab
                creator={creator}
                deliverable={deliverable}
                published={published}
                onAnalytics={() => navigate('/business/analytics')}
              />
            )}

            {tab === 'payments' && (
              <PaymentsTab
                creator={creator}
                record={record}
                milestone={milestone}
                tds={tds}
                net={net}
                milestoneLabel={`Milestone ${index + 1} of ${deliverables.length}`}
                paymentsDone={paymentsDone}
                payingFrom={payingFrom}
                onSetup={() => setSetupOpen(true)}
                onRelease={releasePayment}
              />
            )}

            {tab === 'activity' && <ActivityTab record={record} creatorName={creator.name} onSend={sendMessage} />}
          </div>
        </div>

        {sheet === 'approve' && (
          <ApproveSheet
            creator={creator}
            deliverable={deliverable}
            milestone={milestone}
            tds={tds}
            net={net}
            paymentsDone={paymentsDone}
            payingFrom={payingFrom}
            onSetup={() => setSetupOpen(true)}
            onCancel={() => setSheet(null)}
            onConfirm={approve}
          />
        )}

        {sheet === 'revise' && (
          <ReviseSheet
            creatorName={creator.name}
            revisionsUsed={record.revisionsUsed}
            failedChecks={COMPLIANCE_LABELS.filter((c) => !passes(deliverable.checks[c.key])).map((c) => c.label)}
            onCancel={() => setSheet(null)}
            onSubmit={requestChanges}
          />
        )}

        {toast && (
          <div className="crd-toast" role="status">
            <CircleCheck size={16} /> {toast}
          </div>
        )}
      </aside>

      <PaymentSetupModal
        open={setupOpen}
        reason={`Add your payment details to release ${inr(net)} to ${creator.name}.`}
        onClose={() => setSetupOpen(false)}
        onSaved={() => {
          setSetupOpen(false);
          setToast('Payments are set up. You can release payments now.');
        }}
      />
    </>
  );
}

/* ── Content tab ───────────────────────────────────────────── */

interface ContentTabProps {
  creator: CreatorData;
  deliverable: ContentDeliverable;
  record: ReviewRecord;
  net: number;
  paymentsDone: boolean;
  onApprove: () => void;
  onRevise: () => void;
  onRelease: () => void;
  onRemind: () => void;
  onResubmitted: () => void;
  onRate: (rating: Rating) => void;
}

function ContentTab({
  creator,
  deliverable,
  record,
  net,
  paymentsDone,
  onApprove,
  onRevise,
  onRelease,
  onRemind,
  onResubmitted,
  onRate,
}: ContentTabProps) {
  const checks = COMPLIANCE_LABELS.map((c) => ({ ...c, value: deliverable.checks[c.key], ok: passes(deliverable.checks[c.key]) }));
  const flagged = checks.filter((c) => !c.ok).length;

  return (
    <>
      <Lifecycle record={record} />

      <section className={`crd-decision crd-decision--${record.stage}`}>
        {record.stage === 'in_progress' && (
          <div className="crd-decision__row">
            <Clock size={18} />
            <div>
              <strong>Waiting for the creator</strong>
              <p>{creator.name} hasn’t submitted this deliverable yet. We’ll notify you when it arrives.</p>
            </div>
            <button type="button" className="crd-btn crd-btn--ghost" onClick={onRemind}>Send reminder</button>
          </div>
        )}

        {record.stage === 'business_review' && (
          <>
            <div className="crd-decision__head">
              <div>
                <span className="crd-eyebrow">Your decision</span>
                <strong>Is this ready to go live?</strong>
              </div>
              <div className="crd-payout">
                <span>Releases on approval</span>
                <b>{inr(net)}</b>
              </div>
            </div>
            <div className={`crd-ai-rec${flagged ? ' is-warn' : ''}`}>
              <Sparkles size={15} />
              <p>
                {flagged
                  ? <><b>AI suggests a closer look.</b> {flagged} check{flagged > 1 ? 's' : ''} flagged below. Request changes if needed.</>
                  : <><b>AI recommends approving.</b> All {checks.length} brand and compliance checks passed.</>}
              </p>
              <span className="crd-ai-rec__rev">Revisions used {record.revisionsUsed}/{REVISIONS_INCLUDED}</span>
            </div>
            <div className="crd-decision__actions">
              <button type="button" className="crd-btn crd-btn--primary" onClick={onApprove}>
                <Check size={16} /> Approve content
              </button>
              <button type="button" className="crd-btn crd-btn--outline" onClick={onRevise}>
                <Pencil size={15} /> Request changes
              </button>
            </div>
          </>
        )}

        {record.stage === 'changes_requested' && (
          <>
            <div className="crd-decision__row">
              <TriangleAlert size={18} />
              <div>
                <strong>{record.request?.amendment ? 'Amendment awaiting creator consent' : 'Waiting for the creator to resubmit'}</strong>
                <p>
                  {record.request
                    ? `Due in ${record.request.dueDays} days · ${record.request.areas.join(', ')}`
                    : 'Changes were requested on this deliverable.'}
                </p>
              </div>
            </div>
            {record.request?.note && (
              <blockquote className="crd-quote">
                {record.request.timestamp && <b>At {record.request.timestamp}</b>} {record.request.note}
              </blockquote>
            )}
            <div className="crd-decision__actions">
              <button type="button" className="crd-btn crd-btn--ghost" onClick={onRemind}>Send reminder</button>
              <button type="button" className="crd-btn crd-btn--ghost" onClick={onResubmitted}>Mark as resubmitted</button>
            </div>
          </>
        )}

        {record.stage === 'approved' && record.payment !== 'paid' && (
          <div className="crd-decision__row">
            {record.payment === 'processing' ? <LoaderCircle size={18} className="crd-spin" /> : <Wallet size={18} />}
            <div>
              <strong>{record.payment === 'processing' ? 'Payment processing' : 'Approved · payment not released yet'}</strong>
              <p>
                {record.payment === 'processing'
                  ? `${inr(net)} is on its way to ${creator.payments.accountMasked}.`
                  : paymentsDone
                    ? `Release ${inr(net)} to ${creator.name} when you’re ready.`
                    : 'Set up payments to release this milestone.'}
              </p>
            </div>
            {record.payment === 'pending_release' && (
              <button type="button" className="crd-btn crd-btn--primary" onClick={onRelease}>
                {paymentsDone ? `Release ${inr(net)}` : 'Set up payments'}
              </button>
            )}
          </div>
        )}

        {record.stage === 'approved' && record.payment === 'paid' && (
          <>
            <div className="crd-decision__row">
              <CircleCheck size={18} />
              <div>
                <strong>Approved and paid</strong>
                <p>{inr(net)} paid to {creator.payments.accountMasked} · Invoice {creator.payments.invoiceId}</p>
              </div>
            </div>
            <RatingCard rating={record.rating} creatorName={creator.name} onRate={onRate} />
          </>
        )}
      </section>

      <div className="crd-cards">
        <section className="crd-card">
          <div className="crd-card__head">
            <h3><ShieldCheck size={16} /> AI compliance check</h3>
            <span className={`crd-score${flagged ? ' crd-score--warn' : ''}`}>{deliverable.complianceScore}%</span>
          </div>
          <ul className="crd-checks">
            {checks.map((c) => (
              <li key={c.key} className={c.ok ? '' : 'is-flagged'}>
                {c.ok ? <Check size={14} /> : <TriangleAlert size={14} />}
                <span>{c.label}</span>
                <b>{c.value}</b>
              </li>
            ))}
          </ul>
          <p className="crd-note">
            AI checks are guidance, not a legal determination.{flagged ? ' Flagged items need your review.' : ''}
          </p>
        </section>

        <section className="crd-card">
          <div className="crd-card__head">
            <h3><FileText size={16} /> Content details</h3>
          </div>
          <dl className="crd-details">
            <dt>Caption</dt>
            <dd>{deliverable.caption}</dd>
            <dt>Hashtags</dt>
            <dd className="crd-tags">
              {deliverable.hashtags.map((tag) => <span key={tag}>{tag}</span>)}
            </dd>
            <dt>Location</dt>
            <dd>{deliverable.location}</dd>
            <dt>Posted</dt>
            <dd>{deliverable.postedOn}</dd>
          </dl>
        </section>
      </div>
    </>
  );
}

function Lifecycle({ record }: { record: ReviewRecord }) {
  const changes = record.stage === 'changes_requested';
  const steps = ['Submitted', 'AI check', 'Your review', changes ? 'Changes requested' : 'Approved', 'Paid'];
  const done =
    record.stage === 'in_progress' ? 0
      : record.stage === 'business_review' ? 2
        : changes ? 3
          : record.payment === 'paid' ? 5
            : 4;

  return (
    <ol className="crd-life" aria-label="Deliverable progress">
      {steps.map((label, i) => {
        const state = i < done ? 'done' : i === done ? 'current' : 'todo';
        const warn = changes && i === 3;
        return (
          <li key={label} className={`is-${state}${warn ? ' is-warn' : ''}`}>
            <span>{i < done ? warn ? <Pencil size={12} /> : <Check size={12} /> : i + 1}</span>
            <em>{label}</em>
          </li>
        );
      })}
    </ol>
  );
}

function RatingCard({
  rating,
  creatorName,
  onRate,
}: {
  rating?: Rating;
  creatorName: string;
  onRate: (rating: Rating) => void;
}) {
  const [draft, setDraft] = useState<Rating>(rating ?? { quality: 0, communication: 0, timeliness: 0 });
  const rows: [keyof Rating, string][] = [
    ['quality', 'Content quality'],
    ['communication', 'Communication'],
    ['timeliness', 'Timeliness'],
  ];
  const complete = rows.every(([k]) => draft[k] > 0);

  return (
    <div className="crd-rating">
      <strong>{rating ? `Your rating for ${creatorName}` : `Rate ${creatorName}`}</strong>
      {rows.map(([key, label]) => (
        <div key={key} className="crd-rating__row">
          <span>{label}</span>
          <div role="radiogroup" aria-label={label}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={draft[key] === n}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                disabled={!!rating}
                className={n <= draft[key] ? 'is-on' : ''}
                onClick={() => setDraft({ ...draft, [key]: n })}
              >
                <Star size={16} />
              </button>
            ))}
          </div>
        </div>
      ))}
      {!rating && (
        <button type="button" className="crd-btn crd-btn--outline" disabled={!complete} onClick={() => onRate(draft)}>
          Save rating
        </button>
      )}
    </div>
  );
}

/* ── Performance tab ───────────────────────────────────────── */

function PerformanceTab({
  creator,
  deliverable,
  published,
  onAnalytics,
}: {
  creator: CreatorData;
  deliverable: ContentDeliverable;
  published: boolean;
  onAnalytics: () => void;
}) {
  if (!published) {
    return (
      <div className="crd-empty">
        <TrendingUp size={22} />
        <strong>Results appear after this content is published</strong>
        <p>We only show measured data. Nothing is estimated for content that hasn’t gone live yet.</p>
      </div>
    );
  }

  const p = creator.performance;
  const kpis = [
    ['Views', p.views],
    ['Reach', p.reach],
    ['Engagement', p.engagement],
    ['Store visits', String(p.visits)],
    ['Cost per visit', p.cac],
    ['Coupon sales', p.sales],
  ];
  const week = [38, 62, 54, 80, 72, 96, 88];

  return (
    <>
      <div className="crd-kpis">
        {kpis.map(([label, value]) => (
          <div key={label} className="crd-kpi">
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="crd-cards">
        <section className="crd-card">
          <div className="crd-card__head">
            <h3>Views, last 7 days</h3>
            <span className="crd-grade">Grade {p.grade}</span>
          </div>
          <div className="crd-bars" aria-hidden="true">
            {week.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}
          </div>
          <div className="crd-engage">
            <span><Heart size={14} /> {deliverable.likes}</span>
            <span><MessageCircle size={14} /> {deliverable.comments}</span>
            <span><Share2 size={14} /> {deliverable.shares}</span>
            <span><Bookmark size={14} /> {deliverable.saves}</span>
          </div>
        </section>

        <section className="crd-card crd-card--ai">
          <div className="crd-card__head">
            <h3><Sparkles size={16} /> AI insight</h3>
          </div>
          <p>{p.aiNote}</p>
          <p className="crd-note">
            {p.couponsUsed} coupon redemptions tracked. Budget changes based on this need your approval.
          </p>
          <button type="button" className="crd-btn crd-btn--outline" onClick={onAnalytics}>
            Review in Analytics
          </button>
        </section>
      </div>
    </>
  );
}

/* ── Payments tab ──────────────────────────────────────────── */

function PaymentsTab({
  creator,
  record,
  milestone,
  tds,
  net,
  milestoneLabel,
  paymentsDone,
  payingFrom,
  onSetup,
  onRelease,
}: {
  creator: CreatorData;
  record: ReviewRecord;
  milestone: number;
  tds: number;
  net: number;
  milestoneLabel: string;
  paymentsDone: boolean;
  payingFrom: string;
  onSetup: () => void;
  onRelease: () => void;
}) {
  const steps: [PaymentStage, string, string][] = [
    ['committed', 'Committed', 'Deal confirmed, amount reserved'],
    ['pending_release', 'Pending release', 'Content approved'],
    ['processing', 'Processing', 'Transfer started'],
    ['paid', 'Paid', 'Funds received by creator'],
  ];
  const current = steps.findIndex(([key]) => key === record.payment);

  return (
    <>
      <section className="crd-card">
        <div className="crd-card__head">
          <h3><Wallet size={16} /> {milestoneLabel}</h3>
          <span className="crd-muted">Deal total {creator.payments.totalFee}</span>
        </div>
        <dl className="crd-sum">
          <dt>Milestone amount</dt>
          <dd>{inr(milestone)}</dd>
          <dt>TDS (1%)</dt>
          <dd>− {inr(tds)}</dd>
          <dt className="is-total">Creator receives</dt>
          <dd className="is-total">{inr(net)}</dd>
        </dl>
      </section>

      <section className="crd-card">
        <div className="crd-card__head">
          <h3>Payment status</h3>
        </div>
        <ol className="crd-pay">
          {steps.map(([key, label, sub], i) => (
            <li key={key} className={i < current || record.payment === 'paid' ? 'is-done' : i === current ? 'is-current' : ''}>
              <span>{i < current || record.payment === 'paid' ? <Check size={12} /> : i + 1}</span>
              <div>
                <strong>{label}</strong>
                <em>{sub}</em>
              </div>
            </li>
          ))}
        </ol>
        <p className="crd-note">Campaign status and payment status are tracked separately.</p>
      </section>

      <section className="crd-card">
        <dl className="crd-details">
          <dt>Paying from</dt>
          <dd>{paymentsDone ? payingFrom : 'Not set up yet'}</dd>
          <dt>Paying to</dt>
          <dd>{creator.payments.accountMasked}</dd>
          <dt>Invoice</dt>
          <dd>{record.payment === 'paid' ? creator.payments.invoiceId : 'Generated when paid'}</dd>
        </dl>
        <div className="crd-links">
          {!paymentsDone && (
            <button type="button" className="crd-btn crd-btn--primary" onClick={onSetup}>Set up payments</button>
          )}
          {paymentsDone && record.stage === 'approved' && record.payment === 'pending_release' && (
            <button type="button" className="crd-btn crd-btn--primary" onClick={onRelease}>Release {inr(net)}</button>
          )}
          {record.payment === 'paid' && (
            <button type="button" className="crd-btn crd-btn--ghost" onClick={() => alert(`Downloading ${creator.payments.invoiceId}…`)}>
              <Download size={15} /> Download invoice
            </button>
          )}
        </div>
      </section>
    </>
  );
}

/* ── Activity tab ──────────────────────────────────────────── */

function ActivityTab({
  record,
  creatorName,
  onSend,
}: {
  record: ReviewRecord;
  creatorName: string;
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState('');
  const icons = { ai: Bot, you: User, creator: Camera, system: ShieldCheck };

  return (
    <section className="crd-card">
      <div className="crd-card__head">
        <h3>Activity &amp; audit log</h3>
        <span className="crd-muted">Every action is recorded</span>
      </div>
      <ol className="crd-log">
        {[...record.events].reverse().map((e) => {
          const Icon = icons[e.actor];
          return (
            <li key={e.id} className={`is-${e.actor}`}>
              <span><Icon size={14} /></span>
              <div>
                <p>{e.text}</p>
                <em>{e.time}</em>
              </div>
            </li>
          );
        })}
      </ol>
      <form
        className="crd-compose"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          onSend(text.trim());
          setText('');
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Message ${creatorName}…`}
          aria-label={`Message ${creatorName}`}
        />
        <button type="submit" aria-label="Send" disabled={!text.trim()}>
          <Send size={16} />
        </button>
      </form>
    </section>
  );
}

/* ── Sheets ────────────────────────────────────────────────── */

function ApproveSheet({
  creator,
  deliverable,
  milestone,
  tds,
  net,
  paymentsDone,
  payingFrom,
  onSetup,
  onCancel,
  onConfirm,
}: {
  creator: CreatorData;
  deliverable: ContentDeliverable;
  milestone: number;
  tds: number;
  net: number;
  paymentsDone: boolean;
  payingFrom: string;
  onSetup: () => void;
  onCancel: () => void;
  onConfirm: (release: boolean) => void;
}) {
  const [reviewed, setReviewed] = useState(false);

  return (
    <div className="crd-sheet" role="dialog" aria-modal="true" aria-label="Approve content">
      <div className="crd-sheet__panel">
        <h3>Approve “{deliverable.title}”</h3>
        <p className="crd-muted">Approving confirms this deliverable meets the agreed brief.</p>

        <dl className="crd-sum">
          <dt>Creator</dt>
          <dd>{creator.name}</dd>
          <dt>Milestone amount</dt>
          <dd>{inr(milestone)}</dd>
          <dt>TDS (1%)</dt>
          <dd>− {inr(tds)}</dd>
          <dt className="is-total">Creator receives</dt>
          <dd className="is-total">{inr(net)}</dd>
        </dl>

        {paymentsDone ? (
          <p className="crd-info"><Wallet size={15} /> Paying from {payingFrom}</p>
        ) : (
          <div className="crd-info crd-info--warn">
            <TriangleAlert size={15} />
            <span>Payments aren’t set up yet. You can approve now and release the payment later.</span>
            <button type="button" onClick={onSetup}>Set up</button>
          </div>
        )}

        <label className="crd-check">
          <input type="checkbox" checked={reviewed} onChange={(e) => setReviewed(e.target.checked)} />
          I’ve watched the content and reviewed the AI checks
        </label>

        <div className="crd-sheet__actions">
          <button type="button" className="crd-btn crd-btn--ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="crd-btn crd-btn--outline" disabled={!reviewed} onClick={() => onConfirm(false)}>
            Approve only
          </button>
          <button
            type="button"
            className="crd-btn crd-btn--primary"
            disabled={!reviewed || !paymentsDone}
            onClick={() => onConfirm(true)}
          >
            Approve &amp; release {inr(net)}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviseSheet({
  creatorName,
  revisionsUsed,
  failedChecks,
  onCancel,
  onSubmit,
}: {
  creatorName: string;
  revisionsUsed: number;
  failedChecks: string[];
  onCancel: () => void;
  onSubmit: (request: ChangeRequest) => void;
}) {
  const [areas, setAreas] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [dueDays, setDueDays] = useState(3);
  const [scope, setScope] = useState(false);
  const [tried, setTried] = useState(false);

  const outOfRevisions = revisionsUsed >= REVISIONS_INCLUDED;
  const amendment = scope || outOfRevisions;
  const noteError = note.trim().length < 10 ? 'Describe what should change (at least 10 characters).' : '';
  const areaError = areas.length ? '' : 'Pick at least one area.';

  const toggle = (area: string) =>
    setAreas((list) => (list.includes(area) ? list.filter((a) => a !== area) : [...list, area]));

  return (
    <div className="crd-sheet" role="dialog" aria-modal="true" aria-label="Request changes">
      <form
        className="crd-sheet__panel"
        onSubmit={(e) => {
          e.preventDefault();
          setTried(true);
          if (noteError || areaError) return;
          onSubmit({ areas, note: note.trim(), timestamp: timestamp.trim(), dueDays, amendment });
        }}
      >
        <h3>Request changes from {creatorName}</h3>
        <p className="crd-muted">
          {outOfRevisions
            ? `All ${REVISIONS_INCLUDED} included revisions are used. Further changes need an amendment.`
            : `Revision ${revisionsUsed + 1} of ${REVISIONS_INCLUDED} included in the contract.`}
        </p>

        {failedChecks.length > 0 && (
          <div className="crd-info crd-info--warn">
            <TriangleAlert size={15} />
            <span>AI flagged: {failedChecks.join(', ')}</span>
          </div>
        )}

        <fieldset className="crd-field">
          <legend>What needs to change?</legend>
          <div className="crd-chips">
            {CHANGE_AREAS.map((area) => (
              <button
                key={area}
                type="button"
                aria-pressed={areas.includes(area)}
                className={areas.includes(area) ? 'is-on' : ''}
                onClick={() => toggle(area)}
              >
                {area}
              </button>
            ))}
          </div>
          {tried && areaError && <span className="crd-error">{areaError}</span>}
        </fieldset>

        <div className="crd-field">
          <label htmlFor="crd-note">Feedback for the creator</label>
          <textarea
            id="crd-note"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Be specific, e.g. “Show the café signage in the first 3 seconds and say the offer code out loud.”"
          />
          {tried && noteError && <span className="crd-error">{noteError}</span>}
        </div>

        <div className="crd-field-row">
          <div className="crd-field">
            <label htmlFor="crd-ts">Timestamp (optional)</label>
            <input id="crd-ts" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} placeholder="0:12" />
          </div>
          <div className="crd-field">
            <label htmlFor="crd-due">Resubmit within</label>
            <select id="crd-due" value={dueDays} onChange={(e) => setDueDays(Number(e.target.value))}>
              <option value={2}>2 days</option>
              <option value={3}>3 days</option>
              <option value={5}>5 days</option>
            </select>
          </div>
        </div>

        <label className="crd-check">
          <input type="checkbox" checked={scope} onChange={(e) => setScope(e.target.checked)} />
          This changes the agreed deliverable (new format, extra content or different usage)
        </label>

        {amendment && (
          <div className="crd-info crd-info--warn">
            <TriangleAlert size={15} />
            <span>This will be sent as a contract amendment. The creator must agree, and the price may change.</span>
          </div>
        )}

        <div className="crd-sheet__actions">
          <button type="button" className="crd-btn crd-btn--ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" className="crd-btn crd-btn--primary">
            {amendment ? 'Propose amendment' : 'Send change request'}
          </button>
        </div>
      </form>
    </div>
  );
}
