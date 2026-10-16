import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Check, CircleAlert, CircleCheck, Clapperboard, FileText, LayoutGrid, Megaphone,
  RefreshCw, ScanLine, Send, ShieldCheck, Target, Upload, Wallet, X,
} from 'lucide-react';
import { useResponsive } from '../../../hooks/useResponsive';
import { useCreator } from '../CreatorContext';
import { Button, EmptyState, Toast } from '../ui';
import {
  BriefPanel, CampaignHero, ChecklistPanel, DelivPill, DeliverableRow, Panel, PayoutSchedule, StageTiles, TermsGrid,
} from '../campaignParts';
import { dueLabel } from '../format';
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

  const nextStep = (
    <Panel icon={<Target size={18} />} title="Your next step">
      {waitingForContract ? (
        <>
          <p className="cx-text" style={{ marginBottom: 12 }}>Sign the contract to lock in your payout and start delivering.</p>
          <Button style={{ width: '100%' }} onClick={() => navigate(`/creator/deal/${inv.id}`)}>Open deal room <ArrowRight size={16} /></Button>
        </>
      ) : inv.status === 'completed' ? (
        <p className="cx-text"><CircleCheck size={16} style={{ verticalAlign: -3, color: 'var(--cx-green)' }} /> Every piece is approved. Your payout is being released.</p>
      ) : nextItem ? (
        <>
          <p className="cx-text"><b>{nextItem.label}</b> is next. {dueLabel(nextItem.dueDate)}.</p>
          {nextItem.notes && <p className="cx-text cx-muted" style={{ marginTop: 8 }}>{nextItem.notes}</p>}
        </>
      ) : (
        <p className="cx-text cx-muted">Nothing left to deliver.</p>
      )}
    </Panel>
  );

  const deliverPanel = (
    <Panel
      icon={<Clapperboard size={18} />} title="Your deliverables"
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
              status={<DelivPill status={d.status} />}
              flag={d.revisionNote}
              extra={result && (
                <div className={`cx-scan ${failed ? 'is-fail' : 'is-pass'}`}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <ScanLine size={15} style={{ color: failed ? 'var(--cx-red)' : 'var(--cx-green)' }} />
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
                <Button variant="ghost" small disabled={waitingForContract} onClick={() => upload(d)}><Upload size={14} /> Upload</Button>
              )}
              {d.status === 'uploaded' && (
                <Button small onClick={() => submitForReview(d)}><ScanLine size={14} /> Check &amp; submit</Button>
              )}
              {d.status === 'pending_approval' && (
                <>
                  <span className="cx-flag" style={{ color: 'var(--cx-blue)' }}><Send size={14} /> With {inv.brand}</span>
                  <Button variant="ghost" small onClick={() => approve(d)}><Check size={14} /> Simulate approve</Button>
                  <Button variant="ghost" small onClick={() => requestChanges(d)}><RefreshCw size={14} /> Simulate changes</Button>
                </>
              )}
              {d.status === 'changes_requested' && (
                <Button variant="ghost" small onClick={() => reupload(d)}><Upload size={14} /> Re-upload</Button>
              )}
            </DeliverableRow>
          );
        })}
      </div>
    </Panel>
  );

  const checkPanel = <Panel icon={<ShieldCheck size={18} />} title="Compliance checklist" sub="Every piece is checked against this before the brand sees it"><ChecklistPanel brief={brief} /></Panel>;
  const payPanel = <Panel icon={<Wallet size={18} />} title="How you get paid" sub={brief.paymentTerms}><PayoutSchedule inv={inv} /></Panel>;
  const termsPanel = <Panel icon={<FileText size={18} />} title="Deal terms"><TermsGrid inv={inv} /></Panel>;
  const briefPanel = <Panel icon={<Megaphone size={18} />} title="Campaign brief" sub={`From ${inv.brand}`}><BriefPanel brief={brief} /></Panel>;

  return (
    <div className={`cx${isMobile ? ' is-tabbed' : ''}`}>
      <button className="cx-back" onClick={() => navigate('/creator/campaigns')}>
        <ArrowLeft size={16} /> Campaigns
      </button>

      <CampaignHero inv={inv} items={items} />
      <StageTiles inv={inv} items={items} />

      {isMobile ? (
        <>
          <div className="cx-tabrow" role="tablist" aria-label="Campaign sections">
            {TABS.map(t => (
              <button key={t.key} role="tab" aria-selected={tab === t.key} className={tab === t.key ? 'is-on' : ''} onClick={() => setTab(t.key)}>
                <span><t.icon size={20} /></span>{t.label}
              </button>
            ))}
          </div>
          {tab === 'deliver' && (<>{nextStep}{deliverPanel}{checkPanel}</>)}
          {tab === 'terms' && (<>{payPanel}{termsPanel}</>)}
          {tab === 'brief' && briefPanel}
        </>
      ) : (
        <div className="cx-cols">
          <div className="cx-stack">
            {deliverPanel}
            {briefPanel}
          </div>
          <div className="cx-stack">
            {nextStep}
            {payPanel}
            {termsPanel}
            {checkPanel}
          </div>
        </div>
      )}

      {toast && <Toast message={toast} icon={Check} />}
    </div>
  );
}
