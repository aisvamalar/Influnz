import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CalendarRange, Check, CircleAlert, CircleCheck, Clapperboard, FileText, LayoutGrid, ListChecks,
  Megaphone, MessagesSquare, RefreshCw, ScanLine, Send, Sparkles, Target, Upload, Wallet, X,
} from 'lucide-react';
import { useResponsive } from '../../../hooks/useResponsive';
import { useCreator } from '../CreatorContext';
import { Button, EmptyState, Toast } from '../ui';
import {
  BriefPanel, CampaignHero, CampaignKpis, ChecklistPanel, DelivPill, DeliverableRow, DueText, Panel, PayoutSchedule,
  SpecRequirements, StageTiles, TermsGrid, TimelineList,
} from '../campaignParts';
import type { ComplianceCheck, Deliverable } from '../types';
import '../campaign-ui.css';

type Tab = 'deliver' | 'terms' | 'brief';

const TABS: Array<{ key: Tab; label: string; icon: typeof LayoutGrid }> = [
  { key: 'deliver', label: 'Deliver', icon: Clapperboard },
  { key: 'terms', label: 'Pay & terms', icon: Wallet },
  { key: 'brief', label: 'Brief', icon: Megaphone },
];

// Compliance runs against the brief's own checklist. The first submission of a
// deliverable fails the disclosure check and the re-upload passes, so the revision
// cycle can be seen end to end.
function runCompliance(checklist: string[], usageRights: string, attemptFailed: boolean): ComplianceCheck[] {
  const items = checklist.length ? checklist : ['Paid disclosure (#ad)', 'Product shown clearly'];
  return [
    ...items.map(label => {
      const isDisclosure = /disclosure|#ad/i.test(label);
      const failed = isDisclosure && attemptFailed;
      return { label, passed: !failed, detail: failed ? 'Add a clear #ad or Paid partnership label.' : undefined };
    }),
    { label: 'Usage rights acknowledged', passed: true, detail: usageRights },
  ];
}

