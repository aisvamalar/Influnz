import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CalendarDays,
  CheckCheck,
  Coffee,
  Ellipsis,
  Lightbulb,
  MapPin,
  Megaphone,
  Paperclip,
  Pencil,
  Send,
  Share2,
  ShoppingBag,
  Star,
  Target,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { useAuth } from '../../../app/AuthContext';
import PlatformMark, { type PlatformId } from '../../../components/mobile/PlatformMark';
import Robot from '../../../components/mobile/RobotMark';
import logoImg from '../../../assets/logo.png';
import './create-campaign-mobile.css';

type Step = 'intro' | 'chat' | 'summary';
type QuestionKey = 'duration' | 'platforms' | 'budget' | 'location';

interface ChatMessage {
  id: number;
  from: 'bot' | 'user';
  text: string;
  time: string;
  question?: QuestionKey;
  review?: boolean;
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

interface Question {
  prompt: string;
  options: string[];
  customHint: string;
}

const EMPTY_BRIEF: Brief = { goal: '', location: '', audience: '', budget: '', platforms: [], otherPlatforms: '', timeline: '' };

const QUESTIONS: Record<QuestionKey, Question> = {
  duration: {
    prompt: 'What is your preferred duration?',
    options: ['1 month', '2 months', '3 months', 'Custom'],
    customHint: 'Type a duration, e.g. 6 weeks',
  },
  platforms: {
    prompt: 'Which social media platforms would you like to focus on?',
    options: [],
    customHint: 'Type other platforms, e.g. LinkedIn',
  },
  budget: {
    prompt: 'What budget do you have in mind for this campaign?',
    options: ['₹25,000', '₹50,000', '₹1,00,000', 'Custom'],
    customHint: 'Type your budget, e.g. ₹75,000',
  },
  location: {
    prompt: 'Which city or area should we target?',
    options: ['Chennai', 'Mumbai', 'Bangalore', 'Custom'],
    customHint: 'Type a city or area',
  },
};

const PLATFORMS: { id: PlatformId; label: string; match: RegExp }[] = [
  { id: 'instagram', label: 'Instagram', match: /insta(gram)?|reels?/i },
  { id: 'youtube', label: 'YouTube', match: /you\s?tube|shorts/i },
  { id: 'tiktok', label: 'TikTok', match: /tik\s?tok/i },
  { id: 'facebook', label: 'Facebook', match: /facebook|\bfb\b/i },
  { id: 'x', label: 'X (Twitter)', match: /twitter|\bx\b/i },
];

const CITIES = ['Chennai', 'Mumbai', 'Bangalore', 'Bengaluru', 'Delhi', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Kochi', 'Coimbatore', 'Madurai'];

const SUGGESTIONS: { label: string; prompt: string; Icon: typeof Coffee }[] = [
  { label: 'Launch a cafe in Chennai', prompt: 'I want to promote my cafe in Chennai and reach more local customers.', Icon: Coffee },
  { label: 'Promote a new product', prompt: 'I want to promote a new product launch to young adults.', Icon: ShoppingBag },
  { label: 'Event coverage', prompt: 'I want creators to cover our upcoming event in Bangalore.', Icon: CalendarDays },
  { label: 'Increase brand awareness', prompt: 'I want to increase brand awareness for my business.', Icon: Megaphone },
];

const GREETING =
  "Hi!\nI'm your campaign assistant. Tell me what you want to achieve, and I'll help you create the best campaign with the right creators.";

const BOT_DELAY = 900;

// ── Brief parsing ───────────────────────────────────────────────────────────
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
  if (/local/i.test(text)) return 'Local customers';
  if (/students?|college/i.test(text)) return 'Students';
  if (/young|youth|gen\s?z/i.test(text)) return 'Young adults (18–30)';
  if (/famil(y|ies)|parents?/i.test(text)) return 'Families';
  return 'General audience';
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

function capitalize(text: string): string {
  const t = text.trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

// ── Illustrations & brand marks ─────────────────────────────────────────────
function IntroArt() {
  return (
    <svg className="mcc-intro__art" viewBox="0 0 180 150" aria-hidden="true">
      <defs>
        <radialGradient id="mccHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f9cbbd" />
          <stop offset="100%" stopColor="#fde9e1" />
        </radialGradient>
      </defs>
      <circle cx="90" cy="84" r="60" fill="none" stroke="#f6d3c7" strokeWidth="1.5" />
      <circle cx="90" cy="84" r="46" fill="url(#mccHalo)" />
      <path d="M38 40 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="#ef7a63" />
      <circle cx="58" cy="30" r="3" fill="#f5b3a3" />
      <rect x="118" y="14" width="46" height="30" rx="10" fill="#ffffff" stroke="#f0b9aa" strokeWidth="1.5" />
      <path d="M128 44 l-4 9 12-9 z" fill="#ffffff" stroke="#f0b9aa" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="132" cy="29" r="3" fill="#ef7a63" />
      <circle cx="141" cy="29" r="3" fill="#ef7a63" />
      <circle cx="150" cy="29" r="3" fill="#ef7a63" />
      <g transform="translate(54 48)">
        <Robot size={72} />
      </g>
    </svg>
  );
}

function Hills() {
  return (
    <svg className="mcc-hills" viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 90 C 60 60, 120 70, 180 90 S 300 120, 400 80 V160 H0 Z" fill="#f9e3da" opacity="0.6" />
      <path d="M0 120 C 80 95, 160 105, 240 120 S 340 135, 400 115 V160 H0 Z" fill="#f6d8cc" opacity="0.55" />
    </svg>
  );
}

function UserAvatar() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
      <circle cx="18" cy="14" r="6" fill="#e9967f" />
      <path d="M7 31c1.8-6 6.2-9 11-9s9.2 3 11 9" fill="#e9967f" />
    </svg>
  );
}

function platformLabel(id: PlatformId): string {
  return PLATFORMS.find((p) => p.id === id)?.label ?? id;
}

/**
 * Mobile Create Campaign assistant
 * Intro → guided chat → identified campaign details, then on to campaign parameters.
 */
export default function CreateCampaignPageMobile() {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [brief, setBrief] = useState<Brief>(EMPTY_BRIEF);
  const [queue, setQueue] = useState<QuestionKey[]>([]);
  const [current, setCurrent] = useState<QuestionKey | null>(null);
  const [typing, setTyping] = useState(false);
  const [platformPick, setPlatformPick] = useState<PlatformId[]>([]);
  const [customFor, setCustomFor] = useState<QuestionKey | null>(null);
  const [draft, setDraft] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [editing, setEditing] = useState(false);

  const nextId = useRef(1);
  const timers = useRef<number[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const requested = searchParams.get('step') as Step | null;
  const step: Step = requested && requested !== 'intro' && messages.length > 0 ? requested : 'intro';

  const businessName = state.user?.businessName ?? 'Demo Business';
  const initial = (state.user?.avatarInitials ?? businessName).charAt(0).toUpperCase();

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    if (step !== 'chat') return;
    const el = bodyRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, current, step]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [step]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight + 2, 120)}px`;
    el.style.overflowY = el.scrollHeight > 120 ? 'auto' : 'hidden';
  }, [draft, step]);

  const goTo = (next: Step) => setSearchParams(next === 'intro' ? {} : { step: next });

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
      botSay({
        text: "Perfect, I have everything I need. Here's what I understood — you can edit anything before moving on.",
        review: true,
      });
      return;
    }
    botSay({ text: `${preface}${QUESTIONS[next].prompt}`, question: next }, () => setCurrent(next));
  };

  const start = (text: string) => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    nextId.current = 1;

    const parsed: Brief = {
      goal: toGoal(text),
      location: parseLocation(text),
      audience: parseAudience(text),
      budget: parseBudget(text),
      platforms: parsePlatforms(text),
      otherPlatforms: '',
      timeline: parseDuration(text),
    };
    const pendingQuestions: QuestionKey[] = [];
    if (!parsed.timeline) pendingQuestions.push('duration');
    if (parsed.platforms.length === 0) pendingQuestions.push('platforms');
    if (!parsed.budget) pendingQuestions.push('budget');
    if (!parsed.location) pendingQuestions.push('location');

    setBrief(parsed);
    setCurrent(null);
    setCustomFor(null);
    setPlatformPick([]);
    setEditing(false);
    setMessages([
      { id: nextId.current++, from: 'bot', text: GREETING, time: nowTime() },
      { id: nextId.current++, from: 'user', text, time: nowTime() },
    ]);
    goTo('chat');

    const preface = `Great! That's an exciting goal.\nTo create the best campaign, I just need a few more details. `;
    askNext(pendingQuestions, preface);
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
        case 'location':
          return { ...prev, location: capitalize(text) };
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

  const togglePlatform = (id: PlatformId) =>
    setPlatformPick((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));

  const send = () => {
    const text = [draft.trim(), attachment ? `Attached: ${attachment.name}` : ''].filter(Boolean).join('\n');
    if (!text || typing) return;
    setDraft('');
    setAttachment(null);

    if (step === 'intro') {
      start(text);
      return;
    }
    if (current) {
      answer(current, text, current === 'platforms' ? platformPick : []);
      return;
    }
    push({ from: 'user', text });
    botSay({ text: "Got it — I'll keep that in mind for your campaign.", review: true });
  };

  // Each step is its own history entry, so the header arrow and the phone's back gesture agree.
  const back = () => {
    setEditing(false);
    navigate(-1);
  };

  const next = () => {
    localStorage.setItem('campaign_brief', JSON.stringify({ ...brief, platforms: brief.platforms.map(platformLabel) }));
    navigate('/business/campaigns/strategy');
  };

  const updateBrief = <K extends keyof Brief>(key: K, value: Brief[K]) => setBrief((prev) => ({ ...prev, [key]: value }));

  const placeholder =
    step === 'intro'
      ? 'Describe your campaign goal, budget, audience...'
      : customFor
        ? QUESTIONS[customFor].customHint
        : 'Type your message...';

  const lastMessage = messages[messages.length - 1];

  const renderValue = (value: string): ReactNode =>
    value ? value : <span className="mcc-row__value--empty">Not set</span>;

  return (
    <div className="mcc">
      <div className="mcc-bar">
        <button
          type="button"
          className="mcc-bar__btn mcc-bar__btn--back"
          aria-label="Go back"
          onClick={step === 'intro' ? () => navigate('/business') : back}
        >
          <ArrowLeft size={22} />
        </button>
        <div className="mcc-bar__brand">
          <img src={logoImg} alt="Influnz" className="mcc-bar__logo" />
          <span className="mcc-bar__badge">BUSINESS</span>
        </div>
        <button type="button" className="mcc-bar__btn" aria-label="Account settings" onClick={() => navigate('/business/settings')}>
          <span className="mcc-bar__avatar">{initial}</span>
        </button>
      </div>

      <div className="mcc-body" ref={bodyRef}>
        {step === 'intro' && (
          <>
            <div className="mcc-wrap">
              <section className="mcc-intro">
                <IntroArt />
                <h1 className="mcc-intro__title">Create your campaign</h1>
                <p className="mcc-intro__sub">Tell us what you want to achieve, and I'll help you create the best campaign.</p>
              </section>
              <section className="mcc-try" aria-labelledby="mcc-try-label">
                <p id="mcc-try-label" className="mcc-try__label">You can try:</p>
                <div className="mcc-try__grid">
                  {SUGGESTIONS.map(({ label, prompt, Icon }) => (
                    <button
                      key={label}
                      type="button"
                      className="mcc-suggest"
                      onClick={() => {
                        setDraft(prompt);
                        inputRef.current?.focus();
                      }}
                    >
                      <span className="mcc-suggest__icon"><Icon size={16} /></span>
                      {label}
                    </button>
                  ))}
                </div>
              </section>
            </div>
            <Hills />
          </>
        )}

        {step === 'chat' && (
          <div className="mcc-wrap">
            <div className="mcc-chat" aria-live="polite">
              {messages.map((m) => {
                const isUser = m.from === 'user';
                const showOptions = m.question && m.question === current && m.id === lastMessage?.id;
                return (
                  <div key={m.id} className={`mcc-msg${isUser ? ' mcc-msg--user' : ''}`}>
                    <span className="mcc-msg__avatar">{isUser ? <UserAvatar /> : <Robot size={30} />}</span>
                    <div className="mcc-msg__col">
                      <p className="mcc-bubble">{m.text}</p>
                      {(isUser || m.question) && (
                        <span className="mcc-msg__time">
                          {m.time}
                          {isUser && <CheckCheck size={13} aria-label="Read" />}
                        </span>
                      )}

                      {showOptions && m.question === 'platforms' && (
                        <div className="mcc-options" role="group" aria-label="Choose platforms">
                          {PLATFORMS.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              className="mcc-opt"
                              aria-pressed={platformPick.includes(p.id)}
                              onClick={() => togglePlatform(p.id)}
                            >
                              <PlatformMark id={p.id} size={16} /> {p.label}
                            </button>
                          ))}
                          <button type="button" className="mcc-opt" aria-pressed={customFor === 'platforms'} onClick={() => pickOption('platforms', 'Custom')}>
                            <Ellipsis size={16} /> More
                          </button>
                          {platformPick.length > 0 && (
                            <button
                              type="button"
                              className="mcc-opt mcc-opt--confirm"
                              onClick={() => answer('platforms', platformPick.map(platformLabel).join(', '), platformPick)}
                            >
                              Continue <ArrowRight size={15} />
                            </button>
                          )}
                        </div>
                      )}

                      {showOptions && m.question && m.question !== 'platforms' && (
                        <div className="mcc-options" role="group" aria-label="Quick replies">
                          {QUESTIONS[m.question].options.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className="mcc-opt"
                              aria-pressed={opt === 'Custom' && customFor === m.question}
                              onClick={() => pickOption(m.question as QuestionKey, opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}

                      {m.review && m.id === lastMessage?.id && !typing && (
                        <div className="mcc-options">
                          <button type="button" className="mcc-opt mcc-opt--confirm" onClick={() => goTo('summary')}>
                            Review campaign details <ArrowRight size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {typing && (
                <div className="mcc-msg">
                  <span className="mcc-msg__avatar"><Robot size={30} /></span>
                  <div className="mcc-typing" aria-label="Assistant is typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'summary' && (
          <div className="mcc-wrap">
            <section className="mcc-panel" aria-labelledby="mcc-summary-title">
              <div className="mcc-panel__head">
                <Star size={22} fill="currentColor" />
                <h1 id="mcc-summary-title" className="mcc-panel__title">Identified Campaign Details</h1>
              </div>
              <p className="mcc-panel__sub">
                Here's what I understood from your conversation. You can edit any details or add more information.
              </p>

              <div className="mcc-details">
                <div className="mcc-goal">
                  <Target size={22} />
                  <div>
                    <p className="mcc-goal__label">Campaign Goal</p>
                    {editing ? (
                      <textarea
                        className="mcc-field mcc-field--goal"
                        rows={3}
                        value={brief.goal}
                        onChange={(e) => updateBrief('goal', e.target.value)}
                        aria-label="Campaign goal"
                      />
                    ) : (
                      <p className="mcc-goal__text">{renderValue(brief.goal)}</p>
                    )}
                  </div>
                  <button type="button" className="mcc-edit" onClick={() => setEditing((v) => !v)}>
                    {editing ? 'Done' : (<><Pencil size={13} /> Edit</>)}
                  </button>
                </div>

                <ul className="mcc-rows">
                  {(
                    [
                      ['location', 'Location', MapPin],
                      ['audience', 'Target Audience', Users],
                      ['budget', 'Budget', Wallet],
                    ] as const
                  ).map(([key, label, Icon]) => (
                    <li key={key} className="mcc-row">
                      <Icon size={20} />
                      <span className="mcc-row__label">{label}</span>
                      <span className="mcc-row__value">
                        {editing ? (
                          <input
                            type="text"
                            className="mcc-field"
                            value={brief[key]}
                            onChange={(e) => updateBrief(key, e.target.value)}
                            aria-label={label}
                          />
                        ) : (
                          renderValue(brief[key])
                        )}
                      </span>
                    </li>
                  ))}

                  <li className="mcc-row">
                    <Share2 size={20} />
                    <span className="mcc-row__label">Platforms</span>
                    <span className="mcc-row__value">
                      {editing ? (
                        <span className="mcc-platforms">
                          {PLATFORMS.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              className="mcc-platform-toggle"
                              aria-label={p.label}
                              aria-pressed={brief.platforms.includes(p.id)}
                              onClick={() =>
                                updateBrief(
                                  'platforms',
                                  brief.platforms.includes(p.id)
                                    ? brief.platforms.filter((id) => id !== p.id)
                                    : [...brief.platforms, p.id],
                                )
                              }
                            >
                              <PlatformMark id={p.id} size={22} />
                            </button>
                          ))}
                        </span>
                      ) : brief.platforms.length > 0 || brief.otherPlatforms ? (
                        <span className="mcc-platforms">
                          {brief.platforms.map((id) => (
                            <span key={id} title={platformLabel(id)} aria-label={platformLabel(id)} role="img">
                              <PlatformMark id={id} size={24} />
                            </span>
                          ))}
                          {brief.otherPlatforms && <span className="mcc-platforms__other">{brief.otherPlatforms}</span>}
                        </span>
                      ) : (
                        renderValue('')
                      )}
                    </span>
                  </li>

                  <li className="mcc-row">
                    <Calendar size={20} />
                    <span className="mcc-row__label">Timeline</span>
                    <span className="mcc-row__value">
                      {editing ? (
                        <input
                          type="text"
                          className="mcc-field"
                          value={brief.timeline}
                          onChange={(e) => updateBrief('timeline', e.target.value)}
                          aria-label="Timeline"
                        />
                      ) : (
                        renderValue(brief.timeline)
                      )}
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            <aside className="mcc-tip">
              <Lightbulb size={22} />
              <div>
                <p className="mcc-tip__title">Tip</p>
                <p className="mcc-tip__text">You can edit any details if needed, or add more information for better results.</p>
              </div>
            </aside>
          </div>
        )}
      </div>

      {step === 'summary' ? (
        <div className="mcc-footer">
          <button type="button" className="mcc-next" onClick={next}>
            Next: Campaign Details <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <form
          className="mcc-composer"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          {attachment && (
            <div className="mcc-attach-row">
              <span className="mcc-attach-chip">
                <Paperclip size={12} />
                <span>{attachment.name}</span>
                <button type="button" aria-label="Remove attachment" onClick={() => setAttachment(null)}>
                  <X size={13} />
                </button>
              </span>
            </div>
          )}
          <div className="mcc-composer__inner">
            <button type="button" className="mcc-icon-btn" aria-label="Attach a file" onClick={() => fileRef.current?.click()}>
              <Paperclip size={20} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,image/*"
              hidden
              onChange={(e) => {
                setAttachment(e.target.files?.[0] ?? null);
                e.target.value = '';
              }}
            />
            <textarea
              ref={inputRef}
              className="mcc-input"
              rows={1}
              value={draft}
              placeholder={placeholder}
              aria-label={step === 'intro' ? 'Describe your campaign' : 'Message the campaign assistant'}
              enterKeyHint="send"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <button
              type="submit"
              className="mcc-send"
              aria-label="Send"
              disabled={typing || (!draft.trim() && !attachment)}
            >
              {step === 'intro' ? <Send size={17} /> : <ArrowRight size={18} />}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
