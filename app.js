// ⚔️ Perci Command Center — app.js (v2: Interactive)

const COLUMNS = [
  { id: 'backlog',     label: '🧊 Backlog',     emoji: '🧊' },
  { id: 'todo',        label: '📌 Todo',         emoji: '📌' },
  { id: 'in-progress', label: '⚙️ In Progress',  emoji: '⚙️' },
  { id: 'blocked',     label: '🚫 Blocked',      emoji: '🚫' },
  { id: 'done',        label: '✅ Done',          emoji: '✅' },
];

const PRIORITY_ICONS = { high: '🔴', medium: '🟡', low: '🟢' };
const MOOD_ICONS = { focused: '⚔️', idle: '😴', thinking: '🧠', onfire: '🔥' };

const LS_KEYS = {
  tasks: 'perci_tasks',
  brainDump: 'perci_brain_dump',
  brainDumpLast: 'perci_brain_dump_last',
  briefs: 'perci_briefs',
  compact: 'perci_compact',
  branding: 'perci_branding',
};

let activeProject = null;
let tasks = [];
let briefs = {};

// ── PERSISTENCE ──────────────────────────────────────────────────────────────

function saveTasks() {
  try {
    localStorage.setItem(LS_KEYS.tasks, JSON.stringify(tasks));
  } catch (e) { /* quota exceeded — silent */ }
}

function loadTasks() {
  const defaults = [...(window.TASKS || [])];
  let saved = null;
  try {
    const raw = localStorage.getItem(LS_KEYS.tasks);
    if (raw) saved = JSON.parse(raw);
  } catch (e) { /* corrupt data — ignore */ }

  if (!saved) return defaults;

  // Merge: localStorage wins for same IDs, keep defaults that don't exist in saved
  const savedMap = new Map(saved.map(t => [t.id, t]));
  const defaultMap = new Map(defaults.map(t => [t.id, t]));

  // Start with all saved tasks
  const merged = [...saved];

  // Add any default tasks not present in saved
  defaults.forEach(dt => {
    if (!savedMap.has(dt.id)) merged.push(dt);
  });

  return merged;
}

function loadBriefs() {
  try {
    const raw = localStorage.getItem(LS_KEYS.briefs);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {};
}

function saveBriefs() {
  try {
    localStorage.setItem(LS_KEYS.briefs, JSON.stringify(briefs));
  } catch (e) {}
}

// ── INIT ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  tasks = loadTasks();
  briefs = loadBriefs();
  initBgCanvas();
  renderStatus();
  renderProjects();
  renderStats();
  renderMissionControl();
  renderCarloActions();
  renderSubagents();
  renderKanban();
  renderActivityLog();
  checkOnARoll();
  initBrainDump();
  initQuickAddProjects();
  initCompactMode();
  updateTabBadge();

  // Refresh "X ago" timestamps every 60 seconds
  setInterval(() => {
    renderKanban();
    renderActivityLog();
    renderStatus();
  }, 60000);
});

// ── BACKGROUND PARTICLES ──────────────────────────────────────────────────────

function initBgCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  const dots = Array.from({ length: 60 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.5 + 0.1
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,122,0,${d.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
}

// ── STATUS ────────────────────────────────────────────────────────────────────

function renderStatus() {
  const s = window.PERCI_STATUS || {};
  const dot = document.getElementById('status-dot');
  const mood = document.getElementById('status-mood');
  const text = document.getElementById('status-text');
  const updated = document.getElementById('last-updated');

  dot.className = 'status-dot ' + (s.status || 'idle');
  mood.textContent = MOOD_ICONS[s.mood] || '⚔️';
  text.textContent = s.statusText || 'Standing by';
  if (s.lastUpdated) updated.textContent = 'Updated ' + timeAgo(s.lastUpdated);
}

// ── MISSION CONTROL ───────────────────────────────────────────────────────────

function renderMissionControl() {
  const s = window.PERCI_STATUS || {};
  const el = document.getElementById('mission-control');
  const pct = s.totalSteps ? Math.round((s.currentStepNum / s.totalSteps) * 100) : 0;
  el.innerHTML = `
    <div class="mission-label">🎯 Current Mission</div>
    <div class="mission-task">${escHtml(s.currentTask || 'Awaiting orders')}</div>
    <div class="mission-step">${escHtml(s.currentStep || '')} ${s.totalSteps ? `· Step ${s.currentStepNum} of ${s.totalSteps}` : ''}</div>
    ${s.totalSteps ? `
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill" style="width:${pct}%"></div>
      </div>
    ` : ''}
  `;
}

// ── BRAIN DUMP ────────────────────────────────────────────────────────────────

function initBrainDump() {
  const textarea = document.getElementById('brain-dump-text');
  const lastEl = document.getElementById('brain-dump-last');

  // Restore saved draft
  try {
    const saved = localStorage.getItem(LS_KEYS.brainDump);
    if (saved) textarea.value = saved;
  } catch (e) {}

  // Auto-save draft as user types
  textarea.addEventListener('input', () => {
    try { localStorage.setItem(LS_KEYS.brainDump, textarea.value); } catch (e) {}
  });

  // Show last sent
  showLastBrainDump();
}

function showLastBrainDump() {
  const lastEl = document.getElementById('brain-dump-last');
  try {
    const raw = localStorage.getItem(LS_KEYS.brainDumpLast);
    if (raw) {
      const data = JSON.parse(raw);
      lastEl.textContent = `Last sent ${timeAgo(data.time)}: "${data.text.substring(0, 60)}${data.text.length > 60 ? '...' : ''}"`;
    }
  } catch (e) {}
}

function sendBrainDump() {
  const textarea = document.getElementById('brain-dump-text');
  const text = textarea.value.trim();
  if (!text) return;

  const formatted = `📨 [Carlo → Perci] ${new Date().toLocaleString('en-PH')}\n\n${text}`;

  // Copy to clipboard
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(formatted).catch(() => {
      fallbackCopy(formatted);
    });
  } else {
    fallbackCopy(formatted);
  }

  // Save to localStorage
  const record = { text: text, time: new Date().toISOString() };
  try {
    localStorage.setItem(LS_KEYS.brainDumpLast, JSON.stringify(record));
    localStorage.setItem(LS_KEYS.brainDump, '');
  } catch (e) {}

  // Visual feedback
  const btn = document.getElementById('brain-dump-send');
  btn.textContent = 'Copied! ✅';
  setTimeout(() => { btn.textContent = 'Send to Perci 📨'; }, 2000);

  textarea.value = '';
  showLastBrainDump();

  // Add to activity log
  addActivityEntry('📨', `Carlo brain dump: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`, 'info');
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
}

// ── CARLO ACTIONS ─────────────────────────────────────────────────────────────

function renderCarloActions() {
  const carloTasks = tasks.filter(t => t.needsCarlo && t.status !== 'done');
  const el = document.getElementById('carlo-actions');
  if (!carloTasks.length) { el.innerHTML = ''; return; }

  el.innerHTML = `
    <div class="carlo-header">🔴 Needs Your Attention, Carlo (${carloTasks.length})</div>
    ${carloTasks.map(t => `
      <div class="carlo-card" id="carlo-${t.id}">
        <div>
          <div class="carlo-card-title">${escHtml(t.title)}</div>
          ${t.carloAction ? `<div class="carlo-card-action">👉 ${escHtml(t.carloAction)}</div>` : ''}
        </div>
        <button class="carlo-done-btn" onclick="markCarloDone('${t.id}')">Done ✓</button>
      </div>
    `).join('')}
  `;
}

function markCarloDone(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.needsCarlo = false;
  task.status = 'done';
  task.updatedAt = new Date().toISOString();
  saveTasks();
  renderCarloActions();
  renderKanban();
  launchConfetti();
  renderStats();
  renderProjects();
  updateTabBadge();
  addActivityEntry('✅', `Carlo completed: ${task.title}`, 'success');
}

// ── TASK ACTIONS (Mark Done, Unblock, Brief) ──────────────────────────────────

function markTaskDone(id, event) {
  if (event) event.stopPropagation();
  const task = tasks.find(t => t.id === id);
  if (!task || task.status === 'done') return;

  task.status = 'done';
  task.updatedAt = new Date().toISOString();
  task.needsCarlo = false;
  saveTasks();

  launchConfetti();
  renderAll();
  addActivityEntry('✅', `Task completed: ${task.title}`, 'success');
}

function unblockTask(id, event) {
  if (event) event.stopPropagation();
  const task = tasks.find(t => t.id === id);
  if (!task || task.status !== 'blocked') return;

  task.status = 'in-progress';
  task.updatedAt = new Date().toISOString();
  saveTasks();

  renderAll();

  // Celebratory animation on the card
  setTimeout(() => {
    const card = document.querySelector(`[data-task-id="${id}"]`);
    if (card) {
      card.classList.add('unblock-anim');
      setTimeout(() => card.classList.remove('unblock-anim'), 700);
    }
  }, 50);

  // Mini confetti for unblock
  launchConfetti();
  addActivityEntry('🔓', `Unblocked: ${task.title}`, 'success');
}

function openBriefModal(id, event) {
  if (event) event.stopPropagation();
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const existing = briefs[id] || '';
  const overlay = document.getElementById('brief-overlay');
  document.getElementById('brief-content').innerHTML = `
    <div class="modal-title">📋 Brief Perci — ${escHtml(task.title)}</div>
    <div class="modal-label">Context, URLs, notes for Perci</div>
    <textarea class="brief-textarea" id="brief-text" placeholder="Add context, paste URLs, write notes...">${escHtml(existing)}</textarea>
    <button class="brief-save-btn" onclick="saveBrief('${id}')">Save Brief 📋</button>
  `;
  overlay.classList.add('open');
}

function saveBrief(id) {
  const text = document.getElementById('brief-text').value.trim();
  briefs[id] = text;
  saveBriefs();

  // Also update the task's notes field if brief has content
  const task = tasks.find(t => t.id === id);
  if (task && text) {
    task.briefAdded = true;
    task.updatedAt = new Date().toISOString();
    saveTasks();
  } else if (task && !text) {
    task.briefAdded = false;
    saveTasks();
  }

  closeBriefModal();
  renderKanban();
  addActivityEntry('📋', `Brief updated for: ${task ? task.title : id}`, 'info');
}

function closeBriefModal() {
  document.getElementById('brief-overlay').classList.remove('open');
}

document.getElementById('brief-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('brief-overlay')) closeBriefModal();
});

