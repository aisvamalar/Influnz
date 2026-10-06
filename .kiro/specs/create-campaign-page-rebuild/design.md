# Design Document: CreateCampaignPage Rebuild

## Overview

The CreateCampaignPage is a sophisticated conversational UI component that serves as an AI-powered campaign creation assistant for business users. The component implements a two-panel layout with a chat interface on the left and a dynamic campaign summary/strategy panel on the right. The design emphasizes visual precision, state management clarity, and component reusability while maintaining exact fidelity to the reference UI images.

**Key Design Principles:**
- **Pixel-perfect UI replication**: Exact adherence to spacing, colors, typography, and layout specifications
- **State-driven rendering**: Clean separation between initial and results conversation stages
- **Component composition**: Modular, reusable sub-components for maintainability
- **TypeScript type safety**: Comprehensive type definitions for all data structures and component props
- **Performance optimization**: Efficient rendering with minimal re-renders through proper state management

## Architecture

### High-Level Component Structure

```
CreateCampaignPage (Container)
├── PageHeader
├── ModeToggle
├── TwoPanelLayout
│   ├── ChatPanel
│   │   ├── MessagesArea
│   │   │   ├── BotMessage (greeting or extraction response)
│   │   │   ├── SuggestionChips (initial state only)
│   │   │   ├── UserMessage (results state only)
│   │   │   └── BotExtractionResponse (results state only)
│   │   │       ├── CampaignGoalCard
│   │   │       └── ParameterFieldsGrid
│   │   └── InputBar
│   │       ├── AttachmentButton
│   │       ├── TextInput
│   │       └── SendButton
│   └── RightPanel
│       ├── InitialStatePanel (stage === 'initial')
│       │   ├── PanelHeader
│       │   ├── EmptyFieldsList
│       │   └── TipBox
│       └── ResultsStatePanel (stage === 'results')
│           ├── StrategyHeader
│           ├── TabNavigation
│           └── StrategyContent
│               ├── StrategyCard
│               ├── MetricsGrid
│               ├── KeyHighlights
│               └── ActionButtons
```

### State Management Strategy

The component uses React's built-in `useState` hook for local state management. The state is minimal and focused:

1. **activeMode**: `'ai' | 'manual'` - Controls which creation mode is selected
2. **stage**: `'initial' | 'results'` - Tracks conversation progression
3. **inputValue**: `string` - Controlled input field state
4. **userMessage**: `string` - Stores the user's submitted campaign brief
5. **activeTab**: `'strategy' | 'creators' | 'content' | 'budget' | 'timeline'` - Right panel tab selection

**State Flow:**
```
Initial Load → activeMode='ai', stage='initial'
User submits message → stage='results', userMessage saved, inputValue cleared
User switches mode → activeMode updated, other state preserved
User switches tab → activeTab updated
```

### Styling Strategy

The component uses **inline styles** for precise control over every visual aspect to match the reference images exactly. This approach provides:

- **Pixel-perfect accuracy**: Direct control over every style property
- **No CSS cascade issues**: Styles are scoped to elements
- **Runtime flexibility**: Easy to make styles conditional based on state
- **Type safety**: TypeScript CSSProperties type checking

**Color Palette** (centralized as constants):
```typescript
const COLORS = {
  background: '#F9F7F5',
  botAvatar: '#FFB5A7',
  userAvatar: '#FF6B35',
  userMessageBg: '#F5F0E8',
  botMessageBg: '#F9FAFB',
  activeModeButtonBg: '#FFF5F0',
  activeModeButtonBorder: '#FF6B35',
  tipBoxBg: '#FFFBEB',
  tipBoxBorder: '#FDE68A',
  aiGeneratedGradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
  strategyImageGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  text: {
    primary: '#1a1a1a',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    disabled: '#d1d5db',
  },
  border: {
    default: '#e5e7eb',
    hover: '#9ca3af',
  },
};
```

## Components and Interfaces

### Core Component: CreateCampaignPage

