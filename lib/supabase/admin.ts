import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase';

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
  throw new Error('Supabase admin service role client can only be used on the server.');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseAdminConfigured = !!(
  supabaseUrl &&
  serviceRoleKey &&
  supabaseUrl !== 'your-supabase-project-url'
);

// Admin client bypasses RLS using the service_role key. MUST never be imported client-side.
export const supabaseAdmin = isSupabaseAdminConfigured
  ? createClient<Database>(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : new Proxy({} as SupabaseClient<Database>, {
      get(_, prop) {
        console.warn(
          `[Supabase Admin SDK]: Service key missing. Mocking action: "${String(prop)}".`
        );
        return () => {
          return Promise.resolve({
            data: null,
            error: new Error('Supabase Service Role client is not configured.'),
          });
        };
      },
    });