// ── SUBAGENTS ─────────────────────────────────────────────────────────────────

function renderSubagents() {
  const agents = window.SUBAGENTS || [];
  const el = document.getElementById('subagents-panel');

  if (!agents.length) { el.innerHTML = ''; return; }

  el.innerHTML = `
    <div class="subagents-header">🤖 Active Subagents (${agents.length})</div>
    ${agents.map(a => `
      <div class="subagent-card">
        <div class="subagent-spinner"></div>
        <div class="subagent-info">
          <div class="subagent-name">${escHtml(a.name)}</div>
          <div class="subagent-task">${escHtml(a.task)}</div>
          <div class="subagent-time">Started ${timeAgo(a.startedAt)}</div>
        </div>
        ${getProjectBadge(a.project)}
      </div>
    `).join('')}
  `;
}

// ── PROJECTS ──────────────────────────────────────────────────────────────────

function renderProjects() {
  const el = document.getElementById('projects-list');
  const projects = window.PROJECTS || [];
  el.innerHTML = `
    <div class="project-item ${!activeProject ? 'active' : ''}" onclick="filterProject(null)">
      <span class="project-emoji">🗂️</span>
      <div class="project-info">
        <span class="project-name">All Projects</span>
        <span class="project-meta">${tasks.length} tasks</span>
      </div>
    </div>
    ${projects.map(p => {
      const count = tasks.filter(t => t.project === p.id).length;
      const done = tasks.filter(t => t.project === p.id && t.status === 'done').length;
      return `
        <div class="project-item ${activeProject === p.id ? 'active' : ''}" onclick="filterProject('${p.id}')">
          <span class="project-emoji">${p.emoji}</span>
          <div class="project-info">
            <span class="project-name">${escHtml(p.name)}</span>
            <span class="project-meta">${done}/${count} done</span>
          </div>
          <div class="project-dot" style="background:${p.color}"></div>
        </div>
      `;
    }).join('')}
  `;
}

