You are Brigid 🔥 — forge master for Perci Command Center.

## Goal: Live Auto-Update System

Build these 3 things:

### 1. update-dashboard.js
Create at: C:\Users\Carl Rebadomia\.openclaw\workspace\update-dashboard.js

Node.js script that accepts CLI args:
--task <id> --status <status> --notes <text>
--perci-status <active|idle|offline> --status-text <text> --mood <focused|idle|thinking|onfire>
--add-subagent <json> --remove-subagent <id>
--log <json>
--current-task <text> --current-step <text>

Steps:
1. Read data/tasks.js as text
2. Use eval() in a sandbox (new Function) to extract window globals into a plain object
3. Apply CLI patches to the data
4. Set DATA_VERSION = new Date().toISOString()
5. Serialize back to data/tasks.js (window.DATA_VERSION = '...'; window.PERCI_STATUS = {...}; etc.)
6. Push to GitHub via Contents API:
   - GET https://api.github.com/repos/heylencer-debug/PerciCommandCenter/contents/data/tasks.js → get sha
   - PUT same URL with base64 content, sha, commit message "dashboard: live update"
   - Token: GITHUB_TOKEN_FROM_ENV
7. Print: Dashboard updated and live on GitHub

### 2. data/tasks.js updates
- Add at top: window.DATA_VERSION = '2026-02-26T23:25:00+08:00';
- Set SUBAGENTS = [] (all done)
- Update PERCI_STATUS.statusText = 'Building live update system'
- Update PERCI_STATUS.lastUpdated to now

### 3. app.js — startLiveSync()
Add function at bottom of app.js:

function startLiveSync() {
  const isLocal = location.hostname === 'localhost' || location.hostname.startsWith('192.168');
  const interval = isLocal ? 15000 : 60000;
  let lastVersion = window.DATA_VERSION || '';

  // Add live badge to topbar
  const logo = document.querySelector('.topbar-left');
  logo.insertAdjacentHTML('beforeend', '<div class="live-badge"><div class="live-dot"></div><span id="live-label">Live</span></div>');

  setInterval(async () => {
    try {
      const res = await fetch('data/tasks.js?t=' + Date.now());
      const text = await res.text();
      const match = text.match(/DATA_VERSION\s*=\s*'([^']+)'/);
      if (match && match[1] !== lastVersion) {
        lastVersion = match[1];
        const script = document.createElement('script');
        script.textContent = text;
        document.head.appendChild(script);
        renderStatus();
        renderMissionControl();
        renderCarloActions();
        renderSubagents();
        renderKanban();
        renderActivityLog();
        renderStats();
        document.getElementById('live-label').textContent = 'Updated!';
        setTimeout(() => document.getElementById('live-label').textContent = 'Live', 2000);
      }
    } catch(e) {}
  }, interval);
}

Call startLiveSync() at end of DOMContentLoaded handler.

### 4. style.css additions
.live-badge { display:flex; align-items:center; gap:5px; font-size:11px; color:#22C55E; margin-left:12px; }
.live-dot { width:7px; height:7px; border-radius:50%; background:#22C55E; animation:pulse 2s infinite; }

### 5. Git push
git add -A && git commit -m "Brigid: Live auto-update + update-dashboard.js" && git push origin main

When done run: openclaw system event --text "Brigid done: Live auto-update COMPLETE. update-dashboard.js ready." --mode now
