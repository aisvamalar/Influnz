import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, Calendar, Check, CheckCircle2, Clock, Lock, MapPin, RefreshCw, ShieldCheck, Tag, Target, Wallet,
} from 'lucide-react';
import PlatformMark, { type PlatformId } from '../../../components/mobile/PlatformMark';
import { useCreator } from '../CreatorContext';
import { dateRange, inr } from '../format';
import type { Invitation, InvitationStatus } from '../types';
import { StepRail } from './invitationBits';
import './creator-deal.css';

const STATUS: Record<InvitationStatus, { label: string; tone: string }> = {
  new: { label: 'New invite', tone: 'wait' },
  in_negotiation: { label: 'Negotiating', tone: 'wait' },
  accepted: { label: 'Accepted', tone: 'ok' },
  contract_pending: { label: 'Accepted', tone: 'ok' },
  active: { label: 'In progress', tone: 'ok' },
  completed: { label: 'Completed', tone: 'ok' },
  declined: { label: 'Declined', tone: 'no' },
  expired: { label: 'Expired', tone: 'no' },
};

const AGREED: InvitationStatus[] = ['accepted', 'contract_pending', 'active', 'completed'];

/** Existing café and food photos already used in the app. One shot per deliverable. */
const SHOTS = [
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=720&h=420&fit=crop&q=75',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=720&h=420&fit=crop&q=75',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=720&h=420&fit=crop&q=75',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=720&h=420&fit=crop&q=75',
];

function pieceHint(spec: string): string {
  const head = spec.split('·')[0].trim();
  if (/30[–-]60s/i.test(head)) return '30–60 seconds';
  return head;
}

function platformId(name: string): PlatformId | null {
  const n = name.toLowerCase();
  if (n.includes('instagram')) return 'instagram';
  if (n.includes('youtube')) return 'youtube';
  if (n.includes('tiktok')) return 'tiktok';
  return null;
}

function mark(brand: string): string {
  const parts = brand.split(/\s+/).filter(w => w.length > 1);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || brand.slice(0, 1).toUpperCase();
}

export default function DealRoomPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { getInvitation, ensureContract } = useCreator();
  const inv = getInvitation(id);

  useEffect(() => { if (inv) ensureContract(inv); }, [inv, ensureContract]);

  if (!inv) {
    return (
      <div className="dlr">
        <section className="dlr-empty">
          <h2>Deal not found</h2>
          <p>This deal is no longer available.</p>
          <button type="button" className="dlr-link" onClick={() => navigate('/creator/invitations')}>Back to invitations</button>
        </section>
      </div>
    );
  }

  const rate = inv.agreedRate ?? inv.proposedRate;
  const agreed = AGREED.includes(inv.status);
  const status = STATUS[inv.status];
  const go = () => navigate(`/creator/contract/${inv.id}`);

  return (
    <div className="dlr">
      <header className="dlr-head">
        <div>
          <div className="dlr-title">
            <span className="dlr-ico"><Target size={16} /></span>
            <h1>Deal Room</h1>
          </div>
          <p>Review the campaign details and agreed terms before proceeding to the contract.</p>
        </div>
        <span className={`dlr-pill dlr-pill--${status.tone}`}><Check size={14} /> {status.label}</span>
      </header>

      <StepRail inv={inv} className="flow-steps" place="deal" onHere={() => {}} />

      <Hero inv={inv} rate={rate} />

      <h2 className="dlr-section">Deliverables</h2>
      <div className="dlr-pieces">
        {inv.brief.deliverableSpecs.map((spec, index) => {
          const markId = platformId(spec.platform);
          return (
            <article key={spec.id} className="dlr-piece">
              <img src={SHOTS[index % SHOTS.length]} alt="" />
              <div>
                <strong>{markId && <PlatformMark id={markId} size={16} />} {spec.count} {spec.format}</strong>
                <small>({pieceHint(spec.spec)})</small>
              </div>
            </article>
          );
        })}
      </div>

      <section className="dlr-terms">
        <h2>Campaign Terms</h2>
        <div className="dlr-term"><Calendar size={16} /><span>Timeline</span><b>{inv.timeline || dateRange(inv.brief.startDate, inv.brief.endDate)}</b></div>
        <div className="dlr-term"><ShieldCheck size={16} /><span>Usage rights</span><b>{inv.usageRights}</b></div>
        <div className="dlr-term"><Clock size={16} /><span>Exclusivity</span><b>{inv.exclusivityDays} days from first publish</b></div>
        <div className="dlr-term"><RefreshCw size={16} /><span>Revisions</span><b>Up to {inv.revisions} revision{inv.revisions === 1 ? '' : 's'}</b></div>
        <div className="dlr-term"><Lock size={16} /><span>Payment</span><b>{inv.paymentProtected ? 'Payment protected. Released on approval.' : 'Released on approval'}</b></div>
      </section>

      <section className="dlr-agree">
        <div className="dlr-agree__row">
          <CheckCircle2 size={20} />
          <div>
            <strong>{agreed ? 'Both parties have agreed on the terms.' : 'Agree the invitation before the contract.'}</strong>
            <p>{agreed ? 'Generate and sign the contract to start the campaign.' : 'Accept the offer on the invitation, then come back to sign.'}</p>
          </div>
        </div>
        <button type="button" className="dlr-btn" disabled={!agreed} onClick={go}>
          Continue <ArrowRight size={16} />
        </button>
      </section>

      <div className="dlr-dock">
        <button type="button" className="dlr-btn" disabled={!agreed} onClick={go}>
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function Hero({ inv, rate }: { inv: Invitation; rate: number }) {
  return (
    <section className="dlr-sheet">
      <div className="dlr-photo">{inv.image && <img src={inv.image} alt="" />}</div>
      <div className="dlr-copy">
        <h2>{inv.brief.title}</h2>
        <p className="dlr-brand">
          <span className="dlr-mark" aria-hidden="true">{mark(inv.brand)}</span>
          {inv.brand}
          {inv.brandVerified && <BadgeCheck size={15} color="#3b82f6" />}
        </p>
        <div className="dlr-chips">
          <span><Tag size={12} /> {inv.category}</span>
          <span><MapPin size={12} /> {inv.location}</span>
        </div>
        <p className="dlr-sum">{inv.brief.summary}</p>
      </div>
      <aside className="dlr-pay">
        <div>
          <span>Agreed Compensation</span>
          <strong>{inr(rate)}</strong>
        </div>
        <div className="dlr-escrow">
          <span className="dlr-escrow__ico"><Wallet size={16} /></span>
          <span>Payment<b>{inv.paymentProtected ? 'Payment protected' : 'Released on approval'}</b></span>
        </div>
      </aside>
    </section>
  );
}
