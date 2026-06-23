import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your-supabase-project-url'
);

/**
 * Creates a simple cookie-less Supabase client for background operations like log tracking.
 * This prevents runtime Next.js exceptions when accessing cookies during async streaming.
 * Safe to import in both Client and Server Components.
 */
export function createSimpleSupabaseClient(): SupabaseClient<Database> {
  if (!isSupabaseConfigured) {
    const createMockChain = (): any => {
      const fn = () => chain;
      const chain = new Proxy(fn, {
        get(target, prop) {
          if (prop === 'then') {
            return (resolve: any) => resolve({ data: null, error: null });
          }
          return createMockChain();
        }
      });
      return chain;
    };
    return createMockChain() as SupabaseClient<Database>;
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
