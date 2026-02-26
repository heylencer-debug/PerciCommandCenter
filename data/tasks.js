window.DATA_VERSION = '2026-02-27T04:54:00.000Z';

window.PERCI_STATUS = {
  "status": "active",
  "statusText": "QA Review — Brigid verifying both dashboards",
  "mood": "focused",
  "lastUpdated": "2026-02-27T04:54:00.000Z",
  "currentTask": "QA Review of live dashboards",
  "currentStep": "Brigid reviewing all features",
  "totalSteps": 4,
  "currentStepNum": 4
};

window.SUBAGENTS = [
  {
    "id": "brigid-qa",
    "agentId": "brigid",
    "name": "Brigid",
    "task": "QA Review — Verifying ProjectPerciPH Dashboard + Command Center",
    "project": "perci-system",
    "taskId": "task-012",
    "startedAt": new Date().toISOString()
  }
];

window.PROJECTS = [
  {
    "id": "projectperciph",
    "name": "ProjectPerciPH",
    "emoji": "🛍️",
    "color": "#FF7A00"
  },
  {
    "id": "instagram",
    "name": "Instagram",
    "emoji": "📸",
    "color": "#9333EA"
  },
  {
    "id": "perci-system",
    "name": "Perci System",
    "emoji": "⚔️",
    "color": "#3B82F6"
  },
  {
    "id": "github-pages",
    "name": "GitHub Pages",
    "emoji": "🌐",
    "color": "#22C55E"
  }
];

window.AGENTS_CONFIG = [
  {
    "id": "brigid",
    "name": "Brigid",
    "emoji": "🔥",
    "role": "Forge Master",
    "description": "Builds and deploys code — Command Center, dashboards, scripts",
    "color": "#FF7A00",
    "model": "Claude Opus",
    "status": "active"
  },
  {
    "id": "vesper",
    "name": "Vesper",
    "emoji": "🌌",
    "role": "Creative Director",
    "description": "Generates images — carousels, product shots, brand assets",
    "color": "#9333EA",
    "model": "Gemini + DALL-E",
    "status": "idle"
  }
];

