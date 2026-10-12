# Influnz Mobile Development Guide

## 1. Project Overview

**App Name**: Influnz  
**Version**: 0.0.0  
**Purpose**: AI-powered creator marketing platform for Indian businesses. Connects brands with content creators for campaign management, collaboration, and performance tracking.  
**Users**: Business owners and marketers managing influencer marketing campaigns

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.3.0 | Frontend framework |
| TypeScript | 6.0.2 | Type safety |
| Vite | 8.3.0 | Build tool |
| React Router DOM | 6.30.6 | Routing |
| React Hook Form | 7.88.0 | Form management |
| Zod | 4.6.5 | Schema validation |
| Framer Motion | 13.4.3 | Animations |
| Lucide React | 1.48.0 | Icons |
| i18next | 26.4.2 | Internationalization |
| Tailwind CSS | 3.4.19 | CSS utilities |

### Build Commands
```bash
npm run dev     # Development server
npm run build   # Production build (tsc && vite build)
npm run preview # Preview production build
```

## 2. Architecture & Folder Structure

```
src/
├── app/                    # App-level providers and routing
│   ├── AuthContext.tsx    # User authentication state
│   ├── ProtectedRoute.tsx # Route guards
│   └── Router.tsx         # Main routing configuration
├── assets/                # Static assets
│   └── campaigns/         # Campaign images, avatars, content
├── components/            # Shared components
│   ├── mobile/           # Mobile-specific component library
│   └── Logo.tsx          # Brand logo component
├── features/              # Feature-based modules
│   ├── auth/             # Authentication (login, signup, etc.)
│   ├── business/         # Business dashboard and management
│   │   ├── mobile/       # ✅ Mobile implementations
│   │   └── web/          # Desktop implementations
│   ├── landing/          # Marketing landing page
│   │   ├── mobile/       # ✅ Mobile implementations
│   │   └── web/          # Desktop implementations
│   ├── campaigns/        # Campaign creation (legacy structure)
│   └── dashboard/        # Legacy dashboard
├── hooks/                 # Custom React hooks
│   └── useResponsive.ts  # Responsive breakpoint detection
├── lib/                   # Utilities and configurations
│   ├── auth/             # Auth types and services
│   └── i18n.ts           # Internationalization setup
├── locales/              # Translation files
├── styles/               # Global styles and CSS
│   └── mobile-responsive.css  # Mobile breakpoint overrides
└── App.tsx               # Root app component
```

**Feature Organization Principle**: Each major feature has its own folder under `src/features/`. Features that need mobile support use the two-component pattern: a responsive wrapper that imports either `mobile/` or `web/` implementations based on screen size.

### Current Mobile Implementation Status

| Feature | Has mobile/ folder | Has web/ folder | Status |
|---------|-------------------|-----------------|--------|
| business | ✅ Yes | ✅ Yes | Partially complete |
| landing | ✅ Yes | ✅ Yes | Complete |
| auth | ❌ No | ❌ No | Uses responsive CSS |
| campaigns | ❌ No | ❌ No | **Needs mobile implementation** |
| dashboard | ❌ No | ❌ No | Legacy - being replaced |

## 3. Routing Reference

### Complete Route Table
Based on `src/app/Router.tsx`:

| Path | Component | Auth Required | Description |
|------|-----------|---------------|-------------|
| `/` | Landing | No | Marketing homepage |
| `/signup` | SignupPage | Public only | User registration |
| `/login` | LoginPage | Public only | User login |
| `/verify` | OtpPage | No | OTP verification |
| `/forgot-password` | ForgotPage | Public only | Password recovery |
| `/reset-password` | ResetPage | Public only | Password reset |
| `/dashboard` | Dashboard | Yes | Legacy dashboard (redirect) |
| `/onboarding` | BizDashboard | Yes | Business onboarding |
| `/business` | BizDashboard | Yes | **Main business dashboard** |
| `/business/campaigns` | CampaignList | Yes | Campaign list view |
| `/business/campaigns/new` | CreateCampaign | Yes | Campaign creation |
| `/business/campaigns/ai-strategy` | AIStrategyWizard | Yes | AI strategy creation |
| `/business/campaigns/parameters` | CampaignParametersWizard | Yes | Campaign parameter setup |
| `/business/campaigns/strategy` | Strategy | Yes | Campaign strategy page |
| `/business/campaigns/creators` | CampaignCreators | Yes | Campaign creator selection |
| `/business/campaigns/guardrails` | NegotiationParams | Yes | Negotiation parameters |
| `/business/campaigns/negotiate` | NegotiationPreview | Yes | Negotiation preview |
| `/business/campaigns/invitations` | Invitations | Yes | Campaign invitations |
| `/business/campaigns/:id` | CampaignOps | Yes | Campaign operations detail |
| `/business/campaigns/:id/content` | CampaignContent | Yes | Campaign content review |
| `/business/creators` | CreatorSelection | Yes | Creator discovery |
| `/business/analytics` | Analytics | Yes | Business analytics |
| `/business/payments` | Payments | Yes | Payment management |
| `/business/approvals` | Approvals | Yes | Content approvals |
| `/business/notifications` | Notifications | Yes | Notification center |
| `/business/settings` | Settings | Yes | Account settings |

