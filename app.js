// ⚔️ Perci Command Center — app.js

const COLUMNS = [
  { id: 'backlog',     label: '🧊 Backlog',     emoji: '🧊' },
  { id: 'todo',        label: '📌 Todo',         emoji: '📌' },
  { id: 'in-progress', label: '⚙️ In Progress',  emoji: '⚙️' },
  { id: 'blocked',     label: '🚫 Blocked',      emoji: '🚫' },
  { id: 'done',        label: '✅ Done',          emoji: '✅' },
];

const PRIORITY_ICONS = { high: '🔴', medium: '🟡', low: '🟢' };
const MOOD_ICONS = { focused: '⚔️', idle: '😴', thinking: '🧠', onfire: '🔥' };

let activeProject = null;
let tasks = [];

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  tasks = [...(window.TASKS || [])];
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
    <div class="mission-task">${s.currentTask || 'Awaiting orders'}</div>
    <div class="mission-step">${s.currentStep || ''} ${s.totalSteps ? `· Step ${s.currentStepNum} of ${s.totalSteps}` : ''}</div>
    ${s.totalSteps ? `
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill" style="width:${pct}%"></div>
      </div>
    ` : ''}
  `;
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
          <div class="carlo-card-title">${t.title}</div>
          ${t.carloAction ? `<div class="carlo-card-action">👉 ${t.carloAction}</div>` : ''}
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
  renderCarloActions();
  renderKanban();
  launchConfetti();
  renderStats();
}

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
          <div class="subagent-name">${a.name}</div>
          <div class="subagent-task">${a.task}</div>
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
            <span class="project-name">${p.name}</span>
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
    <div class="stat-item"><span class="stat-label">✅ Done this week</span><span class="stat-value">${s.tasksCompletedThisWeek || done}</span></div>
    <div class="stat-item"><span class="stat-label">🤖 Subagents</span><span class="stat-value">${agents}</span></div>
    <div class="stat-item"><span class="stat-label">🚫 Blocked</span><span class="stat-value" style="color:${blocked > 0 ? 'var(--red)' : 'var(--green)'}">${blocked}</span></div>
    <div class="stat-item"><span class="stat-label">📅 Days together</span><span class="stat-value">${s.daysWorkingTogether || 1}</span></div>
  `;
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
    return `
      <div class="kanban-col">
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
  return `
    <div class="task-card ${t.needsCarlo ? 'needs-carlo' : ''} ${t.subagentRunning ? 'has-subagent' : ''}" onclick="openModal('${t.id}')">
      <div class="task-card-top">
        <span class="task-priority">${PRIORITY_ICONS[t.priority] || '⚪'}</span>
        <span class="task-title">${t.title}</span>
      </div>
      <div class="task-badges">
        ${project ? `<span class="badge badge-project" style="background:${project.color}22;color:${project.color}">${project.emoji} ${project.name}</span>` : ''}
        ${t.needsCarlo ? `<span class="badge badge-carlo">🔴 Needs Carlo</span>` : ''}
        ${t.subagentRunning ? `<span class="badge badge-subagent">🤖 Agent Running</span>` : ''}
      </div>
      ${t.notes ? `<div class="task-notes">${t.notes}</div>` : ''}
      <div class="task-footer">
        <span class="task-date">${formatDate(t.updatedAt)}</span>
      </div>
    </div>
  `;
}

// ── MODAL ──────────────────────────────────────────────────────────────────────
function openModal(id) {
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  const project = (window.PROJECTS || []).find(p => p.id === t.project);
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-content').innerHTML = `
    <div class="modal-title">${PRIORITY_ICONS[t.priority]} ${t.title}</div>
    <div class="task-badges" style="margin-bottom:16px">
      ${project ? `<span class="badge badge-project" style="background:${project.color}22;color:${project.color}">${project.emoji} ${project.name}</span>` : ''}
      ${t.needsCarlo ? `<span class="badge badge-carlo">🔴 Needs Carlo</span>` : ''}
      ${t.subagentRunning ? `<span class="badge badge-subagent">🤖 Agent Running</span>` : ''}
    </div>
    <div class="modal-section">
      <div class="modal-label">Description</div>
      <div class="modal-value">${t.description}</div>
    </div>
    <div class="modal-section">
      <div class="modal-label">Status</div>
      <div class="modal-value">${COLUMNS.find(c=>c.id===t.status)?.label || t.status}</div>
    </div>
    ${t.notes ? `
      <div class="modal-section">
        <div class="modal-label">Perci's Notes</div>
        <div class="modal-value">${t.notes}</div>
      </div>
    ` : ''}
    ${t.carloAction ? `
      <div class="modal-section">
        <div class="modal-label">Carlo Needs To</div>
        <div class="modal-carlo-action">👉 ${t.carloAction}</div>
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

// ── ACTIVITY LOG ───────────────────────────────────────────────────────────────
function renderActivityLog() {
  const log = window.ACTIVITY_LOG || [];
  const el = document.getElementById('activity-log');
  el.innerHTML = log.map(l => `
    <div class="log-item ${l.type}">
      <span class="log-emoji">${l.emoji}</span>
      <div class="log-content">
        <div class="log-text">${l.text}</div>
        <div class="log-time">${timeAgo(l.time)}</div>
      </div>
    </div>
  `).join('');
}

// ── ON A ROLL ──────────────────────────────────────────────────────────────────
function checkOnARoll() {
  const s = window.STATS || {};
  if ((s.tasksCompletedThisWeek || 0) >= 5) {
    const el = document.createElement('div');
    el.className = 'on-a-roll';
    el.textContent = '🔥 On a roll! ' + s.tasksCompletedThisWeek + ' tasks crushed this week. Keep going!';
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