window.TASKS = [
  {
    "id": "task-011",
    "title": "ProjectPerciPH Dashboard v2 — Competitive Intelligence Upgrade",
    "description": "Improve all features of the embroidery intelligence dashboard: Competitor Deep-Dive page, Pricing Calculator, Calendar upgrade, Seasonal Alerts, Catalog upgrade, Quick Stats bar",
    "project": "projectperciph",
    "status": "done",
    "priority": "high",
    "needsCarlo": false,
    "subagentRunning": false,
    "notes": "All 6 major improvements deployed: Competitor Deep-Dive, Pricing Calculator, Seasonal Alerts, Calendar upgrade, Catalog upgrade, Quick Stats bar. Live at heylencer-debug.github.io/ProjectPerciPH",
    "percisAdvice": "Dashboard v2 complete ✅ — all features live and working",
    "createdAt": "2026-02-27T04:20:00+08:00",
    "updatedAt": "2026-02-27T04:54:00+08:00"
  },
  {
    "id": "task-010",
    "title": "Command Center v5 — Quick Actions & Milestones",
    "description": "v5 upgrades: Quick Actions panel (Post Day 1, Generate Day 2, Refresh), Milestone tracker strip, UX polish",
    "project": "perci-system",
    "status": "done",
    "priority": "high",
    "needsCarlo": false,
    "subagentRunning": false,
    "notes": "v5 complete — Quick Actions, Milestone Tracker, and all UX improvements deployed.",
    "percisAdvice": "Command Center v5 complete ✅ — all features live",
    "createdAt": "2026-02-27T03:04:00+08:00",
    "updatedAt": "2026-02-27T04:54:00+08:00"
  },
  {
    "id": "task-009",
    "title": "Command Center: Tasks + Branding section",
    "description": "1. Perci notes/tasks visibility — show what Perci has seen and confirmed. 2. Branding section — show all brand docs per brand, filled with current ProjectPerciPH identity",
    "project": "perci-system",
    "status": "done",
    "priority": "high",
    "needsCarlo": false,
    "subagentRunning": false,
    "notes": "Completed by Brigid — v4 complete, all features live.",
    "percisAdvice": "v4 complete — all features live",
    "createdAt": "2026-02-27T02:47:00+08:00",
    "updatedAt": "2026-02-27T04:00:00+08:00"
  },
  {
    "id": "task-007",
    "title": "Day 1 carousel v11 generation",
    "description": "Generate v11: white hook text, powder blue accent bar, real Filipino candid emotions, no AI faces, iPhone depth-of-field",
    "project": "projectperciph",
    "status": "done",
    "priority": "high",
    "needsCarlo": false,
    "subagentRunning": false,
    "notes": "7/7 slides generated and approved! v11 is the final version.",
    "carloAction": "",
    "percisAdvice": "v11 APPROVED by Carlo ✅ — ready to post",
    "createdAt": "2026-02-27T02:30:00+08:00",
    "updatedAt": "2026-02-27T04:09:00+08:00"
  },
  {
    "id": "task-001",
    "title": "Post Day 1 carousel to Instagram",
    "description": "Upload approved v11 carousel to @projectperciph — first ever post",
    "project": "instagram",
    "status": "approved",
    "priority": "high",
    "needsCarlo": true,
    "subagentRunning": false,
    "notes": "v11 APPROVED! Instagram @projectperciph live, 0 posts. Must post manually via phone.",
    "carloAction": "Post from phone. Slides in dashboard/assets/day-01-*.png",
    "percisAdvice": "Day 1 v11 approved by Carlo ✅ — ready to post manually from phone!",
    "createdAt": "2026-02-26T16:00:00+08:00",
    "updatedAt": "2026-02-27T04:09:00+08:00"
  },
  {
    "id": "task-002",
    "title": "Command Center v3 — all upgrades",
    "description": "All v3 upgrades completed and pushed to GitHub by Brigid",
    "project": "perci-system",
    "status": "done",
    "priority": "high",
    "needsCarlo": false,
    "subagentRunning": false,
    "notes": "Done: emoji hero, agent panels, mood system, task cards, flame particles, mission control. Commit afe9208.",
    "percisAdvice": "Complete. Superseded by v5.",
    "createdAt": "2026-02-26T22:08:00+08:00",
    "updatedAt": "2026-02-27T02:00:00+08:00"
  },
  {
    "id": "task-003",
    "title": "Command Center v3 data accuracy fixes",
    "description": "Brigid v2: fix renderKanban, fix startLiveSync, fix last-synced timestamp",
    "project": "perci-system",
    "status": "done",
    "priority": "high",
    "needsCarlo": false,
    "subagentRunning": false,
    "notes": "Done: renderKanban now respects activeQuickFilter. startLiveSync fetches tasks.js + content.js in parallel. Timestamp = real sync time. Commit 0e6793a.",
    "percisAdvice": "Complete. Superseded by v5.",
    "createdAt": "2026-02-27T01:00:00+08:00",
    "updatedAt": "2026-02-27T02:00:00+08:00"
  },
  {
    "id": "task-006",
    "title": "Create Facebook Business Page",
    "description": "\"Project Perci PH\" Facebook page",
    "project": "instagram",
    "status": "blocked",
    "priority": "low",
    "needsCarlo": true,
    "subagentRunning": false,
    "notes": "Bot detection blocked automated creation. Must be done manually.",
    "carloAction": "Go to facebook.com/pages/create → \"Project Perci PH\" → Gift Shop category",
    "percisAdvice": "15 min task. Carlo creates manually at facebook.com/pages/create. No automation possible.",
    "createdAt": "2026-02-26T12:00:00+08:00",
    "updatedAt": "2026-02-26T22:00:00+08:00"
  },
  {
    "id": "task-008",
    "title": "Set up Shopee store",
    "description": "Create ProjectPerciPH Shopee store for embroidery products",
    "project": "projectperciph",
    "status": "todo",
    "priority": "medium",
    "needsCarlo": false,
    "subagentRunning": false,
    "notes": "Pre-launch phase. Need store setup, product photos, and listing copy before going live.",
    "percisAdvice": "Hold until Instagram Day 1 is live. Then Perci can draft listings.",
    "createdAt": "2026-02-27T09:00:00+08:00",
    "updatedAt": "2026-02-27T09:00:00+08:00"
  },
  {
    "id": "task-004",
    "title": "Generate Day 2 Instagram Post",
    "description": "Generate & send carousel for Day 2 pre-launch content",
    "project": "instagram",
    "status": "backlog",
    "priority": "medium",
    "needsCarlo": false,
    "subagentRunning": false,
    "notes": "Day 1 approved! Ready for Day 2 generation on Carlo's go.",
    "percisAdvice": "Day 1 approved. Perci ready to generate Day 2 on Carlo's go.",
    "createdAt": "2026-02-26T22:00:00+08:00",
    "updatedAt": "2026-02-27T04:09:00+08:00"
  },
  {
    "id": "task-005",
    "title": "Admin Security Tasks",
    "description": "BitLocker, SMB disable, firewall ports 27000/57669",
    "project": "perci-system",
    "status": "blocked",
    "priority": "low",
    "needsCarlo": true,
    "subagentRunning": false,
    "notes": "Paste-ready PowerShell provided. Waiting for Carlo to run as admin.",
    "carloAction": "Run admin PowerShell commands for BitLocker + SMB + firewall (shared earlier)",
    "percisAdvice": "Low risk but should be done. Carlo pastes the PowerShell commands shared earlier.",
    "createdAt": "2026-02-26T12:00:00+08:00",
    "updatedAt": "2026-02-26T22:00:00+08:00"
  }
];

