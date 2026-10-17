/**
 * Invitation detail on phones (prefix: ivd, .ivd-m). The app header and tab bar step
 * aside on this screen (CreatorLayout), so it carries its own back bar and a sticky
 * payout bar with the one primary action: Accept for an invitation (it confirms the
 * terms in a bottom sheet, then opens the contract), Express interest for an open
 * campaign opened from Browse.
 */
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, CircleCheck, HandHeart, MessagesSquare, Share2 } from 'lucide-react';
import { inr, timeAgo } from '../format';
import { DETAIL_TABS, InterestRail, pieceCount, progress, rateOf, useInvitationDetail, StepRail, type DetailTab } from './invitationBits';
import { AcceptSheet, CampaignFit, Chips, DealTerms, DetailContent, MetaLine, QuickFacts } from './invitationDetailParts';
import './creator-invitation-detail.css';

export default function InvitationDetailMobile() {
  const detail = useInvitationDetail();
  const [tab, setTab] = useState<DetailTab>('overview');
  const {
    inv, toast, confirming, askDecline, cancelDecline, accept, accepting, confirmAccept, cancelAccept, decline, share, open,
    next, go, back, backLabel, notify, browsing, interestAt, sendInterest, withdraw,
  } = detail;

  if (!inv) {
    return (
      <div className="ivd-m">
        <div className="ivd-m__bar">
          <button type="button" className="ivd-m__icon" onClick={back} aria-label="Back to invitations"><ArrowLeft size={22} /></button>
          <h1>Invitation</h1>
        </div>
        <div className="ivd-missing">
          <h2>Invitation not found</h2>
          <p>This campaign may have been removed by the brand.</p>
          <button type="button" className="ivd-btn ivd-btn--primary" onClick={back}>Back to invitations</button>
        </div>
      </div>
    );
  }

  const pieces = pieceCount(inv);
  const step = progress(inv.status);
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); notify('Copied'); } catch { notify('Could not copy'); }
  };

  return (
    <div className="ivd-m">
      <div className="ivd-m__bar">
        <button type="button" className="ivd-m__icon" onClick={back} aria-label={`Back to ${backLabel.toLowerCase()}`}><ArrowLeft size={22} /></button>
        <h1>{browsing ? 'Open campaign' : 'Invitation'}</h1>
        <button type="button" className="ivd-m__icon" onClick={share} aria-label="Share campaign"><Share2 size={20} /></button>
      </div>

      <figure className="ivd-m__hero">
        {inv.image ? <img src={inv.image} alt="" /> : <span aria-hidden="true">{inv.brand[0]}</span>}
      </figure>

      <div className="ivd-m__intro">
        <Chips inv={inv} light interested={Boolean(interestAt)} />
        <h2 className="ivd-m__title">{inv.brief.title}</h2>
        <MetaLine inv={inv} />
        <p className="ivd-m__lead">{inv.brief.summary}</p>
      </div>

      <QuickFacts inv={inv} />

      <div className="ivd-m__actions" id="ivd-offer">
        {open && confirming && (
          <div className="ivd-confirm" role="group" aria-label="Confirm decline">
            <p>Decline this invitation? The brand will be told you passed.</p>
            <button type="button" className="ivd-btn ivd-btn--outline" onClick={cancelDecline}>Keep it</button>
            <button type="button" className="ivd-btn ivd-btn--danger" onClick={decline}>Decline</button>
          </div>
        )}
        {/* Accept sits in the payout bar at the bottom; the other two answers stay here. */}
        {open && !confirming && (
          <div className="ivd-m__pair">
            <button type="button" className="ivd-btn ivd-btn--outline" onClick={() => go(`/creator/negotiation/${inv.id}`)}>
              <MessagesSquare size={16} aria-hidden="true" /> Negotiate
            </button>
            <button type="button" className="ivd-btn ivd-btn--danger" onClick={askDecline}>Decline</button>
          </div>
        )}
        {browsing && !interestAt && (
          <p className="ivd-m__closed">You found this campaign yourself. Express interest and {inv.brand} can invite you. No commitment.</p>
        )}
        {browsing && interestAt && (
          <p className="ivd-sent">
            <CircleCheck size={18} strokeWidth={2.2} aria-hidden="true" />
            <span>
              <b>Interest sent {timeAgo(interestAt)}</b>If {inv.brand} picks you, the invitation arrives in Invitations.
              <button type="button" className="ivd-linkbtn" onClick={withdraw}>Withdraw interest</button>
            </span>
          </p>
        )}
        {!browsing && !open && next && <p className="ivd-m__closed">{step.note}. Continue from the bar below.</p>}
        {!browsing && !open && !next && <p className="ivd-m__closed">{step.note}. This invitation is closed.</p>}
      </div>

      {browsing ? <InterestRail sent={Boolean(interestAt)} className="ivd-steps ivd-steps--compact" /> : (
        <StepRail
          inv={inv}
          className="ivd-steps ivd-steps--compact"
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
        <DetailContent inv={inv} tab={tab} onCopy={copy} compact />
      </div>

      <DealTerms inv={inv} />
      <CampaignFit inv={inv} />

      {(open || next || browsing) && (
        <div className="ivd-dock">
          <div className="ivd-dock__pay">
            <strong>{inr(rateOf(inv))}</strong>
            <small>{browsing ? 'Expected' : 'Your payout'} · {pieces} piece{pieces === 1 ? '' : 's'}</small>
          </div>
          {browsing
            ? interestAt
              ? <span className="ivd-dock__sent"><CircleCheck size={17} strokeWidth={2.2} aria-hidden="true" /> Interest sent</span>
              : (
                <button type="button" className="ivd-btn ivd-btn--primary" onClick={sendInterest}>
                  <HandHeart size={17} strokeWidth={2} aria-hidden="true" /> Express interest
                </button>
              )
            : open
            ? <button type="button" className="ivd-btn ivd-btn--primary" onClick={accept}>Accept offer</button>
            : next && (
              <button type="button" className="ivd-btn ivd-btn--primary" onClick={() => go(next.to)}>
                {next.label} <ArrowRight size={16} aria-hidden="true" />
              </button>
            )}
        </div>
      )}

      {accepting && <AcceptSheet inv={inv} onConfirm={confirmAccept} onClose={cancelAccept} />}
      {toast && createPortal(<div className="ivd-toast ivd-toast--docked" role="status">{toast}</div>, document.body)}
    </div>
  );
}
