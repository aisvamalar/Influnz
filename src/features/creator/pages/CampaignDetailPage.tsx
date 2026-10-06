import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Upload, Check, RefreshCw, ShieldCheck, ScanLine, X, CircleCheck, AlertCircle, Send,
} from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, Button, StatusPill, ProgressBar, Toast, EmptyState } from '../ui';
import { inr } from '../format';
import type { ComplianceCheck, Deliverable } from '../types';

// Deterministic mock compliance: first submission of a deliverable fails one check,
// after re-upload it passes (so the revision cycle is demonstrable).
function runCompliance(usageRights: string, attemptFailed: boolean): ComplianceCheck[] {
  const disclosureOk = !attemptFailed;
  return [
    { label: 'Paid partnership disclosure (#ad)', passed: disclosureOk, detail: disclosureOk ? undefined : 'Add a clear #ad / Paid partnership label.' },
    { label: 'Brand handle tagged', passed: true },
    { label: 'No prohibited claims', passed: true },
    { label: 'Usage rights acknowledged', passed: true, detail: usageRights },
  ];
}

export default function CampaignDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { getInvitation, deliverables, ensureDeliverables, updateDeliverable, updateInvitation } = useCreator();
  const inv = getInvitation(id);
  const [toast, setToast] = useState<string | null>(null);
  // Track which deliverables have failed compliance at least once (drives the mock revision cycle)
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
      <Card>
        <EmptyState icon={X} title="Campaign not found" text="This campaign is no longer available."
          action={<Button variant="ghost" onClick={() => navigate('/creator/campaigns')}>Back to Campaigns</Button>} />
      </Card>
    );
  }

  const flash = (msg: string) => { setToast(msg); window.setTimeout(() => setToast(null), 2600); };
  const markActive = () => {
    if (inv.status === 'accepted' || inv.status === 'contract_pending') updateInvitation(inv.id, { status: 'active' });
  };

  const done = items.filter(d => d.status === 'approved').length;
  const progress = items.length ? Math.round((done / items.length) * 100) : 0;

  // not_started → uploaded
  const upload = (d: Deliverable) => {
    updateDeliverable(inv.id, d.id, { status: 'uploaded', revisionNote: undefined });
    markActive();
    flash(`${d.label}: uploaded`);
  };

  // uploaded → run AI compliance → pending_approval (pass) or stay uploaded (fail)
  const submitForReview = (d: Deliverable) => {
    const willFail = !failedOnce[d.id]; // first attempt fails, subsequent pass
    const result = runCompliance(inv.usageRights, willFail);
    setChecks(prev => ({ ...prev, [d.id]: result }));
    const passed = result.every(c => c.passed);
    if (!passed) {
      setFailedOnce(prev => ({ ...prev, [d.id]: true }));
      flash(`${d.label}: compliance failed — fix and re-submit`);
      return; // blocked from business review
    }
    updateDeliverable(inv.id, d.id, { status: 'pending_approval' });
    flash(`${d.label}: sent to business review`);
  };

  // Business review outcomes (mock the brand's decision)
  const approve = (d: Deliverable) => {
    updateDeliverable(inv.id, d.id, { status: 'approved', revisionNote: undefined });
    flash(`${d.label}: approved`);
  };
  const requestChanges = (d: Deliverable) => {
    updateDeliverable(inv.id, d.id, { status: 'changes_requested', revisionNote: 'Brand requested a small edit to the caption.' });
    flash(`${d.label}: changes requested`);
  };
  // changes_requested → uploaded (re-upload)
  const reupload = (d: Deliverable) => {
    updateDeliverable(inv.id, d.id, { status: 'uploaded', revisionNote: undefined });
    flash(`${d.label}: re-uploaded`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <button className="cr-nav-link" style={{ width: 'auto', padding: '6px 10px', color: 'var(--in-gray)' }} onClick={() => navigate('/creator/campaigns')}>
        <ArrowLeft size={16} /> Back to Campaigns
      </button>

      <Card>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--in-charcoal)' }}>{inv.brand}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--in-gray)', marginTop: 4 }}>{inr(inv.agreedRate ?? inv.proposedRate)} · {inv.timeline}</div>
          </div>
          <StatusPill status={inv.status} />
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.8125rem' }}>
            <span style={{ color: 'var(--in-gray)' }}>Deliverable progress</span>
            <span style={{ fontWeight: 700, color: 'var(--in-charcoal)' }}>{done}/{items.length} approved</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {items.map(d => {
          const result = checks[d.id];
          const failed = result && !result.every(c => c.passed);
          return (
            <Card key={d.id}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--in-charcoal)' }}>{d.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--in-gray)' }}>Due {d.dueDate}</div>
                  {d.revisionNote && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--in-warn)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <AlertCircle size={12} /> {d.revisionNote}
                    </div>
                  )}
                </div>
                <StatusPill status={d.status} />
              </div>

              {/* Compliance result (after a submit attempt) */}
              {result && (
                <div style={{ marginTop: 12, padding: 12, borderRadius: 12, background: failed ? 'rgba(224,82,82,0.06)' : 'rgba(124,196,164,0.1)', border: `1px solid ${failed ? 'rgba(224,82,82,0.25)' : 'rgba(124,196,164,0.4)'}` }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--in-charcoal)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <ScanLine size={15} style={{ color: failed ? 'var(--in-danger)' : 'var(--in-success)' }} />
                    AI Compliance {failed ? '— action needed' : 'passed'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {result.map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.8125rem' }}>
                        {c.passed
                          ? <CircleCheck size={15} style={{ color: 'var(--in-success)', flexShrink: 0, marginTop: 1 }} />
                          : <AlertCircle size={15} style={{ color: 'var(--in-danger)', flexShrink: 0, marginTop: 1 }} />}
                        <span style={{ color: 'var(--in-charcoal)' }}>
                          {c.label}{c.detail ? ` — ${c.detail}` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions per status */}
              <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {d.status === 'not_started' && (
                  <Button variant="ghost" small onClick={() => upload(d)}><Upload size={14} /> Upload content</Button>
                )}
                {d.status === 'uploaded' && (
                  <Button small onClick={() => submitForReview(d)}><ScanLine size={14} /> Run compliance & submit</Button>
                )}
                {d.status === 'pending_approval' && (
                  <>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--in-info)', fontWeight: 600 }}>
                      <Send size={14} /> Awaiting business review
                    </span>
                    {/* Simulated brand decisions */}
                    <Button variant="ghost" small onClick={() => approve(d)}><Check size={14} /> Simulate approve</Button>
                    <Button variant="ghost" small onClick={() => requestChanges(d)}><RefreshCw size={14} /> Simulate changes</Button>
                  </>
                )}
                {d.status === 'changes_requested' && (
                  <Button variant="ghost" small onClick={() => reupload(d)}><Upload size={14} /> Re-upload</Button>
                )}
                {d.status === 'approved' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 700, color: 'var(--in-success)' }}>
                    <CircleCheck size={15} /> Approved
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Overall compliance summary */}
      <Card>
        <div className="cr-card__title" style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={18} style={{ color: 'var(--in-success)' }} /> Compliance & payout
        </div>
        <div className="cr-card__sub">
          Every deliverable must pass automated compliance before business review. Payment is protected and releases on approval.
        </div>
      </Card>

      {toast && <Toast message={toast} icon={Check} />}
    </div>
  );
}
