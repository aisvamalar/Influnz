/**
 * CreateCampaignPage - AI Campaign Assistant
 * Exact pixel-perfect recreation from reference images
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';

type ConversationStage = 'initial' | 'results';

const EXTRACTED: [string, string][] = [
  ['Campaign name', 'Chennai Caf? Launch'],
  ['Goal', 'Drive local store visits'],
  ['Target audience', 'Local food lovers (18?34)'],
  ['Budget', '?1,50,000'],
  ['Platform', 'Instagram'],
  ['Location', 'Chennai (15 km)'],
  ['Timeline', '15 days'],
];

const SUGGESTION_CHIPS = [
  'Launch a cafe in Chennai',
  'Promote a new product',
  'Event coverage',
  'Increase brand awareness',
];

export default function CreateCampaignPage() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<'ai' | 'manual'>('ai');
  const [stage, setStage] = useState<ConversationStage>('initial');
  const [inputValue, setInputValue] = useState('');
  const [userMessage, setUserMessage] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setUserMessage(inputValue);
    setInputValue('');
    setStage('results');
  };

  const handleChipClick = (text: string) => {
    setInputValue(text);
  };

  return (
    <BusinessLayout breadcrumb="New Campaign">
      <div style={{ padding: '0 0 24px 0' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', margin: 0, marginBottom: 8 }}>
          Create Campaign
        </h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
          Let the AI help you create a complete campaign or set it up manually.
        </p>
      </div>

      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {(['ai', 'manual'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: activeMode === mode ? '#FFF5F0' : 'white',
              border: activeMode === mode ? '2px solid #FF6B35' : '1px solid #e5e7eb',
              borderRadius: 8,
              color: activeMode === mode ? '#FF6B35' : '#6b7280',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <span>{mode === 'ai' ? '✨' : '⚙️'}</span>
            {mode === 'ai' ? 'AI Assistant' : 'Manual Setup'}
          </button>
        ))}
      </div>

      {/* Two-Panel Layout */}
      <div style={{ display: 'flex', gap: 24, minHeight: 600, height: 'calc(100vh - 280px)' }}>
        {/* LEFT PANEL - Chat */}
        <div style={{ flex: '0 0 58%', display: 'flex', flexDirection: 'column', background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {stage === 'initial' ? (
              <>
                {/* Bot Greeting */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FFB5A7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                    🤖
                  </div>
                  <div style={{ background: '#F5F5F5', borderRadius: '12px 12px 12px 4px', padding: '16px 20px', maxWidth: '85%' }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>
                      Hi! I'm your campaign assistant 👋
                    </div>
                    <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.5 }}>
                      Tell me what you want to achieve, and I'll help you create the best campaign.
                    </div>
                  </div>
                </div>

                {/* Suggestion Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, paddingLeft: 60 }}>
                  {SUGGESTION_CHIPS.map(chip => (
                    <button
                      key={chip}
                      onClick={() => handleChipClick(chip)}
                      style={{
                        background: 'white',
                        border: '1.5px solid #e5e7eb',
                        borderRadius: 24,
                        padding: '10px 18px',
                        fontSize: 13,
                        color: '#374151',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F9FAFB';
                        e.currentTarget.style.borderColor = '#9ca3af';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* User Message */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ background: '#F5F0E8', borderRadius: '12px 12px 4px 12px', padding: '14px 18px', maxWidth: '75%' }}>
                    <div style={{ fontSize: 14, color: '#1a1a1a', lineHeight: 1.6, marginBottom: 6 }}>
                      {userMessage}
                    </div>
                    <div style={{ fontSize: 12, color: '#9ca3af', textAlign: 'right' }}>
                      10:42 AM
                    </div>
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FF6B35', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, flexShrink: 0 }}>
                    D
                  </div>
                </div>

                {/* Bot Response */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FFB5A7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                    🤖
                  </div>
                  <div style={{ background: '#F9FAFB', borderRadius: '12px 12px 12px 4px', padding: '20px 24px', flex: 1, maxWidth: '95%' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>
                      Here's what I understood from your brief 👍
                    </div>
                    <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20, lineHeight: 1.5 }}>
                      I've extracted the key details. Please review and edit if needed before I generate the campaign strategy.
                    </div>

                    {/* Campaign Goal Card */}
                    <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 18px', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#9ca3af', letterSpacing: '0.5px' }}>
                          🎯 CAMPAIGN GOAL
                        </span>
                        <button style={{ background: 'none', border: 'none', color: '#FF6B35', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                          ✏️ Edit all
                        </button>
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>
                        Drive local store visits
                      </div>
                    </div>

                    {/* Fields Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {[
                        { label: 'BUDGET', value: '₹1,50,000', icon: '💰' },
                        { label: 'LOCATION', value: 'Chennai (15 km)', icon: '📍' },
                        { label: 'DURATION', value: '15 days', icon: '📅' },
                        { label: 'CATEGORY', value: 'Food & Beverage', icon: '🍽️' },
                        { label: 'TARGET AUDIENCE', value: 'Local food lovers (18–34)', icon: '👥' },
                        { label: 'LANGUAGE', value: 'Tamil / Tanglish', icon: '🗣️' },
                        { label: 'PLATFORM', value: 'Instagram', icon: '📱', span: true },
                      ].map((field, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: 8,
                            padding: '12px 14px',
                            gridColumn: field.span ? '1 / -1' : 'auto',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#9ca3af', letterSpacing: '0.5px' }}>
                              {field.icon} {field.label}
                            </span>
                            <button style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 14, padding: 0 }}>
                              ✏️
                            </button>
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                            {field.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Input Bar */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', background: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 22, padding: 4, display: 'flex', alignItems: 'center' }}>
                📎
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={
                  stage === 'initial'
                    ? 'Describe your campaign goal, budget, audience...'
                    : 'Modify anything...'
                }
                style={{
                  flex: 1,
                  border: '1px solid #e5e7eb',
                  borderRadius: 24,
                  padding: '12px 20px',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit',
                  background: '#F9FAFB',
                }}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: inputValue.trim() ? '#1a1a1a' : '#e5e7eb',
                  border: 'none',
                  color: 'white',
                  cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                  fontSize: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          {stage === 'initial' ? (
            <>
              <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px 0' }}>
                  📋 Your Campaign
                </h3>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                  The details will be filled as we chat
                </p>
              </div>
              <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {['Campaign name', 'Goal', 'Target audience', 'Budget', 'Platform', 'Location', 'Timeline'].map(item => (
                  <div
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: 12,
                      borderBottom: '1px dashed #e5e7eb',
                    }}
                  >
                    <span style={{ fontSize: 14, color: '#6b7280' }}>{item}</span>
                    <span style={{ fontSize: 14, color: '#d1d5db', fontWeight: 500 }}>—</span>
                  </div>
                ))}
              </div>
              <div style={{ margin: '0 24px 24px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#92400E', marginBottom: 6 }}>
                  💡 Tip
                </div>
                <div style={{ fontSize: 13, color: '#78350F', lineHeight: 1.5, marginBottom: 8 }}>
                  Be as specific as possible to get better recommendations.
                </div>
                <div style={{ fontSize: 12, color: '#92400E', fontStyle: 'italic', background: '#FEF3C7', padding: '8px 10px', borderRadius: 6 }}>
                  <strong>Example:</strong> I have ₹1,50,000. I am launching a cafe in Chennai...
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px 0' }}>
                  ?? Your Campaign
                </h3>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                  Recognised from your brief
                </p>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {EXTRACTED.map(([label, value]) => (
                  <div
                    key={label}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingBottom: 12, borderBottom: '1px dashed #e5e7eb' }}
                  >
                    <span style={{ fontSize: 14, color: '#6b7280' }}>{label}</span>
                    <span style={{ fontSize: 14, color: '#1a1a1a', fontWeight: 600, textAlign: 'right' }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '0 24px 24px' }}>
                <button
                  type="button"
                  onClick={() => navigate('/business/campaigns/strategy')}
                  style={{
                    width: '100%', height: 48, border: 'none', borderRadius: 10,
                    background: 'linear-gradient(180deg, #ee6247 0%, #dc5039 100%)',
                    color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    boxShadow: '0 8px 20px rgba(224,82,57,0.28)',
                  }}
                >
                  ? Generate strategy ?
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </BusinessLayout>
  );
}