### Lazy Loading Pattern
All routes use React.lazy() for code splitting:
```tsx
const Landing = lazy(() => import('../features/landing/LandingPage'));
```

Components are wrapped in Suspense with PageLoader:
```tsx
function PageLoader() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--in-cream)' }}>
      <div className="in-spinner" style={{ width: 28, height: 28, borderWidth: 3, borderColor: 'rgba(242,132,107,0.2)', borderTopColor: 'var(--in-coral)' }} />
    </div>
  );
}
```

### Route Guards
- **ProtectedRoute**: Requires authentication, redirects to `/login?redirect=` with return URL
- **PublicOnlyRoute**: Redirect authenticated users to `/dashboard`

### Navigation in Mobile Components
Use React Router's `useNavigate`:
```tsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/business/campaigns');        // Navigate to path
navigate(-1);                          // Go back
### Navigation in Mobile Components
Use React Router's `useNavigate`:
```tsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/business/campaigns');        // Navigate to path
navigate(-1);                          // Go back
navigate('/business', { replace: true }); // Replace current entry
```

## 4. Authentication & User Context

### User Types and Data Structure
Based on `src/lib/auth/types.ts`:

```typescript
export type UserRole = 'owner' | 'marketer';

export interface User {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarInitials: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

### Using Authentication in Components
```tsx
import { useAuth } from '../../../app/AuthContext';

export default function Component() {
  const { state, setUser, clearUser, logout } = useAuth();
  
  // Check authentication status
  if (state.isLoading) return <LoadingSpinner />;
  if (!state.isAuthenticated) return <LoginPrompt />;
  
  // Access user data
  const user = state.user; // User | null
  const businessName = user?.businessName;
  const userRole = user?.role; // 'owner' | 'marketer'
  
  // Update user after login
  const handleLogin = () => {
    setUser({
      id: 'demo-001',
      businessName: 'Demo Business',
      email: 'demo@influnz.in',
      phone: '+91 9876543210',
      role: 'owner',
      avatarInitials: 'DB'
    });
  };
}
```

### Demo Mode Setup
For testing mobile components without backend:
```tsx
setUser({
  id: 'demo-001',
  businessName: 'Demo Business',
  email: 'demo@influnz.in',
  phone: '+91 9876543210',
  role: 'owner',
  avatarInitials: 'DB'
});
```

### Route Protection Usage
- `<ProtectedRoute>` - Wraps routes that require authentication
- `<PublicOnlyRoute>` - Wraps routes that redirect authenticated users (login, signup)
- Loading states automatically handled by guards

## 5. Responsive Strategy

### The Two-Component Pattern
Every page/feature that needs mobile treatment follows this exact structure:

```
src/features/<featureName>/
  <FeatureName>.tsx          ← responsive wrapper (thin)
  mobile/
    <FeatureName>Mobile.tsx  ← full mobile implementation  
  web/
    <FeatureName>Web.tsx     ← full desktop implementation
```

### useResponsive Hook API
Located at `src/hooks/useResponsive.ts`:

```typescript
interface ResponsiveState {
  isMobile: boolean;   // < 768px
  isTablet: boolean;   // 768px - 1023px  
  isDesktop: boolean;  // >= 1024px
  width: number;       // Current viewport width
  height: number;      // Current viewport height
}

const { isMobile, isTablet, isDesktop, width, height } = useResponsive();
```

### Breakpoint Strategy
**Mobile-first breakpoints**:
- **Small mobile**: max-width 480px
- **Mobile**: max-width 768px  
- **Tablet**: 769px - 1024px
- **Desktop**: min-width 1025px

### CSS vs Component Approach
1. **Component-split approach** (recommended): Use the two-component pattern for complex pages with different layouts
2. **CSS override approach**: Use `mobile-responsive.css` utilities for simple responsive adjustments

### CSS Utility Classes
Available in `mobile-responsive.css`:
- `.mobile-only` - Show only on mobile
- `.desktop-only` - Show only on desktop  
- `.mobile-hidden` - Hide on mobile
### CSS Utility Classes
Available in `mobile-responsive.css`:
- `.mobile-only` - Show only on mobile
- `.desktop-only` - Show only on desktop  
- `.mobile-hidden` - Hide on mobile
- `.desktop-hidden` - Hide on desktop

## 6. Design Tokens & Color System

### CSS Variables (Primary Palette)
```css
--in-coral: #f2846b     /* Primary brand coral */
--in-cream: #fdfcfb     /* Background cream */
--in-border: #e5e7eb    /* Border gray */
```

### Color Palette (Inline Usage)
**Primary Colors**:
- Brand coral: `#f2846b` (buttons, links, active states)
- Red variant: `#dc2626` (used in dashboard components, status indicators)

**Background Colors**:
- Page background: `#f5f5f5` or `#fafafa`
- Card background: `white`
- Cream background: `#fdfcfb` 

**Border & Dividers**:
- Default border: `#e5e7eb`
- Light border: `#f3f4f6`

**Text Colors**:
- Primary text: `#111827` (headings, body text)
- Secondary text: `#6b7280` (meta info, descriptions) 
- Tertiary text: `#9ca3af` (disabled, placeholders)
- Heading text: `#1e293b` (section headings)

**Status Colors**:
| Status | Background | Text | Usage |
|--------|------------|------|--------|
| Active | `#dcfce7` | `#10b981` | Active campaigns |
| Pending | `#fef3c7` | `#f59e0b` | Pending approvals |
| Completed | `#dbeafe` | `#2563eb` | Finished items |
| Rejected | `#fee2e2` | `#dc2626` | Failed/rejected |

**Platform Colors**:
- Instagram gradient: `linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)`
- YouTube red: `#FF0000`
- Platform badge background: `#dc2626`

**UI Elements**:
- Spinner border: `rgba(242,132,107,0.2)` with top color `var(--in-coral)`
- Card shadow: `0 1px 3px rgba(0,0,0,0.05)`

### Usage Notes
- Components use inline styles heavily rather than CSS classes
- Tokens are enforced through CSS variables where possible
- Status colors must include both background and text color for accessibility

## 7. Typography Scale (Mobile)

### Heading Hierarchy
```css
/* Page titles */
h1: 18-20px, font-weight 700-800, color #111827

/* Section headings */  
h2: 18px, font-weight 800, color #1e293b

/* Subsection headings */
h3: 16-18px, font-weight 600-700, color #111827
```

### Body Text
```css
/* Primary body text */
font-size: 14-15px, color: #111827

/* Secondary/meta text */  
font-size: 11-13px, color: #6b7280

/* Small labels/nav text */
font-size: 10-11px, font-weight: 600

/* Status chip text */
font-size: 11-12px, font-weight: 600
```

### Responsive Overrides
CSS breakpoint adjustments in `mobile-responsive.css`:
```css
@media screen and (max-width: 768px) {
  h1 { font-size: 24px !important; }
  h2 { font-size: 20px !important; }
  h3 { font-size: 18px !important; }
}

@media screen and (max-width: 480px) {
  h1 { font-size: 20px !important; }
}
```

### Font Family
- Uses system font stack: `inherit` from CSS
- No custom web fonts loaded
### Font Family
- Uses system font stack: `inherit` from CSS
- No custom web fonts loaded
- Consistent across all components

## 8. Spacing & Layout Rules (Mobile)

### Page Layout
```css
/* Page wrapper */
background: #f5f5f5 or #fafafa
minHeight: 100vh
padding: 16px horizontal (for content)
paddingBottom: 80px (when bottom nav present)
```

### Card Layout
```css
/* Standard card */
background: white
borderRadius: 12px
border: 1px solid #e5e7eb
padding: 14-16px
boxShadow: 0 1px 3px rgba(0,0,0,0.05)

/* Section gap between cards */
gap: 12px vertical
```

### Header Layout
```css
/* Mobile header (MobileHeader component) */
height: auto (content-based)
background: white
borderBottom: 1px solid #e5e7eb
position: sticky, top: 0, zIndex: 100

/* App header (dashboard-style) */
height: variable (content-based)
padding: 12px 16px 16px 16px
```

### Bottom Navigation
```css
height: 72-80px
position: fixed, bottom: 0
background: white
borderTop: 1px solid #e5e7eb
boxShadow: 0 -2px 12px rgba(0,0,0,0.08)
```

### Touch Targets
- **Minimum button size**: 44×44px
- **Form inputs height**: 48px minimum
- **Tab buttons height**: 48px minimum
- **Card touch area**: Full card padding (16-20px)

### Form Inputs
```css
/* Prevent iOS zoom */
fontSize: 16px (always)
minHeight: 48px
padding: 12px 16px
border: 1px solid #e5e7eb
borderRadius: 10px
```

### Spacing Scale
- **Page padding**: 16px horizontal
- **Card padding**: 14-16px
- **Section gaps**: 12px
- **Element gaps**: 8px (small), 12px (medium), 16px (large)
- **Text margins**: 4-6px between related elements

## 9. Mobile Component Library Reference

All components located in `src/components/mobile/`:

### MobileLayout
**Purpose**: Root layout wrapper for mobile pages

```tsx
import MobileLayout from '../../../components/mobile/MobileLayout';

<MobileLayout showBottomNav activeNavItem="home">
  {/* page content */}  
</MobileLayout>
```

**Props**:
- `children`: ReactNode - Page content
- `showBottomNav`: boolean (default: false) - Show bottom navigation
- `activeNavItem`: 'home' | 'campaigns' | 'creators' | 'analytics' - Active nav highlight

**Behavior**: 
- Sets page background to `#fafafa`
- Adds `paddingBottom: '80px'` when `showBottomNav=true`
- Renders `<MobileBottomNavigation>` when enabled

### MobileHeader  
**Purpose**: Sticky header with back button and title

```tsx
import MobileHeader from '../../../components/mobile/MobileHeader';

<MobileHeader 
  title="Campaign Details" 
  showBack 
  rightAction={<button>Save</button>} 
/>
```

**Props**:
- `title`: string - Header title text
- `onBack`: () => void - Custom back handler (defaults to navigate(-1))
- `showBack`: boolean (default: true) - Show back chevron
- `rightAction`: ReactNode - Custom right content (replaces default MoreVertical)

**Behavior**:
- Sticky positioned at top with z-index 100
- White background with bottom border
- Back button uses ChevronLeft icon from lucide-react
- Title truncates with ellipsis if too long

### MobileBottomNavigation
**Purpose**: Fixed bottom tab navigation (4-tab Lucide icon version)

```tsx
import MobileBottomNavigation from '../../../components/mobile/MobileBottomNavigation';

<MobileBottomNavigation active="campaigns" />
```

**Props**:
- `active`: 'home' | 'campaigns' | 'creators' | 'analytics' - Currently active tab

**Navigation Map**:
- Home (Home icon) → `/business`
- Campaigns (BarChart3 icon) → `/business/campaigns`  
- Creators (Users icon) → `/business/creators`
- Analytics (TrendingUp icon) → `/business/analytics`

**Styling**:
- Active color: `#dc2626`
- Inactive color: `#6b7280`  
- Icon size: 22px, strokeWidth 2-2.5
**Styling**:
- Active color: `#dc2626`
- Inactive color: `#6b7280`  
- Icon size: 22px, strokeWidth 2-2.5
- Label: 10px, font-weight 600-700

### MobileStatusChip
**Purpose**: Colored status badge

```tsx
import MobileStatusChip from '../../../components/mobile/MobileStatusChip';

<MobileStatusChip status="active" />
<MobileStatusChip status="pending" label="Under Review" />
```

**Props**:
- `status`: 'active' | 'pending' | 'completed' | 'approved' | 'rejected' | 'inreview'
- `label`: string (optional) - Custom text (overrides default)

**Status Colors**:
- active: bg `#dcfce7`, text `#16a34a`
- pending: bg `#fef3c7`, text `#f59e0b`  
- completed: bg `#dbeafe`, text `#2563eb`
- approved: bg `#dcfce7`, text `#16a34a`
- rejected: bg `#fee2e2`, text `#dc2626`
- inreview: bg `#fef3c7`, text `#f59e0b`

### MobileProgressBar
**Purpose**: Visual progress indicator

```tsx
import MobileProgressBar from '../../../components/mobile/MobileProgressBar';

<MobileProgressBar 
  current={68} 
  total={100} 
  color="#10b981" 
  showPercentage 
/>
```

**Props**:
- `current`: number - Current progress value
- `total`: number - Maximum progress value  
- `showPercentage`: boolean (default: true) - Show percentage text
- `color`: string (default: '#dc2626') - Progress bar color

**Behavior**:
- Bar height: 6px
- Background: `#e5e7eb`
- Animates width changes with CSS transition
- Percentage text aligned right, 10px gray text

### MobileCardCampaign
**Purpose**: Campaign card for list views

```tsx
import MobileCardCampaign from '../../../components/mobile/MobileCardCampaign';

<MobileCardCampaign 
  name="Chennai Café Launch" 
  image={imgUrl} 
  platform="Instagram" 
  creators={5} 
  status="active" 
  spent="₹1,02,000" 
  budget="₹9,00,000" 
  progress={68} 
  onClick={() => navigate('/business/campaigns/1')} 
/>
```

**Props**:
- `name`: string - Campaign name
- `image`: string - Campaign image URL
- `platform`: string - Platform name  
- `creators`: number - Creator count
- `status`: 'active' | 'pending' | 'completed' - Campaign status
- `spent`: string - Amount spent (formatted)
- `budget`: string - Total budget (formatted)
- `progress`: number - Progress percentage (0-100)
- `onClick`: () => void - Click handler

**Layout**:
- Image: 60×60px, borderRadius 8px
- Includes MobileStatusChip and MobileProgressBar
- Shows budget info and progress percentage

### MobileCardCreator
**Purpose**: Creator card for list views

```tsx
import MobileCardCreator from '../../../components/mobile/MobileCardCreator';

<MobileCardCreator 
  name="Shruti Mehta" 
  avatar={avatarUrl} 
  platform="instagram" 
  followers="1.2M" 
  engagement="4.8%" 
  status="approved" 
  delivered={3} 
  total={5} 
  onClick={() => {}} 
/>
```

**Props**:
- `name`: string - Creator name
- `avatar`: string - Avatar image URL
- `platform`: 'instagram' | 'youtube' - Creator platform
- `followers`: string - Follower count (formatted)
- `engagement`: string - Engagement rate (formatted)
- `status`: 'approved' | 'pending' | 'inreview' (optional) - Creator status
- `delivered`: number (optional) - Delivered content count
- `total`: number (optional) - Total expected content
- `onClick`: () => void - Click handler

**Platform Badge**: 
- Instagram: Red circle `#E4405F` with "IG" text
- YouTube: Red circle `#FF0000` with "YT" text  
- Positioned bottom-right of avatar (48×48px circle)

## 10. Mobile Page Architecture Pattern

### Mandatory File Structure
Every new mobile page MUST follow this pattern:

```
src/features/<featureName>/
  <FeatureName>.tsx          ← Responsive wrapper (thin)
  mobile/
    <FeatureName>Mobile.tsx  ← Full mobile implementation
  web/  
    <FeatureName>Web.tsx     ← Full desktop implementation
```

### Responsive Wrapper Template
**File**: `src/features/<featureName>/<FeatureName>.tsx`

```tsx
import { useResponsive } from '../../hooks/useResponsive';
import <FeatureName>Mobile from './mobile/<FeatureName>Mobile';
import <FeatureName>Web from './web/<FeatureName>Web';

export default function <FeatureName>() {
  const { isMobile } = useResponsive();
  
  if (isMobile) return <<FeatureName>Mobile />;
  return <<FeatureName>Web />;
}
```

### Mobile Component Template  
**File**: `src/features/<featureName>/mobile/<FeatureName>Mobile.tsx`

```tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/AuthContext';
import MobileLayout from '../../../components/mobile/MobileLayout';
import MobileHeader from '../../../components/mobile/MobileHeader';

/**
 * Mobile implementation of <FeatureName>
 * Optimized for devices < 768px width
 */
export default function <FeatureName>Mobile() {
  const navigate = useNavigate();
  const { state } = useAuth();

  return (
    <MobileLayout showBottomNav activeNavItem="<tab>">
      <MobileHeader title="<Page Title>" />
      
      <div style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Mobile-specific content here */}
      </div>
    </MobileLayout>
  );
}
```

### Component Requirements
1. **JSDoc comment** explaining the component's purpose
2. **useNavigate** for routing (never window.location)  
3. **useAuth** for user context access
4. **MobileLayout** wrapper with appropriate props
5. **Consistent padding**: 16px horizontal, 12px gaps
6. **TypeScript**: Proper prop interfaces named `<ComponentName>Props`

## 11. Mobile Page Design Rules (Must Follow)

These rules MUST be followed for consistency with existing design system:

### 1. Page Wrapper
```tsx
<div style={{
  background: '#f5f5f5',           // OR '#fafafa'  
  minHeight: '100vh',
  paddingBottom: showBottomNav ? '80px' : '0'
}}>
```

### 2. Card Style  
```tsx
<div style={{
  background: 'white',
  borderRadius: '12px',
  border: '1px solid #e5e7eb', 
  padding: '14px',               // OR '16px'
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
}}>
```

## 16. Accessibility Rules for Mobile

### Required ARIA Labels
```tsx
// Interactive elements need labels
<button aria-label="Go back" onClick={handleBack}>
  <ChevronLeft size={24} />
</button>

<button aria-label="More options">
  <MoreVertical size={20} />
</button>

// Main content area
<main id="main-content" aria-label="Campaign dashboard">
  {content}
</main>
```

### Skip Link (Already Present)
The skip link is implemented in `App.tsx`:
```tsx
<a href="#main-content" className="skip-link">Skip to main content</a>
```

### Form Accessibility
```tsx
// Labels must be associated with inputs
<label htmlFor="campaign-name">Campaign Name</label>
<input 
  id="campaign-name" 
  aria-describedby="name-error"
  {...register('name')} 
/>
{errors.name && (
  <span id="name-error" role="alert">{errors.name.message}</span>
)}
```

### Tab Navigation
```tsx
// Tab components need proper roles
<div role="tablist" aria-label="Campaign sections">
  <button 
    role="tab" 
    aria-selected={activeTab === 'overview'}
    onClick={() => setActiveTab('overview')}
  >
    Overview
  </button>
</div>
```

### Color Contrast Requirements
- **Text on white background**: Must meet 4.5:1 ratio
- **Current palette compliance**:
  - `#111827` on white = 16:1 ✅ (exceeds requirement)
  - `#6b7280` on white = 5:1 ✅ (meets requirement)
  - `#9ca3af` on white = 3:1 ❌ (use for non-essential text only)

### State Communication
Never rely on color alone:
```tsx
// ❌ Bad - color only
<span style={{ color: '#16a34a' }}>Active</span>

// ✅ Good - color + text/icon
<span style={{ background: '#dcfce7', color: '#16a34a' }}>
  <CheckCircle size={12} /> Active
</span>
```

## 17. Features Status Table

Current implementation status for all features:

| Feature | Route(s) | Has mobile/ | Has web/ | Priority | Notes |
|---------|----------|-------------|----------|----------|--------|
| **landing** | `/` | ✅ Complete | ✅ Complete | ✅ Done | Reference implementation |
| **business** | `/business` | ✅ Partial | ✅ Yes | 🔥 High | Dashboard done, lists need work |
| **auth** | `/login`, `/signup`, `/verify` | ❌ CSS only | ❌ CSS only | 🟡 Medium | Uses responsive CSS, works well |
| **campaigns** | `/business/campaigns/*` | ❌ None | ❌ Mixed | 🔥 Critical | **Urgent: Campaign creation flow** |
| **creators** | `/business/creators` | ❌ None | ✅ Yes | 🔥 High | Creator selection needs mobile |
| **analytics** | `/business/analytics` | ❌ None | ❌ None | 🟡 Medium | Analytics dashboard |
| **settings** | `/business/settings` | ❌ None | ❌ None | 🟢 Low | Account settings |
| **notifications** | `/business/notifications` | ❌ None | ❌ None | 🟡 Medium | Notification center |
| **payments** | `/business/payments` | ❌ None | ❌ None | 🟡 Medium | Payment management |

### Next Priority Order
1. **Campaign creation flow** - Critical user journey missing mobile support
2. **Creator selection** - Key discovery feature  
3. **Analytics dashboard** - Important for ROI tracking
4. **Campaign operations** - Content approval workflow
5. **Settings & notifications** - Account management

## 18. Code Quality Rules

### TypeScript Standards
```tsx
// ❌ Never use 'any' without justification
const data: any = response;

// ✅ Proper typing with interfaces
interface CampaignData {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'completed';
}
const data: CampaignData = response;

// ✅ Props interfaces must be named <ComponentName>Props
interface CampaignCardMobileProps {
  campaign: CampaignData;
  onClick: (id: string) => void;
}
```

### Component Standards
```tsx
/**
 * Mobile Campaign Creation Form
 * Handles campaign setup flow optimized for mobile devices
 */
export default function CampaignFormMobile() {
  // Component implementation
}
```

### Import Order Rules
```tsx
// 1. React and React ecosystem
import React from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Third-party libraries  
import { motion } from 'framer-motion';
import { Users, Plus } from 'lucide-react';

// 3. Internal hooks
import { useAuth } from '../../../app/AuthContext';
import { useResponsive } from '../../../hooks/useResponsive';

// 4. Internal components
import MobileLayout from '../../../components/mobile/MobileLayout';
import MobileHeader from '../../../components/mobile/MobileHeader';

// 5. Assets (last)
import logoImg from '../../../assets/logo.png';
```

### File Naming
- **Components**: PascalCase (`CampaignFormMobile.tsx`)
- **Hooks**: camelCase (`useResponsive.ts`)  
- **Utils**: camelCase (`formatCurrency.ts`)
- **Types**: PascalCase (`CampaignTypes.ts`)

### Code Cleanliness
```tsx
// ❌ No console.log in production
console.log('Debug info', data);

// ✅ Use proper error handling
try {
  const result = await api.createCampaign(data);
  navigate('/business/campaigns');
} catch (error) {
  setError('Failed to create campaign. Please try again.');
}
```

### Styling Approach
- **Inline styles**: Acceptable for mobile components (consistent with codebase)
- **CSS classes**: Use for shared utilities in `mobile-responsive.css`  
- **No Tailwind in JSX**: Tailwind utilities stay in CSS files only

## 19. Step-by-Step: Adding a New Mobile View

### Checklist for New Mobile Implementation

#### 1. Preparation
- [ ] Identify the feature folder: `src/features/<name>/`
- [ ] Check if `<FeatureName>.tsx` exists and uses useResponsive pattern
- [ ] If not, refactor to responsive wrapper first

#### 2. Setup Structure  
- [ ] Create `src/features/<name>/mobile/` directory
- [ ] Create `<FeatureName>Mobile.tsx` using template from Section 10
- [ ] Import and setup necessary dependencies (useNavigate, useAuth, etc.)

#### 3. Choose Layout Pattern
- [ ] **Main tab screen**: Use App Header pattern (logo, badge, notifications)
- [ ] **Sub-page screen**: Use MobileHeader component with back button
- [ ] Decide if bottom navigation is needed:
  - ✅ Main dashboard tabs: yes  
  - ❌ Detail/form pages: no

#### 4. Implement Content
- [ ] Apply page wrapper styles (background, minHeight, paddingBottom)
- [ ] Map desktop content to mobile cards/lists using components from Section 9
- [ ] Use MobileCardCampaign, MobileCardCreator, MobileProgressBar as needed
- [ ] Follow design rules from Section 11 (card style, spacing, colors)

#### 5. Verification Checklist
- [ ] **PaddingBottom**: 80px if bottom nav present
- [ ] **All inputs**: fontSize 16px (prevents iOS zoom)  
- [ ] **All buttons**: minHeight 44px (touch targets)
- [ ] **Form inputs**: minHeight 48px
- [ ] **Touch targets**: Minimum 44×44px
- [ ] **Loading states**: Use in-spinner with coral colors
- [ ] **Error handling**: Proper user feedback

#### 6. Testing Viewports
Test at these mobile viewport widths:
- [ ] **375px** (iPhone SE)
- [ ] **390px** (iPhone 14)  
- [ ] **412px** (Pixel 7)
- [ ] **360px** (Galaxy S)

#### 7. Integration
- [ ] Verify responsive wrapper imports mobile component correctly
- [ ] Test navigation flows between mobile screens
- [ ] Check bottom nav active states  
- [ ] Verify auth context integration works

## 20. Reference Examples

### Primary Reference Implementations

#### 1. BusinessDashboardMobile.tsx
**Location**: `src/features/business/mobile/BusinessDashboardMobile.tsx`  
**Study for**: 
- App header pattern with logo and business badge
- Campaign card layout and styling
- Custom 5-item bottom nav with center FAB
- Progress bar implementation  
- Platform badge styling (Instagram gradient)
- Status chip usage

**Key patterns**:
```tsx
// App header with logo + badge
<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
  <img src={logoImg} alt="Influnz" style={{ height: '24px' }} />
  <div style={{
    background: '#dc2626',
    color: 'white',
    fontSize: '10px',
    fontWeight: '700', 
    padding: '3px 8px',
    borderRadius: '4px'
  }}>
    BUSINESS
  </div>
</div>

// Center FAB in bottom nav
<button style={{
  width: '56px',
  height: '56px',
  background: '#dc2626',
  borderRadius: '50%',
  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
  transform: 'translateY(-8px)'
}}>
```

#### 2. LandingPageMobile.tsx  
**Location**: `src/features/landing/mobile/LandingPageMobile.tsx`  
**Study for**:
- Fixed navigation with mobile menu overlay
- Hero section layout and CTA placement
- Feature cards in vertical stack
- Mobile footer structure
- Gradient backgrounds and animations

**Key patterns**:
```tsx
// Mobile menu overlay
{mobileMenuOpen && (
  <div style={{
    position: 'fixed',
    top: '60px',
    left: 0,
    right: 0, 
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(8px)',
    zIndex: 999
  }}>
```

### Secondary References
- `MobileHeader.tsx` - Header component implementation
- `MobileCardCampaign.tsx` - Card layout patterns
- `mobile-responsive.css` - CSS breakpoint strategies
- `AuthFormParts.tsx` - Form component patterns

## 21. TL;DR Quick Reference Card

### 🎨 Essential Colors
- **Primary**: `#dc2626` (buttons, active states)  
- **Page BG**: `#f5f5f5` or `#fafafa`
- **Card BG**: `white`
- **Text**: `#111827` (primary), `#6b7280` (secondary)
- **Border**: `#e5e7eb`
- **Status Active**: bg `#dcfce7`, text `#16a34a`

### 📐 Key Measurements  
- **Page padding**: 16px horizontal
- **Card padding**: 14-16px
- **Card border**: `1px solid #e5e7eb`, `borderRadius: 12px`
- **Button minHeight**: 44px (touch target)
- **Input minHeight**: 48px, **fontSize**: 16px (iOS fix)
- **Bottom nav height**: 80px
- **Header zIndex**: 100

### 🧩 Component Imports
```tsx
import MobileLayout from '../../../components/mobile/MobileLayout';
import MobileHeader from '../../../components/mobile/MobileHeader';  
import MobileBottomNavigation from '../../../components/mobile/MobileBottomNavigation';
import MobileStatusChip from '../../../components/mobile/MobileStatusChip';
import MobileProgressBar from '../../../components/mobile/MobileProgressBar';
import MobileCardCampaign from '../../../components/mobile/MobileCardCampaign';
import MobileCardCreator from '../../../components/mobile/MobileCardCreator';
```

### ⚡ Essential Hooks
```tsx
const { isMobile } = useResponsive();           // < 768px detection
const navigate = useNavigate();                 // React Router navigation
const { state } = useAuth();                    // User context
```

### 🎯 Critical Rules
1. **Two-component pattern**: Always use responsive wrapper + mobile/web implementations  
2. **16px fontSize**: All inputs must use 16px to prevent iOS zoom
3. **44px minimum**: All touch targets (buttons, tabs, cards)
4. **80px bottom padding**: When bottom nav is present  
5. **Coral spinner**: `borderTopColor: 'var(--in-coral)'`
6. **Mobile-first**: Design for 375px width first, then expand
7. **Lucide icons**: Never use emoji in production code
8. **Auth context**: Always check `state.isAuthenticated` before rendering  
9. **Navigation**: Use `useNavigate()`, never `window.location`
10. **TypeScript**: Props interfaces named `<ComponentName>Props`

---

**File created**: `.agents/tasks/mobile-development-guide.md`  
**Total sections**: 21  
**Reference implementations**: 2 complete (BusinessDashboardMobile, LandingPageMobile)  
**Component library**: 7 mobile components documented  
**Ready for**: Campaign creation flow, creator selection, analytics dashboard mobile implementations
```