function filterProject(id) {
  activeProject = id;
  renderProjects();
  renderKanban();
}

// ── STATS ─────────────────────────────────────────────────────────────────────

function renderStats() {
  const el = document.getElementById('stats-panel');
  const s = window.STATS || {};
  const blocked = tasks.filter(t => t.status === 'blocked').length;
  const done = tasks.filter(t => t.status === 'done').length;
  const agents = (window.SUBAGENTS || []).length;
  el.innerHTML = `
    <div class="stat-item"><span class="stat-label">✅ Done this week</span><span class="stat-value">${Math.max(s.tasksCompletedThisWeek || 0, done)}</span></div>
    <div class="stat-item"><span class="stat-label">🤖 Subagents</span><span class="stat-value">${agents}</span></div>
    <div class="stat-item"><span class="stat-label">🚫 Blocked</span><span class="stat-value" style="color:${blocked > 0 ? 'var(--red)' : 'var(--green)'}">${blocked}</span></div>
    <div class="stat-item"><span class="stat-label">📅 Days together</span><span class="stat-value">${s.daysWorkingTogether || 1}</span></div>
  `;

  // Update settings panel days
  const settingsDays = document.getElementById('settings-days');
  if (settingsDays) settingsDays.textContent = s.daysWorkingTogether || 1;
}

// ── KANBAN ────────────────────────────────────────────────────────────────────

function renderKanban() {
  const board = document.getElementById('kanban-board');
  const filtered = activeProject ? tasks.filter(t => t.project === activeProject) : tasks;

  const sorted = [...filtered].sort((a, b) => {
    const p = { high: 0, medium: 1, low: 2 };
    return (p[a.priority] || 1) - (p[b.priority] || 1);
  });

  board.innerHTML = COLUMNS.map(col => {
    const colTasks = sorted.filter(t => t.status === col.id);
    const hasActive = col.id === 'in-progress' && colTasks.length > 0;
    return `
      <div class="kanban-col ${hasActive ? 'has-active' : ''}">
        <div class="kanban-col-header">
          <span class="kanban-col-title">${col.label}</span>
          <span class="kanban-col-count">${colTasks.length}</span>
        </div>
        ${colTasks.map(t => renderTaskCard(t)).join('') || `<div style="color:var(--text-muted);font-size:12px;text-align:center;padding:20px 0">Empty</div>`}
      </div>
    `;
  }).join('');
}

