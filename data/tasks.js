window.PERCI_STATUS = {
  status: 'active',
  statusText: 'Building Perci Command Center dashboard...',
  mood: 'focused',
  lastUpdated: '2026-02-26T22:30:00+08:00',
  currentTask: 'Build Perci Command Center',
  currentStep: 'Writing dashboard files',
  totalSteps: 5,
  currentStepNum: 4
};

window.SUBAGENTS = [
  // Example — update when real subagents are running
  // { id: 'sa-001', name: 'Claude Code', task: 'Building dashboard', project: 'perci-system', startedAt: '2026-02-26T22:10:00+08:00', status: 'running' }
];

window.PROJECTS = [
  { id: 'projectperciph', name: 'ProjectPerciPH', emoji: '🛍️', color: '#FF7A00' },
  { id: 'instagram', name: 'Instagram', emoji: '📸', color: '#9333EA' },
  { id: 'perci-system', name: 'Perci System', emoji: '⚔️', color: '#3B82F6' },
  { id: 'github-pages', name: 'GitHub Pages', emoji: '🌐', color: '#22C55E' }
];

window.TASKS = [
  {
    id: 'task-001',
    title: 'Post Day 1 Instagram Carousel',
    description: 'Upload approved 7-slide carousel to @projectperciph',
    project: 'instagram',
    status: 'blocked',
    priority: 'high',
    needsCarlo: true,
    subagentRunning: false,
    notes: 'Instagram API returns 412 on brand-new accounts. Must post manually once to warm up the account.',
    carloAction: 'Transfer slides from C:\\igup\\ to phone → post via Instagram app',
    createdAt: '2026-02-26T16:00:00+08:00',
    updatedAt: '2026-02-26T22:00:00+08:00'
  },
  {
    id: 'task-002',
    title: 'Build Perci Command Center',
    description: 'Task management dashboard on GitHub Pages',
    project: 'perci-system',
    status: 'in-progress',
    priority: 'high',
    needsCarlo: false,
    subagentRunning: false,
    notes: 'Building directly — Claude Code sub-agent was not logged in. Perci handling it.',
    createdAt: '2026-02-26T22:08:00+08:00',
    updatedAt: '2026-02-26T22:30:00+08:00'
  },
  {
    id: 'task-003',
    title: 'Fix OpenClaw typebox module',
    description: 'npm install corrupted @sinclair/typebox — openclaw CLI broken (gateway OK)',
    project: 'perci-system',
    status: 'blocked',
    priority: 'medium',
    needsCarlo: false,
    subagentRunning: false,
    notes: 'Gateway still running fine. Only CLI broken. npm install silently fails. Need to investigate root cause.',
    createdAt: '2026-02-26T21:00:00+08:00',
    updatedAt: '2026-02-26T22:00:00+08:00'
  },
  {
    id: 'task-004',
    title: 'Generate Day 2 Instagram Post',
    description: 'Generate & send carousel for Day 2 pre-launch content',
    project: 'instagram',
    status: 'backlog',
    priority: 'medium',
    needsCarlo: false,
    subagentRunning: false,
    notes: 'Waiting for Day 1 to go live first.',
    createdAt: '2026-02-26T22:00:00+08:00',
    updatedAt: '2026-02-26T22:00:00+08:00'
  },
  {
    id: 'task-005',
    title: 'Admin Security Tasks',
    description: 'BitLocker, SMB disable, firewall ports 27000/57669',
    project: 'perci-system',
    status: 'blocked',
    priority: 'low',
    needsCarlo: true,
    subagentRunning: false,
    notes: 'Paste-ready PowerShell provided. Waiting for Carlo to run as admin.',
    carloAction: 'Run admin PowerShell commands for BitLocker + SMB + firewall (shared earlier)',
    createdAt: '2026-02-26T12:00:00+08:00',
    updatedAt: '2026-02-26T22:00:00+08:00'
  },
  {
    id: 'task-006',
    title: 'Create Facebook Business Page',
    description: '"Project Perci PH" page on Facebook',
    project: 'instagram',
    status: 'blocked',
    priority: 'low',
    needsCarlo: true,
    subagentRunning: false,
    notes: 'Bot detection blocked automated creation. Must be done manually.',
    carloAction: 'Go to facebook.com/pages/create → "Project Perci PH" → Gift Shop category',
    createdAt: '2026-02-26T12:00:00+08:00',
    updatedAt: '2026-02-26T22:00:00+08:00'
  }
];

