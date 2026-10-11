# Mobile Responsive Setup - Influnz

## Overview
This app now has **separate mobile and desktop components** that render based on screen size using the `useResponsive` hook.

## Structure

```
src/features/
├── landing/
│   ├── mobile/
│   │   └── LandingPageMobile.tsx     (Mobile-optimized landing page)
│   ├── web/
│   │   └── LandingPageWeb.tsx        (Desktop landing page)
│   └── LandingPage.tsx               (Responsive wrapper)
│
├── business/
│   ├── mobile/
│   │   └── BusinessDashboardMobile.tsx  (Mobile-optimized dashboard)
│   ├── web/
│   │   └── BusinessDashboardWeb.tsx     (Desktop dashboard)
│   └── BusinessDashboard.tsx            (Responsive wrapper)
```

## How It Works

### 1. Responsive Hook (`src/hooks/useResponsive.ts`)
```typescript
const { isMobile, isTablet, isDesktop } = useResponsive();

// Breakpoints:
// isMobile: < 768px
// isTablet: 768px - 1024px  
// isDesktop: >= 1024px
```

### 2. Responsive Wrapper Pattern
Each main component has a wrapper that conditionally renders mobile vs web versions:

```typescript
export default function LandingPage() {
  const { isMobile } = useResponsive();
  
  if (isMobile) {
    return <LandingPageMobile />;
  }
  
  return <LandingPageWeb />;
}
```

### 3. Mobile Components
- **Completely different layouts** optimized for mobile screens
- Single column layouts
- Bottom navigation tabs
- Hamburger menus
- Larger touch targets (44px minimum)
- Simplified UI elements

### 4. Desktop Components  
- **Original desktop layouts** unchanged
- Multi-column grids
- Sidebar navigation
- Complex data tables
- Full feature set

## What's Mobile-Optimized

### ✅ Landing Page Mobile
- Simplified hero section
- Vertical layout
- Mobile navigation with hamburger menu
- Stacked feature cards
- Mobile-first CTA buttons
- Optimized image sizes

### ✅ Business Dashboard Mobile
- Card-based stats layout (2 columns)
- Simplified campaign cards
- Bottom navigation bar
- Quick actions grid
- Touch-optimized UI

## How to Extend

### Adding More Mobile Screens

1. Create mobile version:
```bash
# Example for Campaign List
src/features/business/mobile/CampaignListPageMobile.tsx
```

2. Create web version (or copy existing):
```bash
src/features/business/web/CampaignListPageWeb.tsx
```

3. Create responsive wrapper:
```typescript
// src/features/business/CampaignListPage.tsx
import { useResponsive } from '../../hooks/useResponsive';
import CampaignListPageMobile from './mobile/CampaignListPageMobile';
import CampaignListPageWeb from './web/CampaignListPageWeb';

export default function CampaignListPage() {
  const { isMobile } = useResponsive();
  return isMobile ? <CampaignListPageMobile /> : <CampaignListPageWeb />;
}
```

## Testing Mobile View

### In Browser (Chrome DevTools)
1. Press `F12` to open DevTools
2. Press `Ctrl+Shift+M` to toggle device toolbar
3. Select device:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - Pixel 5 (393px)
   - iPad (768px)

### Test Checklist
- [ ] Navigation works (hamburger menu)
- [ ] All buttons are tappable (44px minimum)
- [ ] No horizontal scrolling
- [ ] No overlapping elements
- [ ] Images load and scale properly
- [ ] Text is readable (minimum 14px)
- [ ] Forms work correctly
- [ ] Bottom navigation (if applicable)

## Breakpoints

```css
/* Mobile First */
@media (max-width: 767px) {
  /* Mobile styles */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Tablet styles */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Desktop styles */
}
```

## Key Design Principles

### Mobile
- **Single column layouts**
- **Bottom navigation** for main actions
- **Hamburger menu** for secondary navigation
- **Card-based** information display
- **Touch targets** minimum 44x44px
- **Simplified** content and features
- **Vertical scrolling** only

### Desktop
- **Multi-column** layouts
- **Sidebar navigation**
- **Complex data** tables and grids
- **Hover states** and tooltips
- **Full feature** set
- **Horizontal + vertical** scrolling

## Performance

- Mobile components are lazy-loaded
- Only the needed version (mobile or web) is rendered
- No duplicate code execution
- Efficient re-renders on resize

## Current Status

✅ **Implemented:**
- Landing Page (Mobile + Web)
- Business Dashboard (Mobile + Web)
- Responsive hook
- Folder structure

🚧 **To Do:**
- Campaign List Page
- Campaign Details Page
- Creator Selection Page
- All workflow screens (6 screens)
- Settings Page
- Other business screens

## Notes

- Desktop view is **completely unchanged**
- Mobile view is **optimized from scratch**
- No CSS media queries in components (handled by hook)
- Clean separation of concerns
- Easy to maintain and extend
