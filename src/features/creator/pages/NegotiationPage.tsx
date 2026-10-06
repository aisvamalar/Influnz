import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Sparkles, Send, Check, X, Bot, Building2, Info, ShieldCheck,
} from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, Button, Toast, EmptyState } from '../ui';
import { inr } from '../format';
import type { NegotiationMessage } from '../types';

let seq = 0;
const uid = () => `msg_${Date.now()}_${seq++}`;

export default function NegotiationPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const {
    getInvitation, updateInvitation,
    negotiations, setNegotiation, preferences,
  } = useCreator();
  const inv = getInvitation(id);
  const [draft, setDraft] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = useMemo<NegotiationMessage[]>(() => negotiations[id] ?? [], [negotiations, id]);

  // Seed the conversation once
  useEffect(() => {
    if (!inv) return;
    if (!negotiations[id]) {
      setNegotiation(id, [
        {
          id: uid(),
          sender: 'brand',
          text: `Hi! We'd love to work with you on our campaign. We're offering ${inr(inv.proposedRate)} for ${inv.deliverables.join(', ')}.`,
          offer: inv.proposedRate,
          timestamp: 'Just now',
        },
        {
          id: uid(),
          sender: 'system',
          text: `Your AI agent is negotiating on your behalf. Target: ${inr(preferences.aiMinAcceptableRate)} · Flexibility: ${preferences.aiFlexibilityPct}%`,
          timestamp: 'Just now',
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, inv]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  if (!inv) {
    return (
      <Card>
        <EmptyState icon={X} title="Negotiation not found" text="This campaign is no longer available."
          action={<Button variant="ghost" onClick={() => navigate('/creator/invitations')}>Back to Invitations</Button>} />
      </Card>
    );
  }

  const flash = (msg: string) => { setToast(msg); window.setTimeout(() => setToast(null), 2600); };

  const currentOffer = [...messages].reverse().find(m => typeof m.offer === 'number')?.offer ?? inv.proposedRate;

  // AI agent produces a counter based on preferences
  const runAiCounter = (base: NegotiationMessage[], brandOffer: number) => {
    const target = preferences.aiMinAcceptableRate;
    const floor = Math.round(target * (1 - preferences.aiFlexibilityPct / 100));

    if (brandOffer >= target) {
      const accepted: NegotiationMessage[] = [...base, {
        id: uid(), sender: 'creator_ai',
        text: `${inr(brandOffer)} meets your target. I recommend accepting this offer.`,
        offer: brandOffer, reason: 'Offer at or above your target rate', timestamp: 'Just now',
      }];
      setNegotiation(id, accepted);
      return;
    }

    // counter halfway between brand offer and target, not below floor
    const counter = Math.max(floor, Math.round((brandOffer + target) / 2));
    const limitReached = counter <= floor && brandOffer < floor;
    const counterMsg: NegotiationMessage = {
      id: uid(), sender: 'creator_ai',
      text: `Thanks for the offer. Based on ${inv.deliverables.length} deliverable(s) and the creator's audience fit, I'd propose ${inr(counter)}.`,
      offer: counter,
      reason: `Countering toward target ${inr(target)} within ${preferences.aiFlexibilityPct}% flexibility`,
      permissionUsed: `AI negotiation · min ${inr(preferences.aiMinAcceptableRate)}`,
      limitReached,
      timestamp: 'Just now',
    };
    setNegotiation(id, [...base, counterMsg]);
    if (inv.status !== 'in_negotiation') updateInvitation(inv.id, { status: 'in_negotiation' });
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    const mine: NegotiationMessage = { id: uid(), sender: 'creator', text, timestamp: 'Just now' };
    const next = [...messages, mine];
    setNegotiation(id, next);
    setDraft('');
    // simulate brand reply + AI counter
    window.setTimeout(() => {
      const brandBump = Math.round(currentOffer * 1.05);
      const brandReply: NegotiationMessage = {
        id: uid(), sender: 'brand',
        text: `We hear you. We can move to ${inr(brandBump)}.`,
        offer: brandBump, timestamp: 'Just now',
      };
      const withBrand = [...next, brandReply];
      setNegotiation(id, withBrand);
      window.setTimeout(() => runAiCounter(withBrand, brandBump), 500);
    }, 500);
  };

  const acceptCurrent = () => {
    updateInvitation(inv.id, { status: 'accepted', agreedRate: currentOffer });
    flash('Deal accepted — opening Deal Room');
    window.setTimeout(() => navigate(`/creator/deal/${inv.id}`), 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      <button className="cr-nav-link" style={{ width: 'auto', padding: '6px 10px', color: 'var(--in-gray)' }} onClick={() => navigate(`/creator/invitations/${inv.id}`)}>
        <ArrowLeft size={16} /> Back to Invitation
      </button>

      <div>
        <h1 className="cr-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Sparkles size={22} style={{ color: 'var(--in-coral-text)' }} /> AI Negotiation · {inv.brand}
        </h1>
        <p className="cr-page-sub">Your AI agent negotiates within the limits you set in Preferences.</p>
      </div>

      <Card style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: 0, overflow: 'hidden' }}>
        {/* Offer strip */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: '14px 18px', borderBottom: '1px solid var(--in-border)', background: 'rgba(242,132,107,0.04)' }}>
          <OfferStat label="Brand's offer" value={inr(inv.proposedRate)} />
          <OfferStat label="Current offer" value={inr(currentOffer)} highlight />
          <OfferStat label="Your target" value={inr(preferences.aiMinAcceptableRate)} />
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 18, maxHeight: 420, overflowY: 'auto' }}>
          {messages.map(m => <Bubble key={m.id} m={m} />)}
        </div>

        {/* Composer */}
        <div style={{ display: 'flex', gap: 8, padding: 14, borderTop: '1px solid var(--in-border)' }}>
          <input
            className="cr-input"
            placeholder="Add a note for your AI agent or the brand…"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
          />
          <Button onClick={sendMessage} disabled={!draft.trim()}><Send size={16} /></Button>
        </div>
      </Card>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <Button onClick={acceptCurrent} style={{ flex: 1, minWidth: 160 }}><Check size={16} /> Accept {inr(currentOffer)}</Button>
        <Button variant="danger" onClick={() => { updateInvitation(inv.id, { status: 'declined' }); navigate('/creator/invitations'); }} style={{ flex: 1, minWidth: 160 }}>
          <X size={16} /> Walk Away
        </Button>
      </div>

      {toast && <Toast message={toast} icon={Check} />}
    </div>
  );
}

function OfferStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--in-gray)', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: highlight ? 'var(--in-coral-text)' : 'var(--in-charcoal)' }}>{value}</div>
    </div>
  );
}

function Bubble({ m }: { m: NegotiationMessage }) {
  if (m.sender === 'system') {
    return (
      <div style={{ alignSelf: 'center', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--in-gray)', background: 'rgba(0,0,0,0.04)', padding: '6px 12px', borderRadius: 20 }}>
        <Info size={13} /> {m.text}
      </div>
    );
  }

  const mine = m.sender === 'creator' || m.sender === 'creator_ai';
  const isAi = m.sender === 'creator_ai';
  const Icon = isAi ? Bot : Building2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start', gap: 4, maxWidth: '80%', alignSelf: mine ? 'flex-end' : 'flex-start' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.6875rem', fontWeight: 700, color: 'var(--in-gray)' }}>
        <Icon size={13} /> {m.sender === 'brand' ? 'Brand' : isAi ? 'Your AI Agent' : 'You'}
      </div>
      <div style={{
        padding: '10px 14px', borderRadius: 14, fontSize: '0.875rem', lineHeight: 1.5,
        background: mine ? (isAi ? 'linear-gradient(135deg, var(--in-coral), var(--in-coral-dark))' : 'var(--in-charcoal)') : '#fff',
        color: mine ? '#fff' : 'var(--in-charcoal)',
        border: mine ? 'none' : '1px solid var(--in-border)',
      }}>
        {m.text}
        {typeof m.offer === 'number' && (
          <div style={{ marginTop: 6, fontWeight: 800, fontSize: '0.95rem' }}>{inr(m.offer)}</div>
        )}
      </div>
      {m.reason && <div style={{ fontSize: '0.6875rem', color: 'var(--in-gray)', display: 'flex', alignItems: 'center', gap: 4 }}><ShieldCheck size={11} /> {m.reason}</div>}
      {m.limitReached && <div style={{ fontSize: '0.6875rem', color: 'var(--in-warn)', fontWeight: 600 }}>Reached your minimum acceptable rate.</div>}
    </div>
  );
}
