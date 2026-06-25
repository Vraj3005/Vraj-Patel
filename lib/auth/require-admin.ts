import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/server';

export interface AdminUser {
  id: string;
  email: string;
}

export async function requireAdmin(): Promise<{ user: any; admin: AdminUser | null; error?: string; status?: number }> {
  // If Supabase is not configured (e.g. local dev without DB setup)
  if (!isSupabaseConfigured) {
    if (process.env.NODE_ENV === 'production') {
      return { 
        user: null, 
        admin: null, 
        error: 'Supabase URL/Key is not configured in production.', 
        status: 500 
      };
    }
    // Safe mock in development and testing environments to avoid developer lockout
    return {
      user: { id: 'mock-dev-admin-id', email: 'admin@example.com' },
      admin: { id: 'mock-dev-admin-id', email: 'admin@example.com' }
    };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: userErr } = await supabase.auth.getUser();

    if (userErr || !user) {
      return { 
        user: null, 
        admin: null, 
        error: 'Authentication required. Please sign in.', 
        status: 401 
      };
    }

    // Query admin_users table for user id
    const { data: adminRecord, error: adminErr } = await supabase
      .from('admin_users')
      .select('id, email')
      .eq('id', user.id)
      .maybeSingle();

    if (adminErr || !adminRecord) {
      return { 
        user, 
        admin: null, 
        error: 'Access denied: User is not an authorized administrator.', 
        status: 403 
      };
    }

    return { user, admin: adminRecord as AdminUser };
  } catch (err) {
    console.error('requireAdmin authentication error:', err);
    return { 
      user: null, 
      admin: null, 
      error: 'Internal server error during administrator verification.', 
      status: 500 
    };
  }
}