window.ACTIVITY_LOG = [
  {
    "time": "2026-02-27T04:54:00+08:00",
    "emoji": "🔥",
    "text": "Brigid QA review — verifying both dashboards live",
    "type": "info"
  },
  {
    "time": "2026-02-27T04:09:00+08:00",
    "emoji": "🔥",
    "text": "Brigid spawned — building Command Center v5: Quick Actions, Milestone Tracker, UX Polish",
    "type": "info"
  },
  {
    "time": "2026-02-27T04:05:00+08:00",
    "emoji": "✅",
    "text": "v11 carousel APPROVED by Carlo — ready to post!",
    "type": "success"
  },
  {
    "time": "2026-02-27T04:00:00+08:00",
    "emoji": "🔥",
    "text": "Command Center v4 complete — all features live",
    "type": "success"
  },
  {
    "time": "2026-02-27T03:06:00+08:00",
    "emoji": "🔥",
    "text": "Brigid completed Command Center v4: Perci HQ, Vault, Gallery, Pings, Task Review",
    "type": "success"
  },
  {
    "time": "2026-02-27T03:00:00+08:00",
    "emoji": "📸",
    "text": "V11 carousel test slides sent to Carlo for review",
    "type": "info"
  },
  {
    "time": "2026-02-27T02:47:00+08:00",
    "emoji": "🔥",
    "text": "Brigid completed — Tasks visibility + Branding section deployed",
    "type": "success"
  },
  {
    "time": "2026-02-27T02:45:00+08:00",
    "emoji": "⚔️",
    "text": "Perci confirmed: v8 = 7/7 slides complete",
    "type": "success"
  },
  {
    "time": "2026-02-27T02:28:00+08:00",
    "emoji": "🌌",
    "text": "Vesper v8 generation started — white text, powder blue accent, real Filipino candid emotions",
    "type": "info"
  },
  {
    "time": "2026-02-27T02:10:00+08:00",
    "emoji": "⚔️",
    "text": "Carlo flagged: v7 slides looked same as before — v8 now generating with real changes",
    "type": "blocked"
  },
  {
    "time": "2026-02-27T02:00:00+08:00",
    "emoji": "🔥",
    "text": "Brigid v2 complete — Command Center data accuracy + bug fixes deployed (commit 0e6793a)",
    "type": "success"
  },
  {
    "time": "2026-02-27T01:30:00+08:00",
    "emoji": "🌌",
    "text": "Vesper v7 complete — Silver Chrome Dopamine Chic slides sent to Carlo",
    "type": "success"
  },
  {
    "time": "2026-02-27T00:30:00+08:00",
    "emoji": "🌌",
    "text": "Vesper v6 complete — Industrial Pop Dopamine Chic slides sent to Carlo",
    "type": "success"
  },
  {
    "time": "2026-02-27T00:00:00+08:00",
    "emoji": "🔥",
    "text": "Brigid v1 complete — Command Center v3 all 6 upgrades pushed to GitHub (commit afe9208)",
    "type": "success"
  },
  {
    "time": "2026-02-26T22:00:00+08:00",
    "emoji": "🔴",
    "text": "Instagram API 412 — new account blocked from API uploads",
    "type": "blocked"
  },
  {
    "time": "2026-02-26T16:00:00+08:00",
    "emoji": "📸",
    "text": "Instagram @projectperciph created and live",
    "type": "success"
  },
  {
    "time": "2026-02-26T12:00:00+08:00",
    "emoji": "🌐",
    "text": "ProjectPerciPH dashboard + Command Center live on GitHub Pages",
    "type": "success"
  }
];

