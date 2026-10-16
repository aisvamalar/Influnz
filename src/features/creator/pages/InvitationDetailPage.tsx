import { useState } from 'react';
import { BadgeCheck, ChevronLeft, Share2 } from 'lucide-react';
import { useResponsive } from '../../../hooks/useResponsive';
import { dateRange, inr } from '../format';
import InvitationDetailMobile from './InvitationDetailPageMobile';
import {
  DETAIL_TABS, STATUS,
  DetailPanels, FitBlock, StepRail, TermsList, WhyBlock,
  pieceCount, progress, rateOf, useInvitationDetail,
  type DetailTab,
} from './invitationBits';
import './creator-invitations.css';

export default function InvitationDetailPage() {
  const { isMobile } = useResponsive();
  return isMobile ? <InvitationDetailMobile /> : <InvitationDetailWeb />;
}

function InvitationDetailWeb() {
  const detail = useInvitationDetail();
  const [tab, setTab] = useState<DetailTab>('overview');
  const { inv, toast, confirming, askDecline, cancelDecline, accept, decline, share, open, next, go, back } = detail;

  if (!inv) {
    return (
      <div className="invd-empty">
        <h2>Invitation not found</h2>
        <p>This campaign may have been removed by the brand.</p>
        <button type="button" className="iv-text" onClick={back}>Back to invitations</button>
      </div>
    );
  }

  const { brief } = inv;
  const status = STATUS[inv.status];
  const step = progress(inv.status);
  const pieces = pieceCount(inv);
  const rate = rateOf(inv);

  return (
    <div className="invd">
      <header className="invd-top">
        <button type="button" className="invd-back" onClick={back}>
          <ChevronLeft size={16} /> Invitations
        </button>
        <button type="button" className="invd-share" onClick={share}>
          <Share2 size={14} /> Share
        </button>
      </header>

      <div className="invd-sheet">
        <figure className="invd-photo">
          {inv.image ? <img src={inv.image} alt="" /> : <span>{inv.brand.slice(0, 1)}</span>}
        </figure>

        <div className="invd-intro">
          <p className="invd-kicker">
            <span className={`tone-${status.tone}`}>{status.label}</span>
            <span>{inv.matchPct}% fit</span>
            <span>{inv.category}</span>
          </p>
          <h1>{brief.title}</h1>
          <p className="invd-byline">
            <span>
              {inv.brand}
              {inv.brandVerified && <BadgeCheck size={15} aria-label="Verified brand" />}
            </span>
            <span>{inv.location}</span>
            <span>{brief.platforms[0] || 'Any platform'}</span>
            <span>{dateRange(brief.startDate, brief.endDate)}</span>
          </p>
          <p className="invd-lead">{brief.summary}</p>
        </div>

        <StepRail
          inv={inv}
          className="invd-steps"
          onHere={index => {
            if (index === 0) setTab('overview');
            const id = index === 0 ? 'inv-brief' : 'inv-offer';
            window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
          }}
        />
        <p className="invd-stepnote">{step.note}</p>

        <WhyBlock inv={inv} />

        <div className="invd-tabs" role="tablist" aria-label="Invitation sections">
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
        <div id="inv-brief">
          <DetailPanels inv={inv} tab={tab} />
        </div>
      </div>

      <aside className="invd-side">
        <section className="invd-offer" id="inv-offer">
          <span>Your payout</span>
          <strong>{inr(rate)}</strong>
          <p>
            {inv.status === 'accepted'
              ? 'Offer accepted. Continue to the deal room.'
              : `For ${pieces} piece${pieces === 1 ? '' : 's'}. Accepting stays on this page and confirms the offer.`}
          </p>
          {inv.paymentProtected && <em>Payment protected</em>}
          <div className="invd-actions">
            {open && confirming && (
              <div className="invd-confirm">
                <p>Decline this invitation?</p>
                <button type="button" className="invd-btn invd-btn--ghost" onClick={cancelDecline}>Keep it</button>
                <button type="button" className="invd-btn invd-btn--quiet" onClick={decline}>Decline</button>
              </div>
            )}
            {open && !confirming && (
              <>
                <button type="button" className="invd-btn" onClick={accept}>Accept</button>
                <button type="button" className="invd-btn invd-btn--ghost" onClick={() => go(`/creator/negotiation/${inv.id}`)}>Counter</button>
                <button type="button" className="invd-btn invd-btn--quiet" onClick={askDecline}>Decline</button>
              </>
            )}
            {!open && next && <button type="button" className="invd-btn" onClick={() => go(next.to)}>{next.label}</button>}
            {!open && !next && inv.status !== 'accepted' && <p className="invd-closed">{step.note}. This invitation is closed.</p>}
          </div>
        </section>
        <h2 className="invd-label">Deal terms</h2>
        <TermsList inv={inv} />
        <FitBlock inv={inv} />
      </aside>

      {toast && <div className="invd-toast" role="status">{toast}</div>}
    </div>
  );
}