**Type Definitions:**
```typescript
type ConversationStage = 'initial' | 'results';
type CreationMode = 'ai' | 'manual';
type TabKey = 'strategy' | 'creators' | 'content' | 'budget' | 'timeline';

interface CreateCampaignPageState {
  activeMode: CreationMode;
  stage: ConversationStage;
  inputValue: string;
  userMessage: string;
  activeTab: TabKey;
}
```

**Props:**
```typescript
interface CreateCampaignPageProps {
  // No props - this is a top-level page component
}
```

### Sub-Component: ModeToggle

**Purpose**: Renders the AI Assistant / Manual Setup toggle buttons

**Type Definitions:**
```typescript
interface ModeToggleProps {
  activeMode: CreationMode;
  onModeChange: (mode: CreationMode) => void;
}

interface ModeButton {
  mode: CreationMode;
  icon: string;
  label: string;
}
```

**Rendering Logic:**
```typescript
const MODE_BUTTONS: ModeButton[] = [
  { mode: 'ai', icon: '✨', label: 'AI Assistant' },
  { mode: 'manual', icon: '⚙️', label: 'Manual Setup' },
];
```

### Sub-Component: BotMessage

**Purpose**: Displays bot avatar and message bubble

**Type Definitions:**
```typescript
interface BotMessageProps {
  children: React.ReactNode;
  variant?: 'greeting' | 'extraction';
}
```

**Layout:**
- Avatar: 48px circle, #FFB5A7 background, 🤖 emoji
- Bubble: Max 85% width (greeting) or 95% width (extraction)
- Border radius: 12px-12px-12px-4px (bottom-left smaller for tail effect)
- Gap between avatar and bubble: 12px

### Sub-Component: UserMessage

**Purpose**: Displays user avatar and message bubble with timestamp

**Type Definitions:**
```typescript
interface UserMessageProps {
  message: string;
  timestamp: string;
  userInitial: string;
}
```

**Layout:**
- Right-aligned flex container
- Avatar: 36px circle, #FF6B35 background, white initial
- Bubble: Max 75% width, #F5F0E8 background
- Border radius: 12px-12px-4px-12px (bottom-right smaller)
- Timestamp: 12px gray text, right-aligned within bubble

### Sub-Component: SuggestionChips

**Purpose**: Displays clickable suggestion buttons for common campaign goals

**Type Definitions:**
```typescript
interface SuggestionChipsProps {
  chips: string[];
  onChipClick: (text: string) => void;
}
```

**Styling:**
- Base: White background, #e5e7eb border (1.5px)
- Hover: #F9FAFB background, #9ca3af border
- Border radius: 24px (fully rounded pill shape)
- Padding: 10px vertical, 18px horizontal
- Left padding: 60px (to align with message content)

### Sub-Component: CampaignGoalCard

**Purpose**: Displays the main campaign goal with edit functionality

**Type Definitions:**
```typescript
interface CampaignGoalCardProps {
  goal: string;
  onEdit: () => void;
}
```

**Structure:**
- Header row: "🎯 CAMPAIGN GOAL" label + "✏️ Edit all" button
- Goal text: 18px bold, below header
- Styling: White background, #e5e7eb border, 10px radius

### Sub-Component: ParameterFieldsGrid

**Purpose**: Displays extracted campaign parameters in a 2-column grid

**Type Definitions:**
```typescript
interface CampaignParameter {
  key: string;
  label: string;
  value: string;
  icon: string;
}

interface ParameterFieldsGridProps {
  parameters: CampaignParameter[];
  onEditParameter: (key: string) => void;
}
```

**Layout:**
- CSS Grid: 2 columns, 10px gap
- Platform field spans full width (grid-column: 1 / -1)
- Each card: White background, #e5e7eb border, 8px radius

**Field Card Structure:**
```
┌─────────────────────────────┐
│ 💰 BUDGET         ✏️       │
│ ₹1,50,000                   │
└─────────────────────────────┘
```

### Sub-Component: InputBar

**Purpose**: Text input area with attachment and send buttons

**Type Definitions:**
```typescript
interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder: string;
  stage: ConversationStage;
}
```

