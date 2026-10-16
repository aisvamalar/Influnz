/**
 * Desktop Create Campaign.
 * Campaign ideas travel a right-hand semicircle around the hub (top to bottom, then around again).
 * The assistant sits on the right. The intent card fills in only after the guided chat is complete.
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  Brain,
  CalendarDays,
  ChartColumn,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Gift,
  MapPin,
  Megaphone,
  Paperclip,
  Play,
  Settings,
  Share2,
  ShoppingBag,
  Sparkles,
  Target,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-react';
import BusinessLayout from '../BusinessLayout';
import PlatformMark, { type PlatformId } from '../../../components/mobile/PlatformMark';
import './create-campaign-web.css';

type QuestionKey = 'audience' | 'budget' | 'platforms' | 'duration';

interface ChatMessage {
  id: number;
  from: 'bot' | 'user';
  text: string;
  time: string;
  question?: QuestionKey;
}

interface Brief {
  goal: string;
  location: string;
  audience: string;
  budget: string;
  platforms: PlatformId[];
  otherPlatforms: string;
  timeline: string;
}

interface Idea {
  title: string;
  chips: [string, string];
  prompt: string;
  icon: LucideIcon;
}

const EMPTY_BRIEF: Brief = { goal: '', location: '', audience: '', budget: '', platforms: [], otherPlatforms: '', timeline: '' };

const QUESTIONS: Record<QuestionKey, { prompt: string; options: string[]; customHint: string }> = {
  audience: {
    prompt: 'Who is your target audience?',
    options: ['Local customers', 'Young adults (18–30)', 'Students', 'Families'],
    customHint: 'Describe the audience, e.g. office workers in Chennai',
  },
  budget: {
    prompt: 'What is your budget range?',
    options: ['₹25,000', '₹50,000', '₹1,00,000', 'Custom'],
    customHint: 'Type your budget, e.g. ₹75,000',
  },
  platforms: {
    prompt: 'Which platforms do you prefer?',
    options: [],
    customHint: 'Type other platforms, e.g. LinkedIn',
  },
  duration: {
    prompt: 'Do you have a launch date in mind?',
    options: ['15 days', '1 month', '2 months', 'Custom'],
    customHint: 'Type a duration, e.g. 6 weeks',
  },
};

const CHECKLIST: { key: QuestionKey | 'goal'; label: string; icon: LucideIcon }[] = [
  { key: 'goal', label: 'What is your main goal?', icon: Target },
  { key: 'audience', label: 'Who is your target audience?', icon: Users },
  { key: 'budget', label: 'What is your budget range?', icon: Wallet },
  { key: 'platforms', label: 'Which platforms do you prefer?', icon: Share2 },
  { key: 'duration', label: 'Do you have a launch date in mind?', icon: CalendarDays },
];

const PLATFORMS: { id: PlatformId; label: string; match: RegExp }[] = [
  { id: 'instagram', label: 'Instagram', match: /insta(gram)?|reels?/i },
  { id: 'youtube', label: 'YouTube', match: /you\s?tube|shorts/i },
  { id: 'tiktok', label: 'TikTok', match: /tik\s?tok/i },
  { id: 'facebook', label: 'Facebook', match: /facebook|\bfb\b/i },
  { id: 'x', label: 'X (Twitter)', match: /twitter|\bx\b/i },
];

const CITIES = ['Chennai', 'Mumbai', 'Bangalore', 'Bengaluru', 'Delhi', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Kochi', 'Coimbatore', 'Madurai'];

const IDEAS: Idea[] = [
  { title: 'Launch a cafe in Chennai', chips: ['Local creators', 'Food bloggers'], prompt: 'I want to launch a cafe in Chennai and reach local food lovers.', icon: Coffee },
  { title: 'Promote a new product', chips: ['Influencers', 'Social media'], prompt: 'I want to promote a new product launch to young adults on Instagram.', icon: ShoppingBag },
  { title: 'Increase brand awareness', chips: ['Multi-platform', 'Mass reach'], prompt: 'I want to increase brand awareness across Instagram and YouTube.', icon: Megaphone },
  { title: 'Event coverage', chips: ['On-ground', 'Digital'], prompt: 'I want creators to cover our upcoming event in Bangalore for 15 days.', icon: CalendarDays },
  { title: 'Boost sales', chips: ['Performance driven', 'ROI'], prompt: 'I want to boost sales with a ₹1,00,000 campaign for local customers.', icon: ChartColumn },
  { title: 'College event', chips: ['Campus creators', 'Student audience'], prompt: 'I want a college event campaign for students in Chennai.', icon: MapPin },
  { title: 'App launch campaign', chips: ['Tech creators', 'Product demo'], prompt: 'I want an app launch campaign with tech creators on Instagram and YouTube.', icon: Play },
  { title: 'Seasonal campaign', chips: ['Festive offers', 'UGC content'], prompt: 'I want a seasonal festive campaign for families with a ₹50,000 budget.', icon: Gift },
];

const GREETING =
  "Hi! I'm your campaign assistant\nWhat would you like to create today?\nYou can describe your idea or choose a suggestion from the left.";

const BOT_DELAY = 900;
const nowTime = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

function parseBudget(text: string): string {
  const m = text.match(/(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d+)?)\s*(k|l|lakhs?|lacs?)?\b|([\d,]+(?:\.\d+)?)\s*(k|lakhs?|lacs?)\b/i);
  if (!m) return '';
  const value = parseFloat((m[1] ?? m[3]).replace(/,/g, ''));
  const unit = (m[2] ?? m[4] ?? '').toLowerCase();
  if (Number.isNaN(value)) return '';
  if (unit === 'k') return inr(value * 1_000);
  if (unit.startsWith('l')) return inr(value * 1_00_000);
  return inr(value);
}

function parseLocation(text: string): string {
  const city = CITIES.find((c) => new RegExp(`\\b${c}\\b`, 'i').test(text));
  return city === 'Bengaluru' ? 'Bangalore' : city ?? '';
}

function parseDuration(text: string): string {
  const m = text.match(/(\d+)\s*(day|week|month)s?/i);
  if (!m) return '';
  const n = Number(m[1]);
  return `${n} ${m[2].toLowerCase()}${n === 1 ? '' : 's'}`;
}

function parsePlatforms(text: string): PlatformId[] {
  return PLATFORMS.filter((p) => p.match.test(text)).map((p) => p.id);
}

function parseAudience(text: string): string {
  if (/students?|college|campus/i.test(text)) return 'Students';
  if (/famil(y|ies)|parents?/i.test(text)) return 'Families';
  if (/young|youth|gen\s?z/i.test(text)) return 'Young adults (18–30)';
  if (/local|food lover/i.test(text)) return 'Local customers';
  return '';
}

function toGoal(text: string): string {
  const goal = text
    .trim()
    .replace(/^(hi|hello|hey)[,!.\s]+/i, '')
    .replace(/^(i|we)\s*(?:'d like|would like|want|need|plan|am planning|are planning)\s+to\s+/i, '')
    .replace(/\b(my|our)\s+/gi, '')
    .replace(/\s+/g, ' ');
  if (!goal) return '';
  const sentence = goal.charAt(0).toUpperCase() + goal.slice(1);
  return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
}

function platformLabel(id: PlatformId): string {
  return PLATFORMS.find((p) => p.id === id)?.label ?? id;
}

export default function CreateCampaignPageWeb() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, from: 'bot', text: GREETING, time: nowTime() },
  ]);
  const [brief, setBrief] = useState<Brief>(EMPTY_BRIEF);
  const [queue, setQueue] = useState<QuestionKey[]>([]);
  const [current, setCurrent] = useState<QuestionKey | null>(null);
  const [typing, setTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const [platformPick, setPlatformPick] = useState<PlatformId[]>([]);
  const [customFor, setCustomFor] = useState<QuestionKey | null>(null);
  const [draft, setDraft] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [editing, setEditing] = useState(false);
  const [recognised, setRecognised] = useState(false);

  const nextId = useRef(2);
  const timers = useRef<number[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const wireRefs = useRef<(SVGPathElement | null)[]>([]);
  const pausedRef = useRef(false);
  const nudgeRef = useRef(0);

  const last = messages[messages.length - 1];

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, current]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }, [draft]);

  useEffect(() => {
    const count = IDEAS.length;
    let shift = 0;
    let lastFrame = performance.now();
    let frame = 0;

    const place = (now: number) => {
      const dt = Math.min(now - lastFrame, 40);
      lastFrame = now;
      if (!pausedRef.current) shift += dt * 0.00042;
      const nudge = nudgeRef.current;
      if (nudge !== 0) {
        const take = nudge * (1 - Math.exp(-dt / 240));
        nudgeRef.current -= take;
        shift += take;
      }

      const root = orbitRef.current;
      if (root) {
        const width = root.clientWidth;
        const height = root.clientHeight;
        const cardW = 292;
        const cardH = 54;
        const cx = Math.max(108, Math.min(width * 0.155, 138));
        const cy = height * 0.5;
        const edge = 4;
        const cardRight = width - 8;
        const radius = Math.max(220, cardRight - cardW - cx);
        const travel = Math.max(height - cardH - edge * 2, 1);
        if (hubRef.current) {
          hubRef.current.style.left = `${cx}px`;
          hubRef.current.style.top = `${cy}px`;
        }
        if (glowRef.current) {
          glowRef.current.style.left = `${cx}px`;
          glowRef.current.style.top = `${cy}px`;
        }
        if (ringsRef.current) {
          const diameter = radius * 2.05;
          ringsRef.current.style.left = `${cx}px`;
          ringsRef.current.style.top = `${cy}px`;
          ringsRef.current.style.width = `${diameter}px`;
          ringsRef.current.style.height = `${diameter}px`;
        }
        if (prevRef.current) prevRef.current.style.left = `${Math.max(8, cx - 118)}px`;
        if (nextRef.current) {
          nextRef.current.style.left = `${width - 20}px`;
          nextRef.current.style.right = 'auto';
        }
        const fade = 0.2;
        IDEAS.forEach((_, i) => {
          const pos = (((i + shift) % count) + count) % count;
          const y = edge + cardH / 2 + (pos / count) * travel;
          const ny = Math.max(-0.98, Math.min(0.98, ((y - cy) / (travel * 0.5)) * 0.9));
          const bow = Math.sqrt(1 - ny * ny);
          const x = cx + bow * radius;
          const seam = Math.min(pos, count - pos);
          const opacity = seam < fade ? seam / fade : 1;
          const card = cardRefs.current[i];
          if (card) {
            card.style.left = '0px';
            card.style.top = '0px';
            card.style.opacity = String(opacity);
            card.style.zIndex = String(2 + Math.round(bow * 6));
            card.style.transform = `translate3d(${x}px, ${y}px, 0) translateY(-50%)`;
          }
          const wire = wireRefs.current[i];
          if (wire) {
            const hx = cx + 84;
            const hy = cy + (y - cy) * 0.18;
            const cpx = hx + (x - hx) * 0.58;
            const cpy = hy + (y - hy) * 0.15;
            wire.setAttribute('opacity', String(opacity));
            wire.setAttribute('d', `M ${hx} ${hy} Q ${cpx} ${cpy} ${x} ${y}`);
          }
        });
      }
      frame = requestAnimationFrame(place);
    };

    frame = requestAnimationFrame(place);
    return () => cancelAnimationFrame(frame);
  }, []);

  const push = (msg: Omit<ChatMessage, 'id' | 'time'>) =>
    setMessages((prev) => [...prev, { ...msg, id: nextId.current++, time: nowTime() }]);

  const botSay = (msg: Omit<ChatMessage, 'id' | 'time' | 'from'>, after?: () => void) => {
    setTyping(true);
    const t = window.setTimeout(() => {
      setTyping(false);
      push({ from: 'bot', ...msg });
      after?.();
    }, BOT_DELAY);
    timers.current.push(t);
  };

  const askNext = (remaining: QuestionKey[], preface = '') => {
    const [next, ...rest] = remaining;
    setQueue(rest);
    if (!next) {
      setCurrent(null);
      botSay(
        { text: "Perfect, I have everything I need. Here's what I understood — you can edit anything before we generate the plan." },
        () => setRecognised(true),
      );
      return;
    }
    botSay({ text: `${preface}${QUESTIONS[next].prompt}`, question: next }, () => setCurrent(next));
  };

  const start = (text: string) => {
    const parsed: Brief = {
      goal: toGoal(text),
      location: parseLocation(text),
      audience: parseAudience(text),
      budget: parseBudget(text),
      platforms: parsePlatforms(text),
      otherPlatforms: '',
      timeline: parseDuration(text),
    };
    const pending: QuestionKey[] = [];
    if (!parsed.audience) pending.push('audience');
    if (!parsed.budget) pending.push('budget');
    if (parsed.platforms.length === 0) pending.push('platforms');
    if (!parsed.timeline) pending.push('duration');

    setBrief(parsed);
    setStarted(true);
    setRecognised(false);
    setCurrent(null);
    setCustomFor(null);
    push({ from: 'user', text });
    askNext(pending, "Great! That's an exciting goal.\nTo get a better plan, could you tell me:\n");
  };

  const answer = (question: QuestionKey, text: string, picks: PlatformId[] = []) => {
    setCurrent(null);
    setCustomFor(null);
    push({ from: 'user', text });
    setBrief((prev) => {
      switch (question) {
        case 'duration':
          return { ...prev, timeline: parseDuration(text) || text };
        case 'budget':
          return { ...prev, budget: parseBudget(text) || parseBudget(`₹${text}`) || text };
        case 'audience':
          return { ...prev, audience: text.trim() };
        case 'platforms': {
          const typed = parsePlatforms(text);
          const ids = Array.from(new Set([...picks, ...typed]));
          const other = picks.length === 0 && typed.length === 0 ? text : prev.otherPlatforms;
          return { ...prev, platforms: ids, otherPlatforms: other };
        }
      }
    });
    setPlatformPick([]);
    askNext(queue);
  };

  const pickOption = (question: QuestionKey, option: string) => {
    if (option === 'Custom') {
      setCustomFor(question);
      inputRef.current?.focus();
      return;
    }
    answer(question, option);
  };

  const send = () => {
    const text = [draft.trim(), attachment ? `Attached: ${attachment.name}` : ''].filter(Boolean).join('\n');
    if (!text || typing) return;
    setDraft('');
    setAttachment(null);
    if (!started) {
      start(text);
      return;
    }
    if (current) {
      answer(current, text, current === 'platforms' ? platformPick : []);
      return;
    }
    push({ from: 'user', text });
    botSay({ text: "Got it — I'll keep that in mind for your campaign." }, () => setRecognised(true));
  };

  const chooseIdea = (prompt: string) => {
    if (typing) return;
    if (!started) {
      start(prompt);
      return;
    }
    setDraft(prompt);
    inputRef.current?.focus();
  };

  const stepArc = (dir: number) => {
    nudgeRef.current += dir;
  };

  const generate = () => {
    localStorage.setItem('campaign_brief', JSON.stringify({ ...brief, platforms: brief.platforms.map(platformLabel) }));
    navigate('/business/campaigns/strategy');
  };

  const update = <K extends keyof Brief>(key: K, value: Brief[K]) => setBrief((prev) => ({ ...prev, [key]: value }));

  const placeholder = !started
    ? 'Describe your campaign goal, budget, audience...'
    : customFor
      ? QUESTIONS[customFor].customHint
      : 'Type your message...';

  const done = (key: (typeof CHECKLIST)[number]['key']) => {
    if (key === 'goal') return Boolean(brief.goal);
    if (key === 'audience') return Boolean(brief.audience);
    if (key === 'budget') return Boolean(brief.budget);
    if (key === 'platforms') return brief.platforms.length > 0 || Boolean(brief.otherPlatforms);
    return Boolean(brief.timeline);
  };

  return (
    <BusinessLayout breadcrumb="New Campaign">
      <div className="ccw">
        <header className="ccw-head">
          <h1><Sparkles size={22} /> Create Campaign</h1>
          <p>Let the AI help you create a complete campaign or set it up manually.</p>
          <div className="ccw-modes">
            <button type="button" className="ccw-mode is-on"><Sparkles size={15} /> AI Assistant</button>
            <button type="button" className="ccw-mode" onClick={() => navigate('/business/campaigns/parameters')}>
              <Settings size={15} /> Manual Setup
            </button>
      </div>
        </header>

        <div className="ccw-workspace">
          <section
            className="ccw-orbit"
            ref={orbitRef}
            aria-label="Campaign ideas"
            onMouseEnter={() => { pausedRef.current = true; }}
            onMouseLeave={() => { pausedRef.current = false; }}
          >
            <div className="ccw-glow" ref={glowRef} />
            <div className="ccw-rings" ref={ringsRef} aria-hidden="true" />
            <svg className="ccw-wires" aria-hidden="true">
              {IDEAS.map((idea, i) => (
                <path key={idea.title} ref={(el) => { wireRefs.current[i] = el; }} />
              ))}
            </svg>
            <button type="button" className="ccw-nudge ccw-nudge--prev" ref={prevRef} aria-label="Move ideas up" onClick={() => stepArc(-1)}>
              <ChevronLeft size={18} />
            </button>
            <button type="button" className="ccw-nudge ccw-nudge--next" ref={nextRef} aria-label="Move ideas down" onClick={() => stepArc(1)}>
              <ChevronRight size={18} />
          </button>
            <div className="ccw-hub" ref={hubRef}>
              <span className="ccw-hub__mark" aria-hidden="true"><i /><i /><i /></span>
              <strong>Campaign Idea</strong>
              <span>Explore possibilities powered by AI</span>
      </div>
            {IDEAS.map((idea, i) => {
              const Icon = idea.icon;
              return (
                <button
                  key={idea.title}
                  type="button"
                  className="ccw-idea"
                  ref={(el) => { cardRefs.current[i] = el; }}
                  onClick={() => chooseIdea(idea.prompt)}
                >
                  <span className="ccw-idea__icon"><Icon size={16} /></span>
                  <span className="ccw-idea__body">
                    <strong>{idea.title}</strong>
                    <span>{idea.chips[0]} <i /> {idea.chips[1]}</span>
                  </span>
                  <ChevronRight size={16} />
                </button>
              );
            })}
          </section>

          <aside className="ccw-side">
            <section className="ccw-chat" aria-label="Campaign assistant">
              <div className="ccw-chat__bar">
                <span className="ccw-avatar"><Bot size={18} /></span>
                <div>
                  <strong>Your Campaign Assistant</strong>
                  <span>Tell me what you want to achieve, and I'll help you create the best campaign.</span>
                </div>
              </div>
              <div className="ccw-log" ref={logRef}>
                {messages.map((m) => {
                  const isUser = m.from === 'user';
                  const showOptions = m.question && m.question === current && m.id === last?.id;
                  return (
                    <div key={m.id} className={`ccw-msg${isUser ? ' ccw-msg--user' : ''}`}>
                      {!isUser && <span className="ccw-avatar ccw-avatar--sm"><Bot size={14} /></span>}
                      <div className="ccw-msg__col">
                        <p className="ccw-bubble">{m.text}</p>
                        <span className="ccw-time">{m.time}</span>
                        {showOptions && m.question === 'platforms' && (
                          <div className="ccw-opts">
                            {PLATFORMS.map((p) => (
                    <button
                                key={p.id}
                                type="button"
                                className={`ccw-opt${platformPick.includes(p.id) ? ' is-on' : ''}`}
                                aria-pressed={platformPick.includes(p.id)}
                                onClick={() => setPlatformPick((prev) => (prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id]))}
                              >
                                <PlatformMark id={p.id} size={14} /> {p.label}
                    </button>
                  ))}
                            {platformPick.length > 0 && (
                              <button type="button" className="ccw-opt ccw-opt--go" onClick={() => answer('platforms', platformPick.map(platformLabel).join(', '), platformPick)}>
                                Continue <ArrowRight size={14} />
                        </button>
                            )}
                          </div>
                        )}
                        {showOptions && m.question && m.question !== 'platforms' && (
                          <div className="ccw-opts">
                            {QUESTIONS[m.question].options.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                className={`ccw-opt${opt === 'Custom' && customFor === m.question ? ' is-on' : ''}`}
                                onClick={() => pickOption(m.question as QuestionKey, opt)}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                        </div>
                      {isUser && <span className="ccw-avatar ccw-avatar--user">D</span>}
                    </div>
                  );
                })}
                {typing && (
                  <div className="ccw-msg">
                    <span className="ccw-avatar ccw-avatar--sm"><Bot size={14} /></span>
                    <div className="ccw-typing" aria-label="Assistant is typing"><i /><i /><i /></div>
                  </div>
                )}
                {started && (
                  <ul className="ccw-check">
                    {CHECKLIST.map((item) => {
                      const Icon = item.icon;
                      const active = item.key === current;
                      return (
                        <li key={item.key} className={done(item.key) ? 'is-done' : active ? 'is-now' : ''}>
                          <Icon size={15} />
                          <span>{item.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              {attachment && (
                <div className="ccw-file">
                  <Paperclip size={13} />
                  <span>{attachment.name}</span>
                  <button type="button" aria-label="Remove attachment" onClick={() => setAttachment(null)}><X size={14} /></button>
                </div>
              )}
              <form
                className="ccw-composer"
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
              >
                <button type="button" className="ccw-icon" aria-label="Attach a file" onClick={() => fileRef.current?.click()}>
                  <Paperclip size={18} />
              </button>
                <input
                  ref={fileRef}
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx,.txt,image/*"
                  onChange={(e) => {
                    setAttachment(e.target.files?.[0] ?? null);
                    e.target.value = '';
                  }}
                />
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={draft}
                  placeholder={placeholder}
                  aria-label="Message the campaign assistant"
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                />
                <button type="submit" className="ccw-send" aria-label="Send" disabled={typing || (!draft.trim() && !attachment)}>
                  <ArrowRight size={18} />
                </button>
              </form>
            </section>

            <section className={`ccw-intent${recognised ? ' is-ready' : ''}`} aria-label="Campaign intent recogniser">
              <div className="ccw-intent__top">
                <span className="ccw-intent__icon"><Brain size={18} /></span>
                <div>
                  <strong>Campaign Intent Recogniser</strong>
                  <span>{recognised ? 'Ready to generate' : 'Waiting for details'}</span>
                </div>
              </div>
              {recognised ? (
                <>
                  {editing ? (
                    <textarea rows={2} value={brief.goal} aria-label="Campaign goal" onChange={(e) => update('goal', e.target.value)} />
                  ) : (
                    <p>{brief.goal}</p>
                  )}
                  <dl>
                    <div><dt>Audience</dt><dd>{editing ? <input value={brief.audience} aria-label="Audience" onChange={(e) => update('audience', e.target.value)} /> : brief.audience || '—'}</dd></div>
                    <div><dt>Budget</dt><dd>{editing ? <input value={brief.budget} aria-label="Budget" onChange={(e) => update('budget', e.target.value)} /> : brief.budget || '—'}</dd></div>
                    <div><dt>Location</dt><dd>{editing ? <input value={brief.location} aria-label="Location" onChange={(e) => update('location', e.target.value)} /> : brief.location || '—'}</dd></div>
                    <div><dt>Timeline</dt><dd>{editing ? <input value={brief.timeline} aria-label="Timeline" onChange={(e) => update('timeline', e.target.value)} /> : brief.timeline || '—'}</dd></div>
                  </dl>
                  <div className="ccw-intent__actions">
                    <button type="button" className="ccw-go" onClick={generate}>Generate strategy</button>
                    <button type="button" className="ccw-edit" onClick={() => setEditing((v) => !v)}>{editing ? 'Done' : 'Edit'}</button>
              </div>
            </>
              ) : (
                <p>After we understand your requirements, we'll analyse and generate a complete campaign plan for you.</p>
          )}
            </section>
          </aside>
        </div>
      </div>
    </BusinessLayout>
  );
}
