// ⚔️ Perci Command Center — app.js (v3: Dopamine Chic)

const COLUMNS = [
  { id: 'backlog',     label: '🧊 Backlog',     emoji: '🧊' },
  { id: 'todo',        label: '📌 Todo',         emoji: '📌' },
  { id: 'in-progress', label: '⚙️ In Progress',  emoji: '⚙️' },
  { id: 'blocked',     label: '🚫 Blocked',      emoji: '🚫' },
  { id: 'done',        label: '✅ Done',          emoji: '✅' },
];

const PRIORITY_ICONS = { high: '🔴', medium: '🟡', low: '🟢' };
const MOOD_ICONS = { focused: '⚔️', idle: '😴', thinking: '🧠', onfire: '🔥', offline: '🔴' };

const LS_KEYS = {
  tasks: 'perci_tasks',
  brainDump: 'perci_brain_dump',
  brainDumpLast: 'perci_brain_dump_last',
  briefs: 'perci_briefs',
  compact: 'perci_compact',
  branding: 'perci_branding',
  streak: 'perci_streak',
  theme: 'perci_theme',
  sounds: 'perci_sounds',
};

let activeProject = null;
let tasks = [];
let briefs = {};
let streak = { count: 0, lastDate: null };
let soundsEnabled = true;

// ═══════════════════════════════════════════════════════════════════════════
// SOUNDS (Dopamine Hits!)
// ═══════════════════════════════════════════════════════════════════════════

const SOUNDS = {
  complete: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVoGAACAgICAgICAgICAgICAgICBgoOEhoeIiouMjY6PkJGSk5SVlpiZmpucnZ6foKGio6SlpqepqqusrK2ur7CxsrO0tba3uLm5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+//8=',
  pop: 'data:audio/wav;base64,UklGRl9vT19teleWQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhQW9PX3JlbGV2YW50cGxhY2Vob2xkZXI=',
};

function playSound(name) {
  if (!soundsEnabled) return;
  try {
    // Simple beep using Web Audio API
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (name === 'complete') {
      // Rising tone - dopamine hit!
      oscillator.frequency.setValueAtTime(523, audioCtx.currentTime); // C5
      oscillator.frequency.exponentialRampToValueAtTime(784, audioCtx.currentTime + 0.1); // G5
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.3);
    } else if (name === 'pop') {
      // Quick pop
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.05);
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.1);
    }
  } catch (e) { /* Audio not supported */ }
}

// ═══════════════════════════════════════════════════════════════════════════
// PERSISTENCE
// ═══════════════════════════════════════════════════════════════════════════

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

