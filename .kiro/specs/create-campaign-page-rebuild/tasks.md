# Implementation Plan: CreateCampaignPage Rebuild

## Overview

This implementation plan breaks down the CreateCampaignPage rebuild into discrete, incremental coding tasks. The component is an AI-powered campaign creation assistant with a two-panel conversational interface. Each task builds on previous work, with testing integrated throughout to validate functionality early.

The implementation follows a bottom-up approach: establish core types and constants, build atomic UI components, compose them into larger sections, and finally wire everything together with state management.

## Tasks

- [x] 1. Set up project structure and core type definitions
  - Create the CreateCampaignPage directory at `src/features/campaigns/create-campaign-page/`
  - Create subdirectories: `components/`, `types/`, `constants/`
  - Define core TypeScript types in `types/index.ts`: `ConversationStage`, `CreationMode`, `TabKey`, `CampaignParameter`, `ExtractedParameters`, `GeneratedStrategy`, `Metric`
  - Define color constants in `constants/colors.ts` with all exact hex values from requirements
  - Define spacing constants in `constants/spacing.ts`
  - Define typography constants in `constants/typography.ts`
  - _Requirements: 21, 22, 23, 24_

- [x] 2. Implement atomic UI components
  - [x] 2.1 Create BotMessage component
    - Implement `components/BotMessage.tsx` with avatar (48px circle, #FFB5A7, 🤖 emoji) and message bubble
    - Support two variants: 'greeting' (85% width) and 'extraction' (95% width)
    - Apply border radius: 12px-12px-12px-4px for tail effect
    - Use exact colors and spacing from constants
    - _Requirements: 3_
  
  - [x] 2.2 Create UserMessage component
    - Implement `components/UserMessage.tsx` with right-aligned layout
    - Create user avatar (36px circle, #FF6B35, white initial "D")
    - Create message bubble (#F5F0E8 background, max 75% width)
    - Apply border radius: 12px-12px-4px-12px
    - Add timestamp display (12px gray text, right-aligned)
    - _Requirements: 6_
  
  - [x] 2.3 Create ModeToggle component
    - Implement `components/ModeToggle.tsx` with AI Assistant and Manual Setup buttons
    - Define ModeButton interface with mode, icon, and label properties
    - Apply active state styling: #FFF5F0 background, #FF6B35 2px border
    - Apply inactive state styling: white background, #e5e7eb 1px border
    - Add emoji icons: ✨ for AI, ⚙️ for Manual
    - Handle click events to call onModeChange callback
    - _Requirements: 2_
  
  - [x] 2.4 Create SuggestionChips component
    - Implement `components/SuggestionChips.tsx` with clickable chip buttons
    - Render chips: "Launch a café in Chennai", "Promote a new product", "Event coverage", "Increase brand awareness"
    - Apply base styling: white background, #e5e7eb 1.5px border, 24px border radius
    - Apply hover styling: #F9FAFB background, #9ca3af border
    - Add 60px left padding to align with message content
    - Handle click events to populate input field
    - _Requirements: 5_

  - [x] 2.5 Create FieldCard component
    - Implement `components/FieldCard.tsx` for displaying individual campaign parameters
    - Accept props: icon, label, value, onEdit callback
    - Apply styling: white background, #e5e7eb border, 8px radius, 12-14px padding
    - Display uppercase label with emoji icon (10px font, gray, increased letter spacing)
    - Display value in bold 14px font
    - Add edit icon button (✏️) in top-right corner, gray color
    - _Requirements: 8_

- [ ] 3. Implement compound components
  - [ ] 3.1 Create CampaignGoalCard component
    - Implement `components/CampaignGoalCard.tsx` with distinct styling
    - Display "🎯 CAMPAIGN GOAL" label in uppercase (11px gray, increased spacing)
    - Display goal value in large bold text (18px font)
    - Add "✏️ Edit all" button in top-right corner (orange #FF6B35)
    - Apply styling: white background, #e5e7eb border, 10px radius
    - _Requirements: 7_
  
  - [ ] 3.2 Create ParameterFieldsGrid component
    - Implement `components/ParameterFieldsGrid.tsx` with 2-column CSS grid
    - Define grid with 10px gap
    - Make Platform field span full width (grid-column: 1 / -1)
    - Render FieldCard components for each parameter
    - Include fields: Budget (💰), Location (📍), Duration (📅), Category (🍽️), Target Audience (👥), Language (🗣️), Platform (📱)
    - _Requirements: 8_
  
  - [ ] 3.3 Create InputBar component
    - Implement `components/InputBar.tsx` with flex row layout
    - Add attachment button (📎 icon, gray #9ca3af) on left
    - Add text input field with light gray background (#F9FAFB), 24px border radius
    - Add padding: 12px vertical, 20px horizontal to input
    - Implement dynamic placeholder based on conversation stage
    - Add circular send button (44px diameter) on right
    - Apply conditional styling: gray (#e5e7eb) when disabled, black (#1a1a1a) when enabled
    - Display white arrow icon (➤) in send button
    - Handle Enter key press to submit message
    - _Requirements: 9_
  
  - [ ] 3.4 Create TipBox component
    - Implement `components/TipBox.tsx` with pale yellow styling
    - Apply background: #FFFBEB, border: #FDE68A, 10px radius, 14-16px padding
    - Display "💡 Tip" heading (dark amber #92400E, bold, 14px)
    - Display instructional text (dark yellow #78350F, 13px)
    - Create example section with lighter yellow background (#FEF3C7)
    - Apply 6px radius and 8-10px padding to example section
    - Display "Example:" in bold followed by sample text in 12px italic font
    - _Requirements: 11_

- [ ] 4. Implement strategy panel components
  - [ ] 4.1 Create StrategyCard component
    - Implement `components/StrategyCard.tsx` with gradient image placeholder at top
    - Create 140px height gradient section (#667eea to #764ba2 at 135deg)
    - Display centered emoji icon (☕) at 48px font size in gradient
    - Apply white background, #e5e7eb border, 12px radius to card
    - Display title "Hyperlocal Creator Campaign" in bold 16px font
    - Display description text (gray #6b7280, 13px, 1.5 line height)
    - Add 16-18px padding inside card
    - _Requirements: 14_
  
  - [ ] 4.2 Create MetricsGrid component
    - Implement `components/MetricsGrid.tsx` with 3-column grid layout
    - Apply 12px gap between metric cards
    - Create metric cards with light gray background (#F9FAFB), border (#e5e7eb), 10px radius
    - Apply 14px vertical and 12px horizontal padding, center-aligned content
    - Display metrics: Creators (👥, "8"), Estimated Reach (📊, "1.2M+"), Total Budget (💰, "₹1,50,000")
    - Style icon (24px font, 6px bottom margin), value (bold 16px, black), label (11px, gray)
    - _Requirements: 15_
  
  - [ ] 4.3 Create KeyHighlights component
    - Implement `components/KeyHighlights.tsx` with light gray container
    - Apply background: #F9FAFB, border: #e5e7eb, 12px radius, 18-20px padding
    - Display "💡 Key Strategy Highlights" heading (bold, 14px)
    - Render highlight list with green checkmarks (✓)
    - Display highlights: focus on micro/nano creators, authentic experiences, Tamil/Tanglish content, mix of formats, weekend footfall focus
    - Apply 13px font size, gray color (#6b7280), 1.5 line height
    - Add 10px vertical spacing between items
    - _Requirements: 16_
  
  - [ ] 4.4 Create ActionButtons component
    - Implement `components/ActionButtons.tsx` with stacked vertical layout
    - Create "↻ Regenerate strategy" button with outlined styling (white bg, gray border #e5e7eb, gray text)
    - Create "Continue to creators →" button with filled styling (black bg #1a1a1a, white text)
    - Apply 12-14px vertical padding, full width, 10px border radius, 14px font size
    - Add 10px gap between buttons
    - Implement hover effects (darker background or emphasized border)
    - _Requirements: 17_

- [ ] 5. Implement panel-level components
  - [ ] 5.1 Create InitialStatePanel component
    - Implement `components/InitialStatePanel.tsx` for right panel initial state
    - Display header "📋 Your Campaign" (bold, 18px, 24px padding)
    - Display subtitle "The details will be filled as we chat" (gray #6b7280, 13px)
    - Create empty fields list with dashed bottom borders (#e5e7eb)
    - Display fields: Campaign name (🎯), Goal (🎯), Target audience (👥), Budget (💰), Platform (📱), Location (📍), Timeline (📅)
    - Show em dash (—) for empty values in light gray (#d1d5db)
    - Apply 12px padding bottom to field rows
    - Use flex row with space-between for label and value alignment
    - Include TipBox component at bottom
    - _Requirements: 10, 11_
  
  - [ ] 5.2 Create TabNavigation component
    - Implement `components/TabNavigation.tsx` with horizontal tabs
    - Render tabs: "Strategy Overview", "Creators" (with "8" badge), "Content Plan", "Budget", "Timeline"
    - Apply active styling: #F9FAFB background, 2px #1a1a1a bottom border, black bold text (weight 600)
    - Apply inactive styling: transparent background, no border, gray text (#6b7280, weight 400)
    - Use 8px vertical and 14px horizontal padding, 13px font size
    - Style Creators badge: black background (#1a1a1a), white text, 11px bold, 10px radius, 2px/6px padding
    - Handle click events to call onTabChange callback
    - _Requirements: 13_
  
  - [ ] 5.3 Create StrategyContent component
    - Implement `components/StrategyContent.tsx` for strategy overview tab content
    - Display "RECOMMENDED STRATEGY" label (uppercase, gray #9ca3af, 11px, increased spacing)
    - Compose StrategyCard, MetricsGrid, KeyHighlights, and ActionButtons
    - Apply appropriate spacing between sections
    - _Requirements: 14, 15, 16, 17_
  
  - [ ] 5.4 Create ResultsStatePanel component
    - Implement `components/ResultsStatePanel.tsx` for right panel results state
    - Display header "✨ Your Campaign Strategy" (bold, 18px, black #1a1a1a)
    - Create "AI Generated" badge with gradient background (#EC4899 to #8B5CF6 at 135deg)
    - Style badge: white text, uppercase, 11px bold, 16px radius (pill), 6px/12px padding, 0.5px letter spacing
    - Include TabNavigation component below header
    - Include StrategyContent component for tab content
    - _Requirements: 12, 13_

- [ ] 6. Implement main chat panel sections
  - [ ] 6.1 Create MessagesArea component
    - Implement `components/MessagesArea.tsx` as container for chat messages
    - Apply 32px padding to message area
    - Add 20px gap between consecutive messages
    - Render BotMessage with greeting in initial state
    - Render SuggestionChips below greeting in initial state
    - Render UserMessage in results state
    - Render BotMessage with extraction response in results state
    - Include CampaignGoalCard and ParameterFieldsGrid in extraction response
    - _Requirements: 4, 5, 6, 7, 8_
  
  - [ ] 6.2 Create ChatPanel component
    - Implement `components/ChatPanel.tsx` as container for left panel
    - Apply white background with 16px rounded corners
    - Use flex column layout to separate MessagesArea and InputBar
    - Include MessagesArea component in flex-1 scrollable area
    - Include InputBar component fixed at bottom
    - Add 1px top border (#e5e7eb) to InputBar
    - _Requirements: 1, 4, 5, 6, 7, 8, 9_

- [ ] 7. Checkpoint - Review component structure
  - Ensure all atomic and compound components are implemented
  - Verify all components accept correct props with TypeScript types
  - Ensure all styling matches design specifications (colors, spacing, typography)
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement main page component with state management
  - [ ] 8.1 Create CreateCampaignPage container component
    - Implement `src/features/campaigns/create-campaign-page/CreateCampaignPage.tsx`
    - Define component state using useState hooks: activeMode, stage, inputValue, userMessage, activeTab
    - Initialize state: activeMode='ai', stage='initial', inputValue='', userMessage='', activeTab='strategy'
    - Implement handleModeChange to update activeMode state
    - Implement handleSend to transition to 'results' stage, save userMessage, clear inputValue
    - Implement handleInputChange to update inputValue state
    - Implement handleChipClick to populate inputValue
    - Implement handleTabChange to update activeTab state
    - _Requirements: 1, 2, 21_
  
  - [ ] 8.2 Compose two-panel layout
    - Create container div with beige background (#F9F7F5) and minimum height 600px
    - Render ModeToggle component at top with activeMode and handleModeChange
    - Create flex row layout for two panels with 24px gap
    - Render ChatPanel on left (60% width, white background, 16px rounded corners)
    - Render right panel on right (40% width, white background, 16px rounded corners)
    - Conditionally render InitialStatePanel when stage === 'initial'
    - Conditionally render ResultsStatePanel when stage === 'results'
    - Pass appropriate props and handlers to all child components
    - _Requirements: 1, 2_

  - [ ]* 8.3 Write unit tests for CreateCampaignPage state management
    - Test initial state rendering: verify greeting, suggestion chips, empty fields panel
    - Test stage transition: simulate user sending message, verify results state
    - Test mode switching: click mode buttons, verify visual feedback
    - Test input field behavior: verify send button enabled/disabled based on input
    - Test suggestion chip interaction: click chip, verify input field populated
    - _Requirements: 1, 2, 4, 5, 9_

- [ ] 9. Implement responsive behavior
  - [ ] 9.1 Add responsive layout logic
    - Create useMediaQuery custom hook in `src/hooks/useMediaQuery.ts`
    - Use useMediaQuery to detect viewport width breakpoints (768px, 1024px)
    - Apply conditional styling: flex-direction column when width < 1024px
    - Apply conditional styling: both panels full width when stacked
    - Ensure Chat panel maintains minimum height of 600px
    - Test layout at different viewport widths
    - _Requirements: 19_
  
  - [ ] 9.2 Add mobile optimizations
    - Reduce padding to 16px on mobile (< 768px)
    - Adjust MetricsGrid to 2 columns on mobile
    - Increase button touch targets to minimum 44x44px
    - Increase input field height to 48px on mobile
    - Increase suggestion chip padding for easier tapping
    - _Requirements: 19_

  - [ ]* 9.3 Write responsive layout tests
    - Test desktop layout: verify 60/40 split with 24px gap
    - Test tablet layout: verify vertical stacking with full width panels
    - Test mobile layout: verify optimized spacing and touch targets
    - Test smooth transitions when resizing viewport
    - _Requirements: 19_

- [ ] 10. Implement animations and transitions
  - [ ] 10.1 Add CSS transitions to interactive elements
    - Add 0.2s transition to button hover states (background-color, border-color)
    - Add 0.2s transition to tab active state (border-color, background-color)
    - Add 0.2s transition to send button state change (background-color)
    - Add 0.2s transition to suggestion chip hover (background-color, border-color)
    - Test all hover effects for smooth visual feedback
    - _Requirements: 20, 25_
  
  - [ ] 10.2 Add message fade-in animations
    - Implement fade-in animation for new messages (0.3s ease-in)
    - Animate message entrance: opacity 0→1, translateY 10px→0
    - Apply animation to BotMessage and UserMessage components
    - Test smooth message appearance when transitioning to results state
    - _Requirements: 20_

  - [ ]* 10.3 Write animation tests
    - Test message fade-in animation is applied
    - Test button hover transitions are smooth
    - Test tab switching transitions
    - Verify animations don't cause layout shifts
    - _Requirements: 20_

- [ ] 11. Implement accessibility features
  - [ ] 11.1 Add ARIA labels and keyboard navigation
    - Add aria-label to send button: "Send message"
    - Add aria-disabled to send button based on input state
    - Add aria-label to attachment button: "Attach file"
    - Add aria-label to input field: "Campaign brief description"
    - Add role="tablist" to TabNavigation with aria-label
    - Add role="tab", aria-selected, aria-controls to each tab
    - Add role="tabpanel", aria-labelledby to tab content
    - Ensure logical tab order: mode buttons → chips → input → send button
    - Implement Enter key handler for message submission
    - _Requirements: 9, 13, 25_
  
  - [ ] 11.2 Add focus styles and screen reader support
    - Add visible focus outlines to all interactive elements
    - Ensure focus order follows visual layout
    - Add sr-only text descriptions for emoji icons where needed
    - Test keyboard-only navigation through entire interface
    - Verify all interactive elements are keyboard accessible
    - _Requirements: 25_

  - [ ]* 11.3 Write accessibility tests
    - Run axe accessibility audit on component
    - Test keyboard navigation (Tab, Enter, Space keys)
    - Verify ARIA labels are present and descriptive
    - Test with screen reader to verify announcements
    - Check color contrast ratios meet WCAG AA standards
    - _Requirements: 25_

- [ ] 12. Add sample data and mock responses
  - [ ] 12.1 Create mock data constants
    - Create `constants/mockData.ts` with sample extracted parameters
    - Define sample campaign goal: "Launch a new café in Chennai"
    - Define sample parameters: Budget (₹1,50,000), Location (Chennai), Duration (30 days), Category (Food & Beverage), Target Audience (Food lovers, 18-35), Language (Tamil, English), Platform (Instagram, YouTube)
    - Define sample generated strategy with title, description, metrics, highlights
    - _Requirements: 7, 8, 14, 15, 16_
  
  - [ ] 12.2 Wire mock data to results state
    - Display mock extracted parameters in BotExtractionResponse when stage === 'results'
    - Display mock generated strategy in ResultsStatePanel when stage === 'results'
    - Ensure all mock data matches exact text and values from reference images
    - _Requirements: 7, 8, 12, 14, 15, 16_

- [ ] 13. Final integration and polish
  - [ ] 13.1 Integrate component into app routing
    - Add route for CreateCampaignPage in app router configuration
    - Test navigation to /campaigns/create from other pages
    - Ensure component renders correctly in app layout
    - _Requirements: 1_
  
  - [ ] 13.2 Verify pixel-perfect alignment
    - Compare rendered component side-by-side with reference images
    - Verify all spacing matches specifications (24px panel gap, 32px padding, etc.)
    - Verify all colors match hex values exactly
    - Verify all font sizes and weights match specifications
    - Verify all border radius values match specifications
    - Make fine-tuning adjustments as needed
    - _Requirements: 22, 23, 24_

  - [ ]* 13.3 Write integration tests
    - Test complete flow: initial state → click suggestion → send message → results state
    - Test mode switching maintains state correctly
    - Test tab navigation in results state
    - Test all interactive elements respond to clicks
    - Verify no console errors or warnings
    - _Requirements: All_

- [ ] 14. Final checkpoint - Complete review
  - Run all unit and integration tests, ensure 100% pass rate
  - Verify TypeScript compilation with no errors
  - Test component at multiple viewport widths
  - Test keyboard navigation and accessibility
  - Compare final result with reference images for pixel-perfect match
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional test-related sub-tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The implementation uses inline styles for pixel-perfect control over visual appearance
- TypeScript provides type safety throughout the component hierarchy
- Component composition follows atomic design principles for maintainability
- Mock data is used for initial implementation; API integration will be added later
- Testing strategy focuses on example-based unit tests and integration tests (property-based testing is not applicable for UI components)
- Accessibility is built in from the start with ARIA labels and keyboard navigation
- Responsive behavior ensures the component works across devices

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5"] },
    { "id": 2, "tasks": ["3.1", "3.2", "3.3", "3.4", "4.1", "4.2", "4.3", "4.4"] },
    { "id": 3, "tasks": ["5.1", "5.2", "5.3", "5.4"] },
    { "id": 4, "tasks": ["6.1"] },
    { "id": 5, "tasks": ["6.2"] },
    { "id": 6, "tasks": ["8.1"] },
    { "id": 7, "tasks": ["8.2", "8.3"] },
    { "id": 8, "tasks": ["9.1"] },
    { "id": 9, "tasks": ["9.2", "9.3"] },
    { "id": 10, "tasks": ["10.1"] },
    { "id": 11, "tasks": ["10.2", "10.3"] },
    { "id": 12, "tasks": ["11.1"] },
    { "id": 13, "tasks": ["11.2", "11.3"] },
    { "id": 14, "tasks": ["12.1"] },
    { "id": 15, "tasks": ["12.2"] },
    { "id": 16, "tasks": ["13.1"] },
    { "id": 17, "tasks": ["13.2", "13.3"] }
  ]
}
```
