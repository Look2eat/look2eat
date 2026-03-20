# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Look2Eat is a restaurant loyalty program application built with Next.js 15 and React 19. The app provides:
- **Dashboard**: Analytics and KPIs for restaurant owners (sales, rewards, customer repeat rate, feedback)
- **Cashier Portal**: Customer lookup, OTP verification, and loyalty redemption for POS staff
- **Public Loyalty Pages**: Customer-facing pages showing points, rewards, and redemption instructions

## Architecture

### Monorepo Structure
- `frontend/`: Next.js 15 application (App Router)
- `backend/`: Backend API (currently empty - placeholder for future implementation)

### Frontend Tech Stack
- Next.js 15.5.9 with App Router
- React 19.1.0
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui components (Radix UI primitives)
- Recharts for dashboard charts
- Framer Motion for animations

### Path Aliases
The project uses `@/*` alias mapping to `frontend/src/*` (configured in `tsconfig.json`).

## Common Commands

```bash
# From the frontend directory
cd frontend

# Development
npm run dev          # Start dev server on http://localhost:3000

# Build & Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## Key Directories

```
frontend/src/
├── app/                    # Next.js App Router pages
│   ├── cashier/           # Cashier portal (split layout)
│   ├── dashboard/         # Analytics dashboard with sidebar layout
│   ├── loyalty/[slug]/    # Public loyalty pages
│   └── layout.tsx         # Root layout with ThemeProvider
├── components/
│   ├── cashier/           # Cashier portal components
│   ├── customer/          # Customer-facing mobile components
│   ├── dashboard/         # Dashboard KPI cards and charts
│   └── ui/                # shadcn/ui base components
├── lib/
│   ├── mockDashboardApi.ts  # Mock dashboard stats API
│   ├── mockSalesApi.ts      # Mock sales analytics API
│   └── utils.ts             # cn() utility for class merging
└── types/
    ├── customer.ts         # Customer and Reward types
    └── rewards.ts          # Reward type definitions
```

## Mock Data Layer

The app currently uses mock APIs in `frontend/src/lib/`. These functions simulate async API calls with `setTimeout`:

- `fetchDashboardStats()` - Returns KPI data (sales, rewards, repeat rate, etc.)
- `fetchMonthlySales()` - Returns monthly revenue data
- `mockRepeatRate()` - Returns customer visit frequency data

When implementing real APIs, replace these with actual API calls while maintaining the same interface.

## Routing Patterns

- **Dashboard**: `/dashboard` - Uses `SidebarProvider` layout with `AppSidebar`
- **Cashier**: `/cashier` - Split layout using `CashierLayout` component
- **Loyalty**: `/loyalty/[restaurantSlug]` - Public customer view
- **Loyalty with User**: `/loyalty/[restaurantSlug]/[userID]` - Customer-specific view

## UI Component Patterns

### shadcn/ui Base Components
Located in `components/ui/` - these are Radix UI primitives styled with Tailwind. Use existing components from here when building new features.

### Class Utility
Use the `cn()` function from `lib/utils.ts` for conditional class merging:

```tsx
import { cn } from "@/lib/utils"

<div className={cn("base-class", isActive && "active-class")} />
```

### Theme Support
The app uses `next-themes` with dark mode support. Wrap new pages with `ThemeProvider` or ensure they're under the root layout.

## Data Flow Patterns

### Dashboard
1. Page loads → `useEffect` calls mock API
2. State updates → Child components receive props
3. Charts render with Recharts components

### Cashier Portal
1. `CustomerPanel` handles customer lookup/OTP
2. `onCustomerChange` callback updates selected customer state
3. `CashierLoyaltyPreview` displays customer's points/rewards
4. `onOtpSuccess` resets the flow for next customer

## Styling

- Tailwind CSS for all styling
- Font: Poppins (primary), Geist Sans/Mono (secondary)
- The project uses Tailwind CSS v4 (no `tailwind.config.js` - config is in `tailwind.config.ts`)
- CSS variables in `app/globals.css` for theming