const supabaseUrl = 'https://bfebpgfguqkciohauetg.supabase.co';
const supabaseKey = 'sb_publishable_724z32yG9Y1t10fLRkhWjg_V_504oxl';

async function check() {
  const res = await fetch(`${supabaseUrl}/rest/v1/filings?select=*`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  });
  const data = await res.json();
  console.log('[Watchpost HQ Supabase Verification]: Found', data.length, 'filing records in database:');
  console.log(JSON.stringify(data, null, 2));
}

check();
