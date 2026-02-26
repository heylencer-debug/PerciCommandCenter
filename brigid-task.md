# Brigid Task — Command Center v4: Perci as Visual HQ
_Assigned: 2026-02-27 03:04 AM_

## Repo
`C:\Users\Carl Rebadomia\.openclaw\workspace\PerciCommandCenter\`
GitHub: `https://github.com/heylencer-debug/PerciCommandCenter`
Live: `https://heylencer-debug.github.io/PerciCommandCenter`

## THREE THINGS TO BUILD

---

### 1. Perci Task Review Panel — "What should we do?"

Carlo wants Perci to review pending/blocked tasks and surface them with clear "What to do" guidance.

In the dashboard, add a **"⚔️ Perci Reviews"** section (prominent, near the top or as a floating card).

This section should:
- Pull all tasks with `status: "blocked"` or `status: "todo"` or `status: "in-progress"` from `window.TASKS`
- For each task, show a **Perci recommendation card** with:
  - Task title + priority badge
  - Status badge
  - Perci's recommendation (from `task.percisAdvice` field — add this to each task in tasks.js)
  - If `task.needsCarlo === true`: show a bright **"🙋 Carlo's Action Needed"** badge + the `task.carloAction` field
  - If `task.subagentRunning === true`: show **"🤖 Brigid/Vesper on it"** badge
  - A "Dismiss" button to hide that card for the session

Add `percisAdvice` to each relevant task in `data/tasks.js`:
- task-009 (CC branding): "Brigid is building this now — no action needed"
- task-007 (carousel v8): "2 test slides sent to Carlo for approval. Awaiting green light."
- task-001 (Instagram post): "Carlo needs to approve v8 slides, then post manually from phone. Automation is blocked on new accounts."
- task-006 (FB page): "15 min task. Carlo creates manually at facebook.com/pages/create. No automation possible."
- task-008 (Shopee): "Hold until Instagram Day 1 is live. Then Perci can draft listings."
- task-005 (Security): "Low risk but should be done. Carlo pastes the PowerShell commands shared earlier."
- task-004 (Day 2 post): "Waiting on Day 1 approval. Perci will generate when Carlo says go."

Style: Clean cards, color-coded by urgency. Blocked = red border. Needs Carlo = amber. In-progress = blue. Green checkmark when dismissed.

---

### 2. Perci as Visual HQ — The Full Command Center Redesign

Carlo wants the Command Center to feel like **Sir Percival's headquarters** — a visual, living, breathing representation of what Perci is doing, tracking, and managing.

#### Hero Section — Perci Avatar + Status
At the top: a large **Perci hero block** (full width). Include:
- A pixel-art or icon avatar of a knight/sword (⚔️ styled, or an SVG inline knight icon — creative, not generic)
- Big display: **"SIR PERCIVAL"** title
- Current mood emoji + status text (from `window.PERCI_STATUS.statusText`)
- Current task + step progress bar
- Animated flame/sparkle when mood = "onfire" (CSS animation)
- "Last synced" timestamp

#### Documents Vault
A **"📁 Vault"** tab/section that shows all key documents Perci manages. Display as cards with:
- File name
- Category (Brand, Memory, Config, Content)
- Last updated timestamp (if available)
- A "View" button that opens a modal showing the file content