function loadStreak() {
  try {
    const raw = localStorage.getItem(LS_KEYS.streak);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { count: 0, lastDate: null };
}

function saveStreak() {
  try {
    localStorage.setItem(LS_KEYS.streak, JSON.stringify(streak));
  } catch (e) {}
}

function loadSoundsPreference() {
  try {
    const raw = localStorage.getItem(LS_KEYS.sounds);
    return raw !== 'false';
  } catch (e) { return true; }
}

// ═══════════════════════════════════════════════════════════════════════════
// STREAK SYSTEM (Dopamine!)
// ═══════════════════════════════════════════════════════════════════════════

function updateStreak() {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  if (streak.lastDate === today) {
    // Already incremented today — just increment count for task
    streak.count++;
  } else if (streak.lastDate === yesterday) {
    // Continue streak from yesterday
    streak.count++;
    streak.lastDate = today;
  } else {
    // Streak broken or first time
    streak.count = 1;
    streak.lastDate = today;
  }
  
  saveStreak();
  renderStreakBadge();
}

function renderStreakBadge() {
  let badge = document.querySelector('.streak-badge');
  
  if (streak.count >= 3) {
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'streak-badge';
      document.querySelector('.topbar-left').appendChild(badge);
    }
    badge.innerHTML = `🔥 ${streak.count} tasks`;
    badge.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: linear-gradient(135deg, #FF7A00, #EC4899);
      color: white;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 999px;
      margin-left: 12px;
      animation: streak-pulse 2s infinite;
    `;
  } else if (badge) {
    badge.remove();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  tasks = loadTasks();
  briefs = loadBriefs();
  streak = loadStreak();
  soundsEnabled = loadSoundsPreference();

  initTheme();
  initBgCanvas();
  initScrollEffect();
  renderStatus();
  renderStatusHero();
  renderProjects();
  renderStats();
  renderMissionControl();
  renderCarloActions();
  renderSubagents();
  renderPerciNotes();
  renderKanban();
  renderActivityLog();
  renderStreakBadge();
  checkOnARoll();
  startLiveSync();
  initBrainDump();
  initQuickAddProjects();
  initCompactMode();
  updateTabBadge();
  renderCalendar();
  initFilterProjects();

  // Refresh timestamps every 60 seconds
  setInterval(() => {
    renderKanban();
    renderActivityLog();
    renderStatus();
    renderStatusHero();
  }, 60000);
  
  // Add streak style
  const style = document.createElement('style');
  style.textContent = `
    @keyframes streak-pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(255,122,0,0); }
      50% { transform: scale(1.05); box-shadow: 0 0 16px rgba(255,122,0,0.4); }
    }
    
    @keyframes success-ripple {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(2); opacity: 0; }
    }
    
    .task-card.completing {
      animation: task-complete 0.5s ease forwards;
    }
    
    @keyframes task-complete {
      0% { transform: scale(1); }
      30% { transform: scale(1.05); }
      100% { transform: scale(0.95) translateX(20px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
});

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL EFFECT (Topbar Shadow)
// ═══════════════════════════════════════════════════════════════════════════

function initScrollEffect() {
  const topbar = document.querySelector('.topbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      topbar.classList.add('scrolled');
    } else {
      topbar.classList.remove('scrolled');
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// BACKGROUND PARTICLES (Subtle, Light-Friendly)
// ═══════════════════════════════════════════════════════════════════════════

function initBgCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const dots = Array.from({ length: 40 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 2 + 1,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
    alpha: Math.random() * 0.3 + 0.1
  }));

  // UPGRADE 5: Flame particles for onfire mood
  const flames = Array.from({ length: 20 }, () => resetFlame({ x: 0, y: 0 }));

  function resetFlame(f) {
    f.x = Math.random() * W;
    f.y = H + 10;
    f.r = Math.random() * 4 + 2;
    f.vy = -(Math.random() * 2 + 1);
    f.vx = (Math.random() - 0.5) * 0.5;
    f.alpha = Math.random() * 0.5 + 0.3;
    f.life = 0;
    f.maxLife = 80 + Math.random() * 60;
    return f;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const mood = document.body.getAttribute('data-mood') || 'focused';
    const isOffline = mood === 'offline';
    const speed = mood === 'idle' ? 0.5 : (mood === 'thinking' ? 0.8 : 1);

    // Base dots
    if (!isOffline) {
      const dotColor = mood === 'thinking' ? '124,58,237' : '255,122,0';
      dots.forEach(d => {
        d.x += d.vx * speed;
        d.y += d.vy * speed;
        if (d.x < 0) d.x = W;
        if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H;
        if (d.y > H) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor},${d.alpha})`;
        ctx.fill();
      });
    }

    // Flame particles (onfire only)
    if (mood === 'onfire') {
      flames.forEach(f => {
        f.x += f.vx;
        f.y += f.vy;
        f.life++;
        const progress = f.life / f.maxLife;
        const alpha = f.alpha * (1 - progress);
        if (f.life >= f.maxLife || alpha <= 0) resetFlame(f);
        const r = f.r * (1 - progress * 0.5);
        ctx.beginPath();
        ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,${Math.floor(100 + 50 * (1 - progress))},0,${alpha})`;
        ctx.fill();
      });
    }

    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// STATUS
// ═══════════════════════════════════════════════════════════════════════════

function renderStatus() {
  const s = window.PERCI_STATUS || {};
  const updated = document.getElementById('last-updated');
  if (updated && !updated.textContent.startsWith('Synced')) {
    if (s.lastUpdated) updated.textContent = 'Data: ' + timeAgo(s.lastUpdated);
  }

  // UPGRADE 3: Topbar status pill
  const pillEmoji = document.getElementById('topbar-mood-emoji');
  const pillText = document.getElementById('topbar-status-text');
  if (pillEmoji) pillEmoji.textContent = MOOD_ICONS[s.mood] || '⚔️';
  if (pillText) pillText.textContent = s.statusText || 'Standing by';

  // UPGRADE 3: Agent count badge
  const agentBadge = document.getElementById('topbar-agent-badge');
  const agentCount = (window.SUBAGENTS || []).length;
  if (agentBadge) {
    agentBadge.textContent = agentCount > 0 ? `${agentCount} agent${agentCount > 1 ? 's' : ''} running` : '0 agents';
    agentBadge.classList.toggle('no-agents', agentCount === 0);
  }

  // UPGRADE 5: Mood on body
  const mood = s.mood || 'focused';
  document.body.setAttribute('data-mood', mood);
}

// ═══════════════════════════════════════════════════════════════════════════
// STATUS HERO
// ═══════════════════════════════════════════════════════════════════════════

const MOOD_LABELS = {
  focused: 'is focused',
  idle: 'is chilling',
  thinking: 'is thinking...',
  onfire: 'is on fire!',
  offline: 'is offline'
};

function renderStatusHero() {
  const s = window.PERCI_STATUS || {};
  const hero = document.getElementById('status-hero');
  const emoji = document.getElementById('hero-emoji');
  const text = document.getElementById('hero-text');
  const sub = document.getElementById('hero-sub');
  if (!hero) return;

  // Determine mood
  let mood = s.mood || 'focused';
  if (s.status === 'offline') mood = 'offline';
  if (s.status === 'idle' && !s.mood) mood = 'idle';

  // UPGRADE 1: Giant emoji (120px via CSS)
  emoji.textContent = MOOD_ICONS[mood] || '⚔️';

  // Set mood class for glow ring + animations
  hero.className = 'status-hero mood-' + mood;

  // Bold status text with current task
  const label = MOOD_LABELS[mood] || 'is standing by';
  if (s.currentTask && mood !== 'idle' && mood !== 'offline') {
    text.innerHTML = '<span class="hero-accent">Perci</span> is working on: ' + escHtml(s.currentTask);
  } else {
    text.innerHTML = '<span class="hero-accent">Perci</span> ' + escHtml(label);
  }

  // Subtitle: current step
  sub.textContent = s.currentStep || s.statusText || 'Ready for action';
}

// ═══════════════════════════════════════════════════════════════════════════
// MISSION CONTROL
// ═══════════════════════════════════════════════════════════════════════════

function renderMissionControl() {
  const s = window.PERCI_STATUS || {};
  const el = document.getElementById('mission-control');
  const pct = s.totalSteps ? Math.round((s.currentStepNum / s.totalSteps) * 100) : 0;

  // UPGRADE 6: Determine who is working
  const agents = window.SUBAGENTS || [];
  let whoPill = '<span class="mission-who-pill">⚔️ Perci</span>';
  if (agents.length > 0) {
    const a = agents[0];
    const agentConfig = (window.AGENTS_CONFIG || []).find(c => c.id === (a.agentId || a.id));
    const aEmoji = agentConfig ? agentConfig.emoji : '🤖';
    const aName = agentConfig ? agentConfig.name : (a.name || 'Agent');
    whoPill = `<span class="mission-who-pill">${aEmoji} ${escHtml(aName)}</span>`;
  }

  el.innerHTML = `
    <div class="mission-label">Current Mission</div>
    <div class="mission-task">${escHtml(s.currentTask || 'Awaiting your command')}</div>
    ${whoPill}
    <div class="mission-step">${escHtml(s.currentStep || 'Ready to start')} ${s.totalSteps ? `• Step ${s.currentStepNum} of ${s.totalSteps}` : ''}</div>
    ${s.totalSteps ? `
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill" style="width:${pct}%"></div>
      </div>
      <div class="mission-eta">${pct}% complete</div>
    ` : ''}
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
// BRAIN DUMP
// ═══════════════════════════════════════════════════════════════════════════

function initBrainDump() {
  const textarea = document.getElementById('brain-dump-text');

  // Restore saved draft
  try {
    const saved = localStorage.getItem(LS_KEYS.brainDump);
    if (saved) textarea.value = saved;
  } catch (e) {}

  // Auto-save draft as user types
  textarea.addEventListener('input', () => {
    try { localStorage.setItem(LS_KEYS.brainDump, textarea.value); } catch (e) {}
  });

  showLastBrainDump();
}

function showLastBrainDump() {
  const lastEl = document.getElementById('brain-dump-last');
  try {
    const raw = localStorage.getItem(LS_KEYS.brainDumpLast);
    if (raw) {
      const data = JSON.parse(raw);
      lastEl.textContent = `Sent ${timeAgo(data.time)}: "${data.text.substring(0, 50)}${data.text.length > 50 ? '...' : ''}"`;
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
    navigator.clipboard.writeText(formatted).catch(() => fallbackCopy(formatted));
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
  btn.textContent = '✅ Copied!';
  btn.style.background = '#22C55E';
  playSound('pop');
  
  setTimeout(() => {
    btn.textContent = 'Send to Perci 📨';
    btn.style.background = '';
  }, 2000);

  textarea.value = '';
  showLastBrainDump();
  addActivityEntry('📨', `Brain dump sent: "${text.substring(0, 40)}${text.length > 40 ? '...' : ''}"`, 'info');
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

// ═══════════════════════════════════════════════════════════════════════════
// CARLO ACTIONS
// ═══════════════════════════════════════════════════════════════════════════

function renderCarloActions() {
  const carloTasks = tasks.filter(t => t.needsCarlo && t.status !== 'done');
  const el = document.getElementById('carlo-actions');
  
  if (!carloTasks.length) {
    el.innerHTML = '';
    return;
  }

  el.innerHTML = `
    <div class="carlo-header">🔴 Needs Your Attention (${carloTasks.length})</div>
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
  
  // Animate out
  const card = document.getElementById(`carlo-${id}`);
  if (card) {
    card.style.transition = 'all 0.3s ease';
    card.style.transform = 'translateX(100%)';
    card.style.opacity = '0';
  }
  
  setTimeout(() => {
    task.needsCarlo = false;
    task.status = 'done';
    task.updatedAt = new Date().toISOString();
    saveTasks();
    
    updateStreak();
    playSound('complete');
    launchConfetti();
    
    renderAll();
    addActivityEntry('✅', `Completed: ${task.title}`, 'success');
  }, 300);
}

// ═══════════════════════════════════════════════════════════════════════════
// TASK ACTIONS
// ═══════════════════════════════════════════════════════════════════════════

function markTaskDone(id, event) {
  if (event) event.stopPropagation();
  const task = tasks.find(t => t.id === id);
  if (!task || task.status === 'done') return;

  // Animate the card
  const card = document.querySelector(`[data-task-id="${id}"]`);
  if (card) {
    card.classList.add('completing');
  }

  setTimeout(() => {
    task.status = 'done';
    task.updatedAt = new Date().toISOString();
    task.needsCarlo = false;
    saveTasks();

    updateStreak();
    playSound('complete');
    launchConfetti();
    
    renderAll();
    addActivityEntry('✅', `Task completed: ${task.title}`, 'success');
  }, 400);
}

function unblockTask(id, event) {
  if (event) event.stopPropagation();
  const task = tasks.find(t => t.id === id);
  if (!task || task.status !== 'blocked') return;

  task.status = 'in-progress';
  task.updatedAt = new Date().toISOString();
  saveTasks();

  playSound('pop');
  renderAll();

  // Celebration animation
  setTimeout(() => {
    const card = document.querySelector(`[data-task-id="${id}"]`);
    if (card) {
      card.classList.add('unblock-anim');
      setTimeout(() => card.classList.remove('unblock-anim'), 700);
    }
  }, 50);

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
    <div class="modal-title">📋 Brief — ${escHtml(task.title)}</div>
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

  const task = tasks.find(t => t.id === id);
  if (task && text) {
    task.briefAdded = true;
    task.updatedAt = new Date().toISOString();
    saveTasks();
  } else if (task && !text) {
    task.briefAdded = false;
    saveTasks();
  }

  playSound('pop');
  closeBriefModal();
  renderKanban();
  addActivityEntry('📋', `Brief saved: ${task ? task.title : id}`, 'info');
}

function closeBriefModal() {
  document.getElementById('brief-overlay').classList.remove('open');
}

document.getElementById('brief-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('brief-overlay')) closeBriefModal();
});

