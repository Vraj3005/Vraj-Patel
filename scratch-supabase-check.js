const { createClient } = require('@supabase/supabase-js');

// Load environment variables manually
const supabaseUrl = 'https://vqkioypadmrjtjkctrrc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxa2lveXBhZG1yanRqa2N0cnJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTYyNTQwMiwiZXhwIjoyMDk3MjAxNDAyfQ.BltT3Mdwx0QP-OpJNbu_W7iuuHUEXJey52xOPKQc4wo';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAuthAndAdminTable() {
  try {
    console.log('--- DIAGNOSTIC SCRIPT START ---');
    console.log('Querying auth.users...');
    const { data: { users }, error: usersErr } = await supabase.auth.admin.listUsers();
    if (usersErr) {
      console.error('Error fetching users from auth.users:', usersErr);
    } else {
      console.log(`Found ${users.length} user(s) in auth.users:`);
      users.forEach(u => {
        console.log(`- Email: ${u.email} | ID: ${u.id}`);
      });
    }

    console.log('\nQuerying public.admin_users...');
    const { data: admins, error: adminErr } = await supabase
      .from('admin_users')
      .select('*');

    if (adminErr) {
      console.error('Error fetching records from public.admin_users:', adminErr);
    } else {
      console.log(`Found ${admins.length} record(s) in public.admin_users:`);
      admins.forEach(a => {
        console.log(`- Email: ${a.email} | ID: ${a.id} | Created At: ${a.created_at}`);
      });
    }
    console.log('--- DIAGNOSTIC SCRIPT END ---');
  } catch (err) {
    console.error('Unexpected error running diagnostics:', err);
  }
}

checkAuthAndAdminTable();