function renderTaskCard(t) {
  const project = (window.PROJECTS || []).find(p => p.id === t.project);
  const projectColor = project ? project.color : 'transparent';
  const hasBrief = briefs[t.id] || t.briefAdded;

  // Action buttons based on status
  let actionButtons = '';
  if (t.status !== 'done') {
    actionButtons += `<button class="task-action-btn btn-done" onclick="markTaskDone('${t.id}', event)" title="Mark Done">Done ✓</button>`;
  }
  if (t.status === 'blocked') {
    actionButtons += `<button class="task-action-btn btn-unblock" onclick="unblockTask('${t.id}', event)" title="Unblock">Unblock 🔓</button>`;
  }
  actionButtons += `<button class="task-action-btn" onclick="openBriefModal('${t.id}', event)" title="Brief Perci">📋 Brief</button>`;

  return `
    <div class="task-card card-sliding ${t.needsCarlo ? 'needs-carlo' : ''} ${t.subagentRunning ? 'has-subagent' : ''}"
         data-task-id="${t.id}"
         style="border-left-color: ${projectColor}"
         onclick="openModal('${t.id}')">
      ${hasBrief ? '<div class="brief-dot"></div>' : ''}
      <div class="task-card-top">
        <span class="task-priority">${PRIORITY_ICONS[t.priority] || '⚪'}</span>
        <span class="task-title">${escHtml(t.title)}</span>
      </div>
      <div class="task-badges">
        ${project ? `<span class="badge badge-project" style="background:${project.color}22;color:${project.color}">${project.emoji} ${escHtml(project.name)}</span>` : ''}
        ${t.needsCarlo ? `<span class="badge badge-carlo">🔴 Needs Carlo</span>` : ''}
        ${t.subagentRunning ? `<span class="badge badge-subagent">🤖 Agent Running</span>` : ''}
      </div>
      ${t.notes ? `<div class="task-notes">${escHtml(t.notes)}</div>` : ''}
      <div class="task-footer">
        <span class="task-date">${timeAgo(t.updatedAt) || formatDate(t.updatedAt)}</span>
      </div>
      <div class="task-card-actions">
        ${actionButtons}
      </div>
    </div>
  `;
}

// ── MODAL ──────────────────────────────────────────────────────────────────────

