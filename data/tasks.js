window.DATA_VERSION = '2026-02-27T10:00:00.000Z';

window.PERCI_STATUS = {
  "status": "active",
  "statusText": "Managing Brigid + Vesper — Day 1 carousel v6 in progress",
  "mood": "onfire",
  "lastUpdated": "2026-02-27T10:00:00.000Z",
  "currentTask": "Managing Brigid + Vesper — Day 1 carousel v6 in progress",
  "currentStep": "Vesper building v6 with new branding corrections",
  "totalSteps": 6,
  "currentStepNum": 5
};

window.SUBAGENTS = [
  {
    "id": "vesper",
    "agentId": "vesper",
    "name": "Vesper",
    "task": "Day 1 carousel v6 — neon products, frosted glass, dopamine chic",
    "project": "projectperciph",
    "taskId": "task-007",
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
    "id": "task-007",
    "title": "Generate Day 1 carousel v6",
    "description": "Vesper generating Day 1 Instagram carousel v6 with new branding: frosted glass, dopamine chic, neon products, real Filipino settings",
    "project": "projectperciph",
    "status": "in-progress",
    "priority": "high",
    "needsCarlo": false,
    "subagentRunning": true,
    "notes": "v6 uses corrected branding — frosted glass panels, neon product photography, real Filipino locations as backgrounds.",
    "createdAt": "2026-02-27T09:00:00+08:00",
    "updatedAt": "2026-02-27T10:00:00+08:00"
  },
  {
    "id": "task-001",
    "title": "Post Day 1 carousel to Instagram",
    "description": "Upload approved v6 carousel to @projectperciph — first ever post",
    "project": "instagram",
    "status": "blocked",
    "priority": "high",
    "needsCarlo": true,
    "subagentRunning": false,
    "notes": "Waiting for v6 approval. Instagram @projectperciph is live but 0 posts. Must post manually (API 412 on new accounts).",
    "carloAction": "Review v6 slides → transfer to phone → post via Instagram app",
    "createdAt": "2026-02-26T16:00:00+08:00",
    "updatedAt": "2026-02-27T10:00:00+08:00"
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
    "notes": "Pre-launch phase. Need store setup before products can be listed.",
    "createdAt": "2026-02-27T09:00:00+08:00",
    "updatedAt": "2026-02-27T09:00:00+08:00"
  },
  {
    "id": "task-002",
    "title": "Command Center v3 upgrades",
    "description": "All 6 v3 upgrades completed and pushed to GitHub by Brigid",
    "project": "perci-system",
    "status": "done",
    "priority": "high",
    "needsCarlo": false,
    "subagentRunning": false,
    "notes": "All 6 upgrades done: emoji hero, agent panels, mood system, task cards, flame particles, mission control.",
    "createdAt": "2026-02-26T22:08:00+08:00",
    "updatedAt": "2026-02-27T08:00:00+08:00"
  },
  {
    "id": "task-006",
    "title": "Create Facebook Business Page",
    "description": "\"Project Perci PH\" page on Facebook for cross-platform presence",
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
    "time": "2026-02-27T10:00:00+08:00",
    "emoji": "🌌",
    "text": "Vesper started: Day 1 carousel v6 — new branding corrections",
    "type": "info"
  },
  {
    "time": "2026-02-27T09:30:00+08:00",
    "emoji": "🔥",
    "text": "Brigid: Command Center v3 upgrades complete — all 6 pushed to GitHub",
    "type": "success"
  },
  {
    "time": "2026-02-27T09:00:00+08:00",
    "emoji": "⚔️",
    "text": "Perci coordinating Day 1 v6 generation with corrected branding",
    "type": "info"
  },
  {
    "time": "2026-02-27T08:00:00+08:00",
    "emoji": "🎨",
    "text": "Branding update: frosted glass + dopamine chic + neon products + real Filipino settings",
    "type": "success"
  },
  {
    "time": "2026-02-26T22:30:00+08:00",
    "emoji": "⚔️",
    "text": "Perci building dashboard directly — Claude Code was not logged in",
    "type": "info"
  },
  {
    "time": "2026-02-26T22:00:00+08:00",
    "emoji": "🔴",
    "text": "Instagram API 412 — account too new for API uploads",
    "type": "blocked"
  },
  {
    "time": "2026-02-26T21:00:00+08:00",
    "emoji": "✅",
    "text": "instagram-private-api login SUCCESS",
    "type": "success"
  },
  {
    "time": "2026-02-26T16:00:00+08:00",
    "emoji": "📸",
    "text": "Instagram @projectperciph created and verified",
    "type": "success"
  },
  {
    "time": "2026-02-26T12:00:00+08:00",
    "emoji": "🌐",
    "text": "ProjectPerciPH dashboard live on GitHub Pages",
    "type": "success"
  }
];

window.STATS = {
  "tasksCompletedThisWeek": 9,
  "activeSubagents": 1,
  "blockedTasks": 3,
  "daysWorkingTogether": 2
};