**Layout:**
- Flex row: Attachment button + Input field + Send button
- Input field: Flex 1, rounded (24px), light gray background
- Send button: 44px circle, black when enabled, gray when disabled

**Placeholder Logic:**
```typescript
const getPlaceholder = (stage: ConversationStage): string => {
  return stage === 'initial'
    ? "Describe your campaign goal, budget, audience, or any specific requirements..."
    : "Modify anything... e.g. 'Change duration to 20 days' or 'Include event coverage'";
};
```

### Sub-Component: InitialStatePanel

**Purpose**: Right panel content before user submits brief

**Type Definitions:**
```typescript
interface EmptyField {
  icon: string;
  label: string;
}

interface InitialStatePanelProps {
  // No props - renders static content
}
```

**Structure:**
- Header: "📋 Your Campaign" + subtitle
- Empty fields list with dashed borders
- TipBox component at bottom

### Sub-Component: TipBox

**Purpose**: Helpful tip with example for better input

**Type Definitions:**
```typescript
interface TipBoxProps {
  tipText: string;
  exampleText: string;
}
```

**Styling:**
- Background: #FFFBEB (pale yellow)
- Border: #FDE68A (amber)
- Example section: #FEF3C7 background, slightly darker
- Text colors: #92400E (heading), #78350F (body)

### Sub-Component: ResultsStatePanel

**Purpose**: Right panel content after strategy generation

**Type Definitions:**
```typescript
interface ResultsStatePanelProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

interface Tab {
  key: TabKey;
  label: string;
  badge?: string;
}
```

**Structure:**
- StrategyHeader: Title + AI Generated badge
- TabNavigation: Horizontal tabs with active state
- StrategyContent: Tab-specific content (currently only Strategy Overview implemented)

### Sub-Component: StrategyCard

**Purpose**: Visual card showing the recommended strategy

**Type Definitions:**
```typescript
interface StrategyCardProps {
  title: string;
  description: string;
  imageGradient: string;
  icon: string;
}
```

**Structure:**
```
┌─────────────────────────────┐
│   ☕ (gradient background)   │
│      140px height            │
├─────────────────────────────┤
│ Hyperlocal Creator Campaign │
│ Partner with Tamil-speaking │
│ food creators to create...  │
└─────────────────────────────┘
```

### Sub-Component: MetricsGrid

**Purpose**: Displays key campaign metrics in a 3-column grid

**Type Definitions:**
```typescript
interface Metric {
  icon: string;
  label: string;
  value: string;
}

interface MetricsGridProps {
  metrics: Metric[];
}
```

**Metrics:**
1. Creators: 👥 icon, "8"
2. Estimated Reach: 📊 icon, "1.2M+"
3. Total Budget: 💰 icon, "₹1,50,000"

### Sub-Component: KeyHighlights

**Purpose**: Lists strategic highlights with checkmarks

**Type Definitions:**
```typescript
interface KeyHighlightsProps {
  highlights: string[];
}
```

**Rendering:**
- Each item: ✓ checkmark (green) + text
- Vertical spacing: 10px between items
- Container: #F9FAFB background, border, rounded

### Sub-Component: ActionButtons

**Purpose**: Regenerate and Continue buttons

**Type Definitions:**
```typescript
interface ActionButtonsProps {
  onRegenerate: () => void;
  onContinue: () => void;
}
```

**Buttons:**
1. Regenerate: "↻ Regenerate strategy" - outlined style
2. Continue: "Continue to creators →" - filled black style

## Data Models

### Campaign Brief Data

```typescript
interface CampaignBrief {
  rawInput: string;
  timestamp: Date;
}
```

**Purpose**: Stores the user's original message
**Usage**: Displayed in UserMessage component, sent to AI for extraction

### Extracted Campaign Parameters

```typescript
interface ExtractedParameters {
  goal: string;
  budget: string;
  location: string;
  duration: string;
  category: string;
  targetAudience: string;
  language: string;
  platform: string;
}
```

**Purpose**: Structured data extracted from user's brief
**Source**: In the current implementation, this is hardcoded. In production, this would come from an AI API response.