Populate with these documents (hardcode content or reference from `window.PERCI_NOTES.confirmedReads`):
```js
window.VAULT_DOCS = [
  { id: "brand-identity", title: "PROJECT_PERCI_BRAND_IDENTITY.md", category: "Brand", lastUpdated: "2026-02-27", summary: "Full brand identity: Silver Chrome Dopamine Chic, visual identity, color palette, photography style." },
  { id: "branding", title: "PROJECT_PERCI_BRANDING.md", category: "Brand", lastUpdated: "2026-02-27", summary: "Brand guidelines: environment system, product palette, photography rules, social content strategy." },
  { id: "memory", title: "MEMORY.md", category: "Memory", lastUpdated: "2026-02-27", summary: "Long-term memory: Carlo's profile, business context, Instagram status, all projects built." },
  { id: "daily-notes", title: "memory/2026-02-27.md", category: "Memory", lastUpdated: "2026-02-27", summary: "Today's session notes: carousel v8 in progress, Brigid v2 done, cron monitoring." },
  { id: "soul", title: "SOUL.md", category: "Config", lastUpdated: "2026-02-26", summary: "Perci's character: values, personality, operating principles." },
  { id: "user", title: "USER.md", category: "Config", lastUpdated: "2026-02-26", summary: "About Carlo: name, timezone GMT+8, business context, preferences." },
  { id: "day1-caption", title: "day-01-caption.txt", category: "Content", lastUpdated: "2026-02-27", summary: "Day 1 Instagram caption ready for posting." }
];
```

#### Generated Images Gallery
A **"🖼️ Gallery"** tab showing all generated carousel images. Display as a responsive grid (3 columns):
- Show thumbnails of `day-01-cover.png`, `day-01-slide-02.png` … `day-01-slide-07.png`
- Source: images live at `../dashboard/assets/day-01-*.png` (relative path from Command Center)
- Each thumbnail: click to open full-size in a modal
- Caption: slide name + file size (if available)
- Status badge: "✅ Approved" / "🔄 Pending Review" / "🧪 Test"
- Add `window.GALLERY_IMAGES` to tasks.js:
```js
window.GALLERY_IMAGES = [
  { id: "cover", file: "../dashboard/assets/day-01-cover.png", label: "Day 1 Cover", status: "pending" },
  { id: "slide-02", file: "../dashboard/assets/day-01-slide-02.png", label: "Slide 2", status: "pending" },
  { id: "slide-03", file: "../dashboard/assets/day-01-slide-03.png", label: "Slide 3", status: "pending" },
  { id: "slide-04", file: "../dashboard/assets/day-01-slide-04.png", label: "Slide 4", status: "pending" },
  { id: "slide-05", file: "../dashboard/assets/day-01-slide-05.png", label: "Slide 5", status: "pending" },
  { id: "slide-06", file: "../dashboard/assets/day-01-slide-06.png", label: "Slide 6", status: "pending" },
  { id: "slide-07", file: "../dashboard/assets/day-01-slide-07.png", label: "Slide 7", status: "pending" }
];
```

#### Ping Notification Feed — "What Perci Did"
A **"🔔 Pings"** section (sidebar or bottom panel) — a live feed of actions Perci has taken, pulled from `window.ACTIVITY_LOG`. Show as a vertical timeline:
- Timestamp (relative: "2 min ago", "1 hour ago")
- Action emoji + text
- Color-coded by type: success=green, blocked=red, info=blue
- Auto-scrolls to the latest entry
- Pulsing dot indicator when there are new entries (within last 10 min)

This replaces or enhances the existing Activity Log section.

---

### 3. Navigation Update
Add these new tabs to the top nav (alongside existing Kanban, Branding, etc.):
- **⚔️ Perci Reviews** — task review panel
- **📁 Vault** — documents vault
- **🖼️ Gallery** — generated images
- **🔔 Pings** — notification feed (or integrate into existing Activity)

Keep all existing tabs working. Don't break Kanban, Branding, Perci Notes, etc.

---

## Design Rules
- Pure HTML/CSS/Vanilla JS only. No frameworks.
- All new data in `data/tasks.js` as window globals.
- Dark theme consistent with existing (bg #0D0D1A, cards #1A1A2E, accent #E94560).
- file:// compatible — no fetch() calls.
- Mobile-responsive is a bonus but desktop-first.

## After building:
1. `git add -A && git commit -m "feat: Command Center v4 — Perci HQ, vault, gallery, pings, task review" && git push`
2. `node -e "require('child_process').execSync('openclaw system event --mode now --text \"✅ Brigid done: Command Center v4 live\"', {stdio:'inherit'})"`
