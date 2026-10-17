/**
 * Invitation detail (prefix: ivd). Desktop: hero banner, the five-step rail, tabs and
 * the brief on the left; payout with Accept / Counter / Decline, deal terms and campaign
 * fit on the right. An open campaign opened from Browse uses the same screen, but the
 * creator is the one reaching out, so the only action is Express interest.
 * Phones get InvitationDetailPageMobile.
 */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, CircleCheck, Copy, Ellipsis, HandHeart, MailX, Share2, ShieldCheck } from 'lucide-react';
import { useResponsive } from '../../../hooks/useResponsive';
import { inr, timeAgo } from '../format';
import InvitationDetailMobile from './InvitationDetailPageMobile';
import { DETAIL_TABS, InterestRail, pieceCount, progress, rateOf, useInvitationDetail, StepRail, type DetailTab } from './invitationBits';
import { CampaignFit, Chips, DealTerms, DetailContent, MetaLine } from './invitationDetailParts';
import './creator-invitation-detail.css';

export default function InvitationDetailPage() {
  const { isMobile } = useResponsive();
  return isMobile ? <InvitationDetailMobile /> : <InvitationDetailWeb />;
}

type Detail = ReturnType<typeof useInvitationDetail>;

function InvitationDetailWeb() {
  const detail = useInvitationDetail();
  const [tab, setTab] = useState<DetailTab>('overview');
  const { inv, toast, share, back, backLabel, notify, browsing, interestAt } = detail;

  if (!inv) {
    return (
      <div className="ivd-missing">
        <h1>Invitation not found</h1>
        <p>This campaign may have been removed by the brand.</p>
        <button type="button" className="ivd-btn ivd-btn--primary" onClick={back}>Back to invitations</button>
      </div>
    );
  }

  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); notify('Copied'); } catch { notify('Could not copy'); }
  };

  return (
    <div className="ivd">
      <div className="ivd-top">
        <button type="button" className="ivd-backlink" onClick={back}>
          <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" /> {backLabel}
        </button>
        <div className="ivd-top__tools">
          <button type="button" className="ivd-tool" onClick={share}>
            <Share2 size={17} strokeWidth={1.9} aria-hidden="true" /> Share
          </button>
          <MoreMenu detail={detail} onCopyLink={() => copy(window.location.href)} />
        </div>
      </div>

      <div className="ivd-main">
        <section className="ivd-hero" aria-labelledby="ivd-title">
          {inv.image && <img className="ivd-hero__img" src={inv.image} alt="" />}
          <div className="ivd-hero__body">
            <Chips inv={inv} interested={Boolean(interestAt)} />
            <h1 id="ivd-title">{inv.brief.title}</h1>
            <MetaLine inv={inv} />
            <p className="ivd-hero__lead">{inv.brief.summary}</p>
          </div>
        </section>

        {browsing ? <InterestRail sent={Boolean(interestAt)} className="ivd-steps" /> : (
          <StepRail
            inv={inv}
            className="ivd-steps"
            onHere={index => {
              if (index === 0) setTab('overview');
              const id = index === 0 ? 'ivd-tabs' : 'ivd-offer';
              window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
            }}
          />
        )}

        <div className="ivd-tabs" id="ivd-tabs" role="tablist" aria-label="Invitation sections">
          {DETAIL_TABS.map(item => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={tab === item.key}
              className={tab === item.key ? 'is-on' : ''}
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" aria-label={DETAIL_TABS.find(t => t.key === tab)?.label}>
          <DetailContent inv={inv} tab={tab} onCopy={copy} />
        </div>
      </div>

      <aside className="ivd-side" aria-label="Offer">
        {browsing ? <InterestCard detail={detail} /> : <PayoutCard detail={detail} />}
        <DealTerms inv={inv} />
        <CampaignFit inv={inv} />
      </aside>

      {toast && createPortal(<div className="ivd-toast" role="status">{toast}</div>, document.body)}
    </div>
  );
}

/** Your payout with the one decision on this screen: Accept, then Counter, Decline last and quiet. */
export function PayoutCard({ detail }: { detail: Detail }) {
  const { inv, confirming, askDecline, cancelDecline, accept, decline, open, next, go } = detail;
  if (!inv) return null;
  const pieces = pieceCount(inv);
  const step = progress(inv.status);
  const note = inv.status === 'accepted' || inv.status === 'contract_pending'
    ? 'Offer accepted. Continue to the deal room to confirm the terms.'
    : inv.status === 'active' || inv.status === 'completed'
      ? 'This campaign is confirmed. Your work and payout live in the campaign.'
      : open
        ? `For ${pieces} piece${pieces === 1 ? '' : 's'}. Accepting stays on this page and confirms the offer.`
        : `${step.note}. This invitation is closed.`;

  return (
    <section className="ivd-box ivd-payout" id="ivd-offer" aria-labelledby="ivd-payout-title">
      <h2 id="ivd-payout-title">Your payout</h2>
      <strong className="ivd-payout__amount">{inr(rateOf(inv))}</strong>
      <p>{note}</p>
      {inv.paymentProtected && (
        <span className="ivd-payout__safe"><ShieldCheck size={17} strokeWidth={2} aria-hidden="true" /> Payment protected</span>
      )}

      <div className="ivd-payout__actions">
        {open && confirming && (
          <div className="ivd-confirm" role="group" aria-label="Confirm decline">
            <p>Decline this invitation? The brand will be told you passed.</p>
            <button type="button" className="ivd-btn ivd-btn--outline" onClick={cancelDecline}>Keep it</button>
            <button type="button" className="ivd-btn ivd-btn--danger" onClick={decline}>Decline</button>
          </div>
        )}
        {open && !confirming && (
          <>
            <button type="button" className="ivd-btn ivd-btn--primary" onClick={accept}>Accept</button>
            <button type="button" className="ivd-btn ivd-btn--outline" onClick={() => go(`/creator/negotiation/${inv.id}`)}>Counter</button>
            <button type="button" className="ivd-btn ivd-btn--danger" onClick={askDecline}>Decline</button>
          </>
        )}
        {!open && next && (
          <button type="button" className="ivd-btn ivd-btn--primary" onClick={() => go(next.to)}>
            {next.label === 'Continue' ? 'Continue to deal room' : next.label} <ArrowRight size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
}

/** Open campaign: the expected payout and one action, Express interest. Nothing is committed. */
export function InterestCard({ detail }: { detail: Detail }) {
  const { inv, interestAt, sendInterest, withdraw } = detail;
  if (!inv) return null;
  const pieces = pieceCount(inv);
  return (
    <section className="ivd-box ivd-payout" id="ivd-offer" aria-labelledby="ivd-payout-title">
      <h2 id="ivd-payout-title">Expected payout</h2>
      <strong className="ivd-payout__amount">{inr(rateOf(inv))}</strong>
      <p>
        For {pieces} piece{pieces === 1 ? '' : 's'}, based on your profile. {inv.brand} sets the final offer
        if they invite you.
      </p>

      {interestAt ? (
        <>
          <p className="ivd-sent">
            <CircleCheck size={18} strokeWidth={2.2} aria-hidden="true" />
            <span><b>Interest sent {timeAgo(interestAt)}</b>{inv.brand} sees your passport. If they pick you, the invitation arrives in Invitations.</span>
          </p>
          <div className="ivd-payout__actions">
            <button type="button" className="ivd-btn ivd-btn--quiet" onClick={withdraw}>Withdraw interest</button>
          </div>
        </>
      ) : (
        <>
          <div className="ivd-payout__actions">
            <button type="button" className="ivd-btn ivd-btn--primary" onClick={sendInterest}>
              <HandHeart size={17} strokeWidth={2} aria-hidden="true" /> Express interest
            </button>
          </div>
          <p className="ivd-fine">No commitment. You only agree to terms once the brand invites you and you accept.</p>
        </>
      )}
    </section>
  );
}

function MoreMenu({ detail, onCopyLink }: { detail: Detail; onCopyLink: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="ivd-more" ref={ref}>
      <button type="button" className="ivd-tool ivd-tool--icon" aria-label="More options" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(v => !v)}>
        <Ellipsis size={20} />
      </button>
      {open && (
        <div className="ivd-menu" role="menu">
          <button type="button" role="menuitem" onClick={() => { setOpen(false); onCopyLink(); }}>
            <Copy size={16} aria-hidden="true" /> Copy link
          </button>
          {detail.open && (
            <button type="button" role="menuitem" className="is-danger" onClick={() => {
              setOpen(false);
              detail.askDecline();
              window.setTimeout(() => document.getElementById('ivd-offer')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 40);
            }}>
              <MailX size={16} aria-hidden="true" /> Decline invitation
            </button>
          )}
        </div>
      )}
    </div>
  );
}