**Validation Rules:**
- All fields are required (no optional fields)
- Budget must include currency symbol (₹)
- Duration must include time unit (days, weeks)
- Target audience should include age range when applicable

### Generated Strategy

```typescript
interface GeneratedStrategy {
  title: string;
  description: string;
  icon: string;
  metrics: {
    creators: number;
    estimatedReach: string;
    totalBudget: string;
  };
  highlights: string[];
}
```

**Purpose**: AI-generated campaign strategy data
**Source**: In production, this would come from an AI strategy generation API

**Example:**
```typescript
const exampleStrategy: GeneratedStrategy = {
  title: "Hyperlocal Creator Campaign",
  description: "Partner with Tamil-speaking food creators to create authentic...",
  icon: "☕",
  metrics: {
    creators: 8,
    estimatedReach: "1.2M+",
    totalBudget: "₹1,50,000",
  },
  highlights: [
    "Focus on micro and nano creators from Chennai (15 km radius)",
    "Authentic in-café experiences, food reviews and local eats",
    "Content in Tamil / Tanglish to connect with local audience",
    "Mix of reels, stories and carousel posts for higher reach",
    "Special focus on weekend footfall and lunch buzz",
  ],
};
```

### Conversation Message

```typescript
type MessageRole = 'bot' | 'user';

interface ConversationMessage {
  id: string;
  role: MessageRole;
  content: string | React.ReactNode;
  timestamp: Date;
}
```

**Purpose**: Generic message type for potential future chat history feature
**Note**: Current implementation doesn't use a messages array, but this would be useful for showing full conversation history

## Error Handling

### Input Validation