// ═══════════════════════════════════════════════════════════════════════════
// SUBAGENTS
// ═══════════════════════════════════════════════════════════════════════════

// UPGRADE 2: Track elapsed time for subagents
let subagentTimerInterval = null;

function renderSubagents() {
  const agents = window.SUBAGENTS || [];
  const el = document.getElementById('subagents-panel');

  // Clear any existing timer
  if (subagentTimerInterval) { clearInterval(subagentTimerInterval); subagentTimerInterval = null; }

  // UPGRADE 2: Always show panel header
  if (!agents.length) {
    el.innerHTML = `
      <div class="subagents-header">🤖 Active Agents</div>
      <div class="subagent-solo">
        <span class="subagent-solo-emoji">⚔️</span>
        Perci is handling it solo
      </div>
    `;
    return;
  }

  el.innerHTML = `
    <div class="subagents-header">🤖 Active Agents (${agents.length})</div>
    ${agents.map(a => {
      const agentConfig = (window.AGENTS_CONFIG || []).find(c => c.id === (a.agentId || a.id));
      const aEmoji = agentConfig ? agentConfig.emoji : '🤖';
      const aName = agentConfig ? agentConfig.name : (a.name || 'Agent');
      const aColor = agentConfig ? agentConfig.color : 'var(--orange)';
      return `
      <div class="subagent-card" style="border-color:${aColor}">
        <div class="subagent-avatar">${aEmoji}</div>
        <div class="subagent-info">
          <div class="subagent-name">${escHtml(aName)}</div>
          <div class="subagent-task-desc">${escHtml(a.task || a.description || 'Working...')}</div>
          <div class="subagent-meta">
            ${getProjectBadge(a.project)}
            <div class="subagent-time" data-started="${a.startedAt || ''}">${a.startedAt ? timeAgo(a.startedAt) : ''}</div>
            <div class="subagent-progress-bar"><div class="subagent-progress-fill" style="background:${aColor}"></div></div>
          </div>
        </div>
        <div class="subagent-spinner" style="border-top-color:${aColor}"></div>
      </div>
    `;}).join('')}
  `;

  // Live-update elapsed time every second
  subagentTimerInterval = setInterval(() => {
    document.querySelectorAll('.subagent-time[data-started]').forEach(el => {
      const started = el.dataset.started;
      if (started) el.textContent = timeAgo(started);
    });
  }, 1000);
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════════════════════════════════════

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
  playSound('pop');
  renderProjects();
  renderKanban();
}

