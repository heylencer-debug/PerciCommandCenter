const https = require('https');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const get = key => { const m = env.match(new RegExp(key + '=(.+)')); return m ? m[1].trim() : ''; };
const ACCESS_TOKEN = get('SUPABASE_ACCESS_TOKEN');
const PROJECT_REF = get('SUPABASE_URL').replace('https://','').split('.')[0];

const SQL = `
CREATE TABLE IF NOT EXISTS carousel_slides (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  carousel_id uuid REFERENCES carousels(id),
  day integer NOT NULL,
  slide_number integer NOT NULL,
  variant text NOT NULL DEFAULT 'A',
  image_url text,
  status text DEFAULT 'pending',
  approved_at timestamptz,
  created_at timestamptz DEFAULT now()
);
`;

function apiRequest(path, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const opts = {
      hostname: 'api.supabase.com',
      path,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + ACCESS_TOKEN,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr)
      }
    };
    const req = https.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function run() {
  console.log(`Project ref: ${PROJECT_REF}`);
  const res = await apiRequest(`/v1/projects/${PROJECT_REF}/database/query`, { query: SQL });
  console.log('Create carousel_slides:', res.status, res.body.slice(0, 200));
}
run().catch(console.error);