**Empty Message Prevention:**
- Send button is disabled when `inputValue.trim()` is empty
- Visual feedback: Gray background (#e5e7eb) when disabled
- Cursor: 'not-allowed' when disabled

**Character Limits:**
- Input field should have a reasonable maximum length (e.g., 500 characters)
- Display character count when approaching limit
- Show warning message if user tries to exceed limit

### Error States to Handle

1. **API Failure (Future):**
   ```typescript
   interface APIError {
     code: string;
     message: string;
     retryable: boolean;
   }
   ```
   - Display error message in bot bubble
   - Offer retry button for retryable errors
   - Log to error tracking service

2. **Network Timeout:**
   - Show loading spinner after 2 seconds
   - Display timeout message after 30 seconds
   - Provide manual retry option

3. **Invalid Extraction:**
   - If AI fails to extract parameters, show error message
   - Allow user to try rephrasing their brief
   - Offer fallback to manual mode

### Error Message Component

```typescript
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}
```

**Styling:**
- Red/pink background for visibility
- Icon: ⚠️ or ❌
- Clear action buttons if applicable

## Testing Strategy

### Unit Testing Approach

This feature is a UI-heavy component focused on rendering specific visual layouts. Property-based testing is **NOT applicable** here because:
- The component is primarily about UI rendering and layout, not pure logic
- There are no universal properties that hold across varied inputs
- Testing requires verifying specific visual states against design specifications

**Instead, use:**
1. **Example-based unit tests** for specific behaviors
2. **Snapshot tests** for visual regression
3. **Integration tests** for user interaction flows

### Unit Test Coverage

**Test Suite 1: Mode Toggle**
```typescript
describe('ModeToggle', () => {
  it('should render AI Assistant and Manual Setup buttons', () => {
    // Test that both buttons are rendered with correct labels and icons
  });

  it('should highlight active mode button', () => {
    // Test that active button has correct styling (#FFF5F0 bg, #FF6B35 border)
  });

  it('should call onModeChange when button is clicked', () => {
    // Test event handler is called with correct mode
  });
});
```

**Test Suite 2: Conversation Stage Transitions**
```typescript
describe('CreateCampaignPage - Stage Transitions', () => {
  it('should start in initial stage', () => {
    // Verify initial state rendering: greeting, suggestion chips, empty fields
  });

  it('should transition to results stage when user sends message', () => {
    // Simulate typing and sending message
    // Verify results state rendering: user message, extraction response, strategy panel
  });

  it('should clear input field after sending', () => {
    // Verify inputValue is reset to empty string
  });
});
```

**Test Suite 3: Suggestion Chips**
```typescript
describe('SuggestionChips', () => {
  it('should render all suggestion options', () => {
    // Verify all 4 chips are rendered with correct text
  });

  it('should populate input field when chip is clicked', () => {
    // Click chip, verify inputValue updates
  });

  it('should show hover styles', () => {
    // Test hover state styling changes
  });
});
```

**Test Suite 4: Input Bar**
```typescript
describe('InputBar', () => {
  it('should display correct placeholder based on stage', () => {
    // Test initial stage placeholder
    // Test results stage placeholder
  });

  it('should disable send button when input is empty', () => {
    // Verify button disabled state and styling
  });

  it('should enable send button when input has text', () => {
    // Verify button enabled state and styling
  });

  it('should call onSend when Enter key is pressed', () => {
    // Test keyboard interaction
  });

  it('should call onSend when send button is clicked', () => {
    // Test click interaction
  });
});
```

**Test Suite 5: Right Panel Tabs**
```typescript
describe('ResultsStatePanel - Tabs', () => {
  it('should render all tab options', () => {
    // Verify 5 tabs are rendered with correct labels
  });

  it('should show badge on Creators tab', () => {
    // Verify "8" badge appears on Creators tab
  });

  it('should highlight active tab', () => {
    // Test active tab styling: #F9FAFB bg, #1a1a1a border
  });

  it('should call onTabChange when tab is clicked', () => {
    // Test tab switching functionality
  });
});
```

### Integration Test Scenarios

**Scenario 1: Complete Campaign Creation Flow**
```typescript
describe('Campaign Creation Flow', () => {
  it('should guide user from initial greeting to strategy view', async () => {
    // 1. Render component in initial state
    // 2. Verify greeting and suggestion chips appear
    // 3. Click a suggestion chip
    // 4. Verify input field is populated
    // 5. Click send button
    // 6. Verify transition to results state
    // 7. Verify extracted parameters are displayed
    // 8. Verify strategy content is shown
  });
});
```

**Scenario 2: Mode Switching**
```typescript
describe('Mode Switching', () => {
  it('should allow switching between AI and Manual modes', () => {
    // 1. Start in AI mode
    // 2. Click Manual Setup button
    // 3. Verify mode changes (visual feedback)
    // 4. Click AI Assistant button
    // 5. Verify mode returns to AI
  });
});
```

**Scenario 3: Tab Navigation in Results State**
```typescript
describe('Strategy Tab Navigation', () => {
  it('should allow navigating between strategy tabs', async () => {
    // 1. Complete flow to results state
    // 2. Verify Strategy Overview tab is active by default
    // 3. Click Creators tab
    // 4. Verify Creators tab becomes active
    // 5. Click Content Plan tab
    // 6. Verify Content Plan tab becomes active
  });
});
```

### Snapshot Testing

**Purpose**: Catch unintended visual changes

```typescript
describe('CreateCampaignPage Snapshots', () => {
  it('should match snapshot in initial state', () => {
    const { container } = render(<CreateCampaignPage />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in results state', () => {
    // Simulate progression to results state
    const { container } = render(<CreateCampaignPage />);
    // ... trigger state change
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot for each tab', () => {
    // Test each tab content matches snapshot
  });
});
```

### Accessibility Testing

**Test Suite: Accessibility**
```typescript
describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<CreateCampaignPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should support keyboard navigation', () => {
    // Test Tab key navigation through interactive elements
    // Test Enter key to submit message
    // Test Space key to click buttons
  });

  it('should have proper ARIA labels', () => {
    // Verify buttons have aria-labels
    // Verify input has aria-label or associated label
    // Verify disabled state is announced
  });
});
```

### Visual Regression Testing

**Tool**: Consider using Chromatic, Percy, or similar visual testing tools

**Test Cases:**
1. Initial state appearance
2. Results state appearance
3. Hover states on interactive elements
4. Active/inactive button states
5. Tab switching animations
6. Responsive layout at different viewport widths

### Performance Testing

**Metrics to Monitor:**
1. Initial render time (should be < 100ms)
2. State update re-render time (should be < 16ms for 60fps)
3. Input field responsiveness (no lag while typing)
4. Smooth hover transitions (0.2s CSS transitions)

**Testing Approach:**
- Use React DevTools Profiler to measure render times
- Use Chrome DevTools Performance tab to identify bottlenecks
- Test on low-end devices to ensure acceptable performance

## Responsive Behavior

### Breakpoints

```typescript
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
};
```

### Layout Changes by Viewport Width

**Desktop (>= 1024px):**
- Two-panel horizontal layout (60% chat / 40% summary)
- 24px gap between panels
- Full feature set visible

**Tablet (768px - 1023px):**
- Vertical stacking: Chat panel above, summary panel below
- Both panels take full width
- Chat panel maintains minimum height of 600px
- Summary panel height adjusts to content

**Mobile (< 768px):**
- Vertical stacking with optimizations:
  - Reduced padding (16px instead of 32px)
  - Smaller font sizes where appropriate
  - Simplified metrics grid (2 columns instead of 3)
  - Collapsible sections for better space usage

### Responsive Implementation

**CSS Media Queries** (via inline styles):
```typescript
const containerStyle = {
  display: 'flex',
  flexDirection: window.innerWidth < 1024 ? 'column' : 'row',
  gap: 24,
  // ... other styles
};
```

**Alternative Approach - useMediaQuery Hook:**
```typescript
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

// Usage in component
const isMobile = useMediaQuery('(max-width: 768px)');
const isTablet = useMediaQuery('(max-width: 1024px) and (min-width: 769px)');
```

### Touch Optimizations for Mobile

1. **Button Touch Targets**: Minimum 44x44px for touch
2. **Input Field Height**: Increase to 48px on mobile
3. **Suggestion Chips**: Larger padding for easier tapping
4. **Hover States**: Disable hover effects on touch devices, use active states instead

## Animation and Transitions

### Transition Specifications

**Button Hover:**
```css
transition: all 0.2s ease-in-out;
```
- Properties: background-color, border-color, transform
- Duration: 0.2 seconds
- Easing: ease-in-out

**Message Fade-In:**
```css
animation: fadeIn 0.3s ease-in;

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Tab Switch:**
```css
transition: border-color 0.2s, background-color 0.2s;
```

**Send Button State Change:**
```css
transition: background-color 0.2s ease-in-out;
```

### React Animation Implementation

**Using CSS Classes:**
```typescript
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  setIsVisible(true);
}, []);

