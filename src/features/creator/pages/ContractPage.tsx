import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CircleCheck, Download } from 'lucide-react';
import logoImg from '../../../assets/logo.png';
import { useCreator } from '../CreatorContext';
import { dateRange, inr } from '../format';
import type { DeliverableSpec } from '../types';
import { StepRail } from './invitationBits';
import './creator-deal.css';

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function two(n: number): string {
  if (n < 20) return ONES[n];
  return TENS[Math.floor(n / 10)] + (n % 10 ? ` ${ONES[n % 10]}` : '');
}

function rupeesWords(n: number): string {
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const hundred = Math.floor((n % 1000) / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (crore) parts.push(`${two(crore)} Crore`);
  if (lakh) parts.push(`${two(lakh)} Lakh`);
  if (thousand) parts.push(`${two(thousand)} Thousand`);
  if (hundred) parts.push(`${ONES[hundred]} Hundred`);
  if (rest) parts.push(two(rest));
  return parts.join(' ') || 'Zero';
}

function ordinal(n: number): string {
  const mod = n % 100;
  if (mod >= 11 && mod <= 13) return `${n}th`;
  const suffix = ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th';
  return `${n}${suffix}`;
}

function weight(format: string): number {
  if (/reel|video|short/i.test(format)) return 40;
  if (/story/i.test(format)) return 11;
  return 20;
}

/** Split the creator's own agreed rate. A reel and two stories at ₹15,500 land on 10,000 / 2,750 / 2,750. */
function lineTotals(specs: DeliverableSpec[], rate: number): number[] {
  const weights = specs.map(s => Math.max(1, weight(s.format) * s.count));
  const sum = weights.reduce((a, b) => a + b, 0);
  let used = 0;
  return weights.map((w, i) => {
    const share = i === weights.length - 1 ? rate - used : Math.round((rate * w) / sum);
    used += share;
    return share;
  });
}

function pieceHint(spec: string): string {
  const head = spec.split('·')[0].trim();
  if (/30[–-]60s/i.test(head)) return '30–60 seconds';
  return head;
}

export default function ContractPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, getInvitation, getContract, ensureContract, signContract, updateInvitation, ensureDeliverables } = useCreator();
  const inv = getInvitation(id);
  const contract = getContract(id);

  const [agree, setAgree] = useState(false);
  const [name, setName] = useState(profile.displayName);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { if (inv) ensureContract(inv); }, [inv, ensureContract]);

  if (!inv) {
    return (
      <div className="ctr">
        <section className="ctr-empty">
          <h2>Contract not found</h2>
          <p>This contract is no longer available.</p>
          <button type="button" className="ctr-back" onClick={() => navigate('/creator/campaigns')}>Back to campaigns</button>
        </section>
      </div>
    );
  }

  const rate = contract?.terms.rate ?? inv.agreedRate ?? inv.proposedRate;
  const live = inv.status === 'active' || inv.status === 'completed';
  // A campaign that is already running was signed, even if this session never saw it happen.
  const signed = contract?.status === 'signed' || live;
  const canSign = agree && name.trim().length > 1 && !signed;
  const specs = inv.brief.deliverableSpecs;
  const totals = lineTotals(specs, rate);
  const today = new Date();
  const dated = `${ordinal(today.getDate())} ${MONTHS[today.getMonth()]} ${today.getFullYear()}`;
  const contractNo = `INF-CAM-${today.getFullYear()}-${inv.id.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 8)}`;
  const span = dateRange(inv.brief.startDate, inv.brief.endDate);
  // Arriving straight from Accept: say so, and that signing is the one step left.
  const justAccepted = Boolean((location.state as { accepted?: boolean } | null)?.accepted) && !signed;
  const backTo = live ? `/creator/campaigns/${inv.id}` : `/creator/invitations/${inv.id}`;

  const doSign = () => {
    if (!canSign) return;
    signContract(inv.id, name.trim());
    updateInvitation(inv.id, { status: 'active', agreedRate: rate });
    ensureDeliverables(inv);
    setToast('Contract signed');
    window.setTimeout(() => navigate(`/creator/campaigns/${inv.id}`), 900);
  };

  const download = () => {
    const lines = [
      'SERVICES AGREEMENT',
      `Contract No. ${contractNo}`,
      `Date: ${today.getDate()} ${MONTHS[today.getMonth()].slice(0, 3)} ${today.getFullYear()}`,
      '',
      `Service Provider (Creator): ${profile.displayName}`,
      `Address: ${profile.location || '—'}`,
      `Buyer (Brand): ${inv.brand}`,
      `Address: ${inv.brief.brandCity || inv.location}`,
      '',
      ...specs.map((s, i) => `${s.count} × ${s.format} (${s.spec}) — ${inr(totals[i])}`),
      `Total ${inr(rate)}`,
      '',
      `Purchase price: ${inr(rate)} (${rupeesWords(rate)} Only), held until the deliverables are approved.`,
      `Timeline: ${span}.`,
      `Usage rights: ${inv.usageRights}.`,
      `Exclusivity: ${inv.exclusivityDays} days from first publish.`,
      `Revisions: up to ${inv.revisions}.`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contractNo}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ctr">
      <button type="button" className="ctr-back" onClick={() => navigate(backTo)}>
        <ArrowLeft size={16} /> {live ? 'Back to campaign' : 'Back to invitation'}
      </button>

      {justAccepted && (
        <div className="ctr-accepted" role="status">
          <span className="ctr-accepted__icon" aria-hidden="true"><CircleCheck size={22} strokeWidth={2.2} /></span>
          <div>
            <strong>Offer accepted · {inr(rate)}</strong>
            <p>One step left: read the agreement and sign it to lock in your payout.</p>
          </div>
        </div>
      )}

      <header className="ctr-head">
        <div>
          <div className="ctr-title">
            <h1>Campaign Contract</h1>
          </div>
          <p>Review the agreement below and sign to activate this campaign.</p>
        </div>
        <span className={`ctr-pill${signed ? '' : ' ctr-pill--wait'}`}>
          <i /> {signed ? 'Signed' : 'Awaiting Signature'}
        </span>
      </header>

      <StepRail
        inv={inv}
        className="flow-steps"
        place="contract"
        onHere={() => {
          window.setTimeout(() => document.getElementById('ctr-viewer')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
        }}
      />

      <div className="ctr-split" id="ctr-viewer">
        <section className="ctr-viewer" aria-label="Agreement">
          <article className="ctr-paper">
            <div className="ctr-paper__top">
              <img src={logoImg} alt="Influnz" />
              <p>
                <b>Campaign Agreement</b><br />
                Contract No. {contractNo}<br />
                Date: {today.getDate()} {MONTHS[today.getMonth()].slice(0, 3)} {today.getFullYear()}
              </p>
            </div>
            <h2>Services Agreement</h2>
            <p>This Services Agreement (&ldquo;Agreement&rdquo;) is entered into as of {dated}, by and between:</p>
            <h3>Service Provider (Creator): {profile.displayName} (&ldquo;Creator&rdquo;)</h3>
            <p>Address: {profile.location || '—'}{profile.location && !/india/i.test(profile.location) ? ', India' : ''}</p>
            <p className="ctr-and">and</p>
            <h3>Buyer (Brand): {inv.brand} (&ldquo;Brand&rdquo;)</h3>
            <p>Address: {inv.brief.brandCity || inv.location}, India</p>
            <p>Each Service Provider and Buyer may be referred to in this Agreement individually as a &ldquo;Party&rdquo; and collectively as the &ldquo;Parties&rdquo;.</p>
            <p><b>1. Services.</b> Creator agrees to create and deliver the following content for the campaign:</p>
            <table className="ctr-table">
              <thead>
                <tr>
                  <th>Description of Services</th>
                  <th>Number of Deliverables</th>
                  <th>Price per Deliverable (INR)</th>
                  <th>Total (INR)</th>
                </tr>
              </thead>
              <tbody>
                {specs.map((spec, i) => (
                  <tr key={spec.id}>
                    <td>{spec.format} ({pieceHint(spec.spec)})</td>
                    <td>{spec.count}</td>
                    <td>{Math.round(totals[i] / spec.count).toLocaleString('en-IN')}</td>
                    <td>{totals[i].toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td />
                  <td />
                  <td>{inr(rate)}</td>
                </tr>
              </tfoot>
            </table>
            <p><b>2. Purchase Price.</b> Brand shall pay the Creator a total amount of {inr(rate)} (Rupees {rupeesWords(rate)} Only). Payment is protected and released on approval of the deliverables.</p>
            <p><b>3. Timeline.</b> Deliverables must be submitted between {longWindow(inv.brief.startDate, inv.brief.endDate)}.</p>
            <p><b>4. Usage and exclusivity.</b> {inv.usageRights}. Exclusivity runs {inv.exclusivityDays} days from first publish. Up to {inv.revisions} revision{inv.revisions === 1 ? '' : 's'} included.</p>
            <div className="ctr-paper__sign">
              <div>
                <b className="ctr-scribble">{(signed ? contract?.signedName ?? name : name) || ' '}</b>
                <i />
                <small>Creator signature</small>
              </div>
              <div>
                <b>{dated}</b>
                <i />
                <small>Date</small>
              </div>
            </div>
            <footer>Page 1 of 1 · {contractNo}</footer>
          </article>
        </section>

        <aside className="ctr-sign" aria-label="E-signature">
          <p className="ctr-sign__kicker">E-signature</p>
          <h2>Sign the agreement</h2>
          <p>Your name is written onto the document on the left.</p>
          <label className="ctr-consent">
            <input type="checkbox" checked={agree || signed} disabled={signed} onChange={e => setAgree(e.target.checked)} />
            <span>I have read and agree to the terms of this contract, and understand payment is released on approval.</span>
          </label>
          <label className="ctr-field">
            <span>Full name</span>
            <input
              value={signed ? (contract?.signedName ?? name) : name}
              disabled={signed}
              onChange={e => setName(e.target.value)}
              aria-label="Name to sign"
            />
          </label>
          <div className="ctr-pad" aria-hidden="true">
            <b className="ctr-scribble">{(signed ? contract?.signedName ?? name : name) || ' '}</b>
            <i />
            <small>{signed ? 'Signed' : 'Signature preview'}</small>
          </div>
          <button type="button" className="ctr-quiet" onClick={download}><Download size={14} /> Download</button>
          {signed ? (
            <button type="button" className="ctr-btn" onClick={() => navigate(`/creator/campaigns/${inv.id}`)}>
              Open campaign <ArrowRight size={16} />
            </button>
          ) : (
            <button type="button" className="ctr-btn" disabled={!canSign} onClick={doSign}>
              Sign agreement <ArrowRight size={16} />
            </button>
          )}
        </aside>
      </div>

      <div className="ctr-dock">
        {!signed && (
          <label className="ctr-dock__agree">
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
            <span>I have read and agree to these terms.</span>
          </label>
        )}
        {signed ? (
          <button type="button" className="ctr-btn" onClick={() => navigate(`/creator/campaigns/${inv.id}`)}>Open campaign <ArrowRight size={16} /></button>
        ) : (
          <button type="button" className="ctr-btn" disabled={!canSign} onClick={doSign}>
            Sign agreement <ArrowRight size={16} />
          </button>
        )}
      </div>

      {toast && <div className="ctr-toast" role="status">{toast}</div>}
    </div>
  );
}

function longWindow(from: string, to: string): string {
  const read = (iso: string) => {
    const hit = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    if (!hit) return iso;
    return `${Number(hit[3])} ${MONTHS[Number(hit[2]) - 1]} ${hit[1]}`;
  };
  return `${read(from)} and ${read(to)}`;
}
