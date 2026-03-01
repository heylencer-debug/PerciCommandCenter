// seed-data.js — Seed initial data into Supabase tables
// Run: node seed-data.js

const db = require('./supabase-client.js');

async function seed() {
  console.log('🔥 Brigid — Seeding Supabase with initial data...\n');

  // ─── TASKS (from data/tasks.js) ───────────────────────────────────────────
  console.log('📌 Seeding tasks...');
  const tasks = [
    {
      title: 'Post Day 1 carousel to Instagram',
      description: 'Upload approved v11 carousel to @projectperciph — first ever post',
      status: 'pending',
      priority: 'high',
      project: 'instagram',
      assigned_to: 'carlo'
    },
    {
      title: 'Generate Day 2 Instagram Post',
      description: 'Generate & send carousel for Day 2 pre-launch content',
      status: 'pending',
      priority: 'normal',
      project: 'instagram'
    },
    {
      title: 'Set up Shopee store',
      description: 'Create Project Percy PH Shopee store for embroidery products',
      status: 'pending',
      priority: 'normal',
      project: 'projectperciph'
    },
    {
      title: 'Create Facebook Business Page',
      description: '"Project Percy PH" Facebook page — must be done manually (bot detection blocks automation)',
      status: 'blocked',
      priority: 'low',
      project: 'instagram',
      assigned_to: 'carlo'
    },
    {
      title: 'Admin Security Tasks',
      description: 'BitLocker, SMB disable, firewall ports 27000/57669',
      status: 'blocked',
      priority: 'low',
      project: 'perci-system',
      assigned_to: 'carlo'
    },
    {
      title: 'BRAND.js — Expanded Product Catalog + Personalization Rules',
      description: 'Added 16 BTV × Blanc Nue product+embroidery combos. Added personalizationRules.',
      status: 'done',
      priority: 'high',
      project: 'perci-system',
      completed_at: '2026-02-27T16:50:00+08:00'
    },
    {
      title: 'Command Center v5 — Quick Actions & Milestones',
      description: 'v5 upgrades: Quick Actions panel, Milestone tracker strip, UX polish',
      status: 'done',
      priority: 'high',
      project: 'perci-system',
      completed_at: '2026-02-27T04:54:00+08:00'
    },
    {
      title: 'Day 1 carousel v11 generation',
      description: 'Generate v11: white hook text, powder blue accent bar, real Filipino candid emotions',
      status: 'done',
      priority: 'high',
      project: 'projectperciph',
      completed_at: '2026-02-27T16:39:00+08:00'
    },
    {
      title: 'Project Percy PH Dashboard v2 — Competitive Intelligence Upgrade',
      description: 'Competitor Deep-Dive, Pricing Calculator, Calendar upgrade, Seasonal Alerts',
      status: 'done',
      priority: 'high',
      project: 'projectperciph',
      completed_at: '2026-02-27T04:54:00+08:00'
    },
    {
      title: 'Supabase Integration — Command Center v6',
      description: 'Wire all tabs to Supabase: tasks, agent activity, carousel tracker, intel feed, decisions',
      status: 'done',
      priority: 'urgent',
      project: 'perci-system',
      assigned_to: 'brigid',
      completed_at: new Date().toISOString()
    }
  ];

  try {
    const result = await db.insert('tasks', tasks);
    console.log(`  ✅ ${result.length} tasks seeded`);
  } catch (err) {
    console.error(`  ❌ Tasks seed failed: ${err.message}`);
  }

  // ─── CAROUSELS (Day 1-5) ──────────────────────────────────────────────────
  console.log('📸 Seeding carousels...');
  const carousels = [
    {
      day: 1,
      topic: 'The Art of Gifting — Why personalized gifts matter',
      status: 'approved',
      notes: 'v12 carousel complete — 7 slides. A/B variants generated. Carlo approved v11.',
      copy_approved_at: '2026-02-27T14:00:00+08:00',
      generated_at: '2026-02-27T16:39:00+08:00'
    },
    {
      day: 2,
      topic: 'Why Embroidery Lasts — Durability, craftsmanship, emotional longevity',
      status: 'planning',
      notes: 'Awaiting Carlo\'s go. Hook ideas ready.'
    },
    {
      day: 3,
      topic: 'Behind the Stitch — Process & craftsmanship reel',
      status: 'planning',
      notes: '30s reel format. Draft outline ready.'
    },
    {
      day: 4,
      topic: 'Gift Ideas for Birthdays — Product showcase carousel',
      status: 'planning'
    },
    {
      day: 5,
      topic: 'Wedding Souvenirs Preview — Premium personalized gifts',
      status: 'planning'
    }
  ];

  try {
    const result = await db.insert('carousels', carousels);
    console.log(`  ✅ ${result.length} carousels seeded`);
  } catch (err) {
    console.error(`  ❌ Carousels seed failed: ${err.message}`);
  }

  // ─── AGENT ACTIVITY ───────────────────────────────────────────────────────
  console.log('🤖 Seeding agent activity...');
  const activities = [
    {
      agent: 'brigid',
      action: 'Supabase integration deployed',
      details: 'Created tables, seeded data, wired all 5 tabs to live Supabase backend',
      project: 'perci-system',
      status: 'done'
    },
    {
      agent: 'brigid',
      action: 'Command Center v6 built',
      details: 'Added Intel Feed, Decisions tabs. Upgraded Tasks, Agent Activity, Carousel Tracker with Supabase',
      project: 'perci-system',
      status: 'done'
    },
    {
      agent: 'perci',
      action: 'Live sync running',
      details: 'Heartbeat active — monitoring tasks.js and content.js every 5 minutes',
      project: 'perci-system',
      status: 'done'
    },
    {
      agent: 'vesper',
      action: 'Day 1 carousel v12 generated',
      details: '7 slides with A/B variants. Brand specs auto-injected from BRAND.js',
      project: 'projectperciph',
      status: 'done'
    },
    {
      agent: 'vesper',
      action: 'BRAND.js memory system created',
      details: 'Vesper now auto-injects brand specs into every image prompt',
      project: 'perci-system',
      status: 'done'
    },
    {
      agent: 'perci',
      action: 'Standing by — awaiting Carlo',
      details: 'All systems green. Day 1 approved, ready to post. Idle until next direction.',
      project: 'perci-system',
      status: 'done'
    }
  ];

  try {
    const result = await db.insert('agent_activity', activities);
    console.log(`  ✅ ${result.length} activity entries seeded`);
  } catch (err) {
    console.error(`  ❌ Agent activity seed failed: ${err.message}`);
  }

  // ─── DECISIONS ────────────────────────────────────────────────────────────
  console.log('⚖️ Seeding decisions...');
  const decisions = [
    {
      title: 'Brand Aesthetic Direction',
      context: 'Needed to establish visual identity for all content',
      decision: 'BTV × Blanc Nue Dopamine Minimalism — bright, vibrant, industrial chic with chrome/white/colored acrylic',
      made_by: 'carlo',
      project: 'projectperciph'
    },
    {
      title: 'Instagram First Strategy',
      context: 'Multiple platforms available — needed to pick launch platform',
      decision: 'Launch on Instagram first before Shopee, Facebook, or website. Focus all energy on IG carousel content.',
      made_by: 'carlo',
      project: 'instagram'
    },
    {
      title: 'Supabase for Backend',
      context: 'Command Center needed persistent data storage beyond static JS files',
      decision: 'Use Supabase (PostgreSQL + REST API) for live data. Pure fetch(), no npm packages.',
      made_by: 'carlo',
      project: 'perci-system'
    }
  ];

  try {
    const result = await db.insert('decisions', decisions);
    console.log(`  ✅ ${result.length} decisions seeded`);
  } catch (err) {
    console.error(`  ❌ Decisions seed failed: ${err.message}`);
  }

  console.log('\n✅ Seeding complete!');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