return (
  <div className={isVisible ? 'fade-in' : 'fade-out'}>
    {/* content */}
  </div>
);
```

**Using React Transition Group (if needed for complex animations):**
```typescript
import { CSSTransition, TransitionGroup } from 'react-transition-group';

<TransitionGroup>
  {messages.map(message => (
    <CSSTransition
      key={message.id}
      timeout={300}
      classNames="message"
    >
      <Message {...message} />
    </CSSTransition>
  ))}
</TransitionGroup>
```

**Framer Motion** (available in project dependencies):
```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* content */}
</motion.div>
```

## Implementation Notes

### Inline Styles vs. CSS Classes

**Current Approach**: Inline styles for pixel-perfect control

**Pros:**
- Direct mapping to design specifications
- No class name conflicts
- TypeScript type safety
- Component-scoped styles

**Cons:**
- Verbose code
- No CSS optimizations (deduplication, compression)
- Harder to override for theming
- Can't use pseudo-classes like :hover in all cases

**Recommendation**: Continue with inline styles for this component to maintain exact fidelity to reference images. Consider extracting common style objects as constants to reduce duplication.

### Constants Organization

**Color Constants:**
```typescript
const COLORS = {
  // Define all colors used in the component
};
```

**Spacing Constants:**
```typescript
const SPACING = {
  panelGap: 24,
  messagePadding: 32,
  messageGap: 20,
  avatarMessageGap: 12,
  chipGap: 10,
  // ... etc
};
```

**Typography Constants:**
```typescript
const TYPOGRAPHY = {
  heading: { fontSize: 18, fontWeight: 700 },
  subheading: { fontSize: 14, fontWeight: 600 },
  body: { fontSize: 14, fontWeight: 400 },
  caption: { fontSize: 12, fontWeight: 400 },
  // ... etc
};
```

### Component Extraction Strategy

**When to Extract a Sub-Component:**
1. **Reused more than once**: SuggestionChips, FieldCard
2. **Complex self-contained logic**: InputBar, TabNavigation
3. **Testability**: Easier to test isolated components
4. **Readability**: Main component becomes cleaner

**When to Keep Inline:**
1. **Used only once**: Specific layout containers
2. **Tightly coupled to parent state**: Direct state access needed
3. **Very simple markup**: Single div with styles

### State Management Alternatives (Future Considerations)

**Current**: Local `useState` - Appropriate for this component

**If Complexity Grows:**
1. **useReducer**: Better for complex state logic with multiple sub-values
2. **Context API**: If state needs to be shared with deeply nested components
3. **Zustand/Jotai**: Lightweight state management if needed across multiple pages
4. **React Query**: For managing API data (when AI integration is added)

### API Integration Points (Future)

**When AI Backend is Ready:**

1. **Extract Parameters API:**
```typescript
interface ExtractParametersRequest {
  brief: string;
}

