const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vqkioypadmrjtjkctrrc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxa2lveXBhZG1yanRqa2N0cnJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MjU0MDIsImV4cCI6MjA5NzIwMTQwMn0.NDTy-AzjhNSJYdj5w-j4p1auGjEMXQKBvniYXA0mzQQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

async function simulateClientLogin() {
  try {
    console.log('--- SIMULATING CLIENT LOGIN ---');
    
    // 1. Log in with user credentials
    const email = 'patelvrajpatel30@gmail.com';
    const password = 'YOUR_ACTUAL_PASSWORD'; // Note: We will handle this dynamically or check auth response
    
    // Let's sign in. Since we don't know the password here, we can test with a dummy password first
    // to see if it gives a "Invalid login credentials" vs "Access Denied"
    // Wait, let's prompt the script to list current policies or let's inspect the active session client query
    console.log('Signing in...');
    const { data, error: signInErr } = await supabase.auth.signInWithPassword({
      email: email,
      password: 'wrong-password-to-check-response'
    });

    console.log('Sign in response error:', signInErr?.message || 'None');
    
    // 2. Let's inspect RLS configuration using service role client or direct metadata queries
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxa2lveXBhZG1yanRqa2N0cnJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTYyNTQwMiwiZXhwIjoyMDk3MjAxNDAyfQ.BltT3Mdwx0QP-OpJNbu_W7iuuHUEXJey52xOPKQc4wo';
    const supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey);
    
    console.log('\nQuerying RLS policies for public.admin_users via RPC/SQL info...');
    const { data: policies, error: policiesErr } = await supabaseAdminClient
      .rpc('get_policies'); // Note: get_policies might not exist, let's query pg_policies using select sql
      
    const { data: pgPolicies, error: pgErr } = await supabaseAdminClient
      .from('admin_users')
      .select('*')
      .limit(1);
    
    console.log('Admin client select on admin_users query error:', pgErr?.message || 'None');
    
    // Let's run a raw query to check postgres policies
    // We can do this if we run SQL, but let's query pg_catalog
    const { data: dbPolicies, error: dbPolErr } = await supabaseAdminClient
      .from('pg_policies') // wait, pg_policies is a system view, we can't select from it unless it's exposed or we use RPC
      .select('*')
      .catch(e => ({ error: e }));

    console.log('System policies check:', dbPolErr?.message || 'No direct select access to system views.');
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

simulateClientLogin();