export default function CampaignDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const { getInvitation, deliverables, ensureDeliverables, updateDeliverable, updateInvitation } = useCreator();
  const inv = getInvitation(id);
  const [tab, setTab] = useState<Tab>('deliver');
  const [toast, setToast] = useState<string | null>(null);
  const [failedOnce, setFailedOnce] = useState<Record<string, boolean>>({});
  const [checks, setChecks] = useState<Record<string, ComplianceCheck[]>>({});

  useEffect(() => { if (inv) ensureDeliverables(inv); }, [inv, ensureDeliverables]);

  const items = useMemo<Deliverable[]>(() => deliverables[id] ?? [], [deliverables, id]);

  useEffect(() => {
    if (items.length && items.every(d => d.status === 'approved') && inv?.status === 'active') {
      updateInvitation(id, { status: 'completed' });
    }
  }, [items, inv?.status, id, updateInvitation]);

  if (!inv) {
    return (
      <div className="cx-panel">
        <EmptyState
          icon={X} title="Campaign not found" text="This campaign is no longer available."
          action={<Button variant="ghost" onClick={() => navigate('/creator/campaigns')}>Back to campaigns</Button>}
        />
      </div>
    );
  }

  const { brief } = inv;
  const flash = (msg: string) => { setToast(msg); window.setTimeout(() => setToast(null), 2600); };
  const markActive = () => {
    if (inv.status === 'accepted' || inv.status === 'contract_pending') updateInvitation(inv.id, { status: 'active' });
  };
  const waitingForContract = inv.status === 'accepted' || inv.status === 'contract_pending';

  const upload = (d: Deliverable) => {
    updateDeliverable(inv.id, d.id, { status: 'uploaded', revisionNote: undefined });
    markActive();
    flash(`${d.label}: uploaded`);
  };

  const submitForReview = (d: Deliverable) => {
    const willFail = !failedOnce[d.id];
    const result = runCompliance(brief.checklist, inv.usageRights, willFail);
    setChecks(prev => ({ ...prev, [d.id]: result }));
    if (!result.every(c => c.passed)) {
      setFailedOnce(prev => ({ ...prev, [d.id]: true }));
      flash(`${d.label}: compliance failed, fix and re-submit`);
      return;
    }
    updateDeliverable(inv.id, d.id, { status: 'pending_approval' });
    flash(`${d.label}: sent to ${inv.brand} for review`);
  };

  // The brand's review, simulated until the business side feeds decisions back.
  const approve = (d: Deliverable) => {
    updateDeliverable(inv.id, d.id, { status: 'approved', revisionNote: undefined });
    flash(`${d.label}: approved`);
  };
  const requestChanges = (d: Deliverable) => {
    updateDeliverable(inv.id, d.id, { status: 'changes_requested', revisionNote: 'The brand asked for a small edit to the caption.' });
    flash(`${d.label}: changes requested`);
  };
  const reupload = (d: Deliverable) => {
    updateDeliverable(inv.id, d.id, { status: 'uploaded', revisionNote: undefined });
    flash(`${d.label}: re-uploaded`);
  };

  const nextItem = items.filter(d => d.status !== 'approved').sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];

  // The action that moves the next piece forward, shared by its row and the next-step panel.
  const actionFor = (d: Deliverable): { label: string; icon: typeof Upload; run: () => void } | null => {
    if (d.status === 'not_started') return { label: 'Upload', icon: Upload, run: () => upload(d) };
    if (d.status === 'uploaded') return { label: 'Check & submit', icon: ScanLine, run: () => submitForReview(d) };
    if (d.status === 'changes_requested') return { label: 'Re-upload', icon: Upload, run: () => reupload(d) };
    return null;
  };
  const nextAction = nextItem && !waitingForContract ? actionFor(nextItem) : null;

  const nextStep = (
    <Panel icon={<Target size={18} />} title="Your next step" focus>
      {waitingForContract ? (
        <>
          <p className="cx-next__lead">Sign the contract</p>
          <p className="cx-text cx-muted">It locks in your payout and unlocks your deliverables.</p>
          <div className="cx-next__go">
            <Button onClick={() => navigate(`/creator/deal/${inv.id}`)}>Open deal room <ArrowRight size={16} /></Button>
          </div>
        </>
      ) : inv.status === 'completed' ? (
        <>
          <p className="cx-next__lead"><CircleCheck size={18} className="cx-next__ok" /> All pieces approved</p>
          <p className="cx-text cx-muted">Your payout is being released.</p>
        </>
      ) : nextItem ? (
        <>
          <p className="cx-next__lead">
            {nextItem.status === 'changes_requested' ? 'Fix' : nextItem.status === 'pending_approval' ? 'Waiting on' : nextItem.status === 'uploaded' ? 'Submit' : 'Make'} {nextItem.label}
          </p>
          <div className="cx-next__meta">
            <DelivPill status={nextItem.status} />
            <DueText iso={nextItem.dueDate} />
          </div>
          {nextItem.revisionNote
            ? <p className="cx-flag"><CircleAlert size={15} aria-hidden="true" /><span>{nextItem.revisionNote}</span></p>
            : nextItem.notes && <p className="cx-text cx-muted">{nextItem.notes}</p>}
          {nextAction && (
            <div className="cx-next__go">
              <Button onClick={nextAction.run}><nextAction.icon size={16} /> {nextAction.label}</Button>
            </div>
          )}
        </>
      ) : (
        <p className="cx-text cx-muted">Nothing left to deliver.</p>
      )}
    </Panel>
  );

  const deliverPanel = (
    <Panel
      icon={<Clapperboard size={18} />} title="Your deliverables" tone="coral"
      sub={waitingForContract ? 'Unlocks once your contract is signed' : `${items.filter(d => d.status === 'approved').length} of ${items.length} approved`}
    >
      <div className="cx-delivs">
        {items.map(d => {
          const spec = brief.deliverableSpecs.find(s => d.id.includes(`_${s.id}_`));
          const result = checks[d.id];
          const failed = result && !result.every(c => c.passed);
          return (
            <DeliverableRow
              key={d.id} title={d.label} format={d.format ?? ''} platform={spec?.platform ?? 'Instagram'}
              spec={d.spec ?? ''} due={d.dueDate} note={d.notes} open={d === nextItem && !waitingForContract}
              state={d.status} status={<DelivPill status={d.status} />}
              flag={d.revisionNote}
              extra={result && (
                <div className={`cx-scan ${failed ? 'is-fail' : 'is-pass'}`}>
                  <div className="cx-scan__head">
                    <ScanLine size={15} aria-hidden="true" />
                    AI compliance {failed ? 'needs action' : 'passed'}
                  </div>
                  <ul className="cx-checks">
                    {result.map(c => (
                      <li key={c.label} className={c.passed ? 'is-ok' : 'is-no'}>
                        {c.passed ? <CircleCheck size={15} /> : <CircleAlert size={15} />}
                        <span>{c.label}{c.detail ? `: ${c.detail}` : ''}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            >
              {d.status === 'not_started' && (
                <Button small disabled={waitingForContract} onClick={() => upload(d)}><Upload size={14} /> Upload</Button>
              )}
              {d.status === 'uploaded' && (
                <Button small onClick={() => submitForReview(d)}><ScanLine size={14} /> Check &amp; submit</Button>
              )}
              {d.status === 'pending_approval' && (
                <>
                  <span className="cx-waiting"><Send size={14} aria-hidden="true" /> With {inv.brand}</span>
                  <Button variant="ghost" small onClick={() => approve(d)}><Check size={14} /> Simulate approve</Button>
                  <Button variant="ghost" small onClick={() => requestChanges(d)}><RefreshCw size={14} /> Simulate changes</Button>
                </>
              )}
              {d.status === 'changes_requested' && (
                <Button small onClick={() => reupload(d)}><Upload size={14} /> Re-upload</Button>
              )}
            </DeliverableRow>
          );
        })}
      </div>
    </Panel>
  );

  const checkPanel = (
    <Panel icon={<Sparkles size={18} />} title="AI assistant" tone="violet" sub="Checks these before anything reaches the brand">
      <ChecklistPanel brief={brief} />
    </Panel>
  );
  const payPanel = (
    <Panel icon={<Wallet size={18} />} title="Payment" tone="green" sub={inv.status === 'completed' ? 'Processing' : 'Expected until the brand approves'}>
      <PayoutSchedule inv={inv} />
    </Panel>
  );
  const termsPanel = <Panel icon={<FileText size={18} />} title="Deal terms" tone="pink"><TermsGrid inv={inv} /></Panel>;
  const briefPanel = <Panel icon={<Megaphone size={18} />} title="Campaign brief" tone="amber" sub={`From ${inv.brand}`}><BriefPanel brief={brief} /></Panel>;
  const timelinePanel = (
    <Panel icon={<CalendarRange size={18} />} title="Timeline" tone="blue" sub={inv.timeline}>
      <TimelineList inv={inv} items={items} />
    </Panel>
  );
  const contactPanel = (
    <Panel icon={<MessagesSquare size={18} />} title="Brand contact" tone="grey" sub="Approved channel">
      <p className="cx-text">Stay with {inv.brand} inside this campaign. Do not move the deal to a private chat.</p>
    </Panel>
  );
  const submitPanel = (
    <Panel icon={<ListChecks size={18} />} title="What to hand in" tone="teal">
      <SpecRequirements specs={brief.deliverableSpecs} />
    </Panel>
  );
  const revisions = items.filter(d => d.revisionNote);
  const revisionPanel = revisions.length > 0 && (
    <Panel icon={<RefreshCw size={18} />} title="Revision requests" tone="red" sub={`${revisions.length} open`}>
      <ul className="cx-checks">
        {revisions.map(d => <li key={d.id} className="is-no"><CircleAlert size={16} /><span><b>{d.label}</b>: {d.revisionNote}</span></li>)}
      </ul>
    </Panel>
  );

  return (
    <div className={`cx${isMobile ? ' is-tabbed' : ''}`}>
      <button className="cx-back" onClick={() => navigate('/creator/campaigns')}>
        <ArrowLeft size={16} /> Campaigns
      </button>

      <CampaignHero inv={inv} items={items} />
      <StageTiles inv={inv} items={items} />
      <CampaignKpis inv={inv} items={items} />

      {isMobile ? (
        <>
          <div className="cx-tabrow" role="tablist" aria-label="Campaign sections">
            {TABS.map(t => (
              <button key={t.key} role="tab" aria-selected={tab === t.key} className={tab === t.key ? 'is-on' : ''} onClick={() => setTab(t.key)}>
                <t.icon size={17} aria-hidden="true" />{t.label}
              </button>
            ))}
          </div>
          {tab === 'deliver' && (<>{nextStep}{deliverPanel}{revisionPanel}{checkPanel}</>)}
          {tab === 'terms' && (<>{payPanel}{termsPanel}</>)}
          {tab === 'brief' && (<>{briefPanel}{timelinePanel}{submitPanel}{contactPanel}</>)}
        </>
      ) : (
        <div className="cx-cols">
          <div className="cx-stack">
            {deliverPanel}
            {revisionPanel}
            {briefPanel}
            {timelinePanel}
          </div>
          <div className="cx-stack">
            {nextStep}
            {payPanel}
            {termsPanel}
            {submitPanel}
            {checkPanel}
            {contactPanel}
          </div>
        </div>
      )}

      {toast && <Toast message={toast} icon={Check} />}
    </div>
  );
}