interface ExtractParametersResponse {
  parameters: ExtractedParameters;
  confidence: number;
}

const extractParameters = async (brief: string): Promise<ExtractParametersResponse> => {
  // API call implementation
};
```

2. **Generate Strategy API:**
```typescript
interface GenerateStrategyRequest {
  parameters: ExtractedParameters;
}

interface GenerateStrategyResponse {
  strategy: GeneratedStrategy;
}

const generateStrategy = async (parameters: ExtractedParameters): Promise<GenerateStrategyResponse> => {
  // API call implementation
};
```

3. **Loading States:**
```typescript
interface LoadingState {
  extracting: boolean;
  generating: boolean;
}

// Show loading spinners in message bubbles during API calls
```

### Accessibility Considerations

**Keyboard Navigation:**
- All interactive elements must be focusable
- Logical tab order: Mode buttons → Suggestion chips → Input field → Send button
- Enter key submits message from input field
- Tab key navigates through tabs in strategy panel

**Screen Reader Support:**
- Add `aria-label` to all icon-only buttons
- Use semantic HTML where possible (button, input, nav)
- Announce state changes (e.g., "Strategy generated")
- Provide text alternatives for emoji icons

**ARIA Attributes:**
```typescript
<button
  aria-label="Send message"
  aria-disabled={!inputValue.trim()}
  onClick={handleSend}
>
  ➤
</button>

<input
  aria-label="Campaign brief description"
  aria-placeholder="Describe your campaign..."
  value={inputValue}
  onChange={handleChange}
/>

<div role="tablist" aria-label="Campaign strategy sections">
  <button
    role="tab"
    aria-selected={activeTab === 'strategy'}
    aria-controls="strategy-panel"
    id="strategy-tab"
  >
    Strategy Overview
  </button>
</div>
```

**Color Contrast:**
- Verify all text meets WCAG AA standards (4.5:1 for normal text)
- Gray text (#6b7280) on white background: Contrast ratio ~5.74:1 ✓
- Gray text (#9ca3af) on white background: Contrast ratio ~3.47:1 ✗ (use for labels only, not body text)

### Performance Optimizations

**Memoization:**
```typescript
import { useMemo, useCallback } from 'react';

// Memoize expensive computations
const formattedParameters = useMemo(() => {
  return formatParameters(extractedData);
}, [extractedData]);

// Memoize callbacks to prevent unnecessary re-renders
const handleSend = useCallback(() => {
  if (!inputValue.trim()) return;
  setUserMessage(inputValue);
  setInputValue('');
  setStage('results');
}, [inputValue]);
```

**React.memo for Sub-Components:**
```typescript
const ModeToggle = React.memo(({ activeMode, onModeChange }: ModeToggleProps) => {
  // Component implementation
});

// Only re-renders if activeMode changes
```

**Lazy Loading (if component grows):**
```typescript
const StrategyContent = lazy(() => import('./StrategyContent'));

