# Requirements Document

## Introduction

This document specifies requirements for rebuilding the CreateCampaignPage component to exactly match two reference UI images. The component is an AI-powered campaign assistant that guides businesses through creating influencer marketing campaigns through a conversational interface.

## Glossary

- **CreateCampaignPage**: The main React component being rebuilt
- **Chat_Interface**: The left panel containing conversational UI elements
- **Campaign_Summary_Panel**: The right panel showing campaign details or generated strategy
- **Bot_Avatar**: The circular peach/pink icon representing the AI assistant
- **User_Avatar**: The circular orange icon with user initial
- **Suggestion_Chip**: Interactive button showing example campaign goals
- **Message_Bubble**: Container for bot or user messages in the chat
- **Strategy_Card**: Visual card displaying AI-generated campaign strategy
- **Field_Card**: Individual card showing extracted campaign parameters
- **Input_Bar**: Bottom text input area with attachment and send buttons
- **Bottom_Card**: Promotional card overlay in bottom-left of chat area
- **Mode_Toggle**: Buttons switching between AI Assistant and Manual Setup modes
- **Tab_Control**: Navigation tabs in the strategy panel

## Requirements

### Requirement 1: Layout Structure

**User Story:** As a business user, I want a clear two-panel layout, so that I can simultaneously view the conversation and campaign details.

#### Acceptance Criteria

