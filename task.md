Redesign this scheduling dashboard UI. Use shadcn/ui components throughout.

VIBE: Tactical operations center. Think Bloomberg Terminal × Vercel Dashboard. Serious, dense, utilitarian — not friendly SaaS. This is a tool for professionals making real decisions.

AESTHETIC:
- Dark mode default, with a clean light mode toggle
- Background: #0a0a0a (dark) / #fafafa (light)
- Font: IBM Plex Mono for all numbers and stats, Geist Sans for labels and body
- Sharp 1px borders everywhere — no soft shadows, no glow
- Accent color: #ef4444 (red) for high risk only. Everything else is monochrome
- No rounded-corner avatar blobs — use small square initials badges instead
- No purple gradients, no coral pinks, no bubbly UI

SIMPLIFICATION (critical):
- Max 3 stat cards on the dashboard — Accuracy, Predictions Today, Cancelled Caught
- Remove the right sidebar entirely — appointment detail opens in a focused drawer on click
- Priority alert section: show ONE client at a time, not a full card with 5 actions
- Today's appointments list: show name, time, risk level badge only — no icons, no subtext
- Pattern Insights: collapse to 2 rows max, visible only on scroll
- Remove inline chat assistant from the main dashboard — move to a floating icon
- Navigation: icon + label only, no active dot indicators

COMPONENTS TO USE (shadcn):
- Card, Badge, Button, Separator for layout
- Sheet for the appointment detail drawer
- Command for the search bar
- Progress for risk indicators (not a donut chart)
- Switch for the light/dark toggle in the nav

RISK DISPLAY:
- High Risk → red Badge, plain percentage text
- Medium Risk → amber Badge
- Low Risk → muted text, no badge
- No circular donut charts — use a single bold number instead

LAYOUT:
- Left sidebar: 200px, flat, no gradient
- Main content: full width, max 3 columns
- No nested panels or split-view by default