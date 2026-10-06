/**
 * CreateCampaignPage — 3-stage AI chat flow
 * Stage 1: initial (greeting + suggestion chips)
 * Stage 2: thinking (user message + animated chain-of-thought)
 * Stage 3: results (user message + AI response with editable fields + right panel strategy)
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';

type ConversationStage = 'initial' | 'thinking' | 'results';
type RightTab = 'strategy' | 'creators' | 'content' | 'budget' | 'timeline';

interface ThinkingStep {
  id: number;
  title: string;
  detail: string;
  timing: string;
  expanded: boolean;
}

const THINKING_STEPS: ThinkingStep[] = [
  { id: 1, title: 'Understanding campaign objective', detail: 'Identified goal: Drive local store visits for a new café launch in Chennai. Primary KPI will be footfall and brand awareness among local food lovers.', timing: '1.2s', expanded: false },
  { id: 2, title: 'Analysing budget & location', detail: 'Budget ₹1,50,000 allocated. Chennai with 15km radius targeting. Cost per creator estimated at ₹15,000–₹25,000 for nano/micro tier.', timing: '0.8s', expanded: false },
  { id: 3, title: 'Matching creator profiles', detail: 'Filtering Tamil-speaking food creators on Instagram in Chennai. Nano creators (10k–50k) provide higher engagement; micro (50k–200k) add reach.', timing: '1.5s', expanded: false },
  { id: 4, title: 'Building campaign strategy', detail: 'Recommending 6 nano + 2 micro creators. 15-day campaign with Reels + Stories. Projected reach 1.2M+, estimated 2,400+ store visits.', timing: '2.1s', expanded: false },
];

const FIELDS = [
  { key: 'budget',   label: 'Budget',          value: '₹1,50,000' },
  { key: 'location', label: 'Location',        value: 'Chennai 15 km' },
  { key: 'duration', label: 'Duration',        value: '15 days' },
  { key: 'category', label: 'Category',        value: 'Food & Beverage' },
  { key: 'audience', label: 'Target Audience', value: 'Local food lovers, 18–34' },
  { key: 'language', label: 'Language',        value: 'Tamil / Tanglish' },
  { key: 'platform', label: 'Platform',        value: 'Instagram' },
];

const SUGGESTION_CHIPS = [
  'Launch a café in Chennai',
  'Promote a new product',
  'Event coverage',
  'Increase brand awareness',
];

const THINKING_DURATION_MS = 3500;

// Field validation rules
const validateField = (key: string, value: string): string | null => {
  if (!value.trim()) return 'Field cannot be empty';
  
  switch (key) {
    case 'budget':
      // Must start with ₹ and contain numbers
      if (!value.startsWith('₹')) return 'Budget must start with ₹';
      const budgetNum = value.slice(1).replace(/,/g, '');
      if (!/^\d+$/.test(budgetNum)) return 'Budget must be a valid number';
      return null;
    
    case 'duration':
      // Must contain a number
      if (!/\d+/.test(value)) return 'Duration must include a number';
      return null;
    
    case 'location':
      // Basic check: not empty
      if (value.trim().length < 3) return 'Location must be at least 3 characters';
      return null;
    
    default:
      // Generic non-empty check
      return value.trim().length > 0 ? null : 'Field cannot be empty';
  }
};

export default function CreateCampaignPage() {
  const navigate = useNavigate();

  const [stage, setStage] = useState<ConversationStage>('initial');
  const [userMessage, setUserMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [visibleStepCount, setVisibleStepCount] = useState(0);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(
    Object.fromEntries(FIELDS.map(f => [f.key, f.value]))
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const [rightTab, setRightTab] = useState<RightTab>('strategy');

  // Progressive step reveal when entering thinking stage
  useEffect(() => {
    if (stage !== 'thinking') return;
    setVisibleStepCount(0);
    const timers = [
      setTimeout(() => setVisibleStepCount(1), 400),
      setTimeout(() => setVisibleStepCount(2), 900),
      setTimeout(() => setVisibleStepCount(3), 1400),
      setTimeout(() => setVisibleStepCount(4), 2000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [stage]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setUserMessage(inputValue);
    setInputValue('');
    setStage('thinking');
    setThinkingSteps(THINKING_STEPS.map(s => ({ ...s, expanded: false })));
    setTimeout(() => setStage('results'), THINKING_DURATION_MS);
  };

  const handleChipClick = (text: string) => {
    setInputValue(text);
  };

  const toggleStepExpanded = (id: number) => {
    setThinkingSteps(prev => prev.map(s => s.id === id ? { ...s, expanded: !s.expanded } : s));
  };

  const handleFieldEdit = (key: string, value: string) => {
    const error = validateField(key, value);
    setFieldErrors(prev => ({ ...prev, [key]: error }));
    if (!error) {
      setFieldValues(prev => ({ ...prev, [key]: value }));
    }
  };

  const commitFieldEdit = (key: string) => {
    const error = fieldErrors[key];
    if (error) {
      // Don't commit invalid values, revert to previous
      setFieldValues(prev => ({ ...prev, [key]: FIELDS.find(f => f.key === key)?.value || prev[key] }));
      setFieldErrors(prev => ({ ...prev, [key]: null }));
    }
    setEditingField(null);
  };

  return (
    <BusinessLayout breadcrumb="New Campaign">
      <style>{`
        @keyframes thinkDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        .think-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #9ca3af;
          animation: thinkDot 1.4s infinite ease-in-out;
        }
        .think-dot:nth-child(1) { animation-delay: 0s; }
        .think-dot:nth-child(2) { animation-delay: 0.2s; }
        .think-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .step-appear {
          animation: fadeSlideIn 0.4s ease forwards;
        }
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 200px; }
        }
        .step-detail {
          animation: slideDown 0.25s ease forwards;
          overflow: hidden;
        }
      `}</style>

      {/* Two-panel layout */}
      <div style={{
        display: 'flex',
        gap: 20,
        height: 'calc(100vh - 200px)',
        minHeight: 600,
      }}>
        {/* LEFT PANEL — Chat */}
        <div style={{
          flex: '0 0 55%',
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
        }}>
          {/* Bot header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 24,
            background: '#f9f9f7',
            borderBottom: '1px solid #e5e7eb',
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}>
              🤖
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>
                Campaign Assistant
              </div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                Powered by AI
              </div>
            </div>
          </div>

          {/* Message area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            {stage === 'initial' && (
              <>
                {/* Greeting card */}
                <div style={{
                  background: 'white',
                  borderRadius: 12,
                  border: '1px solid #e5e7eb',
                  padding: 20,
                }}>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#1a1a1a',
                    marginBottom: 8,
                  }}>
                    Hi! I'm your campaign assistant 👋
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: '#6b7280',
                    lineHeight: 1.5,
                  }}>
                    Tell me what you want to achieve, and I'll help you create the best campaign.
                  </div>
                </div>

                {/* Suggestion chips */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  {SUGGESTION_CHIPS.map(chip => (
                    <button
                      key={chip}
                      onClick={() => handleChipClick(chip)}
                      style={{
                        background: 'white',
                        border: '1.5px solid #e5e7eb',
                        borderRadius: 20,
                        padding: '8px 16px',
                        fontSize: 13,
                        color: '#374151',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </>
            )}

            {(stage === 'thinking' || stage === 'results') && (
              <>
                {/* User message bubble */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start',
                  gap: 8,
                }}>
                  <div style={{
                    background: '#f5f0e8',
                    borderRadius: '16px 16px 4px 16px',
                    padding: '12px 16px',
                    maxWidth: '80%',
                    fontSize: 14,
                    color: '#1a1a1a',
                    lineHeight: 1.4,
                  }}>
                    {userMessage}
                  </div>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: '#1a1a1a',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    U
                  </div>
                </div>

                {stage === 'thinking' && (
                  /* AI Thinking block */
                  <div style={{
                    background: '#f8f8f6',
                    border: '1px solid #e5e7eb',
                    borderRadius: 16,
                    padding: 20,
                    maxWidth: '90%',
                  }}>
                    {/* Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 16,
                    }}>
                      <span style={{ fontSize: 16 }}>✨</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>
                        Thinking...
                      </span>
                      <div style={{ display: 'flex', gap: 3, marginLeft: 4 }}>
                        <div className="think-dot" />
                        <div className="think-dot" />
                        <div className="think-dot" />
                      </div>
                    </div>

                    {/* Chain-of-thought steps */}
                    <div style={{ position: 'relative', paddingLeft: 20 }}>
                      {/* Vertical connector line */}
                      <div style={{
                        position: 'absolute',
                        left: 9,
                        top: 10,
                        bottom: 10,
                        width: 2,
                        background: '#e5e7eb',
                      }} />

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {thinkingSteps.filter(s => s.id <= visibleStepCount).map(step => (
                          <div key={step.id} className="step-appear" style={{ position: 'relative' }}>
                            {/* Step row */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 10,
                            }}>
                              {/* Step number badge */}
                              <div style={{
                                position: 'absolute',
                                left: -20,
                                top: 2,
                                width: 18,
                                height: 18,
                                borderRadius: '50%',
                                background: '#1a1a1a',
                                color: 'white',
                                fontSize: 10,
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1,
                              }}>
                                {step.id}
                              </div>

                              {/* Step content */}
                              <div style={{ flex: 1 }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  flexWrap: 'wrap',
                                }}>
                                  <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>
                                    {step.title}
                                  </span>
                                  <span style={{
                                    background: '#f3f4f6',
                                    color: '#6b7280',
                                    fontSize: 11,
                                    padding: '2px 8px',
                                    borderRadius: 10,
                                  }}>
                                    {step.timing}
                                  </span>
                                  <button
                                    onClick={() => toggleStepExpanded(step.id)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#9ca3af',
                                      cursor: 'pointer',
                                      fontSize: 12,
                                      padding: 4,
                                      display: 'flex',
                                      alignItems: 'center',
                                      transform: step.expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                      transition: 'transform 0.2s',
                                    }}
                                    aria-label={step.expanded ? 'Collapse' : 'Expand'}
                                  >
                                    ▼
                                  </button>
                                </div>

                                {/* Expanded detail */}
                                {step.expanded && (
                                  <div
                                    className="step-detail"
                                    style={{
                                      background: 'white',
                                      border: '1px solid #f0f0f0',
                                      borderRadius: 8,
                                      padding: '10px 12px',
                                      fontSize: 13,
                                      color: '#6b7280',
                                      marginTop: 8,
                                      lineHeight: 1.5,
                                    }}
                                  >
                                    {step.detail}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {stage === 'results' && (
                  /* AI Response block */
                  <div style={{
                    background: '#f8f8f6',
                    border: '1px solid #e5e7eb',
                    borderRadius: 16,
                    padding: 20,
                    maxWidth: '95%',
                  }}>
                    {/* Header */}
                    <div style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: '#1a1a1a',
                      marginBottom: 4,
                    }}>
                      Here's what I understood from your brief 👍
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: '#6b7280',
                      marginBottom: 14,
                      lineHeight: 1.4,
                    }}>
                      I've extracted the key details. Please review and edit if needed before I generate the campaign strategy.
                    </div>

                    {/* Campaign Goal card */}
                    <div style={{
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: 10,
                      padding: '12px 14px',
                      marginBottom: 12,
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 6,
                      }}>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: '#9ca3af',
                          letterSpacing: '0.5px',
                        }}>
                          🎯 CAMPAIGN GOAL
                        </span>
                        <button style={{
                          background: 'none',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          fontSize: 14,
                          padding: 0,
                        }}>
                          ✏️
                        </button>
                      </div>
                      <div style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#1a1a1a',
                        marginBottom: 4,
                      }}>
                        Drive local store visits
                      </div>
                      <div style={{
                        fontSize: 12,
                        color: '#6b7280',
                      }}>
                        (Café launch, Chennai)
                      </div>
                    </div>

                    {/* Fields grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 8,
                    }}>
                      {FIELDS.map(field => (
                        <div
                          key={field.key}
                          style={{
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: 8,
                            padding: '10px 12px',
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 4,
                          }}>
                            <span style={{
                              fontSize: 10,
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              color: '#9ca3af',
                              letterSpacing: '0.5px',
                            }}>
                              {field.label}
                            </span>
                            {editingField !== field.key && (
                              <button
                                onClick={() => setEditingField(field.key)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#9ca3af',
                                  cursor: 'pointer',
                                  fontSize: 14,
                                  padding: 0,
                                }}
                              >
                                ✏️
                              </button>
                            )}
                          </div>
                          {editingField === field.key ? (
                            <div>
                              <input
                                type="text"
                                value={fieldValues[field.key]}
                                onChange={e => handleFieldEdit(field.key, e.target.value)}
                                onBlur={() => commitFieldEdit(field.key)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') commitFieldEdit(field.key);
                                  if (e.key === 'Escape') {
                                    setEditingField(null);
                                    setFieldErrors(prev => ({ ...prev, [field.key]: null }));
                                  }
                                }}
                                autoFocus
                                style={{
                                  width: '100%',
                                  border: `1px solid ${fieldErrors[field.key] ? '#ef4444' : '#1a1a1a'}`,
                                  borderRadius: 4,
                                  padding: '4px 6px',
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: '#1a1a1a',
                                  outline: 'none',
                                  fontFamily: 'inherit',
                                }}
                              />
                              {fieldErrors[field.key] && (
                                <div style={{
                                  fontSize: 10,
                                  color: '#ef4444',
                                  marginTop: 2,
                                }}>
                                  {fieldErrors[field.key]}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: '#1a1a1a',
                            }}>
                              {fieldValues[field.key]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input bar */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #e5e7eb',
            background: 'white',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: 20,
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label="Attach file"
              >
                📎
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder="Type your campaign goal..."
                style={{
                  flex: 1,
                  border: '1px solid #e5e7eb',
                  borderRadius: 24,
                  padding: '10px 16px',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#1a1a1a',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Send message"
              >
                ➤
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
        }}>
          {stage === 'initial' && (
            <>
              {/* Empty state header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e5e7eb',
              }}>
                <div style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#1a1a1a',
                  marginBottom: 4,
                }}>
                  Your Campaign
                </div>
                <div style={{
                  fontSize: 13,
                  color: '#6b7280',
                }}>
                  Fill in the details below
                </div>
              </div>

              {/* Empty fields */}
              <div style={{
                flex: 1,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}>
                {[
                  'Campaign Goal',
                  'Budget',
                  'Duration',
                  'Location',
                  'Category',
                  'Platform',
                ].map(label => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: 10,
                      borderBottom: '1px dashed #e5e7eb',
                    }}
                  >
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: '#9ca3af',
                      letterSpacing: '0.5px',
                    }}>
                      {label}
                    </span>
                    <span style={{
                      fontSize: 13,
                      color: '#d1d5db',
                    }}>
                      ─────
                    </span>
                  </div>
                ))}

                {/* Tip section */}
                <div style={{
                  marginTop: 'auto',
                  background: '#fef9f0',
                  border: '1px solid #fed7aa',
                  borderRadius: 10,
                  padding: 14,
                }}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#1a1a1a',
                    marginBottom: 6,
                  }}>
                    💡 Tip
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: '#6b7280',
                    lineHeight: 1.5,
                  }}>
                    Try: "I have ₹1,50,000. I am launching a café in Chennai and want more local customers through Tamil-speaking food creators on Instagram."
                  </div>
                </div>
              </div>
            </>
          )}

          {(stage === 'thinking' || stage === 'results') && (
            <>
              {/* Strategy header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e5e7eb',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}>
                  <div style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: '#1a1a1a',
                  }}>
                    Your Campaign Strategy
                  </div>
                  <div style={{
                    background: '#ecfdf5',
                    color: '#059669',
                    border: '1px solid #a7f3d0',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                  }}>
                    ✨ AI Generated
                  </div>
                </div>

                {/* Tabs */}
                <div style={{
                  display: 'flex',
                  gap: 4,
                  overflowX: 'auto',
                }}>
                  {[
                    { key: 'strategy', label: 'Strategy Overview' },
                    { key: 'creators', label: 'Creators (8)' },
                    { key: 'content', label: 'Content Plan' },
                    { key: 'budget', label: 'Budget' },
                    { key: 'timeline', label: 'Timeline' },
                  ].map(tab => {
                    const active = rightTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setRightTab(tab.key as RightTab)}
                        style={{
                          padding: '8px 12px',
                          background: 'none',
                          border: 'none',
                          borderBottom: active ? '2px solid #1a1a1a' : '2px solid transparent',
                          fontSize: 12,
                          fontWeight: active ? 700 : 500,
                          color: active ? '#1a1a1a' : '#6b7280',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          whiteSpace: 'nowrap',
                          transition: 'color 0.15s',
                        }}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Strategy content */}
              {rightTab === 'strategy' && (
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '20px 24px',
                }}>
                  {/* Badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: '#fef3c7',
                    color: '#92400e',
                    borderRadius: 20,
                    padding: '5px 12px',
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: 10,
                  }}>
                    ✦ RECOMMENDED STRATEGY
                  </div>

                  {/* Strategy image placeholder */}
                  <div style={{
                    height: 140,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 12,
                  }}>
                    📸 Hyperlocal Creator Campaign
                  </div>

                  {/* Strategy name */}
                  <div style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: '#1a1a1a',
                    marginBottom: 8,
                  }}>
                    Hyperlocal Creator Campaign
                  </div>

                  {/* Description */}
                  <div style={{
                    fontSize: 13,
                    color: '#6b7280',
                    lineHeight: 1.5,
                    marginBottom: 16,
                  }}>
                    This strategy focuses on partnering with 8 nano and micro Tamil-speaking food creators in Chennai to drive authentic local engagement and maximize store footfall within your budget.
                  </div>

                  {/* Metrics row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 10,
                    marginBottom: 20,
                  }}>
                    {[
                      { label: 'Creators', value: '8' },
                      { label: 'Estimated Reach', value: '1.2M+' },
                      { label: 'Total Budget', value: '₹1,50,000' },
                    ].map(metric => (
                      <div
                        key={metric.label}
                        style={{
                          background: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          borderRadius: 10,
                          padding: '12px 14px',
                        }}
                      >
                        <div style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: '#9ca3af',
                          letterSpacing: '0.5px',
                          marginBottom: 6,
                        }}>
                          {metric.label}
                        </div>
                        <div style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: '#1a1a1a',
                        }}>
                          {metric.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Key strategy highlights */}
                  <div style={{
                    marginBottom: 20,
                  }}>
                    <div style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: '#374151',
                      letterSpacing: '0.5px',
                      paddingBottom: 8,
                      borderBottom: '1px solid #e5e7eb',
                      marginBottom: 12,
                    }}>
                      KEY STRATEGY HIGHLIGHTS
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}>
                      {[
                        'Tamil language content for authentic local connection',
                        'Food & lifestyle creators with strong community engagement',
                        'Mix of nano (6) and micro (2) creators for balanced reach',
                        'Instagram-focused campaign with Reels and Stories',
                        'Estimated 2,400+ store visits within 15-day campaign',
                      ].map((text, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 10,
                          }}
                        >
                          <span style={{
                            color: '#10b981',
                            fontSize: 16,
                            flexShrink: 0,
                          }}>
                            ✓
                          </span>
                          <span style={{
                            fontSize: 13,
                            color: '#374151',
                            lineHeight: 1.5,
                          }}>
                            {text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{
                    display: 'flex',
                    gap: 10,
                  }}>
                    <button style={{
                      flex: 1,
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: 8,
                      padding: '11px 16px',
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#374151',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}>
                      Regenerate strategy
                    </button>
                    <button
                      onClick={() => navigate('/business/campaigns/creators')}
                      style={{
                        flex: 1,
                        background: '#1a1a1a',
                        border: 'none',
                        borderRadius: 8,
                        padding: '11px 20px',
                        fontSize: 14,
                        fontWeight: 700,
                        color: 'white',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      Continue to creators →
                    </button>
                  </div>
                </div>
              )}

              {/* Placeholder for other tabs */}
              {rightTab !== 'strategy' && (
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  color: '#9ca3af',
                }}>
                  {rightTab.charAt(0).toUpperCase() + rightTab.slice(1)} content coming soon...
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </BusinessLayout>
  );
}