function openModal(id) {
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  const project = (window.PROJECTS || []).find(p => p.id === t.project);
  const brief = briefs[id] || '';
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-content').innerHTML = `
    <div class="modal-title">${PRIORITY_ICONS[t.priority]} ${escHtml(t.title)}</div>
    <div class="task-badges" style="margin-bottom:16px">
      ${project ? `<span class="badge badge-project" style="background:${project.color}22;color:${project.color}">${project.emoji} ${escHtml(project.name)}</span>` : ''}
      ${t.needsCarlo ? `<span class="badge badge-carlo">🔴 Needs Carlo</span>` : ''}
      ${t.subagentRunning ? `<span class="badge badge-subagent">🤖 Agent Running</span>` : ''}
    </div>
    <div class="modal-section">
      <div class="modal-label">Description</div>
      <div class="modal-value">${escHtml(t.description)}</div>
    </div>
    <div class="modal-section">
      <div class="modal-label">Status</div>
      <div class="modal-value">${COLUMNS.find(c=>c.id===t.status)?.label || t.status}</div>
    </div>
    ${t.notes ? `
      <div class="modal-section">
        <div class="modal-label">Perci's Notes</div>
        <div class="modal-value">${escHtml(t.notes)}</div>
      </div>
    ` : ''}
    ${brief ? `
      <div class="modal-section">
        <div class="modal-label">📋 Carlo's Brief</div>
        <div class="modal-value" style="background:var(--orange-dim);padding:10px;border-radius:var(--radius);border:1px solid var(--orange-glow)">${escHtml(brief)}</div>
      </div>
    ` : ''}
    ${t.carloAction ? `
      <div class="modal-section">
        <div class="modal-label">Carlo Needs To</div>
        <div class="modal-carlo-action">👉 ${escHtml(t.carloAction)}</div>
      </div>
    ` : ''}
    <div class="modal-section" style="display:flex;gap:16px">
      <div>
        <div class="modal-label">Created</div>
        <div class="modal-value" style="font-size:12px">${formatDate(t.createdAt)}</div>
      </div>
      <div>
        <div class="modal-label">Last Updated</div>
        <div class="modal-value" style="font-size:12px">${formatDate(t.updatedAt)}</div>
      </div>
    </div>
  `;
  overlay.classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

// ── QUICK ADD TASK ────────────────────────────────────────────────────────────

function initQuickAddProjects() {
  const select = document.getElementById('qa-project');
  const projects = window.PROJECTS || [];
  select.innerHTML = projects.map(p =>
    `<option value="${p.id}">${p.emoji} ${escHtml(p.name)}</option>`
  ).join('');
}

function openQuickAdd() {
  const overlay = document.getElementById('quick-add-overlay');
  overlay.classList.add('open');
  // Focus title after animation
  setTimeout(() => document.getElementById('qa-title').focus(), 350);
}

function closeQuickAdd(event) {
  if (event && event.target !== document.getElementById('quick-add-overlay')) return;
  document.getElementById('quick-add-overlay').classList.remove('open');
  // Clear form
  document.getElementById('qa-title').value = '';
  document.getElementById('qa-notes').value = '';
}

function submitQuickAdd() {
  const title = document.getElementById('qa-title').value.trim();
  if (!title) {
    document.getElementById('qa-title').style.borderColor = 'var(--red)';
    setTimeout(() => document.getElementById('qa-title').style.borderColor = '', 1500);
    return;
  }

  const project = document.getElementById('qa-project').value;
  const priority = document.getElementById('qa-priority').value;
  const notes = document.getElementById('qa-notes').value.trim();

  const newTask = {
    id: 'task-' + Date.now(),
    title: title,
    description: title,
    project: project,
    status: 'todo',
    priority: priority,
    needsCarlo: false,
    subagentRunning: false,
    notes: notes || '',
    carloAction: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  saveTasks();

  // Close form and reset
  document.getElementById('quick-add-overlay').classList.remove('open');
  document.getElementById('qa-title').value = '';
  document.getElementById('qa-notes').value = '';

  renderAll();
  addActivityEntry('📌', `New task added: ${title}`, 'success');
}

// ── SETTINGS ──────────────────────────────────────────────────────────────────

function toggleSettings() {
  const overlay = document.getElementById('settings-overlay');
  overlay.classList.toggle('open');
}

function closeSettings(event) {
  if (event && event.target === document.getElementById('settings-overlay')) {
    document.getElementById('settings-overlay').classList.remove('open');
  }
}

function resetAllData() {
  if (!confirm('Reset ALL data to defaults? This clears all your changes, added tasks, briefs, and brain dumps.')) return;

  Object.values(LS_KEYS).forEach(key => {
    try { localStorage.removeItem(key); } catch (e) {}
  });

  tasks = [...(window.TASKS || [])];
  briefs = {};
  saveTasks();
  saveBriefs();

  document.getElementById('brain-dump-text').value = '';
  document.getElementById('brain-dump-last').textContent = '';

  renderAll();
  toggleSettings();
  addActivityEntry('🗑️', 'All data reset to defaults', 'info');
}

function toggleCompact() {
  const compact = document.getElementById('setting-compact').checked;
  document.body.classList.toggle('compact', compact);
  try { localStorage.setItem(LS_KEYS.compact, compact ? '1' : '0'); } catch (e) {}
}

function initCompactMode() {
  try {
    const compact = localStorage.getItem(LS_KEYS.compact) === '1';
    if (compact) {
      document.body.classList.add('compact');
      document.getElementById('setting-compact').checked = true;
    }
  } catch (e) {}
}

// ── ACTIVITY LOG ───────────────────────────────────────────────────────────────

let activityLog = [];

function renderActivityLog() {
  const log = [...(window.ACTIVITY_LOG || []), ...activityLog]
    .sort((a, b) => new Date(b.time) - new Date(a.time));
  const el = document.getElementById('activity-log');
  el.innerHTML = log.map(l => `
    <div class="log-item ${l.type}">
      <span class="log-emoji">${l.emoji}</span>
      <div class="log-content">
        <div class="log-text">${escHtml(l.text)}</div>
        <div class="log-time">${timeAgo(l.time)}</div>
      </div>
    </div>
  `).join('');
}

function addActivityEntry(emoji, text, type) {
  activityLog.push({
    time: new Date().toISOString(),
    emoji: emoji,
    text: text,
    type: type || 'info'
  });
  renderActivityLog();
}

// ── NOTIFICATION BADGE ─────────────────────────────────────────────────────────

function updateTabBadge() {
  const carloCount = tasks.filter(t => t.needsCarlo && t.status !== 'done').length;
  if (carloCount > 0) {
    document.title = `(${carloCount}) ⚔️ Perci Command Center`;
  } else {
    document.title = '⚔️ Perci Command Center';
  }
}

// ── ON A ROLL ──────────────────────────────────────────────────────────────────

function checkOnARoll() {
  const s = window.STATS || {};
  const done = tasks.filter(t => t.status === 'done').length;
  const count = Math.max(s.tasksCompletedThisWeek || 0, done);
  if (count >= 5) {
    const existing = document.querySelector('.on-a-roll');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = 'on-a-roll';
    el.textContent = '🔥 On a roll! ' + count + ' tasks crushed this week. Keep going!';
    document.querySelector('.main-content').prepend(el);
  }
}

// ── CONFETTI ───────────────────────────────────────────────────────────────────

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -10,
    r: Math.random() * 8 + 4,
    color: ['#FF7A00','#FFB347','#22C55E','#3B82F6','#9333EA'][Math.floor(Math.random()*5)],
    vx: (Math.random()-0.5)*6,
    vy: Math.random()*4+2,
    rot: Math.random()*360,
    vr: (Math.random()-0.5)*10
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p => {
      p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr; p.vy+=0.1;
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle=p.color;
      ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r);
      ctx.restore();
    });
    frame++;
    if(frame<180) requestAnimationFrame(draw);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  draw();
}

// ── RENDER ALL ─────────────────────────────────────────────────────────────────

function renderAll() {
  renderStatus();
  renderProjects();
  renderStats();
  renderMissionControl();
  renderCarloActions();
  renderSubagents();
  renderKanban();
  renderActivityLog();
  updateTabBadge();
  checkOnARoll();
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff/60) + 'm ago';
  if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
  return Math.floor(diff/86400) + 'd ago';
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-PH', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
}

function getProjectBadge(projectId) {
  const p = (window.PROJECTS||[]).find(p=>p.id===projectId);
  if (!p) return '';
  return `<span class="badge badge-project" style="background:${p.color}22;color:${p.color}">${p.emoji}</span>`;
}

function escHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── NAV TABS ──────────────────────────────────────────────────────────────────

let currentTab = 'dashboard';

function switchTab(tab) {
  currentTab = tab;
  // Update tab buttons
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  // Show/hide views
  const dashboardView = document.getElementById('view-dashboard');
  const brandingView = document.getElementById('view-branding');
  const fab = document.getElementById('fab-add');

  if (tab === 'branding') {
    dashboardView.style.display = 'none';
    brandingView.style.display = 'block';
    fab.style.display = 'none';
    initBrandingPage();
  } else {
    dashboardView.style.display = '';
    brandingView.style.display = 'none';
    fab.style.display = '';
  }
}

// ── BRANDING PAGE ─────────────────────────────────────────────────────────────

let brandingInitialized = false;

function initBrandingPage() {
  const textarea = document.getElementById('branding-textarea');
  if (!brandingInitialized) {
    // Load from localStorage or default
    let content = null;
    try { content = localStorage.getItem(LS_KEYS.branding); } catch (e) {}
    textarea.value = content || window.BRANDING_MD || '';

    // Live preview on input
    textarea.addEventListener('input', () => {
      renderBrandingPreview();
    });
    brandingInitialized = true;
  }
  renderBrandingPreview();
}

function renderBrandingPreview() {
  const textarea = document.getElementById('branding-textarea');
  const preview = document.getElementById('branding-preview');
  preview.innerHTML = renderMarkdown(textarea.value);
}

function saveBranding() {
  const textarea = document.getElementById('branding-textarea');
  try {
    localStorage.setItem(LS_KEYS.branding, textarea.value);
  } catch (e) {}
  const btn = document.querySelector('.branding-btn-save');
  const orig = btn.textContent;
  btn.textContent = 'Saved! ✅';
  setTimeout(() => { btn.textContent = orig; }, 2000);
  addActivityEntry('🎨', 'Branding guidelines saved', 'success');
}

function copyBranding() {
  const textarea = document.getElementById('branding-textarea');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textarea.value).catch(() => fallbackCopy(textarea.value));
  } else {
    fallbackCopy(textarea.value);
  }
  const btn = document.querySelector('.branding-btn-copy');
  const orig = btn.textContent;
  btn.textContent = 'Copied! ✅';
  setTimeout(() => { btn.textContent = orig; }, 2000);
}

function resetBranding() {
  if (!confirm('Reset branding to default? Your edits will be lost.')) return;
  const textarea = document.getElementById('branding-textarea');
  textarea.value = window.BRANDING_MD || '';
  try { localStorage.removeItem(LS_KEYS.branding); } catch (e) {}
  renderBrandingPreview();
  addActivityEntry('🎨', 'Branding reset to defaults', 'info');
}

// ── MARKDOWN RENDERER ─────────────────────────────────────────────────────────

function renderMarkdown(md) {
  if (!md) return '';
  const lines = md.split('\n');
  let html = '';
  let inTable = false;
  let inUl = false;
  let inOl = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Horizontal rule
    if (/^---+\s*$/.test(line.trim())) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
      if (inTable) { html += '</tbody></table>'; inTable = false; }
      html += '<hr>';
      continue;
    }

    // Table row
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
      // Skip separator rows
      if (/^\|[-| :]+\|$/.test(line.trim())) continue;
      if (!inTable) {
        html += '<table>';
        inTable = true;
        const cells = line.split('|').filter(Boolean).map(c => '<th>' + mdInline(c.trim()) + '</th>').join('');
        html += '<thead><tr>' + cells + '</tr></thead><tbody>';
        // Skip next line if it's a separator
        if (lines[i + 1] && /^\|[-| :]+\|$/.test(lines[i + 1].trim())) i++;
        continue;
      } else {
        const cells = line.split('|').filter(Boolean).map(c => '<td>' + mdInline(c.trim()) + '</td>').join('');
        html += '<tr>' + cells + '</tr>';
        continue;
      }
    } else if (inTable) {
      html += '</tbody></table>';
      inTable = false;
    }

    // Headers
    const hMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (hMatch) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
      const lvl = hMatch[1].length;
      html += '<h' + lvl + '>' + mdInline(hMatch[2]) + '</h' + lvl + '>';
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
      html += '<blockquote>' + mdInline(line.slice(2)) + '</blockquote>';
      continue;
    }

    // Unordered list
    if (/^- (.+)/.test(line)) {
      if (inOl) { html += '</ol>'; inOl = false; }
      if (!inUl) { html += '<ul>'; inUl = true; }
      html += '<li>' + mdInline(line.replace(/^- /, '')) + '</li>';
      continue;
    } else if (inUl && line.trim() !== '') {
      html += '</ul>'; inUl = false;
    }

    // Ordered list
    if (/^\d+\.\s+(.+)/.test(line)) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (!inOl) { html += '<ol>'; inOl = true; }
      html += '<li>' + mdInline(line.replace(/^\d+\.\s+/, '')) + '</li>';
      continue;
    } else if (inOl && line.trim() !== '') {
      html += '</ol>'; inOl = false;
    }

    // Empty line — close lists
    if (!line.trim()) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
      continue;
    }

    // Paragraph
    html += '<p>' + mdInline(line) + '</p>';
  }

  if (inUl) html += '</ul>';
  if (inOl) html += '</ol>';
  if (inTable) html += '</tbody></table>';

  return html;
}

function mdInline(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');
}

// ── KEYBOARD SHORTCUTS ────────────────────────────────────────────────────────

document.addEventListener('keydown', e => {
  // Escape to close modals
  if (e.key === 'Escape') {
    closeModal();
    closeBriefModal();
    document.getElementById('quick-add-overlay').classList.remove('open');
    document.getElementById('settings-overlay').classList.remove('open');
  }
  // Ctrl+Shift+N = Quick Add
  if (e.ctrlKey && e.shiftKey && e.key === 'N') {
    e.preventDefault();
    openQuickAdd();
  }
});