window.ACTIVITY_LOG = [
  { time: '2026-02-26T22:30:00+08:00', emoji: '⚔️', text: 'Perci building dashboard directly — Claude Code was not logged in', type: 'info' },
  { time: '2026-02-26T22:10:00+08:00', emoji: '🤖', text: 'Spawned Claude Code sub-agent for dashboard (failed: not logged in)', type: 'blocked' },
  { time: '2026-02-26T22:05:00+08:00', emoji: '⚙️', text: 'Configured model tiers: Sonnet / Haiku / Opus', type: 'success' },
  { time: '2026-02-26T22:00:00+08:00', emoji: '🔴', text: 'Instagram API 412 — account too new for API uploads', type: 'blocked' },
  { time: '2026-02-26T21:00:00+08:00', emoji: '✅', text: 'instagram-private-api login SUCCESS with Calcifer123!', type: 'success' },
  { time: '2026-02-26T20:00:00+08:00', emoji: '🎨', text: 'Day 1 carousel approved by Carlo — 7 slides ready', type: 'success' },
  { time: '2026-02-26T16:00:00+08:00', emoji: '📸', text: 'Instagram @projectperciph created and verified', type: 'success' },
  { time: '2026-02-26T12:00:00+08:00', emoji: '🌐', text: 'ProjectPerciPH dashboard live on GitHub Pages', type: 'success' }
];

window.STATS = {
  tasksCompletedThisWeek: 8,
  activeSubagents: 0,
  blockedTasks: 3,
  daysWorkingTogether: 1
};

window.BRANDING_MD = `# ⚔️ Project Perci — Branding Guidelines
_Inspired by Beyond The Vines (BTV) aesthetic with a "Chrome & Vibrant" twist_
_Last updated: 2026-02-26_

---

## 🎯 Brand Identity

- **Name:** PROJECT PERCI (always caps, bold, wide font)
- **Tagline:** "Personalization, Engineered."
- **Vibe:** Techno-Utilitarian — treat every personalized gift like a piece of industrial engineering
- **Logo:** Stripped back — just PROJECT PERCI in a wide, bold sans-serif font

---

## 🎨 Color Palette (BTV-Inspired)

| Base (Industrial) | The "Pop" (Vibrant) | BTV Feel |
|---|---|---|
| Cool Slate / Silver | Electric Blue | Modern, clean, professional |
| Deep Moss / Charcoal | Neon Orange | Rugged, utility-wear aesthetic |
| Off-White / Cream | Cobalt | Classic BTV "Studio" look |

> **Pro Tip:** Use **Silver Chrome** as your neutral. Instead of black or white, use reflective metallic silver — it bridges tech and style.

---

## 📸 Photo/Content Style

- **NOT warm, NOT golden-filtered** — cool, balanced natural daylight
- **iPhone shot quality** — must NOT look AI-generated
- **Editorial lifestyle feel** — real Filipino person + emotion + product
- **Text overlays** — always a combination of: Person + Text + Branding
- **Every image must have:** "Project Perci PH" logo, white bold, bottom-right corner

---

## 🏗️ Store Vibe: "The Clean Laboratory"

- **Materials:** Galvanized steel or brushed aluminum display racks — no wood
- **Pop Block:** One solid high-gloss vibrant wall (Cobalt Blue or Safety Orange)
- **Show the machine:** Embroidery machine behind clear acrylic — make the process the art
- **Feel:** Futuristic playground, assembled not built

---

## 🧵 Product Strategy: "Precision Customization"

1. **Signature Tag:** Bold blue woven label — "PERCI CUSTOMIZED [01]" + customer name engraved on metal clip
2. **Industrial Embroidery:** Heavy blocky sans-serif font — looks like a serial number, not a pretty monogram
3. **The Hardware Look:** Chrome carabiner or metallic grommet on bags/towels for functional BTV edge

---

## 📦 Packaging: "The Tech Gift"

- **Bag/Box:** Translucent matte plastic or silver foil mailer
- **Sticker:** Large wrap-around sticker in vibrant color, logo in bold black text sealing the package

---

## 📱 Social Media Content Rules

- **Audience:** Gift-givers — NOT embroidery craft people
- **This month (pre-launch):** Educational only — Days 1–29
- **Day 30:** First promotional post
- **Carousel spec:** 1080×1080px square, cool-toned, editorial
- **Every slide:** Real person + emotion + text overlay + branding
- **Embroidery shown as creative art:** pet portraits, couple silhouettes, vectorized faces — not just names

---

## ✒️ Tone of Voice

- Confident, clean, precise
- "Engineered" not "cute"
- Speaks to the gift-giver's desire to impress and be remembered
- Filipino context, Cebu-first

---

## 🔗 Reference Brand
[Beyond The Vines (BTV)](https://beyondthevines.com) — study their product photography, store layout, and label design`;
