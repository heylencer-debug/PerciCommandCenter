# Brigid Task — Command Center: Tasks Visibility + Branding Section
_Assigned: 2026-02-27 02:47 AM_

## Repo
`C:\Users\Carl Rebadomia\.openclaw\workspace\PerciCommandCenter\`
GitHub: `https://github.com/heylencer-debug/PerciCommandCenter`

## Current files
- `index.html` — main shell
- `style.css` — styles
- `app.js` — all JS logic
- `data/tasks.js` — tasks, Perci status, subagents, activity log
- `data/content.js` — content calendar data

## TWO THINGS TO BUILD

---

### 1. Tasks / Notes — Perci Confirmation Panel

Carlo wants to see: **what has Perci seen, read, and confirmed?**

Add a "Perci's Notes" panel or section to the dashboard. This should show:
- A list of **confirmed reads** — what Perci has recently read/confirmed (e.g. "Read PROJECT_PERCI_BRAND_IDENTITY.md", "Read MEMORY.md", "Reviewed tasks.js")
- A **"Last sync" timestamp** — when Perci last updated the data
- Any **notes Perci left** about specific tasks (pull from task `notes` field)

In `data/tasks.js`, add a new `window.PERCI_NOTES` object like:

```js
window.PERCI_NOTES = {
  "lastUpdated": "2026-02-27T02:47:00+08:00",
  "confirmedReads": [
    { "file": "PROJECT_PERCI_BRAND_IDENTITY.md", "at": "2026-02-27T02:40:00+08:00", "note": "Brand identity updated: silver chrome, white hook text, powder blue accents. Orange retired." },
    { "file": "MEMORY.md", "at": "2026-02-27T02:40:00+08:00", "note": "Long-term memory loaded. Carlo's preferences, business context, Instagram status all current." },
    { "file": "memory/2026-02-27.md", "at": "2026-02-27T02:40:00+08:00", "note": "Today's notes loaded. V8 carousel in progress, Brigid v2 complete." },
    { "file": "data/tasks.js", "at": "2026-02-27T02:47:00+08:00", "note": "Tasks updated: 9 tasks, accurate statuses, v8 in-progress." },
    { "file": "generate-carousel-v7.js", "at": "2026-02-27T02:45:00+08:00", "note": "V7 script reviewed. V8 created with white hook text + powder blue accent bar + real Filipino people prompt." }
  ],
  "percisNotes": "V8 carousel generating: 6/7 slides done (cover + slides 3-7). Slide 2 failed (Gemini returned no image) — retrying separately. Will send all 7 when complete. Brigid now building branding section."
};
```

In `app.js` and `index.html`: render this as a **"⚔️ Perci's Notes"** card/panel. Show:
- `percisNotes` text at the top (brief summary of what Perci is doing)
- A list of confirmed reads with file name, time, and note (collapsible or scrollable)
- Last updated timestamp

Style: dark panel, monospace font for file names, clean and readable.

---

### 2. Branding Section — Brand Documents per Brand

Carlo handles multiple brands. He needs a **Branding tab** in the Command Center that shows:
- A list of **brands** (for now just ProjectPerciPH)
- When a brand is selected: show its **brand documents** with real content

#### Data: Add `window.BRANDING_DATA` to `data/tasks.js`:

```js
window.BRANDING_DATA = [
  {
    "id": "projectperciph",
    "name": "Project Perci PH",
    "emoji": "🛍️",
    "color": "#FF7A00",
    "tagline": "Personalized gifts, engineered with love.",
    "category": "Personalized embroidery gifts — tote bags, towels, caps, polo shirts",
    "market": "Philippines, starting Cebu City",
    "docs": [
      {
        "id": "visual-identity",
        "title": "🎨 Visual Identity",
        "content": `**Style Formula:**
Silver Chrome + Colored Chrome Wall Panels + Colored Frosted/Clear Glass or Acrylic Dividers (smooth, pleated, matte, glossy) + Dopamine Vibrant Decor + Iridescent/Silver Surfaces + White + Blue Accents

**NOT:** Pure white minimalism. NOT dark warehouse. NOT orange-dominant text. NOT warm/golden.