1. THE CreateCampaignPage SHALL render within a beige/cream background (#F9F7F5)
2. THE Chat_Interface SHALL occupy approximately 60% of the width on the left side
3. THE Campaign_Summary_Panel SHALL occupy approximately 40% of the width on the right side
4. THE gap between panels SHALL be 24 pixels
5. THE Chat_Interface SHALL have a white background with rounded corners (16px radius)
6. THE Campaign_Summary_Panel SHALL have a white background with rounded corners (16px radius)
7. WHEN the viewport height changes, THE component SHALL maintain a minimum height of 600 pixels

### Requirement 2: Mode Toggle Controls

**User Story:** As a business user, I want to choose between AI-assisted and manual campaign creation, so that I can use the approach that suits my needs.

#### Acceptance Criteria

1. THE component SHALL display two toggle buttons at the top: "AI Assistant" and "Manual Setup"
2. WHEN a mode button is active, THE button SHALL have a light background (#FFF5F0) and orange border (#FF6B35 with 2px width)
3. WHEN a mode button is inactive, THE button SHALL have white background and gray border (#e5e7eb with 1px width)
4. WHEN the user clicks a mode button, THE component SHALL update the active state visually
5. THE AI Assistant button SHALL display a "✨" emoji icon before the text
6. THE Manual Setup button SHALL display a "⚙️" emoji icon before the text

### Requirement 3: Bot Avatar and Messaging

**User Story:** As a business user, I want to see clear visual distinction for AI messages, so that I can easily identify system responses.

#### Acceptance Criteria

1. THE Bot_Avatar SHALL be a circular element with 40 pixels diameter
2. THE Bot_Avatar SHALL have a peachy pink background color (#FFB5A7)
3. THE Bot_Avatar SHALL display a black robot emoji (🤖) centered within
4. WHEN displaying a bot message, THE Bot_Avatar SHALL appear on the left side with 12 pixels gap to the message
5. THE bot Message_Bubble SHALL have a light gray background (#F5F5F5)
6. THE bot Message_Bubble SHALL have rounded corners (12px on top-right, top-left, and bottom-right; 4px on bottom-left)
7. THE bot Message_Bubble SHALL have a maximum width of 85% of the chat area

### Requirement 4: Initial Greeting Message

**User Story:** As a business user, I want to see a welcoming greeting when I start, so that I understand the assistant's purpose.

#### Acceptance Criteria

1. WHEN the component loads in initial state, THE Chat_Interface SHALL display a bot message with text "Hi! I'm your campaign assistant 👋"
2. THE greeting heading SHALL be bold with font size 14-15 pixels
3. THE greeting SHALL include subtitle text "Tell me what you want to achieve, and I'll help you create the best campaign."
4. THE subtitle SHALL use gray color (#6b7280) with font size 13-14 pixels
5. THE subtitle SHALL have line height of 1.5 for readability

### Requirement 5: Suggestion Chips

**User Story:** As a business user, I want to see example campaign goals, so that I can quickly start with common scenarios.

#### Acceptance Criteria

1. WHEN the component is in initial state, THE Chat_Interface SHALL display suggestion chips below the greeting
2. THE suggestion chips SHALL be left-aligned with 60 pixels left padding to align with message content
3. THE suggestion chips SHALL display the following options: "Launch a café in Chennai", "Promote a new product", "Event coverage", "Increase brand awareness"
4. WHEN a suggestion chip is displayed, THE chip SHALL have white background with gray border (#e5e7eb with 1.5px width)
5. THE suggestion chips SHALL have fully rounded corners (24px border radius)
6. THE suggestion chips SHALL have padding of 10 pixels vertical and 18 pixels horizontal
7. THE suggestion chip text SHALL be 12-13 pixels font size in gray color (#374151)
8. WHEN the user hovers over a suggestion chip, THE chip SHALL change background to #F9FAFB and border color to #9ca3af
9. WHEN the user clicks a suggestion chip, THE text SHALL be inserted into the input field

### Requirement 6: User Message Display

**User Story:** As a business user, I want my messages to appear distinctly from bot messages, so that I can follow the conversation flow.

#### Acceptance Criteria

1. WHEN the user sends a message, THE Chat_Interface SHALL display the message aligned to the right
2. THE user Message_Bubble SHALL have a cream/beige background (#F5EFE7 or #F5F0E8)
3. THE user Message_Bubble SHALL have rounded corners (12px on top-left, top-right, and bottom-left; 4px on bottom-right)
4. THE user Message_Bubble SHALL have maximum width of 75% of the chat area
5. THE User_Avatar SHALL be a 36 pixels diameter circle with orange background (#E57A5A or #FF6B35)
6. THE User_Avatar SHALL display white text "D" centered within, font size 15 pixels, bold weight
7. THE User_Avatar SHALL appear on the right side of the message with 12 pixels gap
8. THE message SHALL display a timestamp "10:42 AM" below the text in gray color (#9ca3af), 12 pixels font size
9. THE timestamp SHALL be right-aligned within the message bubble

### Requirement 7: Bot Response with Extracted Details

**User Story:** As a business user, I want the AI to extract and display campaign parameters from my description, so that I can verify the understanding before proceeding.

#### Acceptance Criteria

1. WHEN the user submits their campaign brief, THE Chat_Interface SHALL display a bot response message
2. THE bot response SHALL include heading "Here's what I understood from your brief 👍" in bold, 16 pixels font size
3. THE bot response SHALL include gray subtitle text (13 pixels) stating "I've extracted the key details. Please review and edit if needed before I generate the campaign strategy."
4. THE bot response SHALL include a Campaign Goal card with distinctive styling
5. THE Campaign Goal card SHALL have white background, light gray border (#e5e7eb), and 10 pixels border radius
6. THE Campaign Goal card SHALL display "🎯 CAMPAIGN GOAL" label in uppercase, gray color (#9ca3af), 11 pixels font size with increased letter spacing
7. THE Campaign Goal card SHALL display the goal value in large bold text (18 pixels font size) below the label
8. THE Campaign Goal card SHALL include an "✏️ Edit all" button in orange color (#FF6B35) on the top-right

### Requirement 8: Campaign Parameter Fields Grid

**User Story:** As a business user, I want to see extracted campaign parameters in an organized grid, so that I can quickly review and edit individual fields.

#### Acceptance Criteria

1. WHEN displaying extracted parameters, THE bot response SHALL include a 2-column grid of Field_Cards
2. THE grid SHALL have 10 pixels gap between cards
3. THE Platform field SHALL span the full width of the grid (2 columns)
4. THE Field_Cards SHALL include the following parameters: Budget (💰), Location (📍), Duration (📅), Category (🍽️), Target Audience (👥), Language (🗣️), Platform (📱)
5. WHEN displaying a Field_Card, THE card SHALL have white background and light gray border (#e5e7eb)
6. THE Field_Card SHALL have 8 pixels border radius and 12-14 pixels padding
7. THE Field_Card SHALL display an uppercase label with emoji icon (10 pixels font, gray color #9ca3af, increased letter spacing)
8. THE Field_Card SHALL display the parameter value below the label in bold, 14 pixels font size
9. THE Field_Card SHALL include a small edit icon (✏️) button on the top-right in gray color (#9ca3af)

### Requirement 9: Input Bar Controls

**User Story:** As a business user, I want an accessible input area, so that I can easily send messages to the AI assistant.

#### Acceptance Criteria

1. THE Input_Bar SHALL be positioned at the bottom of the Chat_Interface with white background
2. THE Input_Bar SHALL have a top border (1px solid #e5e7eb) separating it from the chat area
3. THE Input_Bar SHALL include an attachment button (📎 icon) on the left in gray color (#9ca3af)
4. THE Input_Bar SHALL include a text input field with light gray background (#F9FAFB)
5. THE text input SHALL have rounded corners (24px border radius) and light gray border (#e5e7eb)
6. THE text input SHALL have padding of 12 pixels vertical and 20 pixels horizontal
7. THE text input SHALL display placeholder text that changes based on conversation stage
8. WHEN in initial state, THE placeholder SHALL read "Describe your campaign goal, budget, audience, or any specific requirements..."
9. WHEN in results state, THE placeholder SHALL read "Modify anything... e.g. 'Change duration to 20 days' or 'Include event coverage'"
10. THE Input_Bar SHALL include a circular send button (44 pixels diameter) on the right
11. WHEN the input field is empty, THE send button SHALL have gray background (#e5e7eb) and be disabled
12. WHEN the input field has text, THE send button SHALL have black background (#1a1a1a) and display a white arrow icon (➤)
13. WHEN the user presses Enter key in the input field, THE component SHALL submit the message

### Requirement 10: Initial State - Campaign Summary Panel

**User Story:** As a business user, I want to see a preview of what information will be collected, so that I know what details to provide.

#### Acceptance Criteria

1. WHEN the component is in initial state, THE Campaign_Summary_Panel SHALL display header "📋 Your Campaign"
2. THE header SHALL be bold, 18 pixels font size, with 24 pixels padding
3. THE panel SHALL display subtitle "The details will be filled as we chat" in gray (#6b7280), 13 pixels font size
4. THE panel SHALL list the following fields with dashed bottom borders: Campaign name (🎯), Goal (🎯), Target audience (👥), Budget (💰), Platform (📱), Location (📍), Timeline (📅)
5. WHEN displaying empty fields, THE value area SHALL show an em dash (—) in light gray color (#d1d5db)
6. THE field rows SHALL have 12 pixels padding bottom and dashed border (#e5e7eb)
7. THE field label SHALL display an emoji icon followed by text in gray color (#6b7280), 14 pixels font size
8. THE field label and value SHALL be aligned in a flex row with space-between justification

### Requirement 11: Tip Box Component

**User Story:** As a business user, I want to see helpful tips with examples, so that I can provide effective campaign descriptions.

#### Acceptance Criteria

1. WHEN in initial state, THE Campaign_Summary_Panel SHALL display a tip box at the bottom
2. THE tip box SHALL have pale yellow background (#FFFBEB) with amber border (#FDE68A)
3. THE tip box SHALL have 10 pixels border radius and padding of 14-16 pixels
4. THE tip box SHALL display a "💡 Tip" heading in dark amber (#92400E), bold, 14 pixels font size
5. THE tip box SHALL include instructional text "Be as specific as possible to get better recommendations." in dark yellow (#78350F), 13 pixels font size
6. THE tip box SHALL include an example section with lighter yellow background (#FEF3C7), 6 pixels border radius, and 8-10 pixels padding
7. THE example text SHALL display "Example:" in bold followed by a sample campaign description in 12 pixels italic font

### Requirement 12: Results State - Strategy Panel Header

**User Story:** As a business user, I want to see a clear indication when AI has generated my strategy, so that I know the system has processed my input.

#### Acceptance Criteria

1. WHEN the component enters results state, THE Campaign_Summary_Panel SHALL display header "✨ Your Campaign Strategy"
2. THE header SHALL be bold, 18 pixels font size, in black color (#1a1a1a)
3. THE panel SHALL display an "AI Generated" badge next to the header
4. THE AI Generated badge SHALL have a gradient background from pink to purple (#EC4899 to #8B5CF6 at 135deg)
5. THE badge SHALL have white text, uppercase, 11 pixels font size, bold weight
6. THE badge SHALL have 16 pixels border radius (pill shape) and padding of 6 pixels vertical, 12 pixels horizontal
7. THE badge SHALL have increased letter spacing (0.5px)

### Requirement 13: Strategy Panel Navigation Tabs

**User Story:** As a business user, I want to navigate between different aspects of my campaign strategy, so that I can review each section in detail.

#### Acceptance Criteria

1. WHEN in results state, THE Campaign_Summary_Panel SHALL display navigation tabs below the header
2. THE tabs SHALL include: "Strategy Overview", "Creators" (with badge showing "8"), "Content Plan", "Budget", "Timeline"
3. WHEN a tab is active, THE tab SHALL have light gray background (#F9FAFB) and bottom border (2px solid #1a1a1a)
4. WHEN a tab is active, THE tab text SHALL be black (#1a1a1a) and bold (weight 600)
5. WHEN a tab is inactive, THE tab SHALL have transparent background and no visible bottom border
6. WHEN a tab is inactive, THE tab text SHALL be gray (#6b7280) and normal weight (400)
7. THE tabs SHALL have 8 pixels padding vertical and 14 pixels padding horizontal
8. THE tabs SHALL have 13 pixels font size
9. THE Creators tab badge SHALL have black background (#1a1a1a), white text, 11 pixels font size, bold, 10 pixels border radius
10. THE badge SHALL have 2 pixels vertical and 6 pixels horizontal padding
11. WHEN the user clicks a tab, THE active tab SHALL update accordingly

### Requirement 14: Strategy Overview Content

**User Story:** As a business user, I want to see a comprehensive strategy overview, so that I can understand the recommended approach before proceeding.

#### Acceptance Criteria

1. WHEN the Strategy Overview tab is active, THE panel SHALL display "RECOMMENDED STRATEGY" label in uppercase, gray (#9ca3af), 11 pixels font, with increased letter spacing
2. THE panel SHALL display a Strategy_Card with gradient image placeholder at the top
3. THE image placeholder SHALL be 140 pixels height with gradient background (#667eea to #764ba2 at 135deg)
4. THE image placeholder SHALL display a centered emoji icon (☕) at 48 pixels font size
5. THE Strategy_Card SHALL have white background, light gray border (#e5e7eb), and 12 pixels border radius
6. THE Strategy_Card SHALL display a title "Hyperlocal Creator Campaign" in bold, 16 pixels font size
7. THE Strategy_Card SHALL display descriptive text in gray (#6b7280), 13 pixels font size, with 1.5 line height
8. THE descriptive text SHALL be padded 16-18 pixels inside the card

### Requirement 15: Strategy Metrics Display

**User Story:** As a business user, I want to see key campaign metrics at a glance, so that I can quickly assess the strategy's scope.

#### Acceptance Criteria

1. WHEN displaying strategy overview, THE panel SHALL show a 3-column metrics grid below the Strategy_Card
2. THE grid SHALL have 12 pixels gap between metric cards
3. THE metrics SHALL include: Creators (👥 icon, value "8"), Estimated Reach (📊 icon, value "1.2M+"), Total Budget (💰 icon, value "₹1,50,000")
4. WHEN displaying a metric card, THE card SHALL have light gray background (#F9FAFB), border (#e5e7eb), and 10 pixels border radius
5. THE metric card SHALL have 14 pixels vertical and 12 pixels horizontal padding
6. THE metric card content SHALL be center-aligned
7. THE metric icon SHALL be 24 pixels font size with 6 pixels bottom margin
8. THE metric value SHALL be bold, 16 pixels font size, black color (#1a1a1a)
9. THE metric label SHALL be 11 pixels font size, gray color (#6b7280)

### Requirement 16: Strategy Highlights Section

**User Story:** As a business user, I want to see key strategy highlights, so that I can understand the main tactical elements of the campaign.

#### Acceptance Criteria

1. WHEN displaying strategy overview, THE panel SHALL include a "Key Strategy Highlights" section below metrics
2. THE highlights section SHALL have light gray background (#F9FAFB), border (#e5e7eb), and 12 pixels border radius
3. THE section SHALL have 18-20 pixels padding
4. THE section SHALL display heading "💡 Key Strategy Highlights" in bold, 14 pixels font size
5. THE section SHALL list at least 5 highlight points with checkmark icons (✓)
6. THE highlights SHALL include: focus on micro/nano creators, authentic experiences, Tamil/Tanglish content, mix of content formats, weekend footfall focus
7. WHEN displaying a highlight, THE item SHALL show a green checkmark (✓) followed by the text
8. THE highlight text SHALL be 13 pixels font size, gray color (#6b7280), with 1.5 line height
9. THE highlights SHALL have 10 pixels vertical spacing between items

### Requirement 17: Strategy Action Buttons

**User Story:** As a business user, I want clear action buttons to regenerate the strategy or proceed, so that I can control the next steps.

#### Acceptance Criteria

1. WHEN displaying strategy overview, THE panel SHALL include two action buttons at the bottom
2. THE first button SHALL display "↻ Regenerate strategy" with outlined styling
3. THE Regenerate button SHALL have white background, gray border (#e5e7eb), and gray text (#6b7280)
4. THE second button SHALL display "Continue to creators →" with filled styling
5. THE Continue button SHALL have black background (#1a1a1a) and white text
6. THE buttons SHALL have 12-14 pixels vertical padding and full width
7. THE buttons SHALL have 10 pixels border radius and 14 pixels font size
8. THE buttons SHALL be stacked vertically with 10 pixels gap between them
9. WHEN the user hovers over a button, THE button SHALL show visual feedback (darker background or border)

### Requirement 18: Bottom-Left Promotional Card

**User Story:** As a business user, I want to see a promotional message about influencer marketing, so that I understand the platform's value proposition.

#### Acceptance Criteria

1. WHEN in initial state, THE Chat_Interface SHALL display a Bottom_Card overlaying the bottom-left area
2. THE Bottom_Card SHALL have absolute positioning in the bottom-left corner
3. THE Bottom_Card SHALL have light peach/orange gradient background
4. THE Bottom_Card SHALL display a graph/chart icon (📊 or chart bars emoji) at the top
5. THE card SHALL display heading "Grow with Influencer Marketing" in bold, 16-17 pixels font size
6. THE card SHALL display descriptive text below the heading in 13-14 pixels font size
7. THE card SHALL include an orange "Create campaign →" button with white text
8. THE card SHALL include a "Sign out" link below the button
9. THE card SHALL display a demo business profile section at the very bottom
10. THE card SHALL have appropriate padding (16-20 pixels) and rounded corners (12-16 pixels)

### Requirement 19: Responsive Behavior

**User Story:** As a business user, I want the interface to work on different screen sizes, so that I can create campaigns from various devices.

#### Acceptance Criteria

1. WHEN the viewport width is less than 1024 pixels, THE component SHALL stack the two panels vertically
2. WHEN panels are stacked, THE Chat_Interface SHALL take full width and maintain minimum height
3. WHEN panels are stacked, THE Campaign_Summary_Panel SHALL appear below with full width
4. WHEN the viewport is resized, THE component SHALL smoothly transition between layouts
5. THE component SHALL maintain readability and usability at viewport widths down to 768 pixels

### Requirement 20: Transition Animations

**User Story:** As a business user, I want smooth transitions between states, so that the interface feels polished and responsive.

#### Acceptance Criteria

1. WHEN new messages are added to the Chat_Interface, THE messages SHALL fade in smoothly
2. WHEN the component transitions from initial to results state, THE right panel content SHALL transition smoothly
3. WHEN hovering over interactive elements, THE visual feedback SHALL transition smoothly over 0.2 seconds
4. WHEN tab selection changes, THE active state indicators SHALL transition smoothly
5. WHEN buttons change between enabled and disabled states, THE background color SHALL transition over 0.2 seconds

### Requirement 21: TypeScript Type Safety

**User Story:** As a developer, I want full TypeScript type safety, so that I can catch errors at compile time.

#### Acceptance Criteria

1. THE component SHALL be implemented as a TypeScript React functional component
2. THE component SHALL define explicit types for all props, state, and event handlers
3. THE component SHALL use TypeScript enums or union types for conversation stages
4. THE component SHALL use TypeScript interfaces for data structures (campaign parameters, strategy data)
5. THE component SHALL compile without TypeScript errors
6. THE component SHALL not use 'any' type unless absolutely necessary

### Requirement 22: Color Consistency

**User Story:** As a designer, I want exact color matching with the reference images, so that the rebuilt component maintains visual consistency.

#### Acceptance Criteria

1. THE main background color SHALL be #F9F7F5 (beige/cream)
2. THE Bot_Avatar background SHALL be #FFB5A7 (peachy pink)
3. THE User_Avatar background SHALL be #E57A5A or #FF6B35 (orange)
4. THE user Message_Bubble background SHALL be #F5EFE7 or #F5F0E8 (cream/beige)
5. THE bot Message_Bubble background SHALL be #F5F5F5 or #F9FAFB (light gray)
6. THE active mode button background SHALL be #FFF5F0 (light peach)
7. THE active mode button border SHALL be #FF6B35 (orange)
8. THE tip box background SHALL be #FFFBEB (pale yellow) with border #FDE68A (amber)
9. THE AI Generated badge SHALL have gradient from #EC4899 to #8B5CF6 (pink to purple)
10. THE strategy image placeholder SHALL have gradient from #667eea to #764ba2 (blue to purple)

### Requirement 23: Typography Specifications

**User Story:** As a designer, I want precise typography matching the reference images, so that text appears exactly as designed.

#### Acceptance Criteria

1. THE bot greeting heading SHALL be 14-15 pixels, bold (weight 600-700)
2. THE bot greeting subtitle SHALL be 13-14 pixels, normal weight, gray color
3. THE user message text SHALL be 14 pixels with 1.6 line height
4. THE timestamp text SHALL be 12 pixels, gray color
5. THE Campaign Summary header SHALL be 18 pixels, bold (weight 700)
6. THE uppercase labels SHALL be 10-11 pixels with increased letter spacing (0.5px)
7. THE campaign goal value SHALL be 18 pixels, bold (weight 700)
8. THE field values SHALL be 14 pixels, bold (weight 600)
9. THE strategy card title SHALL be 16 pixels, bold (weight 700)
10. THE strategy description SHALL be 13 pixels with 1.5 line height

### Requirement 24: Spacing and Layout Precision

**User Story:** As a designer, I want exact spacing matching the reference images, so that the layout appears identical.

#### Acceptance Criteria

1. THE gap between the two main panels SHALL be exactly 24 pixels
2. THE padding inside the Chat_Interface message area SHALL be 32 pixels
3. THE gap between consecutive messages SHALL be 20 pixels
4. THE gap between Bot_Avatar and message bubble SHALL be 12 pixels
5. THE padding inside message bubbles SHALL be 14-20 pixels (varies by message type)
6. THE gap between suggestion chips SHALL be 10 pixels
7. THE padding inside Field_Cards SHALL be 12-14 pixels
8. THE grid gap in the fields grid SHALL be 10 pixels
9. THE padding in the Campaign_Summary_Panel header SHALL be 20-24 pixels
10. THE gap between strategy metrics cards SHALL be 12 pixels

### Requirement 25: Interactive Element States

**User Story:** As a business user, I want clear visual feedback on interactive elements, so that I know when elements are clickable.

#### Acceptance Criteria

1. WHEN hovering over suggestion chips, THE chip SHALL show visual feedback (background and border color change)
2. WHEN hovering over edit icons, THE icon SHALL show visual feedback (color change or scale)
3. WHEN hovering over buttons, THE button SHALL show visual feedback (background darkening or border emphasis)
4. WHEN hovering over tabs, THE tab SHALL show subtle visual feedback
5. WHEN a button is disabled, THE button SHALL have reduced opacity or gray styling
6. THE cursor SHALL change to pointer when hovering over interactive elements
7. THE cursor SHALL remain default when hovering over disabled elements
