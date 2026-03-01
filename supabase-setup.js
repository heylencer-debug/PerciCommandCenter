// supabase-setup.js — Create all Supabase tables for Perci Command Center
// Run: node supabase-setup.js

const config = require('./supabase-config.js');
const SUPABASE_URL = config.url;
const SUPABASE_KEY = config.key;

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': 'Bearer ' + SUPABASE_KEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

const SQL = `
-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  status text DEFAULT 'pending',
  priority text DEFAULT 'normal',
  project text DEFAULT 'general',
  assigned_to text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Agent Activity Log
CREATE TABLE IF NOT EXISTS agent_activity (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  agent text NOT NULL,
  action text NOT NULL,
  details text,
  project text,
  status text DEFAULT 'done',
  created_at timestamptz DEFAULT now()
);

-- Carousel Tracker
CREATE TABLE IF NOT EXISTS carousels (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  day integer NOT NULL,
  topic text NOT NULL,
  status text DEFAULT 'planning',
  copy_approved_at timestamptz,
  generated_at timestamptz,
  posted_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Intel Feed (from Ethel)
CREATE TABLE IF NOT EXISTS intel_feed (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  source text NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  content text,
  url text,
  engagement integer DEFAULT 0,
  scraped_at timestamptz DEFAULT now()
);

-- Decisions Log
CREATE TABLE IF NOT EXISTS decisions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  context text,
  decision text NOT NULL,
  made_by text DEFAULT 'carlo',
  project text,
  created_at timestamptz DEFAULT now()
);
`;

async function setup() {
  console.log('🔥 Brigid — Setting up Supabase tables...\n');

  // Execute SQL via Supabase's SQL query endpoint
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({})
  });

  // Try the direct SQL approach via the query endpoint
  // Supabase doesn't expose raw SQL via REST by default,
  // so we'll create tables by attempting inserts (tables must exist)
  // or use the management API approach

  // Approach: Use the Supabase SQL editor API
  const sqlRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: SQL })
  });

  if (sqlRes.ok) {
    console.log('✅ All tables created via SQL RPC');
    return;
  }

  // Fallback: Try individual table creation via the pg-meta endpoint
  console.log('ℹ️  RPC not available, trying table-by-table approach...');

  // We'll verify tables exist by trying a SELECT on each
  const tables = ['tasks', 'agent_activity', 'carousels', 'intel_feed', 'decisions'];

  for (const table of tables) {
    try {
      const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/${table}?limit=0`, { headers });
      if (checkRes.ok) {
        console.log(`  ✅ ${table} — exists`);
      } else if (checkRes.status === 404) {
        console.log(`  ⚠️  ${table} — does not exist. Please create via Supabase Dashboard SQL Editor.`);
      } else {
        const errText = await checkRes.text();
        console.log(`  ❌ ${table} — error (${checkRes.status}): ${errText}`);
      }
    } catch (err) {
      console.log(`  ❌ ${table} — network error: ${err.message}`);
    }
  }

  console.log('\n📋 If tables don\'t exist, run this SQL in Supabase Dashboard → SQL Editor:');
  console.log('─'.repeat(60));
  console.log(SQL);
  console.log('─'.repeat(60));
  console.log('\n💡 Go to: https://supabase.com/dashboard → your project → SQL Editor → paste & run');
}

setup().catch(err => {
  console.error('❌ Setup failed:', err.message);
  process.exit(1);
});