**Vibe:** Walking into a luxury dopamine-charged gift boutique from the future.`
      },
      {
        "id": "color-palette",
        "title": "🌈 Color Palette",
        "content": `**Text Overlays (Social):**
- Hook text: White #FFFFFF (90px+, bold)
- Subtext: White #FFFFFF (42px)
- Accent bar: Powder Blue #A8D8F0
- Border: Iridescent rainbow gradient
- NO orange in overlays

**UI / Dashboard:**
- Coral Red: #E94560 (dashboard only)
- Navy: #1A1A2E

**Products:**
- Neon Poppy (bright red-orange)
- Electric Grape (vivid purple)
- Hot Coral
- Acid Lime
- Soft Lilac
- Peach Fizz
- Baby Blue

**Packaging:**
- Outer: Iridescent or silver metallic mailer
- Inner: Powder blue tissue paper + baby pink ribbon
- Seal: Holographic Project Perci sticker`
      },
      {
        "id": "photography",
        "title": "📸 Photography Style",
        "content": `**Environment:** Silver chrome + colored chrome wall panels. Colored frosted/clear acrylic dividers. Dopamine vibrant decor. Iridescent surfaces.

**People:** Real Filipino people, 20-40yo. Genuine candid emotions — mid-laugh, actual tears, real surprise. NOT AI faces, NOT stock poses, NOT perfect symmetry. iPhone/mirrorless feel with natural depth of field.

**Products:** Neon/bold embroidered items as dopamine hero. Always show: tote bags, towels, caps, polo shirts — never generic gift boxes.

**Lighting:** Cool balanced (5500-6500K). NOT warm, NOT golden. Chrome reflections add sparkle.

**Logo:** "PROJECT PERCI PH" — white, bold, bottom-right corner, every image.`
      },
      {
        "id": "embroidery-style",
        "title": "🧵 Embroidery Style",
        "content": `**NOT:** Plain name/text only (e.g. just "SOFIA" in orange)

**YES — Creative Embroidery Art:**
- Pet portraits (golden retriever, tabby cat, etc.)
- Vectorized face portraits
- Couple silhouettes
- Family portraits
- Baby portraits

**Brand differentiator:** "We turn your people and pets into wearable art"

**Thread quality:** Individual stitch textures visible. Museum-quality detail. Layered fur, realistic eyes, delicate features.`
      },
      {
        "id": "social-strategy",
        "title": "📱 Social Strategy",
        "content": `**Platform:** Instagram @projectperciph (0 posts, launching soon)
**Facebook:** Page creation pending (Carlo must create manually)

**Content Plan:**
- Days 1-29: Educational only (no promotions)
- Day 30: First promotional post
- 5 pillars: Art of Gifting, Craft & Process, Filipino Gift Culture, Gift Inspo, Behind the Brand

**Audience:** Gift-givers — NOT embroidery/craft enthusiasts

**Carousel spec:** 1080×1080px, 7 slides, cool-toned
**Approval:** Carlo approves EVERY post before it goes live`
      },
      {
        "id": "reference-brand",
        "title": "🔗 Reference Brand",
        "content": `**Beyond The Vines (BTV)** — beyondthevines.com
Study: product photography, contrast pairings, label design, editorial clean aesthetic`
      }
    ]
  }
];
```

#### UI: Add a **"Branding" tab** to the top navigation (alongside existing tabs like Kanban, Activity, etc.)

When the Branding tab is active:
- Show brand cards on the left (just ProjectPerciPH for now)
- When a brand card is clicked: show its docs on the right as expandable sections/cards
- Each doc card shows title + content (markdown-rendered or just pre-formatted)
- Style: clean, dark background, colored left border matching brand color
- Use the existing design system (dark cards, white text, same fonts/colors as the rest of the dashboard)

---

## After building:
1. Push to GitHub: `git add -A && git commit -m "feat: Perci notes panel + Branding section" && git push`
2. Run: `node -e "require('child_process').execSync('openclaw system event --mode now --text \"✅ Brigid done: Perci Notes + Branding section built and pushed\"', {stdio:'inherit'})"`

## Notes
- Pure HTML/CSS/Vanilla JS only. No frameworks.
- All new data goes in `data/tasks.js` (window globals).
- Keep existing functionality intact — don't break Kanban, Activity, etc.
- The dashboard is file:// compatible (no fetch calls).
