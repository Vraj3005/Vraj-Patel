import { createServerClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your-supabase-project-url'
);

/**
 * Creates a typesafe Supabase client for Server Components, Actions, and Route Handlers.
 * Awaits cookies to fetch session states.
 */
export async function createServerSupabaseClient(): Promise<SupabaseClient<Database>> {
  if (!isSupabaseConfigured) {
    // Return proxy mock client for compilation and local testing when credentials are empty
    return new Proxy({} as SupabaseClient<Database>, {
      get() {
        return () => {
          return {
            select: () => ({
              order: () => Promise.resolve({ data: [], error: null }),
              limit: () => Promise.resolve({ data: [], error: null }),
            }),
            insert: (args: unknown) => Promise.resolve({ data: args, error: null }),
          };
        };
      },
    });
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Can ignore inside Server Components if middleware handles cookie refreshing
        }
      },
    },
  });
}
