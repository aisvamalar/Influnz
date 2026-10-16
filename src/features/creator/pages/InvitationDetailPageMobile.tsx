import { useState } from 'react';
import { BadgeCheck, ChevronLeft, Share2 } from 'lucide-react';
import { inr } from '../format';
import {
  DETAIL_TABS, STATUS,
  DetailPanels, FitBlock, StepRail, TermsList, WhyBlock,
  pieceCount, progress, rateOf, useInvitationDetail,
  type DetailTab,
} from './invitationBits';
import './creator-invitations.css';
import './creator-invitations-mobile.css';

export default function InvitationDetailMobile() {
  const detail = useInvitationDetail();
  const [tab, setTab] = useState<DetailTab>('overview');
  const { inv, toast, confirming, askDecline, cancelDecline, accept, decline, share, open, next, go, back } = detail;

  if (!inv) {
    return (
      <div className="idm-empty">
        <h2>Invitation not found</h2>
        <p>This campaign may have been removed by the brand.</p>
        <button type="button" className="idm-text" onClick={back}>Back to invitations</button>
      </div>
    );
  }

  const { brief } = inv;
  const status = STATUS[inv.status];
  const step = progress(inv.status);
  const pieces = pieceCount(inv);
  const rate = rateOf(inv);
  const docked = open || !next || inv.status === 'accepted' || inv.status === 'contract_pending';

  return (
    <div className={`idm${docked ? ' has-dock' : ''}`}>
      <div className="idm-mast">
        <div className="idm-hero">
          {inv.image ? <img src={inv.image} alt="" /> : <span className="idm-hero__fallback">{inv.brand.slice(0, 1)}</span>}
          <div className="idm-tools">
            <button type="button" className="idm-back" onClick={back}>
              <ChevronLeft size={16} /> Back
            </button>
            <button type="button" className="idm-share" aria-label="Share invitation" onClick={share}>
              <Share2 size={15} />
            </button>
          </div>
        </div>
        <div className="idm-intro">
          <p className="idm-kicker">
            <span className={`tone-${status.tone}`}>{status.label}</span>
            <span>{inv.matchPct}% fit</span>
          </p>
          <h1>{brief.title}</h1>
          <p className="idm-byline">
            <span>
              {inv.brand}
              {inv.brandVerified && <BadgeCheck size={14} aria-label="Verified brand" />}
            </span>
            <span>{inv.category}</span>
            <span>{inv.location}</span>
          </p>
          <p className="idm-lead">{brief.summary}</p>
        </div>
      </div>

      <section className="idm-offer" id="inv-offer" aria-label="Your payout">
        <div>
          <span>Your payout</span>
          <strong>{inr(rate)}</strong>
        </div>
        <div>
          <span>The work</span>
          <strong>{pieces} piece{pieces === 1 ? '' : 's'}</strong>
          {inv.paymentProtected && <em>Payment protected</em>}
        </div>
      </section>

      {!open && next && !docked && (
        <button type="button" className="idm-go" onClick={() => go(next.to)}>{next.label}</button>
      )}

      <StepRail
        inv={inv}
        className="idm-steps"
        onHere={index => {
          if (index === 0) setTab('overview');
          const id = index === 0 ? 'inv-brief' : 'inv-offer';
          window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
        }}
      />
      <p className="idm-stepnote">{step.note}</p>

      <WhyBlock inv={inv} />

      <section className="idm-terms">
        <h2>Deal terms</h2>
        <TermsList inv={inv} />
      </section>

      <div className="idm-tabs" role="tablist" aria-label="Invitation sections">
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
      <FitBlock inv={inv} />

      {docked && (
        <div className="idm-dock">
          {open && confirming && (
            <>
              <button type="button" className="idm-ghost" onClick={cancelDecline}>Keep</button>
              <button type="button" className="idm-danger" onClick={decline}>Decline</button>
            </>
          )}
          {open && !confirming && (
            <>
              <button type="button" className="idm-quiet" onClick={askDecline}>Decline</button>
              <button type="button" className="idm-ghost" onClick={() => go(`/creator/negotiation/${inv.id}`)}>Counter</button>
              <button type="button" className="idm-go" onClick={accept}>Accept</button>
            </>
          )}
          {!open && next && (
            <button type="button" className="idm-go" onClick={() => go(next.to)}>{next.label}</button>
          )}
          {!open && !next && inv.status !== 'accepted' && <p>This invitation is closed.</p>}
        </div>
      )}

      {toast && <div className="idm-toast" role="status">{toast}</div>}
    </div>
  );
}
