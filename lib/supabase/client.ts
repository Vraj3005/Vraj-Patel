import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your-supabase-project-url'
);

// Browser client utilizes createBrowserClient for standard cookie mappings automatically
export const supabase = isSupabaseConfigured
  ? createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as SupabaseClient<Database>, {
      get(_, prop) {
        if (typeof window !== 'undefined' && prop !== 'then') {
          console.warn(
            `[Supabase Client SDK]: Keys missing. Running mock fallback for: "${String(prop)}".`
          );
        }
        return (...args: unknown[]) => {
          return {
            select: () => ({
              order: () => Promise.resolve({ data: [], error: null }),
              limit: () => Promise.resolve({ data: [], error: null }),
            }),
            insert: () => Promise.resolve({ data: args, error: null }),
            update: () => Promise.resolve({ data: args, error: null }),
            delete: () => Promise.resolve({ data: args, error: null }),
          };
        };
      },
    });
