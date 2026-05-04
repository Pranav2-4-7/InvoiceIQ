# InvoiceIQ — Comprehensive Fintech Dashboard

Build a production-quality Next.js 14 invoice management platform for Indian SMEs and freelancers, featuring 10 integrated financial modules with AI-powered invoice parsing, fraud detection, and GST compliance.

## Design System

The UI follows the **Monolith Fintech B&W** design system extracted from Stitch:
- **Base**: Pure black `#000000` canvas with `#121212` card surfaces
- **Borders**: `#262626` structural borders, no shadows
- **Typography**: Inter font, tight tracking for headings, generous line-height for body
- **Accents**: White-only for primary actions and critical data
- **Shapes**: 12px-16px corner radius on containers

> [!IMPORTANT]
> The user explicitly requests **Tailwind CSS** — I'll integrate the B&W design tokens directly into `tailwind.config.ts`.

## User Review Required

> [!WARNING]
> **Environment Variables**: The app requires `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`, and `OPEN_EXCHANGE_RATES_API_KEY`. Without these, API routes will fail gracefully with demo/mock data fallbacks.

> [!IMPORTANT]
> **Supabase Database**: The SQL schema must be created manually in Supabase. I will provide the seed script but cannot auto-create the tables. The app will work with mock/demo data if Supabase is not connected.

> [!IMPORTANT]
> **Scope**: This is a ~50+ file project. I will build every feature with working demo data and real API integration points. All API routes that depend on Claude/Supabase will gracefully fall back to mock responses when env vars are missing.

## Open Questions

1. **Supabase project**: Do you have a Supabase project set up already, or should I build everything with mock data first and you'll connect Supabase later?
2. **Claude API key**: Is the Anthropic API key available for testing, or should the invoice parser use a simulated response?
3. **Deployment**: Should I configure Vercel deployment settings, or is local development sufficient for now?

---

## Proposed Changes

### Phase 1: Project Scaffolding & Core Infrastructure

#### [NEW] Project initialization
- Initialize Next.js 14 with App Router, TypeScript, Tailwind CSS
- Configure the Monolith B&W design tokens in `tailwind.config.ts`
- Set up project structure per the spec

#### [NEW] [tailwind.config.ts](file:///c:/AntiGravity/invoiceiq/tailwind.config.ts)
- Extended color palette matching Stitch B&W design system
- Custom typography scale (headline-xl, headline-lg, headline-md, body-lg, body-md, label-md, label-sm)
- Custom spacing (unit, gutter, margin, stack-xs through stack-xl)

#### [NEW] [app/globals.css](file:///c:/AntiGravity/invoiceiq/app/globals.css)
- Global styles: scrollbar, body background, Material Symbols import
- Custom utility classes

#### [NEW] [types/index.ts](file:///c:/AntiGravity/invoiceiq/types/index.ts)
- TypeScript interfaces for Invoice, Vendor, LedgerEntry, FraudAlert, Subscription, Reconciliation, etc.

---

### Phase 2: Library Layer

#### [NEW] [lib/supabase.ts](file:///c:/AntiGravity/invoiceiq/lib/supabase.ts)
- Supabase client initialization with env check
- Falls back to null if env vars missing

#### [NEW] [lib/claude.ts](file:///c:/AntiGravity/invoiceiq/lib/claude.ts)
- Claude API wrapper using `@anthropic-ai/sdk`
- `parseWithClaude()` function for invoice/document parsing
- Graceful fallback with mock responses

#### [NEW] [lib/gst.ts](file:///c:/AntiGravity/invoiceiq/lib/gst.ts)
- `calculateGST()` with state-based CGST/SGST vs IGST logic
- GST slab detection (5%, 12%, 18%, 28%)
- GSTR-1 report generator
- Compliance score calculator

#### [NEW] [lib/fraud.ts](file:///c:/AntiGravity/invoiceiq/lib/fraud.ts)
- Duplicate invoice detection
- Price spike analysis
- New vendor high-value flagging
- Unusual payment terms detection

#### [NEW] [lib/demo-data.ts](file:///c:/AntiGravity/invoiceiq/lib/demo-data.ts)
- 15 sample invoices with Indian vendor names, GSTINs, addresses
- 3 fraud alerts (high, medium, low)
- 5 subscriptions (AWS, Figma, Notion, Slack, Zoom)
- Ledger entries and reconciliation data

---

### Phase 3: Layout & Navigation

#### [NEW] [app/layout.tsx](file:///c:/AntiGravity/invoiceiq/app/layout.tsx)
- Root layout with Sidebar navigation
- Inter font from Google Fonts
- Global providers (Toaster)

#### [NEW] [components/Sidebar.tsx](file:///c:/AntiGravity/invoiceiq/components/Sidebar.tsx)
- Fixed 256px sidebar with navigation items matching Stitch design
- Material Symbols Outlined icons
- Active state highlighting
- "New Transaction" CTA button
- Support & Settings links

---

### Phase 4: Feature Pages & Components

