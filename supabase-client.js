// supabase-client.js — Supabase REST client for Perci Command Center
// Pure fetch() — works in browser and Node.js
// Reads credentials from supabase-config.js

// Load config (Node.js)
let _config;
if (typeof require !== 'undefined') {
  try { _config = require('./supabase-config.js'); } catch (e) { _config = {}; }
}

// Load config (browser) — supabase-config.js must be loaded before this script
const SUPABASE_URL = (typeof window !== 'undefined' && window.SUPABASE_CONFIG?.url) || (_config && _config.url) || '';
const SUPABASE_KEY = (typeof window !== 'undefined' && window.SUPABASE_CONFIG?.key) || (_config && _config.key) || '';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': 'Bearer ' + SUPABASE_KEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

const db = {
  /**
   * SELECT from a table. Optional PostgREST query string.
   * e.g. db.select('tasks', 'status=eq.pending&order=created_at.desc')
   */
  async select(table, query = '') {
    const url = `${SUPABASE_URL}/rest/v1/${table}${query ? '?' + query : ''}`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`SELECT ${table} failed (${res.status}): ${err}`);
    }
    return res.json();
  },

  /**
   * INSERT into a table. data can be object or array of objects.
   */
  async insert(table, data) {
    const url = `${SUPABASE_URL}/rest/v1/${table}`;
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`INSERT ${table} failed (${res.status}): ${err}`);
    }
    return res.json();
  },

  /**
   * UPDATE a row by id.
   */
  async update(table, id, data) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`UPDATE ${table} failed (${res.status}): ${err}`);
    }
    return res.json();
  },

  /**
   * DELETE a row by id.
   */
  async delete(table, id) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`DELETE ${table} failed (${res.status}): ${err}`);
    }
    return res.status === 204 ? [] : res.json();
  },

  /**
   * UPSERT (insert or update on conflict). Requires 'Prefer: resolution=merge-duplicates'.
   */
  async upsert(table, data) {
    const url = `${SUPABASE_URL}/rest/v1/${table}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Prefer': 'return=representation,resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`UPSERT ${table} failed (${res.status}): ${err}`);
    }
    return res.json();
  },

  /**
   * Run a stored function via Supabase's rpc endpoint.
   */
  async rpc(fnName, params = {}) {
    const url = `${SUPABASE_URL}/rest/v1/rpc/${fnName}`;
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`RPC ${fnName} failed (${res.status}): ${err}`);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }
};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = db;
}

// Expose for browser
if (typeof window !== 'undefined') {
  window.db = db;
}
