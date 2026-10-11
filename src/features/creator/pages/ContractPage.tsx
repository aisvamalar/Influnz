import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ScrollText, FileSignature, X, Check, CheckCircle2, ArrowRight,
} from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, Button, StatusPill, EmptyState, Toast } from '../ui';
import { inr } from '../format';

export default function ContractPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { getInvitation, getContract, ensureContract, signContract, updateInvitation, ensureDeliverables } = useCreator();
  const inv = getInvitation(id);
  const contract = getContract(id);

  const [agree, setAgree] = useState(false);
  const [name, setName] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { if (inv) ensureContract(inv); }, [inv, ensureContract]);

  if (!inv) {
    return (
      <Card>
        <EmptyState icon={X} title="Contract not found" text="This contract is no longer available."
          action={<Button variant="ghost" onClick={() => navigate('/creator/campaigns')}>Back to Campaigns</Button>} />
      </Card>
    );
  }

  const terms = contract?.terms ?? {
    rate: inv.agreedRate ?? inv.proposedRate,
    deliverables: inv.deliverables,
    timeline: inv.timeline,
    usageRights: inv.usageRights,
    exclusivityDays: inv.exclusivityDays,
    revisions: inv.revisions,
  };
  const signed = contract?.status === 'signed';
  const canSign = agree && name.trim().length > 1 && !signed;

  const doSign = () => {
    if (!canSign) return;
    signContract(inv.id, name.trim());
    updateInvitation(inv.id, { status: 'active', agreedRate: terms.rate });
    ensureDeliverables(inv);
    setToast('Contract signed');
    window.setTimeout(() => navigate(`/creator/campaigns/${inv.id}`), 900);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <button className="cr-nav-link" style={{ width: 'auto', padding: '6px 10px', color: 'var(--in-gray)' }} onClick={() => navigate(`/creator/deal/${inv.id}`)}>
        <ArrowLeft size={16} /> Back to Deal Room
      </button>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="cr-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ScrollText size={22} style={{ color: 'var(--in-coral-text)' }} /> Campaign Contract
          </h1>
          <p className="cr-page-sub">{inv.brand} · Generated from your agreed deal terms.</p>
        </div>
        {contract && <StatusPill status={contract.status} />}
      </div>

      <Card>
        <div style={{ fontSize: '0.9rem', color: 'var(--in-charcoal)', lineHeight: 1.7 }}>
          <p style={{ marginBottom: 12 }}>
            This agreement is between <strong>{inv.brand}</strong> ("Brand") and the Creator, for the campaign deliverables listed below.
          </p>
          <ClauseRow n="1" title="Compensation" body={`The Brand shall pay the Creator ${inr(terms.rate)}, held in escrow and released on approved milestone completion.`} />
          <ClauseRow n="2" title="Deliverables" body={terms.deliverables.join(', ')} />
          <ClauseRow n="3" title="Timeline" body={terms.timeline} />
          <ClauseRow n="4" title="Usage rights" body={terms.usageRights} />
          <ClauseRow n="5" title="Exclusivity" body={`${terms.exclusivityDays} days from first publish.`} />
          <ClauseRow n="6" title="Revisions" body={`Up to ${terms.revisions} revision(s) included.`} />
          <ClauseRow n="7" title="Amendments" body="Any change to these terms requires an explicit written amendment agreed by both parties." />
        </div>
      </Card>

      {signed ? (
        <Card style={{ background: 'linear-gradient(135deg, rgba(124,196,164,0.12), rgba(90,155,212,0.08))', border: '1px solid rgba(124,196,164,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', color: 'var(--in-charcoal)' }}>
            <CheckCircle2 size={18} style={{ color: 'var(--in-success)' }} />
            <span>Signed by <strong>{contract?.signedName}</strong>. Your campaign workspace is ready.</span>
          </div>
          <Button style={{ marginTop: 14 }} onClick={() => navigate(`/creator/campaigns/${inv.id}`)}>
            Go to Campaign Workspace <ArrowRight size={16} />
          </Button>
        </Card>
      ) : (
        <Card>
          <div className="cr-card__title" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileSignature size={18} style={{ color: 'var(--in-coral-text)' }} /> Sign the contract
          </div>
          <label className="cr-consent" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--in-coral)', marginTop: 2 }} />
            <span style={{ fontSize: '0.8125rem', color: 'var(--in-charcoal)', lineHeight: 1.5 }}>
              I have read and agree to the terms of this contract, and understand payments are released on milestone approval.
            </span>
          </label>
          <label className="cr-field" style={{ maxWidth: 360 }}>
            <span className="cr-field__label">Type your full name to sign</span>
            <input className="cr-input" value={name} onChange={e => setName(e.target.value)} placeholder="Full legal name" />
          </label>
          <Button style={{ marginTop: 16 }} onClick={doSign} disabled={!canSign}>
            <Check size={16} /> Sign & Activate Campaign
          </Button>
        </Card>
      )}

      {toast && <Toast message={toast} icon={Check} />}
    </div>
  );
}

function ClauseRow({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <span style={{ fontWeight: 700, color: 'var(--in-charcoal)' }}>{n}. {title}. </span>
      <span style={{ color: 'var(--in-gray)' }}>{body}</span>
    </div>
  );
}
