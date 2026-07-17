# RevHawk Design System

Source of truth derived from [rev-hawk.com](https://rev-hawk.com/) CSS tokens and visual language, structured per [Material Design 3](https://m3.material.io/) theming (color roles, type scale, shape, elevation, state).

Use this document when redesigning preventive outreach cards and queue screens. Prefer **one continuous light surface language** — avoid split dark-hero / light-body two-tone cards.

---

## 1. Brand principles

| Principle | Meaning for product UI |
|---|---|
| **Loyalty, not alarm** | Urgency is signaled with roles (error / warning), not by flipping the whole card to black. |
| **Insight → action** | Every surface should make the next save action obvious. Primary CTA = mint green fill. |
| **Built for pest control** | Copy and hierarchy favor field reality (visits, techs, CSAT) over generic SaaS chrome. |
| **Light by default** | Marketing and product chrome are warm-light. Dark teal is an accent / chart / illustration role, not the default card ground. |
| **One surface** | Cards, sheets, and lists live on the same light stack. Imagery can sit *on* the surface; it should not create a second UI theme mid-card. |

---

## 2. Color system (M3 roles)

Site tokens are stored as HSL components and applied as `hsl(var(--token))`. Hex values below are converted equivalents for design tools.

### 2.1 Key colors

| Role | Token | HSL | Hex | Usage |
|---|---|---|---|---|
| **Primary** | `--primary` | `155 93% 42%` | `#07CF7C` | CTA fills, focus rings, positive emphasis, “recommended” path |
| **On-primary** | `--primary-foreground` | `200 18% 9%` | `#13181B` | Text/icons on primary buttons (dark on mint, not white) |
| **Error** | `--destructive` | `0 72% 51%` | `#DC2828` | Critical risk, cancel risk, destructive outcomes |
| **On-error** | `--destructive-foreground` | `0 0% 100%` | `#FFFFFF` | Text on error fills |
| **Tertiary / brand deep** | `--dark-teal` | `186 96% 12%` | `#01363C` | Logo-adjacent deep teal; sparingly for charts / emphasis, not full card backgrounds |
| **Tertiary mid** | `--teal-mid` | `187 52% 46%` | `#38A4B2` | High-risk (non-critical) badges, secondary data accents |
| **Tertiary light** | `--teal-light` | `189 82% 67%` | `#66DBF0` | Illustrative highlights only |
| **Primary container** | `--mint-bg` | `155 60% 96%` | `#EFFBF6` | Soft recommended / selected path backgrounds |
| **Primary container bright** | `--mint-light` | `155 94% 65%` | `#52FAB4` | Glow / success pulses (marketing); use lightly in product |

### 2.2 Surfaces & neutrals

| Role | Token | HSL | Hex | Usage |
|---|---|---|---|---|
| **Background** | `--background` | `40 30% 98%` | `#FBFAF8` | App / page canvas (warm off-white) |
| **Surface / card** | `--card` | `0 0% 100%` | `#FFFFFF` | Cards, sheets, dialogs |
| **On-surface** | `--foreground` / `--card-foreground` | `200 18% 9%` | `#13181B` | Primary text |
| **Surface variant** | `--muted` / `--secondary` | `40 16% 94%` / `40 20% 95%` | `#F2F1ED` / `#F5F3F0` | Nested wells, table header, accordion idle |
| **Surface accent** | `--accent` | `36 36% 95%` | `#F7F3EE` | Warm tinted panels, quote wells |
| **On-surface variant** | `--muted-foreground` | `210 10% 38%` | `#57616B` | Secondary body, meta |
| **On-surface tertiary** | `--text-tertiary` | `210 8% 52%` | `#7B858E` | Captions, timestamps, disabled-adjacent |
| **Outline** | `--border` / `--input` | `210 16% 90%` | `#E1E6EA` | Hairlines, inputs, card borders |
| **Focus ring** | `--ring` | `155 93% 42%` | `#07CF7C` | Keyboard / focus — same as primary |

### 2.3 Risk semantic mapping (product)

Use these for outreach severity — **never** by painting the whole card dark.

| Risk | Badge text | Fill / outline | Text |
|---|---|---|---|
| **Critical** | Critical · {score} | Error container: `#DC2828` @ 10–12% fill, or solid badge with on-error text | `#DC2828` label or white on solid |
| **High** | High · {score} | Teal mid @ 12% fill / `#38A4B2` text | `#38A4B2` |
| **Moderate** | Moderate · {score} | Muted fill `#F2F1ED`, outline `#E1E6EA` | `#57616B` |
| **Recommended path** | Recommended | Mint bg `#EFFBF6`, outline primary @ 20–30% | Primary `#07CF7C` labels |

### 2.4 Color rules

1. **One intense accent moment per view** — primary mint *or* destructive red, not both competing at the same visual weight.
2. **Primary buttons use dark ink on mint** (`on-primary` = `#13181B`), matching the site — do not default to white-on-green.
3. **No black card shells** for the default product state. Deep teal / black is reserved for marketing heroes and optional full-screen map overlays, not queue cards.
4. **Imagery** (satellite, home) sits on the white card with a soft light fade into the card surface — fade *to white/background*, not to black.
5. Maintain WCAG AA for text: body on white ≥ 4.5:1; large display type ≥ 3:1.

---

## 3. Typography (M3 type scale)

### 3.1 Families

| Role | Family | Source | Notes |
|---|---|---|---|
| **Display / headline** | **Clash Display** | Fontshare (`clash-display@400,500,600,700`) | Brand display — stakes lines, section titles |
| **Body / UI** | **Inter** | System / Google Fonts stack | All UI chrome, data, buttons, meta |
| **Fallback** | `system-ui, sans-serif` | — | Always present in stack |

Stack as used on site:

```css
--font-display: "Clash Display", Inter, system-ui, sans-serif;
--font-body: Inter, system-ui, sans-serif;
```

Do **not** introduce Fraunces, serif italics, or other display faces for product UI unless marketing expressly requires it. RevHawk’s product voice is Clash + Inter.

### 3.2 Type scale (roles)

Sizes adapted to dense retention UI while preserving M3 role names.

| Role | Family | Size | Weight | Line height | Tracking | Use |
|---|---|---|---|---|---|---|
| **Display small** | Clash Display | 28–32px | 600–700 | 1.15 | -0.02em | Queue page title (“7 accounts need a call”) |
| **Headline medium** | Clash Display | 22–24px | 600 | 1.25 | -0.02em | Card stakes headline |
| **Headline small** | Clash Display | 18–20px | 600 | 1.3 | -0.015em | Expanded section titles (rare) |
| **Title medium** | Inter | 14–16px | 600 | 1.35 | 0 | Path names, customer name in dense rows |
| **Title small** | Inter | 13px | 600 | 1.35 | 0 | Accordion headers |
| **Body large** | Inter | 15–16px | 400 | 1.5 | 0 | Opener script, primary supporting sentence |
| **Body medium** | Inter | 13–14px | 400 | 1.45 | 0 | Why-spine rows, protocol steps |
| **Body small** | Inter | 12px | 400 | 1.4 | 0 | Meta (value, tenure, agent) |
| **Label large** | Inter | 12px | 700 | 1.2 | 0.08–0.12em | Uppercase risk / section labels |
| **Label medium** | Inter | 11px | 700 | 1.2 | 0.12em | Badge chips, “Recommended” |
| **Label small** | Inter | 10–11px | 600 | 1.2 | 0.08em | Table column headers |

### 3.3 Type rules

1. Clash Display for **story stakes only** (1 headline per card). Everything else is Inter.
2. Uppercase labels use Inter + wide tracking — never Clash in all-caps.
3. Opener / script uses Inter medium italic or regular at body-large — not a second display face.
4. Avoid decorative mixed serif/sans stacks; they fight the brand.

---

## 4. Shape

| Token | Value | Use |
|---|---|---|
| `--radius` (md) | `0.5rem` / **8px** | Default buttons, inputs, chips |
| Radius sm | `6px` (`radius - 2`) | Dense badges |
| Radius lg | `12px` (`radius + 4`) | Cards, stat cards, sheets |
| Radius xl | `16px` (`radius + 8`) | Large marketing panels |
| Radius 2xl / 3xl | `24px` / `1.5rem` | Hero marketing only |
| Pill | `9999px` | Soft filter chips (sparingly) |

**Product cards:** prefer **12px** outer radius, **8px** inner controls. Avoid sharp 0px editorial edges and heavy 24px “soft SaaS” cards in the agent queue.

---

## 5. Elevation & borders

Site language is mostly **border + flat fill**, not heavy drop shadows.

| Level | Treatment | Use |
|---|---|---|
| **0** | No border, canvas `#FBFAF8` | Page |
| **1** | `1px` `#E1E6EA` border on `#FFFFFF` | Default card / list item |
| **2** | Level 1 + `shadow-sm` / soft primary glow @ 10% | Hover / focused card |
| **3** | Dialog / map overlay scrim | Modal map view |

Rules:

- Default queue cards = Level 1 (border, no shadow).
- Selected / expanded card may use a primary outline at 20–30% or a 1.5px primary border — not a black frame.
- Avoid multi-layer neon glows in the product UI; reserve glow for marketing.

---

## 6. Spacing

Use an **8px** base grid (Material default), with 4px for dense meta.

| Token | px | Use |
|---|---|---|
| space-1 | 4 | Icon gaps, badge padding y |
| space-2 | 8 | Compact stack gaps |
| space-3 | 12 | Accordion row padding |
| space-4 | 16 | Card internal section gaps |
| space-5 | 20 | Card padding (comfortable) |
| space-6 | 24 | Card padding (default), section breaks |
| space-8 | 32 | Between cards in a queue |
| space-10 | 40 | Page header → list |

**Queue list:** card width ~640–680px centered (or fluid in a content column); vertical gap **16–24px** between cards.

---

## 7. Motion

Keep motion quiet and functional (Material easing).

| Token | Value | Use |
|---|---|---|
| Duration short | 150ms | Hover, badge |
| Duration medium | 250–300ms | Accordion expand / collapse |
| Duration long | 400ms | Map expand |
| Easing standard | `cubic-bezier(0.2, 0, 0, 1)` | Default |
| Easing emphasized | `cubic-bezier(0.2, 0, 0, 1)` | Card open |

Accordion content should **expand in place** in the list (height animation), not navigate away, unless opening a full map overlay.

---

## 8. Component recipes (outreach)

### 8.1 Queue card — collapsed (default)

Single light surface. No dark band.

```
┌─────────────────────────────────────────────┐  ← white card, 12px radius, border
│  [Critical · 86]     $1,240 / 14mo · —      │  ← label + meta
│                                             │
│  Hernandez Residence is about to give up.   │  ← Clash Display headline
│  Three failed visits. Maria feels unheard.  │  ← Inter body
│                                             │
│  [ Start the rescue → ]   Details    Map    │  ← primary filled + text buttons
└─────────────────────────────────────────────┘
```

Optional: thin full-width satellite **strip** (max ~120–140px) at top of card with a **white fade** into the card body. Pin uses destructive red. Do not put primary text on the photo without the fade.

### 8.2 Queue card — expanded

Same shell. Sections separated by `#E1E6EA` hairlines, not nested black boxes:

1. **Why this surfaced** — dated spine (Inter)
2. **What to say first** — script in accent well `#F7F3EE` or muted `#F2F1ED`
3. **Rescue paths** — A in mint container; B/C as plain rows with save% · cost

Primary CTA remains mint throughout. Collapse control is a text button (`muted-foreground`).

### 8.3 Map view

Full-bleed imagery is allowed as an **overlay / third state**, not as the default card theme. Bottom sheet = white Level 1 surface with the same type and CTAs. Close returns to the light card.

### 8.4 Buttons

| Type | Fill | Text | Border |
|---|---|---|---|
| **Primary** | `#07CF7C` | `#13181B` | none |
| **Secondary** | transparent / `#F5F3F0` | `#13181B` | `#E1E6EA` |
| **Text** | none | `#57616B` | none |
| **Destructive** | `#DC2828` | `#FFFFFF` | none |

Height: ~36–40px for card CTAs. Radius: 8px. Label: Inter 13px / 700.

### 8.5 Badges / chips

- Height ~22–24px, radius 6–8px, Inter label-medium.
- Risk colors per §2.3. Signal tags use muted fill + outline (match table UI on site / CRM exports).

---

## 9. Layout patterns

### Queue screen

- Canvas: `--background` `#FBFAF8`
- Header on white with bottom border
- Centered column 640–720px for cards
- Title: Clash Display display-small
- Filters: secondary / muted chips (“Sorted by risk”)

### Do / Don’t (cards)

| Do | Don’t |
|---|---|
| One light surface per card | Black header + white body (two-tone) |
| Mint primary CTA with dark label | White CTA on black or purple accents |
| Clash for one stakes line | Serif / Fraunces / mixed display faces |
| Risk as a badge | Risk as a full-bleed dark theme |
| Fade imagery to white | Fade imagery to black as the card ground |
| Expand in-list with accordions | Nested “card in card in card” stacks |

---

## 10. Token reference (CSS)

Copy-paste foundation matching production site:

```css
:root {
  --background: 40 30% 98%;
  --foreground: 200 18% 9%;
  --card: 0 0% 100%;
  --card-foreground: 200 18% 9%;
  --primary: 155 93% 42%;
  --primary-foreground: 200 18% 9%;
  --secondary: 40 20% 95%;
  --secondary-foreground: 200 18% 9%;
  --muted: 40 16% 94%;
  --muted-foreground: 210 10% 38%;
  --accent: 36 36% 95%;
  --accent-foreground: 200 18% 9%;
  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 100%;
  --border: 210 16% 90%;
  --input: 210 16% 90%;
  --ring: 155 93% 42%;
  --radius: 0.5rem;

  --glow: 155 93% 42%;
  --dark-teal: 186 96% 12%;
  --teal-mid: 187 52% 46%;
  --teal-light: 189 82% 67%;
  --mint-light: 155 94% 65%;
  --mint-bg: 155 60% 96%;
  --text-tertiary: 210 8% 52%;

  --font-display: "Clash Display", Inter, system-ui, sans-serif;
  --font-body: Inter, system-ui, sans-serif;
}
```

---

## 11. Application checklist (next redesign)

When reworking cards 18–20 / the outreach queue:

- [ ] Replace Fraunces with **Clash Display** for headlines only
- [ ] Replace Inter-equivalent (IBM Plex) with **Inter** for UI
- [ ] Collapse default cards onto **white** surface + warm canvas
- [ ] Primary CTA → mint `#07CF7C` with dark label
- [ ] Critical → red badge; High → teal-mid; Moderate → muted gray
- [ ] Recommended path → mint container, not inverted black block
- [ ] Satellite strip fades to **white**, optional and short
- [ ] Map remains a separate overlay state
- [ ] Remove inky / nocturnal two-tone treatments from the product queue

---

*Generated from live site tokens on rev-hawk.com (`:root` in `assets/index-WIAorXFt.css`) and organized using Material Design 3 role conventions.*
