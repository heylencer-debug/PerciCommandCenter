window.DATA_VERSION = '2026-02-27T02:47:00.000Z';

window.PERCI_STATUS = {
  "status": "active",
  "statusText": "V8 carousel generating — 6/7 slides done, slide 2 retrying",
  "mood": "onfire",
  "lastUpdated": "2026-02-27T02:47:00.000Z",
  "currentTask": "Day 1 carousel v8 generation + Command Center branding section build",
  "currentStep": "Brigid building Branding section; v8 slide 2 retrying",
  "totalSteps": 3,
  "currentStepNum": 2
};

window.SUBAGENTS = [
  {
    "id": "brigid-cc",
    "agentId": "brigid",
    "name": "Brigid",
    "task": "Command Center: Tasks/Notes visibility + Branding section for ProjectPerciPH",
    "project": "perci-system",
    "taskId": "task-009",
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

window.TASKS = [
  {
    "id": "task-009",
    "title": "Command Center: Tasks + Branding section",
    "description": "1. Perci notes/tasks visibility — show what Perci has seen and confirmed. 2. Branding section — show all brand docs per brand, filled with current ProjectPerciPH identity",
    "project": "perci-system",
    "status": "in-progress",
    "priority": "high",
    "needsCarlo": false,
    "subagentRunning": true,
    "notes": "Carlo wants to confirm what Perci has read/updated. Also needs a Branding tab showing brand documents per brand.",
    "createdAt": "2026-02-27T02:47:00+08:00",
    "updatedAt": "2026-02-27T02:47:00+08:00"
  },
  {
    "id": "task-007",
    "title": "Day 1 carousel v8 generation",
    "description": "Generate v8: white hook text, powder blue accent bar, real Filipino candid emotions, no AI faces, iPhone depth-of-field",
    "project": "projectperciph",
    "status": "in-progress",
    "priority": "high",
    "needsCarlo": false,
    "subagentRunning": false,
    "notes": "6/7 slides generated (cover + slides 3–7). Slide 2 failed (Gemini returned no image) — retrying now. Will send all 7 to Carlo when complete.",
    "createdAt": "2026-02-27T02:30:00+08:00",
    "updatedAt": "2026-02-27T02:47:00+08:00"
  },
  {
    "id": "task-001",
    "title": "Post Day 1 carousel to Instagram",
    "description": "Upload approved v8 carousel to @projectperciph — first ever post",
    "project": "instagram",
    "status": "blocked",
    "priority": "high",
    "needsCarlo": true,
    "subagentRunning": false,
    "notes": "Waiting for v8 Carlo approval. Instagram @projectperciph live, 0 posts. Must post manually via phone (Instagram blocks API on new accounts).",
    "carloAction": "Review v8 slides → transfer to phone → post via Instagram app",
    "createdAt": "2026-02-26T16:00:00+08:00",
    "updatedAt": "2026-02-27T02:47:00+08:00"
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
    "notes": "Waiting for Day 1 to go live first.",
    "createdAt": "2026-02-26T22:00:00+08:00",
    "updatedAt": "2026-02-26T22:00:00+08:00"
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
    "createdAt": "2026-02-26T12:00:00+08:00",
    "updatedAt": "2026-02-26T22:00:00+08:00"
  }
];

window.ACTIVITY_LOG = [
  {
    "time": "2026-02-27T02:47:00+08:00",
    "emoji": "🔥",
    "text": "Brigid spawned — building Tasks visibility + Branding section for Command Center",
    "type": "info"
  },
  {
    "time": "2026-02-27T02:45:00+08:00",
    "emoji": "⚔️",
    "text": "Perci confirmed: v8 = 6/7 slides done. Slide 2 failed (Gemini no image) — retrying",
    "type": "info"
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
  "tasksCompletedThisWeek": 11,
  "activeSubagents": 1,
  "blockedTasks": 3,
  "daysWorkingTogether": 2
};

// ═══════════════════════════════════════════════════════════════════════════
// PERCI NOTES — What Perci has read and confirmed
// ═══════════════════════════════════════════════════════════════════════════

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