window.STATS = {
  "tasksCompletedThisWeek": 14,
  "activeSubagents": 1,
  "blockedTasks": 2,
  "daysWorkingTogether": 2
};

// ═══════════════════════════════════════════════════════════════════════════
// PERCI NOTES — What Perci has read and confirmed
// ═══════════════════════════════════════════════════════════════════════════

window.PERCI_NOTES = {
  "lastUpdated": "2026-02-27T04:54:00+08:00",
  "confirmedReads": [
    { "file": "PROJECT_PERCI_BRAND_IDENTITY.md", "at": "2026-02-27T02:40:00+08:00", "note": "Brand identity updated: silver chrome, white hook text, powder blue accents. Orange retired." },
    { "file": "MEMORY.md", "at": "2026-02-27T02:40:00+08:00", "note": "Long-term memory loaded. Carlo's preferences, business context, Instagram status all current." },
    { "file": "memory/2026-02-27.md", "at": "2026-02-27T02:40:00+08:00", "note": "Today's notes loaded. V8 carousel complete, Brigid building v4." },
    { "file": "data/tasks.js", "at": "2026-02-27T04:54:00+08:00", "note": "Tasks updated: task-011 (Dashboard v2) done, task-010 (CC v5) done." },
    { "file": "brigid-task.md", "at": "2026-02-27T03:04:00+08:00", "note": "V4 task brief read. Building Perci HQ, Vault, Gallery, Pings, Task Review." }
  ],
  "percisNotes": "Dashboard v2 + Command Center v5 complete. All features verified. Day 1 carousel v11 approved — waiting for Carlo to post manually."
};

// ═══════════════════════════════════════════════════════════════════════════
// VAULT DOCUMENTS — Key documents Perci manages
// ═══════════════════════════════════════════════════════════════════════════

