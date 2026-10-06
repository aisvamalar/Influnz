/**
 * CreateCampaignPage - AI Campaign Assistant
 * Exact pixel-perfect recreation from reference images
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';

type ConversationStage = 'initial' | 'results';
type TabKey = 'strategy' | 'creators' | 'content' | 'budget' | 'timeline';

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
  const [activeTab, setActiveTab] = useState<TabKey>('strategy');

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
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                  ✨ Your Campaign Strategy
                </h3>
                <span
                  style={{
                    background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: 16,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  AI Generated
                </span>
              </div>
              <div style={{ display: 'flex', gap: 4, padding: '12px 24px', borderBottom: '1px solid #e5e7eb', overflowX: 'auto' }}>
                {[
                  { key: 'strategy', label: 'Strategy Overview' },
                  { key: 'creators', label: 'Creators', badge: '8' },
                  { key: 'content', label: 'Content Plan' },
                  { key: 'budget', label: 'Budget' },
                  { key: 'timeline', label: 'Timeline' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as TabKey)}
                    style={{
                      padding: '8px 14px',
                      background: activeTab === tab.key ? '#F9FAFB' : 'transparent',
                      border: 'none',
                      borderBottom: activeTab === tab.key ? '2px solid #1a1a1a' : '2px solid transparent',
                      color: activeTab === tab.key ? '#1a1a1a' : '#6b7280',
                      fontSize: 13,
                      fontWeight: activeTab === tab.key ? 600 : 400,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {tab.label}
                    {tab.badge && (
                      <span
                        style={{
                          background: '#1a1a1a',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: 10,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#9ca3af', letterSpacing: '0.5px', marginBottom: 12 }}>
                  RECOMMENDED STRATEGY
                </div>
                <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
                  <div
                    style={{
                      width: '100%',
                      height: 140,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 48,
                    }}
                  >
                    ☕
                  </div>
                  <div style={{ padding: '16px 18px' }}>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px 0' }}>
                      Hyperlocal Creator Campaign
                    </h4>
                    <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5, margin: 0 }}>
                      Partner with Tamil-speaking food creators to create authentic content.
                    </p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                  {[
                    { icon: '👥', label: 'Creators', value: '8' },
                    { icon: '📊', label: 'Estimated Reach', value: '1.2M+' },
                    { icon: '💰', label: 'Total Budget', value: '₹1,50,000' },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      style={{
                        background: '#F9FAFB',
                        border: '1px solid #e5e7eb',
                        borderRadius: 10,
                        padding: '14px 12px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 24, marginBottom: 6 }}>{metric.icon}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 2 }}>
                        {metric.value}
                      </div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>{metric.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#F9FAFB', border: '1px solid #e5e7eb', borderRadius: 12, padding: '18px 20px', marginBottom: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 14 }}>
                    💡 Key Strategy Highlights
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      'Focus on micro and nano creators from Chennai (15 km radius)',
                      'Authentic in-cafe experiences, food reviews and local eats',
                      'Content in Tamil / Tanglish to connect with local audience',
                      'Mix of reels, stories and carousel posts for higher reach',
                      'Special focus on weekend footfall and lunch buzz',
                    ].map((highlight) => (
                      <div key={highlight} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{ color: '#10B981', fontSize: 16, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    style={{
                      flex: 1,
                      padding: '12px 20px',
                      background: 'white',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#374151',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    ↻ Regenerate strategy
                  </button>
                  <button
                    onClick={() => navigate('/business/creators')}
                    style={{
                      flex: 1,
                      padding: '12px 20px',
                      background: '#1a1a1a',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'white',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Continue to creators →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </BusinessLayout>
  );
}