<Suspense fallback={<LoadingSpinner />}>
  <StrategyContent />
</Suspense>
```

### Browser Compatibility

**Target Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**CSS Features Used:**
- Flexbox: Fully supported ✓
- Grid: Fully supported ✓
- Border-radius: Fully supported ✓
- Linear-gradient: Fully supported ✓
- Transitions: Fully supported ✓

**JavaScript Features Used:**
- Optional chaining: Supported in target browsers ✓
- Nullish coalescing: Supported in target browsers ✓
- Array methods (map, filter): Fully supported ✓

### Development Workflow

**Component Development Order:**
1. Create type definitions first
2. Implement main component structure with hardcoded data
3. Extract reusable sub-components
4. Add event handlers and state management
5. Add animations and transitions
6. Write unit tests
7. Test accessibility
8. Test responsive behavior
9. Optimize performance

**Testing During Development:**
- Run tests after each significant change
- Use Storybook or similar for isolated component development
- Test in multiple browsers regularly
- Use React DevTools to debug state and props

**Code Review Checklist:**
- [ ] TypeScript types are comprehensive and accurate
- [ ] All colors match the COLORS constant
- [ ] All spacing matches the SPACING constant
- [ ] Event handlers are properly bound
- [ ] No console errors or warnings
- [ ] Accessibility attributes are present
- [ ] Responsive behavior works at all breakpoints
- [ ] Tests pass and cover key functionality
- [ ] Code is DRY (no unnecessary duplication)
- [ ] Comments explain complex logic

## Future Enhancements

### Phase 2: Additional Features

1. **Conversation History:**
   - Store full message history
   - Allow scrolling through past messages
   - Show typing indicators

2. **Parameter Editing:**
   - Make Edit buttons functional
   - Open modal or inline editor
   - Validate edited values
   - Regenerate strategy based on changes

3. **File Attachments:**
   - Make attachment button functional
   - Support image uploads (e.g., cafe photos, product images)
   - Display attached files in message bubbles

4. **Voice Input:**
   - Add microphone button
   - Integrate speech-to-text API
   - Show recording indicator

5. **Export Functionality:**
   - Export campaign strategy as PDF
   - Share via email or link
   - Save as draft for later

6. **Other Tab Content:**
   - Implement Creators tab (show 8 recommended creators)
   - Implement Content Plan tab (content calendar)
   - Implement Budget tab (breakdown by creator/content type)
   - Implement Timeline tab (Gantt chart or timeline view)

### Phase 3: Advanced Features

1. **Real-time Collaboration:**
   - Multiple users editing same campaign
   - See other users' cursors and changes
   - Conflict resolution

2. **AI Suggestions:**
   - Proactive suggestions as user types
   - Alternative strategy options
   - Best practices tips

3. **A/B Testing:**
   - Generate multiple strategy variants
   - Compare side-by-side
   - User can choose preferred approach

4. **Integration with Campaign Management:**
   - One-click campaign creation from strategy
   - Auto-populate campaign fields
   - Transition to CreatorSelectionPage

### Localization Support (Future)

**i18n Integration:**
```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

<div>{t('campaign.greeting')}</div>
```

**Translation Keys:**
- All user-facing strings should be externalized
- Support for multiple languages (Tamil, Hindi, etc.)
- RTL support for applicable languages

## Conclusion

This design document provides a comprehensive blueprint for rebuilding the CreateCampaignPage component with pixel-perfect accuracy to the reference images. The architecture emphasizes:

- **Type safety** through comprehensive TypeScript definitions
- **Modularity** through well-organized sub-components
- **Maintainability** through clear separation of concerns
- **Testability** through example-based unit tests and integration tests
- **Accessibility** through proper ARIA attributes and keyboard navigation
- **Performance** through efficient state management and rendering

The implementation strategy focuses on exact visual replication using inline styles while maintaining code quality through constants, proper component extraction, and comprehensive testing. Future phases can build upon this foundation to add interactive editing, API integration, and advanced features while maintaining the polished UI established in this phase.
