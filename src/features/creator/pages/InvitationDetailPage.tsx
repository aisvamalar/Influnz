import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Check, Clapperboard, FileText, LayoutGrid, Megaphone, MessageSquare,
  ShieldCheck, Sparkles, Target, UserCheck, Wallet, X,
} from 'lucide-react';
import { useResponsive } from '../../../hooks/useResponsive';
import { useCreator } from '../CreatorContext';
import { Button, EmptyState, Toast } from '../ui';
import {
  BriefPanel, CampaignHero, ChecklistPanel, EligibilityPanel, MatchPanel, Panel, PayoutSchedule,
  SpecList, StageTiles, TermsGrid, pieceCount,
} from '../campaignParts';
import { inr } from '../format';
import '../campaign-ui.css';

type Tab = 'overview' | 'deliverables' | 'terms' | 'brief';

const TABS: Array<{ key: Tab; label: string; icon: typeof LayoutGrid }> = [
  { key: 'overview', label: 'Overview', icon: LayoutGrid },
  { key: 'deliverables', label: 'Deliver', icon: Clapperboard },
  { key: 'terms', label: 'Terms', icon: FileText },
  { key: 'brief', label: 'Brief', icon: Megaphone },
];

export default function InvitationDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const { getInvitation, updateInvitation } = useCreator();
  const inv = getInvitation(id);
  const [tab, setTab] = useState<Tab>('overview');
  const [toast, setToast] = useState<string | null>(null);

  if (!inv) {
    return (
      <div className="cx-panel">
        <EmptyState
          icon={X} title="Invitation not found"
          text="This campaign may have been unpublished or removed by the brand."
          action={<Button variant="ghost" onClick={() => navigate('/creator/invitations')}>Back to invitations</Button>}
        />
      </div>
    );
  }

  const { brief } = inv;
  const open = inv.status === 'new' || inv.status === 'in_negotiation';
  const pieces = pieceCount(brief.deliverableSpecs);

  const flash = (msg: string) => { setToast(msg); window.setTimeout(() => setToast(null), 2600); };
  const accept = () => {
    updateInvitation(inv.id, { status: 'accepted', agreedRate: inv.agreedRate ?? inv.proposedRate });
    flash('Offer accepted, opening your deal room');
    window.setTimeout(() => navigate(`/creator/deal/${inv.id}`), 700);
  };
  const decline = () => {
    updateInvitation(inv.id, { status: 'declined' });
    flash('Invitation declined');
    window.setTimeout(() => navigate('/creator/invitations'), 700);
  };

  // What the next step is for this creator, whatever state the campaign is in.
  const next = (() => {
    if (open) return null;
    if (inv.status === 'accepted' || inv.status === 'contract_pending') return { label: 'Open deal room', to: `/creator/deal/${inv.id}`, text: 'Your offer is agreed. Review and sign the contract to start.' };
    if (inv.status === 'active' || inv.status === 'completed') return { label: 'Open campaign', to: `/creator/campaigns/${inv.id}`, text: 'This campaign is under way. Track and submit your content.' };
    return null;
  })();

  const offerPanel = (
    <Panel icon={<Wallet size={18} />} title={open ? 'Your offer' : 'Your payout'} sub={open ? 'Set for you by the brand' : undefined} id="offer">
      <div className="cx-amount" style={{ fontSize: '1.875rem' }}>{inr(inv.agreedRate ?? inv.proposedRate)}</div>
      <p className="cx-muted" style={{ margin: '6px 0 16px', fontSize: '0.8125rem' }}>
        For {pieces} {pieces === 1 ? 'piece' : 'pieces'} of content{inv.paymentProtected ? ', held safely in escrow until you deliver' : ''}.
      </p>
      {open ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button onClick={accept}><Check size={16} /> Accept offer</Button>
          <Button variant="ghost" onClick={() => navigate(`/creator/negotiation/${inv.id}`)}>
            <MessageSquare size={16} /> Negotiate with AI
          </Button>
          <Button variant="danger" onClick={decline}><X size={16} /> Decline</Button>
        </div>
      ) : next ? (
        <>
          <p className="cx-text" style={{ marginBottom: 12 }}>{next.text}</p>
          <Button style={{ width: '100%' }} onClick={() => navigate(next.to)}>{next.label} <ArrowRight size={16} /></Button>
        </>
      ) : (
        <p className="cx-text cx-muted">This invitation is closed.</p>
      )}
    </Panel>
  );

  const matchPanel = <Panel icon={<Sparkles size={18} />} title="Why you" sub="How this campaign fits your profile"><MatchPanel inv={inv} /></Panel>;
  const deliverablesPanel = (
    <Panel
      icon={<Clapperboard size={18} />} title="What you will deliver"
      sub={`${pieces} ${pieces === 1 ? 'piece' : 'pieces'} across ${brief.platforms.join(', ')}`}
    >
      <SpecList specs={brief.deliverableSpecs} />
    </Panel>
  );
  const termsPanel = <Panel icon={<FileText size={18} />} title="Deal terms" sub="What you agree to by accepting"><TermsGrid inv={inv} /></Panel>;
  const payPanel = <Panel icon={<Wallet size={18} />} title="How you get paid" sub={brief.paymentTerms}><PayoutSchedule inv={inv} /></Panel>;
  const eligPanel = <Panel icon={<UserCheck size={18} />} title="What the brand asks for" sub="Checked against your passport"><EligibilityPanel brief={brief} /></Panel>;
  const briefPanel = <Panel icon={<Target size={18} />} title="Campaign brief" sub={`From ${inv.brand}`}><BriefPanel brief={brief} /></Panel>;
  const checkPanel = (
    <Panel icon={<ShieldCheck size={18} />} title="Before you submit" sub="The AI compliance check looks for these">
      <ChecklistPanel brief={brief} />
    </Panel>
  );

  return (
    <div className={`cx${isMobile ? ' is-tabbed' : ''}${isMobile && (open || next) ? ' has-actionbar' : ''}`}>
      <button className="cx-back" onClick={() => navigate('/creator/invitations')}>
        <ArrowLeft size={16} /> Invitations
      </button>

      <CampaignHero inv={inv} />

      {isMobile ? (
        <>
          <div className="cx-tabrow" role="tablist" aria-label="Campaign sections">
            {TABS.map(t => (
              <button key={t.key} role="tab" aria-selected={tab === t.key} className={tab === t.key ? 'is-on' : ''} onClick={() => setTab(t.key)}>
                <span><t.icon size={20} /></span>{t.label}
              </button>
            ))}
          </div>
          {tab === 'overview' && (<><StageTiles inv={inv} />{matchPanel}{eligPanel}{open && (
            <Button variant="ghost" onClick={decline} style={{ alignSelf: 'center' }}><X size={15} /> Not interested, decline</Button>
          )}</>)}
          {tab === 'deliverables' && (<>{deliverablesPanel}{checkPanel}</>)}
          {tab === 'terms' && (<>{termsPanel}{payPanel}</>)}
          {tab === 'brief' && briefPanel}
        </>
      ) : (
        <>
          <StageTiles inv={inv} />
          <div className="cx-cols">
            <div className="cx-stack">
              {deliverablesPanel}
              {briefPanel}
              {checkPanel}
            </div>
            <div className="cx-stack">
              {offerPanel}
              {matchPanel}
              {termsPanel}
              {payPanel}
              {eligPanel}
            </div>
          </div>
        </>
      )}

      {isMobile && (open || next) && (
        <div className="cx-actionbar" role="group" aria-label="Respond to this campaign">
          <div className="cx-actionbar__lead">
            <span>Your payout</span>
            <b>{inr(inv.agreedRate ?? inv.proposedRate)}</b>
          </div>
          {open ? (
            <>
              <Button variant="ghost" onClick={() => navigate(`/creator/negotiation/${inv.id}`)}><MessageSquare size={16} /> Negotiate</Button>
              <Button onClick={accept}><Check size={16} /> Accept</Button>
            </>
          ) : next ? (
            <Button onClick={() => navigate(next.to)}>{next.label} <ArrowRight size={16} /></Button>
          ) : null}
        </div>
      )}

      {toast && <Toast message={toast} icon={Check} />}
    </div>
  );
}