#### Dashboard (app/page.tsx)
- Hero banner with financial integrity score
- 4-card stats grid (Total Invoices, Receivable, Overdue, GST Liability)
- Invoice Aging Analysis chart (Recharts BarChart)
- Recent Invoices table
- Fraud Alerts sidebar panel
- GST Compliance footer section

#### Invoice Upload (app/upload/page.tsx)
- Drag-and-drop file upload zone
- AI parsing status indicator
- Extracted data preview with editable fields
- Confirm & Save to Ledger button
- Recent uploads table

#### Ledger (app/ledger/page.tsx)
- GST Liability summary card
- Filter bar with time ranges and download/print buttons
- 4-card stat row (Debit Volumes, Credit Volumes, Pending Approvals, Fraud Score)
- Full ledger table with vendor avatars, categories, status, amounts
- Pagination
- Financial performance chart
- Quick actions grid

#### GST Compliance (app/gst/page.tsx)
- Filing period selector
- Compliance Health Score (circular progress)
- GSTR-1 Summary Preview (B2B, B2C Large, Export sections)
- Compliance checks table with status badges
- Download Report & Sync GST Portal actions

#### Fraud Detection (app/fraud/page.tsx)
- 4-card stat row (Risk Score, Active Alerts, Blocked Txns, Savings Impact)
- Analytical banner with network visualization
- High-priority alert cards (High/Medium/Low severity)
- Security Event Log timeline
- Footer with system status

#### Reconciliation (app/reconcile/page.tsx)
- 3-way upload zones (PO, GRN, Invoice)
- Side-by-side comparison table
- Match/mismatch indicators
- Field-level difference highlighting

#### Multi-Currency (app/multi-currency/page.tsx)
- Currency converter with live rates
- Conversion fee estimate
- 7-day rate trend chart
- High-volatility currency warnings

#### Invoice Financing (app/financing/page.tsx)
- Calculator inputs (amount, due date, urgency)
- Available advance, fee, total repayable
- 3 mock lender comparison cards
- Break-even analysis chart

#### Expense Splitting (app/split/page.tsx)
- Invoice/amount selector
- Participant management
- Split modes (Equal, Custom, Percentage)
- Settlement optimization table
- Shareable summary

#### Subscription Tracker (app/subscriptions/page.tsx)
- Total monthly burn rate display
- Subscription CRUD
- Donut chart by category
- Sort/filter by amount, due date, category

---

### Phase 5: API Routes

#### [NEW] [app/api/parse-invoice/route.ts](file:///c:/AntiGravity/invoiceiq/app/api/parse-invoice/route.ts)
- Accept multipart form data
- Convert to base64, send to Claude
- Parse response, save to Supabase
- Return parsed data with mock fallback

#### [NEW] [app/api/detect-fraud/route.ts](file:///c:/AntiGravity/invoiceiq/app/api/detect-fraud/route.ts)
- Run all 4 fraud checks
- Send findings to Claude for severity rating
- Save alerts to fraud_alerts table

#### [NEW] [app/api/gst-report/route.ts](file:///c:/AntiGravity/invoiceiq/app/api/gst-report/route.ts)
- Generate quarterly GST report
- GSTR-1 format output

#### [NEW] [app/api/reconcile/route.ts](file:///c:/AntiGravity/invoiceiq/app/api/reconcile/route.ts)
- Accept 3 document uploads
- Parse with Claude, compare fields
- Return mismatch report

#### [NEW] [app/api/fx-rate/route.ts](file:///c:/AntiGravity/invoiceiq/app/api/fx-rate/route.ts)
- Fetch from Open Exchange Rates
- 1-hour caching
- Return rates with conversion calculations

#### [NEW] [app/api/financing/route.ts](file:///c:/AntiGravity/invoiceiq/app/api/financing/route.ts)
- Calculate advance, fees, repayable amounts
- Return 3 lender options

---

### Phase 6: Components

All components following the Stitch B&W design system:

| Component | Purpose |
|---|---|
| `InvoiceUpload.tsx` | Drag-drop zone with progress |
| `ParsedInvoicePreview.tsx` | Editable extracted data form |
| `LedgerTable.tsx` | Sortable/filterable transactions |
| `FraudAlertCard.tsx` | Alert severity cards |
| `ReconciliationTable.tsx` | Side-by-side comparison |
| `GSTSummary.tsx` | Compliance score + filing data |
| `CurrencyConverter.tsx` | Currency conversion widget |
| `FinancingCalculator.tsx` | Financing estimation form |
| `ExpenseSplitter.tsx` | Split mode calculator |
| `SubscriptionCard.tsx` | Subscription entry card |

---

## Verification Plan

### Automated Tests
```bash
npm run build     # Verify TypeScript compilation
npm run lint      # Verify ESLint passes
npm run dev       # Start dev server and verify all routes
```

### Manual Verification
- Navigate to each of the 10 feature pages in the browser
- Verify the B&W Monolith design system renders correctly
- Test invoice upload flow with mock data
- Verify charts render with Recharts
- Test responsive layout at mobile/tablet/desktop breakpoints
- Verify toast notifications on form submissions
- Test CSV export from ledger page

### Browser Testing
- Use browser subagent to navigate all pages
- Screenshot each page for visual verification
- Record a walkthrough video
