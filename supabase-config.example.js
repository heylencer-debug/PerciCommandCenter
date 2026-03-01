// supabase-config.example.js — Copy this to supabase-config.js and fill in your values
// DO NOT commit supabase-config.js to git

const SUPABASE_CONFIG = {
  url: 'https://YOUR_PROJECT_REF.supabase.co',
  key: 'YOUR_SUPABASE_API_KEY'
};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SUPABASE_CONFIG;
}

// Expose for browser
if (typeof window !== 'undefined') {
  window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}