window.VAULT_DOCS = [
  { 
    id: "brand-identity", 
    title: "PROJECT_PERCI_BRAND_IDENTITY.md", 
    category: "Brand", 
    lastUpdated: "2026-02-27", 
    icon: "🎨",
    summary: "Full brand identity: Silver Chrome Dopamine Chic, visual identity, color palette, photography style. The definitive guide for all ProjectPerciPH visuals.",
    content: "**Style Formula:**\nSilver Chrome + Colored Chrome Wall Panels + Colored Frosted/Clear Glass or Acrylic Dividers + Dopamine Vibrant Decor + Iridescent/Silver Surfaces + White + Blue Accents\n\n**Color Palette:**\n- Hook text: White #FFFFFF\n- Accent bar: Powder Blue #A8D8F0\n- NO orange in overlays\n\n**Photography:**\nReal Filipino people, 20-40yo. Genuine candid emotions. iPhone/mirrorless feel with natural depth of field."
  },
  { 
    id: "branding", 
    title: "PROJECT_PERCI_BRANDING.md", 
    category: "Brand", 
    lastUpdated: "2026-02-27", 
    icon: "🏷️",
    summary: "Brand guidelines: environment system, product palette, photography rules, social content strategy.",
    content: "**Environment:** Silver chrome + colored chrome wall panels. Colored frosted/clear acrylic dividers.\n\n**Products:** Neon Poppy, Electric Grape, Hot Coral, Acid Lime, Soft Lilac, Peach Fizz, Baby Blue\n\n**Packaging:** Iridescent outer, powder blue tissue, holographic sticker"
  },
  { 
    id: "memory", 
    title: "MEMORY.md", 
    category: "Memory", 
    lastUpdated: "2026-02-27", 
    icon: "🧠",
    summary: "Long-term memory: Carlo's profile, business context, Instagram status, all projects built. Perci's curated wisdom.",
    content: "Carlo (he/him) — GMT+8 Manila. Building ProjectPerciPH: personalized embroidery gifts. Instagram @projectperciph live, 0 posts. Day 1 carousel v11 ready for approval."
  },
  { 
    id: "daily-notes", 
    title: "memory/2026-02-27.md", 
    category: "Memory", 
    lastUpdated: "2026-02-27", 
    icon: "📝",
    summary: "Today's session notes: carousel v11 approved, Dashboard v2 + CC v5 complete.",
    content: "02:28 — V8 carousel generation started\n02:45 — 7/7 slides complete\n03:00 — Test slides sent to Carlo\n04:05 — v11 APPROVED\n04:54 — Brigid QA review"
  },
  { 
    id: "soul", 
    title: "SOUL.md", 
    category: "Config", 
    lastUpdated: "2026-02-26", 
    icon: "⚔️",
    summary: "Perci's character: values, personality, operating principles. Be genuinely helpful, have opinions, earn trust.",
    content: "Be genuinely helpful, not performatively helpful. Have opinions. Be resourceful before asking. Earn trust through competence. Remember you're a guest."
  },
  { 
    id: "user", 
    title: "USER.md", 
    category: "Config", 
    lastUpdated: "2026-02-26", 
    icon: "👤",
    summary: "About Carlo: name, timezone GMT+8, business context, preferences.",
    content: "Name: Carlo\nTimezone: GMT+8 (Asia/Manila)\nNotes: Named me Sir Percival (Perci). First met 2026-02-26."
  },
  { 
    id: "day1-caption", 
    title: "day-01-caption.txt", 
    category: "Content", 
    lastUpdated: "2026-02-27", 
    icon: "📄",
    summary: "Day 1 Instagram caption ready for posting.",
    content: "The first gift I ever made? It was terrible. 😂\n\nBut my lola kept it anyway. She put it on her dresser, right next to her wedding photo.\n\n[Full caption in file...]"
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// GALLERY IMAGES — Generated carousel images
// ═══════════════════════════════════════════════════════════════════════════

window.GALLERY_IMAGES = [
  { id: "cover", file: "../dashboard/assets/day-01-cover.png", label: "Day 1 Cover", status: "approved", description: "Hook slide: 'The first gift I ever made? It was terrible.'" },
  { id: "slide-02", file: "../dashboard/assets/day-01-slide-02.png", label: "Slide 2", status: "approved", description: "Story continuation with Filipino tita" },
  { id: "slide-03", file: "../dashboard/assets/day-01-slide-03.png", label: "Slide 3", status: "approved", description: "Emotional moment — lola's reaction" },
  { id: "slide-04", file: "../dashboard/assets/day-01-slide-04.png", label: "Slide 4", status: "approved", description: "Product showcase — embroidered tote" },
  { id: "slide-05", file: "../dashboard/assets/day-01-slide-05.png", label: "Slide 5", status: "approved", description: "Behind the scenes — embroidery process" },
  { id: "slide-06", file: "../dashboard/assets/day-01-slide-06.png", label: "Slide 6", status: "approved", description: "Customer testimonial moment" },
  { id: "slide-07", file: "../dashboard/assets/day-01-slide-07.png", label: "Slide 7 (CTA)", status: "approved", description: "Call to action — follow for more" }
];

// ═══════════════════════════════════════════════════════════════════════════
// V5: Day 1 Caption for Quick Actions
// ═══════════════════════════════════════════════════════════════════════════

window.DAY1_CAPTION = `The first gift I ever made? It was terrible. 😂

But my lola kept it anyway. She put it on her dresser, right next to her wedding photo.

That's when I learned: it's not about perfection.
It's about the love stitched into every thread. 🧵💕

Coming soon: personalized embroidery gifts that tell YOUR story.

Follow @projectperciph for the journey ✨

#projectperciph #personalizedgifts #cebugifts #embroidery #handmadeph`;

window.DAY1_SLIDES = [
  "day-01-cover.png",
  "day-01-slide-02.png",
  "day-01-slide-03.png",
  "day-01-slide-04.png",
  "day-01-slide-05.png",
  "day-01-slide-06.png",
  "day-01-slide-07.png"
];

// ═══════════════════════════════════════════════════════════════════════════
// V5: Milestone Tracker Data
// ═══════════════════════════════════════════════════════════════════════════

window.MILESTONES = [
  { id: "brand", label: "Brand", emoji: "🎨", status: "done", description: "Brand identity complete" },
  { id: "social", label: "Social", emoji: "📱", status: "in-progress", description: "Instagram Day 1 ready to post" },
  { id: "shopee", label: "Shopee", emoji: "🛒", status: "todo", description: "Store setup pending" },
  { id: "facebook", label: "Facebook", emoji: "📘", status: "todo", description: "Page creation pending" },
  { id: "website", label: "Website", emoji: "🌐", status: "todo", description: "Future phase" }
];

// ═══════════════════════════════════════════════════════════════════════════
// BRANDING DATA — Brand documents per brand
// ═══════════════════════════════════════════════════════════════════════════

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
        "content": "**Style Formula:**\nSilver Chrome + Colored Chrome Wall Panels + Colored Frosted/Clear Glass or Acrylic Dividers (smooth, pleated, matte, glossy) + Dopamine Vibrant Decor + Iridescent/Silver Surfaces + White + Blue Accents\n\n**NOT:** Pure white minimalism. NOT dark warehouse. NOT orange-dominant text. NOT warm/golden.\n\n**Vibe:** Walking into a luxury dopamine-charged gift boutique from the future."
      },
      {
        "id": "color-palette",
        "title": "🌈 Color Palette",
        "content": "**Text Overlays (Social):**\n- Hook text: White #FFFFFF (90px+, bold)\n- Subtext: White #FFFFFF (42px)\n- Accent bar: Powder Blue #A8D8F0\n- Border: Iridescent rainbow gradient\n- NO orange in overlays\n\n**UI / Dashboard:**\n- Coral Red: #E94560 (dashboard only)\n- Navy: #1A1A2E\n\n**Products:**\n- Neon Poppy (bright red-orange)\n- Electric Grape (vivid purple)\n- Hot Coral\n- Acid Lime\n- Soft Lilac\n- Peach Fizz\n- Baby Blue\n\n**Packaging:**\n- Outer: Iridescent or silver metallic mailer\n- Inner: Powder blue tissue paper + baby pink ribbon\n- Seal: Holographic Project Perci sticker"
      },
      {
        "id": "photography",
        "title": "📸 Photography Style",
        "content": "**Environment:** Silver chrome + colored chrome wall panels. Colored frosted/clear acrylic dividers. Dopamine vibrant decor. Iridescent surfaces.\n\n**People:** Real Filipino people, 20-40yo. Genuine candid emotions — mid-laugh, actual tears, real surprise. NOT AI faces, NOT stock poses, NOT perfect symmetry. iPhone/mirrorless feel with natural depth of field.\n\n**Products:** Neon/bold embroidered items as dopamine hero. Always show: tote bags, towels, caps, polo shirts — never generic gift boxes.\n\n**Lighting:** Cool balanced (5500-6500K). NOT warm, NOT golden. Chrome reflections add sparkle.\n\n**Logo:** \"PROJECT PERCI PH\" — white, bold, bottom-right corner, every image."
      },
      {
        "id": "embroidery-style",
        "title": "🧵 Embroidery Style",
        "content": "**NOT:** Plain name/text only (e.g. just \"SOFIA\" in orange)\n\n**YES — Creative Embroidery Art:**\n- Pet portraits (golden retriever, tabby cat, etc.)\n- Vectorized face portraits\n- Couple silhouettes\n- Family portraits\n- Baby portraits\n\n**Brand differentiator:** \"We turn your people and pets into wearable art\"\n\n**Thread quality:** Individual stitch textures visible. Museum-quality detail. Layered fur, realistic eyes, delicate features."
      },
      {
        "id": "social-strategy",
        "title": "📱 Social Strategy",
        "content": "**Platform:** Instagram @projectperciph (0 posts, launching soon)\n**Facebook:** Page creation pending (Carlo must create manually)\n\n**Content Plan:**\n- Days 1-29: Educational only (no promotions)\n- Day 30: First promotional post\n- 5 pillars: Art of Gifting, Craft & Process, Filipino Gift Culture, Gift Inspo, Behind the Brand\n\n**Audience:** Gift-givers — NOT embroidery/craft enthusiasts\n\n**Carousel spec:** 1080×1080px, 7 slides, cool-toned\n**Approval:** Carlo approves EVERY post before it goes live"
      },
      {
        "id": "reference-brand",
        "title": "🔗 Reference Brand",
        "content": "**Beyond The Vines (BTV)** — beyondthevines.com\nStudy: product photography, contrast pairings, label design, editorial clean aesthetic"
      }
    ]
  }
];
