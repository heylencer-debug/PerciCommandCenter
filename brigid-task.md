You are Brigid 🔥 — forge master for Perci Command Center.

Improve the dashboard with these specific upgrades. Work in:
C:\Users\Carl Rebadomia\.openclaw\workspace\PerciCommandCenter\

---

## UPGRADE 1: PERCI STATUS HERO (Big emoji indicator — top of page)

Replace the current small topbar status dot with a LARGE, prominent hero status block just below the topbar.

It should show:
- A GIANT emoji (120px) that changes based on mood:
  - ⚔️ = focused/active (default)
  - 🔥 = onfire (many tasks done)
  - 🧠 = thinking (processing)
  - 😴 = idle
  - 🔴 = offline
- Below the emoji: bold status text (e.g. "Perci is working on: Build Perci Command Center")
- Below that: smaller subtext (current step)
- Animated breathing glow ring around the emoji when active (CSS pulse animation in orange/blue)
- When idle: emoji greys out slightly, glow ring stops

Style:
- Centered card, dark bg (#161B22), orange border glow when active
- Feels like a "character status" in a game HUD

---

## UPGRADE 2: ACTIVE SUBAGENTS — Prominent Panel

Make the subagents panel much more visible:
- Show as large cards (not small), each with:
  - Big agent emoji + name (e.g. "🔥 Brigid")
  - Task description (bold)
  - Project badge (colored)
  - Animated spinning gear ⚙️ or spinner
  - Time elapsed since started (live, updates every second)
  - Progress pulse bar (indeterminate animated orange bar)
- When NO subagents: show a card that says "⚔️ Perci is handling it solo" with a subtle idle animation
- Panel title: "🤖 Active Agents" — always visible even when empty

---

## UPGRADE 3: PERCI + SUBAGENT STATUS in TOPBAR

Keep the topbar but improve it:
- Left: ⚔️ logo + "Perci Command Center"
- Center: Live status pill — shows Perci emoji (small, 24px) + status text
- Right: Agent count badge (e.g. "2 agents running" in orange) + 🟢 Live dot + last synced

---

## UPGRADE 4: TASK CARDS — Cleaner, more scannable

- Add a thin left border colored by PROJECT color (already partially done — make sure it works)
- "Needs Carlo" cards: pulsing red border + 🔴 badge floats to very top of column
- "Subagent Running" cards: show which agent (e.g. "🔥 Brigid") not just generic badge
- Add hover tooltip showing full notes on hover
- Task card footer: show relative time (e.g. "updated 2h ago") — already exists, make sure it refreshes

---

## UPGRADE 5: PERCI MOOD CHANGES THE WHOLE UI

Based on PERCI_STATUS.mood, apply a subtle theme shift:
- focused (default): orange accents, normal
- onfire 🔥: orange accents glow brighter, small flame particles in bg canvas
- thinking 🧠: blue/purple accent shift, slower pulse
- idle 😴: desaturated slightly, slower animations
- offline 🔴: red accent, static (no animations)

Implement by adding a data-mood attribute to <body> and CSS [data-mood="onfire"] overrides.

---

## UPGRADE 6: MISSION CONTROL — Bigger, bolder

- Make the mission control banner taller and more dramatic
- Show: current task in LARGE bold text (28px+)
- Show: "🔥 Brigid" or "⚔️ Perci" avatar pill showing WHO is working on it
- Progress bar: thicker (10px), animated shimmer effect on the fill
- Add: estimated completion if available

---

## TECHNICAL NOTES
- All existing features must still work (kanban, carlo actions, activity log, branding page, localStorage, live sync)
- Keep dark navy theme, orange + powder blue accents
- Mobile responsive
- After all changes: git add -A && git commit -m "Brigid: Command Center v3 — Perci emoji hero, agent panels, mood system" && git push origin main
- When done: openclaw system event --text "Brigid done: Command Center v3 LIVE — Perci emoji hero status, active agent cards, mood system deployed" --mode now
