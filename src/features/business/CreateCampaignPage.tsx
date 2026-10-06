/**
 * Screen 04 — AI Campaign Brief (Create Campaign)
 * Two-panel AI chat interface with thinking animation
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';

type ActiveTab = 'ai' | 'manual';
type ThinkingState = 'thinking' | 'done';
type RightTab = 'strategy' | 'creators' | 'content' | 'budget' | 'timeline';

const EXAMPLE_BRIEF = 'I have ₹1,50,000. I am launching a café in Chennai and want more local customers through Tamil-speaking food creators on Instagram.';

const FIELDS = [
  { key: 'budget', label: 'Budget', value: '₹1,50,000' },
  { key: 'location', label: 'Location', value: 'Chennai, 15 km radius' },
  { key: 'duration', label: 'Duration', value: '15 days' },
  { key: 'category', label: 'Category', value: 'Food & Beverage' },
  { key: 'audience', label: 'Target Audience', value: 'Local food lovers, age 18–34' },
  { key: 'language', label: 'Language', value: 'Tamil / Tanglish' },
  { key: 'platform', label: 'Platform', value: 'Instagram' },
];

export default function CreateCampaignPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>('ai');
  const [thinkingState, setThinkingState] = useState<ThinkingState>('thinking');
  const [userInput, setUserInput] = useState('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(
    Object.fromEntries(FIELDS.map(f => [f.key, f.value]))
  );
  const [rightTab, setRightTab] = useState<RightTab>('strategy');

  useEffect(() => {
    const timer = setTimeout(() => {
      setThinkingState('done');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
    if (userInput.trim()) {
      setUserInput('');
      // Handle sending logic
    }
  };

  const handleFieldEdit = (key: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [key]: value }));
    setEditingField(null);
  };

  return (
    <BusinessLayout breadcrumb="New Campaign">
      <style>{`
        @keyframes thinkingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-8px); opacity: 1; }
        }
        .thinking-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #9ca3af;
          animation: thinkingBounce 1.4s infinite ease-in-out both;
        }
        .thinking-dot:nth-child(1) { animation-delay: 0s; }
        .thinking-dot:nth-child(2) { animation-delay: 0.15s; }
        .thinking-dot:nth-child(3) { animation-delay: 0.3s; }
      `}</style>

      <div className="biz-page-head">
        <div>
          <h1 className="biz-page-head__title">Create Campaign</h1>
          <p className="biz-page-head__sub">Tell the AI your goal and budget — or set it up manually.</p>
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['ai', 'manual'] as ActiveTab[]).map(m => (
          <button
            key={m}
            className={`biz-chip${activeTab === m ? ' biz-chip--active' : ''}`}
            style={{ height: 38, fontSize: '0.875rem', fontWeight: 700 }}
            onClick={() => setActiveTab(m)}
          >
            {m === 'ai' ? '✨ AI Assistant' : '⚙️ Manual Setup'}
          </button>
        ))}
      </div>

      {/* Two-panel layout */}
      {activeTab === 'ai' && (
        <div style={{ display: 'flex', gap: 24, height: 'calc(100vh - 280px)', minHeight: 600 }}>
          {/* LEFT PANEL - Chat */}
          <div style={{
            flex: '0 0 55%',
            background: 'white',
            borderRadius: 16,
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Chat Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#1f2937',
                margin: '0 0 4px 0'
              }}>
                AI Campaign Brief
              </h2>
              <p style={{
                fontSize: 14,
                color: '#6b7280',
                margin: 0
              }}>
                Describe your campaign naturally and AI will structure it for you
              </p>
            </div>

            {/* Chat Messages Area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              {/* User Message */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: 4
              }}>
                <div>
                  <div style={{
                    background: '#1f2937',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: 16,
                    borderBottomRightRadius: 4,
                    maxWidth: 400,
                    fontSize: 14,
                    lineHeight: 1.5
                  }}>
                    {EXAMPLE_BRIEF}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: '#9ca3af',
                    textAlign: 'right',
                    marginTop: 4
                  }}>
                    10:42 AM
                  </div>
                </div>
              </div>

              {/* AI Thinking or Response */}
              {thinkingState === 'thinking' ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start'
                }}>
                  <div style={{
                    background: '#f3f4f6',
                    padding: '12px 16px',
                    borderRadius: 16,
                    borderBottomLeftRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <span style={{ fontSize: 16 }}>✨</span>
                    <span style={{ fontSize: 13, color: '#6b7280', marginRight: 8 }}>AI is thinking</span>
                    <div className="thinking-dot"></div>
                    <div className="thinking-dot"></div>
                    <div className="thinking-dot"></div>
                  </div>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start'
                }}>
                  <div style={{
                    background: '#f3f4f6',
                    padding: '16px 18px',
                    borderRadius: 16,
                    borderBottomLeftRadius: 4,
                    maxWidth: 480,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14
                  }}>
                    <p style={{
                      fontSize: 14,
                      color: '#1f2937',
                      fontWeight: 500,
                      margin: 0
                    }}>
                      Here's what I understood from your brief 🤝
                    </p>

                    {/* Campaign Goal Card */}
                    <div style={{
                      background: 'white',
                      padding: '12px 16px',
                      borderRadius: 10,
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 6
                      }}>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: '#9ca3af',
                          letterSpacing: '0.5px'
                        }}>
                          🎯 Campaign Goal
                        </span>
                        <button style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: 14,
                          padding: 0
                        }}>
                          ✏️
                        </button>
                      </div>
                      <p style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: '#1f2937',
                        margin: 0
                      }}>
                        Drive local store visits
                      </p>
                    </div>

                    {/* Fields Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 10
                    }}>
                      {FIELDS.map(field => (
                        <div
                          key={field.key}
                          style={{
                            background: 'white',
                            padding: '10px 12px',
                            borderRadius: 8,
                            border: '1px solid #e5e7eb'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 4
                          }}>
                            <span style={{
                              fontSize: 10,
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              color: '#9ca3af',
                              letterSpacing: '0.5px'
                            }}>
                              {field.label}
                            </span>
                            {editingField !== field.key && (
                              <button
                                onClick={() => setEditingField(field.key)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  fontSize: 12,
                                  padding: 0
                                }}
                              >
                                ✏️
                              </button>
                            )}
                          </div>
                          {editingField === field.key ? (
                            <input
                              type="text"
                              value={fieldValues[field.key]}
                              onChange={e => setFieldValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                              onBlur={() => setEditingField(null)}
                              onKeyDown={e => e.key === 'Enter' && handleFieldEdit(field.key, fieldValues[field.key])}
                              autoFocus
                              style={{
                                width: '100%',
                                border: '1px solid #ef4444',
                                borderRadius: 4,
                                padding: '4px 6px',
                                fontSize: 13,
                                fontWeight: 600,
                                outline: 'none'
                              }}
                            />
                          ) : (
                            <p style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: '#1f2937',
                              margin: 0
                            }}>
                              {fieldValues[field.key]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: 10
            }}>
              <input
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything or refine your brief..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  padding: '10px 18px',
                  background: '#1f2937',
                  border: 'none',
                  borderRadius: 8,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                Send
              </button>
            </div>
          </div>

          {/* RIGHT PANEL - Strategy */}
          <div style={{
            flex: '0 0 45%',
            background: 'white',
            borderRadius: 16,
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Strategy Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12
              }}>
                <h2 style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#1f2937',
                  margin: 0
                }}>
                  Your Campaign Strategy
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#10b981',
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '4px 10px',
                    borderRadius: 12,
                    letterSpacing: '0.5px'
                  }}>
                    ✨ AI Generated
                  </span>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: 18,
                    padding: 4
                  }}>
                    🔄
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div style={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto'
              }}>
                {[
                  { key: 'strategy', label: 'Strategy Overview' },
                  { key: 'creators', label: 'Creators (8)' },
                  { key: 'content', label: 'Content Plan' },
                  { key: 'budget', label: 'Budget' },
                  { key: 'timeline', label: 'Timeline' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setRightTab(tab.key as RightTab)}
                    style={{
                      padding: '8px 14px',
                      background: rightTab === tab.key ? '#f3f4f6' : 'transparent',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: rightTab === tab.key ? 600 : 500,
                      color: rightTab === tab.key ? '#1f2937' : '#6b7280',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Strategy Content */}
            {rightTab === 'strategy' && (
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: 24
              }}>
                {/* Recommended Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '6px 12px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: 16
                }}>
                  ✦ RECOMMENDED STRATEGY
                </div>

                {/* Strategy Name */}
                <h3 style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#1f2937',
                  margin: '0 0 12px 0'
                }}>
                  Hyperlocal Creator Campaign
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: 14,
                  color: '#6b7280',
                  lineHeight: 1.6,
                  marginBottom: 20
                }}>
                  This strategy focuses on partnering with 8 nano and micro Tamil-speaking food creators in Chennai to drive authentic local engagement and maximize store footfall within your budget.
                </p>

                {/* Metrics */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 12,
                  marginBottom: 24
                }}>
                  {[
                    { label: 'Creators', value: '8' },
                    { label: 'Estimated Reach', value: '1.2M+' },
                    { label: 'Total Budget', value: '₹1,50,000' }
                  ].map((metric, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#f9fafb',
                        padding: '14px 16px',
                        borderRadius: 10,
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <p style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: '#9ca3af',
                        letterSpacing: '0.5px',
                        margin: '0 0 6px 0'
                      }}>
                        {metric.label}
                      </p>
                      <p style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: '#1f2937',
                        margin: 0
                      }}>
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Key Strategy Highlights */}
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#1f2937',
                    margin: '0 0 12px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Key Strategy Highlights
                  </h4>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                  }}>
                    {[
                      'Tamil language content for authentic local connection',
                      'Food & lifestyle creators with strong community engagement',
                      'Mix of nano (6) and micro (2) creators for balanced reach',
                      'Instagram-focused campaign with Reels and Stories',
                      'Estimated 2,400+ store visits within 15-day campaign'
                    ].map((highlight, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          gap: 10,
                          alignItems: 'flex-start'
                        }}
                      >
                        <span style={{
                          color: '#10b981',
                          fontSize: 16,
                          flexShrink: 0,
                          marginTop: 2
                        }}>
                          ✓
                        </span>
                        <span style={{
                          fontSize: 13,
                          color: '#374151',
                          lineHeight: 1.5
                        }}>
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: 10,
                  paddingTop: 16,
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <button style={{
                    flex: 1,
                    padding: '12px 20px',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#374151',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}>
                    Regenerate strategy
                  </button>
                  <button
                    onClick={() => navigate('/business/campaigns/creators')}
                    style={{
                      flex: 1,
                      padding: '12px 20px',
                      background: '#1f2937',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'white',
                      cursor: 'pointer',
                      fontFamily: 'inherit'
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
                color: '#9ca3af',
                fontSize: 14
              }}>
                {rightTab.charAt(0).toUpperCase() + rightTab.slice(1)} content coming soon...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Setup (placeholder) */}
      {activeTab === 'manual' && (
        <div style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          padding: 40,
          textAlign: 'center'
        }}>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Manual setup form coming soon...</p>
        </div>
      )}
    </BusinessLayout>
  );
}