// ═══════════════════════════════════════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════════════════════════════════════

function renderStats() {
  const el = document.getElementById('stats-panel');
  const s = window.STATS || {};
  const blocked = tasks.filter(t => t.status === 'blocked').length;
  const done = tasks.filter(t => t.status === 'done').length;
  const agents = (window.SUBAGENTS || []).length;
  
  el.innerHTML = `
    <div class="stat-item">
      <span class="stat-label">✅ Completed</span>
      <span class="stat-value">${done}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">🤖 Agents</span>
      <span class="stat-value">${agents}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">🚫 Blocked</span>
      <span class="stat-value" style="color:${blocked > 0 ? 'var(--red)' : 'var(--green)'}">${blocked}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">🔥 Streak</span>
      <span class="stat-value">${streak.count}</span>
    </div>
  `;

  const settingsDays = document.getElementById('settings-days');
  if (settingsDays) settingsDays.textContent = s.daysWorkingTogether || 1;
}

// ═══════════════════════════════════════════════════════════════════════════
// KANBAN
// ═══════════════════════════════════════════════════════════════════════════

function renderKanban() {
  const board = document.getElementById('kanban-board');
  let filtered = activeProject ? tasks.filter(t => t.project === activeProject) : [...tasks];

  // Apply quick filter
  if (activeQuickFilter === 'needs-carlo') {
    filtered = filtered.filter(t => t.needsCarlo);
  } else if (activeQuickFilter === 'high') {
    filtered = filtered.filter(t => t.priority === 'high');
  } else if (activeQuickFilter === 'in-progress') {
    filtered = filtered.filter(t => t.status === 'in-progress');
  }

  // UPGRADE 4: needs-carlo floats to top, then by priority
  const sorted = [...filtered].sort((a, b) => {
    if (a.needsCarlo && !b.needsCarlo) return -1;
    if (!a.needsCarlo && b.needsCarlo) return 1;
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
        ${colTasks.map(t => renderTaskCard(t)).join('') || `<div style="color:var(--text-muted);font-size:12px;text-align:center;padding:24px 0">No tasks</div>`}
      </div>
    `;
  }).join('');
}

function renderTaskCard(t) {
  const project = (window.PROJECTS || []).find(p => p.id === t.project);
  const projectColor = project ? project.color : 'transparent';
  const hasBrief = briefs[t.id] || t.briefAdded;

  // UPGRADE 4: Find which agent is running on this task
  let subagentBadge = '';
  if (t.subagentRunning) {
    const runningAgent = (window.SUBAGENTS || []).find(a => a.taskId === t.id);
    if (runningAgent) {
      const agentConfig = (window.AGENTS_CONFIG || []).find(c => c.id === (runningAgent.agentId || runningAgent.id));
      const aEmoji = agentConfig ? agentConfig.emoji : '🤖';
      const aName = agentConfig ? agentConfig.name : (runningAgent.name || 'Agent');
      subagentBadge = `<span class="badge badge-subagent">${aEmoji} ${escHtml(aName)}</span>`;
    } else {
      subagentBadge = `<span class="badge badge-subagent">🤖 Agent</span>`;
    }
  }

  let actionButtons = '';
  if (t.status !== 'done') {
    actionButtons += `<button class="task-action-btn btn-done" onclick="markTaskDone('${t.id}', event)" title="Mark Done">✓ Done</button>`;
  }
  if (t.status === 'blocked') {
    actionButtons += `<button class="task-action-btn btn-unblock" onclick="unblockTask('${t.id}', event)" title="Unblock">🔓 Unblock</button>`;
  }
  actionButtons += `<button class="task-action-btn" onclick="openBriefModal('${t.id}', event)" title="Add Brief">📋</button>`;

  return `
    <div class="task-card card-sliding ${t.needsCarlo ? 'needs-carlo' : ''} ${t.subagentRunning ? 'has-subagent' : ''}"
         data-task-id="${t.id}"
         style="border-left-color: ${projectColor}"
         title="${t.notes ? escHtml(t.notes) : ''}"
         onclick="openModal('${t.id}')">
      ${hasBrief ? '<div class="brief-dot"></div>' : ''}
      <div class="task-card-top">
        <span class="task-priority">${PRIORITY_ICONS[t.priority] || '⚪'}</span>
        <span class="task-title">${escHtml(t.title)}</span>
      </div>
      <div class="task-badges">
        ${project ? `<span class="badge badge-project" style="background:${project.color}15;color:${project.color}">${project.emoji} ${escHtml(project.name)}</span>` : ''}
        ${t.needsCarlo ? `<span class="badge badge-carlo">🔴 Needs You</span>` : ''}
        ${subagentBadge}
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

// ═══════════════════════════════════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════════════════════════════════

function openModal(id) {
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  const project = (window.PROJECTS || []).find(p => p.id === t.project);
  const brief = briefs[id] || '';
  const overlay = document.getElementById('modal-overlay');
  
  document.getElementById('modal-content').innerHTML = `
    <div class="modal-title">${PRIORITY_ICONS[t.priority]} ${escHtml(t.title)}</div>
    <div class="task-badges" style="margin-bottom:20px">
      ${project ? `<span class="badge badge-project" style="background:${project.color}15;color:${project.color}">${project.emoji} ${escHtml(project.name)}</span>` : ''}
      ${t.needsCarlo ? `<span class="badge badge-carlo">🔴 Needs You</span>` : ''}
      ${t.subagentRunning ? `<span class="badge badge-subagent">🤖 Agent</span>` : ''}
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
        <div class="modal-label">Notes</div>
        <div class="modal-value">${escHtml(t.notes)}</div>
      </div>
    ` : ''}
    ${brief ? `
      <div class="modal-section">
        <div class="modal-label">📋 Your Brief</div>
        <div class="modal-value" style="background:var(--orange-soft);padding:14px;border-radius:var(--radius);border:1px solid var(--orange)">${escHtml(brief)}</div>
      </div>
    ` : ''}
    ${t.carloAction ? `
      <div class="modal-section">
        <div class="modal-label">Action Required</div>
        <div class="modal-carlo-action">👉 ${escHtml(t.carloAction)}</div>
      </div>
    ` : ''}
    <div class="modal-section" style="display:flex;gap:20px">
      <div>
        <div class="modal-label">Created</div>
        <div class="modal-value" style="font-size:13px">${formatDate(t.createdAt)}</div>
      </div>
      <div>
        <div class="modal-label">Updated</div>
        <div class="modal-value" style="font-size:13px">${formatDate(t.updatedAt)}</div>
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

// ═══════════════════════════════════════════════════════════════════════════
// QUICK ADD
// ═══════════════════════════════════════════════════════════════════════════

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
  playSound('pop');
  setTimeout(() => document.getElementById('qa-title').focus(), 350);
}

function closeQuickAdd(event) {
  if (event && event.target !== document.getElementById('quick-add-overlay')) return;
  document.getElementById('quick-add-overlay').classList.remove('open');
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

  playSound('pop');
  document.getElementById('quick-add-overlay').classList.remove('open');
  document.getElementById('qa-title').value = '';
  document.getElementById('qa-notes').value = '';

  renderAll();
  addActivityEntry('📌', `New task: ${title}`, 'success');
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════════════

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
  if (!confirm('Reset ALL data? This clears all your tasks, briefs, and streak.')) return;

  Object.values(LS_KEYS).forEach(key => {
    try { localStorage.removeItem(key); } catch (e) {}
  });

  tasks = [...(window.TASKS || [])];
  briefs = {};
  streak = { count: 0, lastDate: null };
  saveTasks();
  saveBriefs();

  document.getElementById('brain-dump-text').value = '';
  document.getElementById('brain-dump-last').textContent = '';

  renderAll();
  renderStreakBadge();
  toggleSettings();
  addActivityEntry('🗑️', 'Data reset to defaults', 'info');
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

// ═══════════════════════════════════════════════════════════════════════════
// ACTIVITY LOG
// ═══════════════════════════════════════════════════════════════════════════

let activityLog = [];

function renderActivityLog() {
  const log = [...(window.ACTIVITY_LOG || []), ...activityLog]
    .sort((a, b) => new Date(b.time) - new Date(a.time));
  const el = document.getElementById('activity-log');
  
  el.innerHTML = log.slice(0, 20).map(l => `
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

// ═══════════════════════════════════════════════════════════════════════════
// TAB BADGE
// ═══════════════════════════════════════════════════════════════════════════

function updateTabBadge() {
  const carloCount = tasks.filter(t => t.needsCarlo && t.status !== 'done').length;
  if (carloCount > 0) {
    document.title = `(${carloCount}) ⚔️ Perci Command Center`;
  } else {
    document.title = '⚔️ Perci Command Center';
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ON A ROLL
// ═══════════════════════════════════════════════════════════════════════════

function checkOnARoll() {
  const s = window.STATS || {};
  const done = tasks.filter(t => t.status === 'done').length;
  const count = Math.max(s.tasksCompletedThisWeek || 0, done);
  
  if (count >= 5) {
    const existing = document.querySelector('.on-a-roll');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = 'on-a-roll';
    el.textContent = '🔥 On a roll! ' + count + ' tasks crushed. Keep going!';
    document.querySelector('.main-content').prepend(el);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFETTI (Dopamine Burst!)
// ═══════════════════════════════════════════════════════════════════════════

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#FF7A00', '#FFB347', '#22C55E', '#3B82F6', '#EC4899', '#9333EA', '#06B6D4'];
  
  const pieces = Array.from({ length: 80 }, () => ({
    x: canvas.width / 2 + (Math.random() - 0.5) * 200,
    y: canvas.height / 2,
    r: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 12,
    vy: Math.random() * -15 - 5,
    rot: Math.random() * 360,
    vr: (Math.random() - 0.5) * 15,
    gravity: 0.3
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rot += p.vr;
      p.vx *= 0.99;
      
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r);
      ctx.restore();
    });
    
    frame++;
    if (frame < 120 && pieces.some(p => p.y < canvas.height + 50)) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  draw();
}

// ═══════════════════════════════════════════════════════════════════════════
// PERCI NOTES PANEL
// ═══════════════════════════════════════════════════════════════════════════

let perciNotesCollapsed = false;

function renderPerciNotes() {
  const notes = window.PERCI_NOTES || {};
  const el = document.getElementById('perci-notes-panel');
  if (!el) return;

  const reads = notes.confirmedReads || [];
  const summary = notes.percisNotes || '';
  const lastUpdated = notes.lastUpdated || '';

  if (!reads.length && !summary) {
    el.innerHTML = '';
    return;
  }

  el.innerHTML = `
    <div class="perci-notes-header">
      <div class="perci-notes-title">
        <span>⚔️</span>
        <span>Perci's Notes</span>
      </div>
      <div class="perci-notes-sync">
        <span class="sync-dot"></span>
        <span>Last sync: ${lastUpdated ? timeAgo(lastUpdated) : 'unknown'}</span>
      </div>
    </div>
    ${summary ? `
      <div class="perci-notes-summary">
        <span class="perci-notes-summary-icon">📝</span>
        ${escHtml(summary)}
      </div>
    ` : ''}
    ${reads.length ? `
      <div class="perci-reads-title">
        <span>📂 Confirmed Reads (${reads.length})</span>
        <button class="perci-reads-toggle" onclick="togglePerciNotesCollapse()">
          ${perciNotesCollapsed ? '▼ Expand' : '▲ Collapse'}
        </button>
      </div>
      <div class="perci-reads-list ${perciNotesCollapsed ? 'collapsed' : ''}">
        ${reads.map(r => `
          <div class="perci-read-item">
            <span class="perci-read-icon">✅</span>
            <div class="perci-read-content">
              <div class="perci-read-file">${escHtml(r.file)}</div>
              ${r.note ? `<div class="perci-read-note">${escHtml(r.note)}</div>` : ''}
            </div>
            <span class="perci-read-time">${timeAgo(r.at)}</span>
          </div>
        `).join('')}
      </div>
    ` : ''}
  `;
}

function togglePerciNotesCollapse() {
  perciNotesCollapsed = !perciNotesCollapsed;
  renderPerciNotes();
}

// ═══════════════════════════════════════════════════════════════════════════
// RENDER ALL
// ═══════════════════════════════════════════════════════════════════════════

function renderAll() {
  renderStatus();
  renderStatusHero();
  renderProjects();
  renderStats();
  renderMissionControl();
  renderCarloActions();
  renderSubagents();
  renderPerciNotes();
  renderKanban();
  renderActivityLog();
  updateTabBadge();
  checkOnARoll();
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getProjectBadge(projectId) {
  const p = (window.PROJECTS || []).find(p => p.id === projectId);
  if (!p) return '';
  return `<span class="badge badge-project" style="background:${p.color}15;color:${p.color}">${p.emoji}</span>`;
}

function escHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ═══════════════════════════════════════════════════════════════════════════
// NAV TABS
// ═══════════════════════════════════════════════════════════════════════════

let currentTab = 'dashboard';

function switchTab(tab) {
  currentTab = tab;
  playSound('pop');

  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  const views = ['dashboard', 'tasks', 'content', 'agents', 'branding'];
  views.forEach(v => {
    const el = document.getElementById('view-' + v);
    if (el) el.style.display = (v === tab) ? '' : 'none';
  });

  const fab = document.getElementById('fab-add');
  fab.style.display = (tab === 'branding') ? 'none' : '';

  if (tab === 'branding') initBrandingPage();
  if (tab === 'tasks') renderTasksList();
  if (tab === 'content') renderContentCalendar();
  if (tab === 'agents') renderAgentsView();
}

function renderTasksList() {
  applyTaskFilters();
}

function renderContentCalendar() {
  // Already handled by existing calendar code if present
}

function renderAgentsView() {
  const grid = document.getElementById('agents-grid');
  if (!grid) return;
  const configs = window.AGENTS_CONFIG || [];
  grid.innerHTML = configs.map(a => `
    <div class="agent-card" style="border-left: 4px solid ${a.color}">
      <div style="font-size:36px;margin-bottom:8px">${a.emoji}</div>
      <div style="font-weight:800;font-size:16px">${escHtml(a.name)}</div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:2px">${escHtml(a.role)}</div>
      <div style="font-size:11px;color:var(--text-secondary);margin-top:8px">${escHtml(a.description)}</div>
      <div style="margin-top:10px;display:flex;gap:8px;align-items:center">
        <span class="badge" style="background:${a.status === 'active' ? 'var(--green-soft)' : 'var(--bg3)'};color:${a.status === 'active' ? 'var(--green)' : 'var(--text-muted)'}">${a.status === 'active' ? '🟢 Active' : '😴 Idle'}</span>
        <span style="font-size:10px;color:var(--text-muted)">${escHtml(a.model)}</span>
      </div>
    </div>
  `).join('');
}

// ═══════════════════════════════════════════════════════════════════════════
// BRANDING PAGE (NEW — Brand-based document viewer)
// ═══════════════════════════════════════════════════════════════════════════

let activeBrandId = null;
let expandedDocs = new Set();

function initBrandingPage() {
  renderBrandSidebar();
  
  // Auto-select first brand if none selected
  const brands = window.BRANDING_DATA || [];
  if (brands.length > 0 && !activeBrandId) {
    selectBrand(brands[0].id);
  }
}

function renderBrandSidebar() {
  const sidebar = document.getElementById('brand-sidebar');
  if (!sidebar) return;
  
  const brands = window.BRANDING_DATA || [];
  
  if (!brands.length) {
    sidebar.innerHTML = `
      <div class="brand-card" style="text-align:center;cursor:default">
        <div style="font-size:32px;margin-bottom:8px">🎨</div>
        <div style="color:var(--text-muted);font-size:13px">No brands configured yet</div>
      </div>
    `;
    return;
  }
  
  sidebar.innerHTML = brands.map(brand => `
    <div class="brand-card ${activeBrandId === brand.id ? 'active' : ''}" 
         style="--brand-color: ${brand.color}"
         onclick="selectBrand('${brand.id}')">
      <div class="brand-card-header">
        <span class="brand-card-emoji">${brand.emoji}</span>
        <div class="brand-card-info">
          <div class="brand-card-name">${escHtml(brand.name)}</div>
          <div class="brand-card-tagline">${escHtml(brand.tagline || '')}</div>
        </div>
      </div>
      <div class="brand-card-meta">
        <span class="brand-card-badge">${brand.docs ? brand.docs.length : 0} docs</span>
        <span class="brand-card-badge">${escHtml(brand.market || '')}</span>
      </div>
    </div>
  `).join('');
}

function selectBrand(brandId) {
  activeBrandId = brandId;
  expandedDocs.clear(); // Reset expanded state
  
  playSound('pop');
  renderBrandSidebar();
  renderBrandDocs();
}

function renderBrandDocs() {
  const panel = document.getElementById('brand-docs-panel');
  if (!panel) return;
  
  const brands = window.BRANDING_DATA || [];
  const brand = brands.find(b => b.id === activeBrandId);
  
  if (!brand) {
    panel.innerHTML = `
      <div class="brand-docs-empty">
        <div class="empty-icon">🎨</div>
        <div class="empty-text">Select a brand to view its documents</div>
      </div>
    `;
    return;
  }
  
  const docs = brand.docs || [];
  
  panel.innerHTML = `
    <div class="brand-docs-header" style="border-left: 4px solid ${brand.color}">
      <div class="brand-docs-title">
        <span class="brand-docs-emoji">${brand.emoji}</span>
        <span class="brand-docs-name">${escHtml(brand.name)}</span>
      </div>
      <div class="brand-docs-tagline">${escHtml(brand.tagline || '')}</div>
      <div class="brand-docs-meta">
        <span>📦 ${escHtml(brand.category || '')}</span>
        <span>🌍 ${escHtml(brand.market || '')}</span>
      </div>
    </div>
    <div class="brand-docs-content">
      ${docs.map(doc => `
        <div class="doc-card ${expandedDocs.has(doc.id) ? 'expanded' : ''}" 
             id="doc-${doc.id}"
             style="--brand-color: ${brand.color}">
          <div class="doc-card-header" onclick="toggleDocCard('${doc.id}')">
            <span class="doc-card-title">${escHtml(doc.title)}</span>
            <span class="doc-card-toggle">▼</span>
          </div>
          <div class="doc-card-body">
            ${renderDocContent(doc.content)}
          </div>
        </div>
      `).join('')}
      ${!docs.length ? `
        <div style="text-align:center;color:var(--text-muted);padding:40px">
          No documents for this brand yet
        </div>
      ` : ''}
    </div>
  `;
  
  // Auto-expand first doc
  if (docs.length > 0 && expandedDocs.size === 0) {
    expandedDocs.add(docs[0].id);
    const firstDoc = document.getElementById('doc-' + docs[0].id);
    if (firstDoc) firstDoc.classList.add('expanded');
  }
}

function toggleDocCard(docId) {
  if (expandedDocs.has(docId)) {
    expandedDocs.delete(docId);
  } else {
    expandedDocs.add(docId);
  }
  
  const card = document.getElementById('doc-' + docId);
  if (card) {
    card.classList.toggle('expanded', expandedDocs.has(docId));
  }
  
  playSound('pop');
}

function renderDocContent(content) {
  if (!content) return '';
  
  // Simple markdown-like rendering
  let html = escHtml(content);
  
  // Bold **text**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Lines starting with - become list items
  const lines = html.split('\n');
  let result = '';
  let inList = false;
  
  for (const line of lines) {
    if (line.trim().startsWith('- ')) {
      if (!inList) {
        result += '<ul>';
        inList = true;
      }
      result += '<li>' + line.trim().slice(2) + '</li>';
    } else {
      if (inList) {
        result += '</ul>';
        inList = false;
      }
      if (line.trim()) {
        result += '<p>' + line + '</p>';
      }
    }
  }
  
  if (inList) result += '</ul>';
  
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// MARKDOWN RENDERER
// ═══════════════════════════════════════════════════════════════════════════

function renderMarkdown(md) {
  if (!md) return '';
  const lines = md.split('\n');
  let html = '';
  let inTable = false;
  let inUl = false;
  let inOl = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^---+\s*$/.test(line.trim())) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
      if (inTable) { html += '</tbody></table>'; inTable = false; }
      html += '<hr>';
      continue;
    }

    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
      if (/^\|[-| :]+\|$/.test(line.trim())) continue;
      if (!inTable) {
        html += '<table>';
        inTable = true;
        const cells = line.split('|').filter(Boolean).map(c => '<th>' + mdInline(c.trim()) + '</th>').join('');
        html += '<thead><tr>' + cells + '</tr></thead><tbody>';
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

    const hMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (hMatch) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
      const lvl = hMatch[1].length;
      html += '<h' + lvl + '>' + mdInline(hMatch[2]) + '</h' + lvl + '>';
      continue;
    }

    if (line.startsWith('> ')) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
      html += '<blockquote>' + mdInline(line.slice(2)) + '</blockquote>';
      continue;
    }

    if (/^- (.+)/.test(line)) {
      if (inOl) { html += '</ol>'; inOl = false; }
      if (!inUl) { html += '<ul>'; inUl = true; }
      html += '<li>' + mdInline(line.replace(/^- /, '')) + '</li>';
      continue;
    } else if (inUl && line.trim() !== '') {
      html += '</ul>'; inUl = false;
    }

    if (/^\d+\.\s+(.+)/.test(line)) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (!inOl) { html += '<ol>'; inOl = true; }
      html += '<li>' + mdInline(line.replace(/^\d+\.\s+/, '')) + '</li>';
      continue;
    } else if (inOl && line.trim() !== '') {
      html += '</ol>'; inOl = false;
    }

    if (!line.trim()) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
      continue;
    }

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

// ═══════════════════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeBriefModal();
    document.getElementById('quick-add-overlay').classList.remove('open');
    document.getElementById('settings-overlay').classList.remove('open');
  }
  if (e.ctrlKey && e.shiftKey && e.key === 'N') {
    e.preventDefault();
    openQuickAdd();
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// LIVE SYNC
// ═══════════════════════════════════════════════════════════════════════════

function startLiveSync() {
  const isLocal = location.hostname === 'localhost' || /^192\.168/.test(location.hostname);
  const interval = isLocal ? 15000 : 60000;
  let lastVersion = window.DATA_VERSION || '';

  // Update "last synced" display on each cycle
  function updateSyncTimestamp() {
    const el = document.getElementById('last-updated');
    if (el) el.textContent = 'Synced: just now';
  }

  setInterval(async () => {
    try {
      const cacheBust = '?t=' + Date.now();

      // Fetch both data files in parallel
      const [tasksRes, contentRes] = await Promise.all([
        fetch('data/tasks.js' + cacheBust),
        fetch('data/content.js' + cacheBust)
      ]);

      const tasksText = await tasksRes.text();
      const contentText = await contentRes.text();

      const match = tasksText.match(/DATA_VERSION\s*=\s*'([^']+)'/);
      if (match && match[1] !== lastVersion) {
        lastVersion = match[1];

        // Re-evaluate both data scripts
        const script1 = document.createElement('script');
        script1.textContent = tasksText;
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.textContent = contentText;
        document.head.appendChild(script2);

        tasks = [...(window.TASKS || [])];
        renderAll();

        const lbl = document.getElementById('topbar-live-label');
        if (lbl) {
          lbl.textContent = 'Updated!';
          lbl.style.color = '#FF7A00';
        }
        setTimeout(() => {
          const l = document.getElementById('topbar-live-label');
          if (l) { l.textContent = 'Live'; l.style.color = ''; }
        }, 2000);
      }

      updateSyncTimestamp();
    } catch (e) {}
  }, interval);
}

// ═══════════════════════════════════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════════════════════════════════

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  try { localStorage.setItem(LS_KEYS.theme, newTheme); } catch (e) {}
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

function toggleThemeFromSettings() {
  toggleTheme();
  document.getElementById('setting-dark').checked = document.documentElement.getAttribute('data-theme') === 'dark';
}

function initTheme() {
  try {
    const saved = localStorage.getItem(LS_KEYS.theme);
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      const icon = document.getElementById('theme-icon');
      if (icon) icon.textContent = '☀️';
    }
  } catch (e) {}
}

function toggleSounds() {
  soundsEnabled = document.getElementById('setting-sounds').checked;
  try { localStorage.setItem(LS_KEYS.sounds, soundsEnabled ? 'true' : 'false'); } catch (e) {}
}

function exportData() {
  const data = { tasks, briefs, streak, branding: localStorage.getItem(LS_KEYS.branding) || '' };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'perci-data-' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════════════════════
// SHORTCUTS
// ═══════════════════════════════════════════════════════════════════════════

function toggleShortcuts() {
  document.getElementById('shortcuts-overlay').classList.toggle('open');
}

// ═══════════════════════════════════════════════════════════════════════════
// QUICK FILTERS
// ═══════════════════════════════════════════════════════════════════════════

let activeQuickFilter = 'all';

function setQuickFilter(filter) {
  activeQuickFilter = filter;
  document.querySelectorAll('.filter-chip').forEach(el => {
    el.classList.toggle('active', el.dataset.filter === filter);
  });
  renderKanban();
}

// ═══════════════════════════════════════════════════════════════════════════
// TASKS VIEW FILTERS
// ═══════════════════════════════════════════════════════════════════════════

function applyTaskFilters() {
  const status = document.getElementById('filter-status')?.value || 'all';
  const priority = document.getElementById('filter-priority')?.value || 'all';
  const project = document.getElementById('filter-project')?.value || 'all';
  const needsCarlo = document.getElementById('filter-needs-carlo')?.checked || false;

  let filtered = [...tasks];
  if (status !== 'all') filtered = filtered.filter(t => t.status === status);
  if (priority !== 'all') filtered = filtered.filter(t => t.priority === priority);
  if (project !== 'all') filtered = filtered.filter(t => t.project === project);
  if (needsCarlo) filtered = filtered.filter(t => t.needsCarlo);

  const list = document.getElementById('tasks-list');
  const empty = document.getElementById('tasks-empty');
  if (!list) return;

  if (!filtered.length) {
    list.innerHTML = '';
    if (empty) empty.style.display = '';
    return;
  }

  if (empty) empty.style.display = 'none';
  list.innerHTML = filtered.map(t => renderTaskCard(t)).join('');
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT CALENDAR
// ═══════════════════════════════════════════════════════════════════════════

let calendarMonth = new Date().getMonth();
let calendarYear = new Date().getFullYear();

function prevMonth() {
  calendarMonth--;
  if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
  renderCalendar();
}

function nextMonth() {
  calendarMonth++;
  if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
  renderCalendar();
}

function renderCalendar() {
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const el = document.getElementById('content-month');
  if (el) el.textContent = monthNames[calendarMonth] + ' ' + calendarYear;

  const grid = document.getElementById('calendar-grid');
  if (!grid) return;
  const posts = window.CONTENT_POSTS || [];
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();

  let html = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => `<div class="calendar-header">${d}</div>`).join('');
  for (let i = 0; i < firstDay; i++) html += '<div class="calendar-day empty"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${calendarYear}-${String(calendarMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayPosts = posts.filter(p => p.scheduledDate === dateStr);
    html += `<div class="calendar-day${dayPosts.length ? ' has-post' : ''}"><div class="calendar-day-num">${d}</div>${dayPosts.map(p => `<div class="calendar-post status-${p.status}">${p.type === 'reel' ? '🎬' : '📸'} ${escHtml(p.title.substring(0,20))}</div>`).join('')}</div>`;
  }
  grid.innerHTML = html;

  // Stats
  const scheduled = posts.filter(p => p.status === 'ready' || p.status === 'scheduled').length;
  const posted = posts.filter(p => p.status === 'posted').length;
  const drafts = posts.filter(p => p.status === 'draft').length;
  const statScheduled = document.getElementById('stat-scheduled');
  const statPosted = document.getElementById('stat-posted');
  const statDrafts = document.getElementById('stat-drafts');
  if (statScheduled) statScheduled.textContent = scheduled;
  if (statPosted) statPosted.textContent = posted;
  if (statDrafts) statDrafts.textContent = drafts;

  // Queue
  const queue = document.getElementById('queue-list');
  if (queue) {
    const upcoming = posts.filter(p => p.status !== 'posted').sort((a,b) => a.scheduledDate.localeCompare(b.scheduledDate));
    queue.innerHTML = upcoming.map(p => `
      <div class="queue-item">
        <span class="queue-date">${p.scheduledDate}</span>
        <span class="queue-title">${p.type === 'reel' ? '🎬' : '📸'} ${escHtml(p.title)}</span>
        <span class="badge" style="background:${p.status === 'ready' ? 'var(--green-soft)' : 'var(--yellow-soft)'};color:${p.status === 'ready' ? 'var(--green)' : 'var(--yellow)'}">${p.status}</span>
      </div>
    `).join('') || '<div style="color:var(--text-muted);text-align:center;padding:20px">No upcoming posts</div>';
  }
}

function initFilterProjects() {
  const select = document.getElementById('filter-project');
  if (!select) return;
  const projects = window.PROJECTS || [];
  select.innerHTML = '<option value="all">All Projects</option>' +
    projects.map(p => `<option value="${p.id}">${p.emoji} ${escHtml(p.name)}</option>`).join('');
}
