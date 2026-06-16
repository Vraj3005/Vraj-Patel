import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/server';

// Local database fallback paths
const getDbPath = (filename: string) => path.join(process.cwd(), 'db', filename);

function readLocalDb(filename: string): Record<string, unknown>[] {
  const dbPath = getDbPath(filename);
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '[]', 'utf-8');
    return [];
  }
  try {
    const content = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(content || '[]') as Record<string, unknown>[];
  } catch (err) {
    console.error(`Error reading database file ${filename}:`, err);
    return [];
  }
}

function writeLocalDb(filename: string, data: Record<string, unknown>[]) {
  const dbPath = getDbPath(filename);
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

function getLocalMockData(type: string) {
  if (type === 'overview') {
    return {
      stats: {
        projects: readLocalDb('projects.json').length,
        skills: readLocalDb('skills.json').length,
        inquiries: readLocalDb('messages.json').length,
        chats: 2,
        blogs: readLocalDb('blogs.json').length,
        downloads: readLocalDb('downloads.json').length,
        analytics: readLocalDb('analytics.json').length,
      },
    };
  }

  let filename = '';
  if (type === 'projects') filename = 'projects.json';
  else if (type === 'skills') filename = 'skills.json';
  else if (type === 'blogs') filename = 'blogs.json';
  else if (type === 'inquiries') filename = 'messages.json';
  else if (type === 'downloads') filename = 'downloads.json';
  else if (type === 'analytics') filename = 'analytics.json';

  if (!filename) return null;

  const data = readLocalDb(filename);
  return { data };
}

// Check admin credentials
async function checkAdminAuth() {
  if (!isSupabaseConfigured) {
    // Local development allows mock access without auth checks
    return { error: null, authorized: true, email: 'mock-admin@example.com' };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { error: 'Not authenticated.', authorized: false };
    }

    const isAdmin = user.email === 'patelvrajpatel30@gmail.com';
    if (!isAdmin) {
      return { error: 'Not authorized as administrator.', authorized: false };
    }

    return { error: null, authorized: true, email: user.email };
  } catch (err) {
    console.error('Auth check failure:', err);
    return { error: 'Authentication processing error.', authorized: false };
  }
}

export async function GET(req: NextRequest) {
  const { authorized, error } = await checkAdminAuth();
  if (!authorized) {
    return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'overview';

  try {
    if (isSupabaseConfigured) {
      const supabase = await createServerSupabaseClient();

      if (type === 'overview') {
        const [
          { count: projectsCount },
          { count: skillsCount },
          { count: inquiriesCount },
          { count: chatsCount },
          { count: blogsCount },
          { count: downloadsCount },
          { count: analyticsCount },
        ] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('skills').select('*', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
          supabase.from('ai_chat_sessions').select('*', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
          supabase.from('resume_downloads').select('*', { count: 'exact', head: true }),
          supabase.from('analytics_events').select('*', { count: 'exact', head: true }),
        ]);

        return NextResponse.json({
          stats: {
            projects: projectsCount || 0,
            skills: skillsCount || 0,
            inquiries: inquiriesCount || 0,
            chats: chatsCount || 0,
            blogs: blogsCount || 0,
            downloads: downloadsCount || 0,
            analytics: analyticsCount || 0,
          },
        });
      }

      // Fetch items based on request type
      let table = '';
      if (type === 'projects') table = 'projects';
      else if (type === 'skills') table = 'skills';
      else if (type === 'blogs') table = 'blog_posts';
      else if (type === 'inquiries') table = 'contact_messages';
      else if (type === 'chats') table = 'ai_chat_sessions';
      else if (type === 'downloads') table = 'resume_downloads';
      else if (type === 'analytics') table = 'analytics_events';

      if (!table) {
        return NextResponse.json({ error: 'Invalid data type request.' }, { status: 400 });
      }

      let query = supabase.from(table).select('*');
      if (table === 'contact_messages' || table === 'ai_chat_sessions' || table === 'resume_downloads' || table === 'analytics_events') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: true });
      }

      const { data, error: dbErr } = await query;
      if (dbErr) throw dbErr;

      return NextResponse.json({ data: data || [] });
    } else {
      const mockResult = getLocalMockData(type);
      if (!mockResult) {
        return NextResponse.json({ error: 'Invalid data type request.' }, { status: 400 });
      }
      return NextResponse.json(mockResult);
    }
  } catch (err: unknown) {
    console.error('Admin GET fetch failure:', err);
    
    // Check if error is due to missing tables in Supabase (PGRST205)
    const isMissingTable = err && typeof err === 'object' && ('code' in err) && (err as { code?: string }).code === 'PGRST205';
    if (isMissingTable) {
      console.warn('Supabase is configured but tables are missing. Falling back to local offline JSON storage.');
      const mockResult = getLocalMockData(type);
      if (mockResult) {
        return NextResponse.json(mockResult, {
          headers: { 'x-supabase-warning': 'tables-missing' }
        });
      }
    }

    const message = err instanceof Error ? err.message : 'Database fetch error.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { authorized, email, error } = await checkAdminAuth();
  if (!authorized) {
    return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  let body: Record<string, unknown> | null = null;
  try {
    body = await req.json() as Record<string, unknown>;

    if (isSupabaseConfigured) {
      const supabase = await createServerSupabaseClient();
      let table = '';
      if (type === 'projects') table = 'projects';
      else if (type === 'skills') table = 'skills';
      else if (type === 'blogs') table = 'blog_posts';

      if (!table) {
        return NextResponse.json({ error: 'Invalid table insertion target.' }, { status: 400 });
      }

      // Automatically generate details where needed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload = { ...body } as Record<string, any>;
      if (!payload.id) {
        payload.id = crypto.randomUUID();
      }

      if (table === 'skills') {
        const catMap: Record<string, string> = {
          'Languages': '11111111-1111-1111-1111-111111111111',
          'Frontend Development': '22222222-2222-2222-2222-222222222222',
          'Backend & APIs': '33333333-3333-3333-3333-333333333333',
          'Databases & Systems': '44444444-4444-4444-4444-444444444444'
        };
        const catId = catMap[payload.category] || '11111111-1111-1111-1111-111111111111';
        payload.category_id = catId;
        
        // Ensure the parent category exists to prevent foreign key errors
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('skill_categories') as any).insert([
          { id: catId, name: payload.category || 'Languages', display_order: 1 }
        ]).select().catch(() => {});
        
        delete payload.category;
      }

      if (table === 'projects') {
        const catMap: Record<string, string> = {
          'Client Software': 'client_software',
          'ERP Systems': 'erp_system',
          'E-commerce': 'ecommerce',
          'AI Automation': 'ai_automation',
          'Quant Research': 'quant_research',
          'Websites': 'website',
          'Dashboards': 'dashboard'
        };
        payload.category = catMap[payload.category] || 'website';
        
        const statusMap: Record<string, string> = {
          'Live': 'published',
          'In Development': 'draft',
          'Private': 'archived'
        };
        payload.status = statusMap[payload.status] || 'published';
        
        if (payload.shortDescription) {
          payload.short_description = payload.shortDescription;
          delete payload.shortDescription;
        }
        if (payload.banner_image_url) {
          // Keep
        } else if (payload.image) {
          payload.banner_image_url = payload.image;
          delete payload.image;
        }
        
        // Strip custom UI properties to match database columns
        const dbColumns = ['id', 'created_at', 'updated_at', 'slug', 'title', 'short_description', 'description', 'category', 'featured', 'status', 'banner_image_url'];
        Object.keys(payload).forEach(key => {
          if (!dbColumns.includes(key)) {
            delete payload[key];
          }
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: dbErr } = await (supabase.from(table) as any).insert([payload]).select().single();
      if (dbErr) throw dbErr;

      // Log transaction
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('admin_audit_logs') as any).insert([{
        admin_email: email || 'system',
        action_performed: `CREATE RECORD: ${payload.title || payload.name || payload.id}`,
        target_table: table,
        record_id: payload.id
      }]);

      return NextResponse.json({ success: true, data });
    } else {
      // Local Mock DB Insertion
      let filename = '';
      if (type === 'projects') filename = 'projects.json';
      else if (type === 'skills') filename = 'skills.json';
      else if (type === 'blogs') filename = 'blogs.json';

      if (!filename) {
        return NextResponse.json({ error: 'Invalid table insertion target.' }, { status: 400 });
      }

      const dbData = readLocalDb(filename);
      const newRecord = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...body,
      };

      dbData.push(newRecord);
      writeLocalDb(filename, dbData);

      return NextResponse.json({ success: true, data: newRecord });
    }
  } catch (err: unknown) {
    console.error('Admin POST insertion failure:', err);
    
    // Check if error is due to missing tables in Supabase (PGRST205)
    const isMissingTable = err && typeof err === 'object' && ('code' in err) && (err as { code?: string }).code === 'PGRST205';
    if (isMissingTable) {
      console.warn('Supabase tables are missing. Falling back to local offline JSON storage.');
      let filename = '';
      if (type === 'projects') filename = 'projects.json';
      else if (type === 'skills') filename = 'skills.json';
      else if (type === 'blogs') filename = 'blogs.json';

      if (filename) {
        try {
          const dbData = readLocalDb(filename);
          const newRecord = {
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...body,
          };
          dbData.push(newRecord);
          writeLocalDb(filename, dbData);
          return NextResponse.json({ success: true, data: newRecord }, {
            headers: { 'x-supabase-warning': 'tables-missing' }
          });
        } catch (fallbackErr) {
          console.error('Local mock DB fallback failed:', fallbackErr);
        }
      }
    }

    const message = err instanceof Error ? err.message : 'Database insert error.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { authorized, email, error } = await checkAdminAuth();
  if (!authorized) {
    return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  let body: Record<string, unknown> | null = null;
  let id = '';
  let fieldsToUpdate: Record<string, unknown> = {};

  try {
    body = await req.json() as Record<string, unknown>;
    id = (body.id as string) || '';
    const rest = { ...body };
    delete rest.id;
    fieldsToUpdate = rest;

    if (!id) {
      return NextResponse.json({ error: 'Record ID is required for update.' }, { status: 400 });
    }

    if (isSupabaseConfigured) {
      const supabase = await createServerSupabaseClient();
      let table = '';
      if (type === 'projects') table = 'projects';
      else if (type === 'skills') table = 'skills';
      else if (type === 'blogs') table = 'blog_posts';

      if (!table) {
        return NextResponse.json({ error: 'Invalid update target table.' }, { status: 400 });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fieldsToUpdatePayload = { ...fieldsToUpdate } as Record<string, any>;
      if (table === 'skills') {
        const catMap: Record<string, string> = {
          'Languages': '11111111-1111-1111-1111-111111111111',
          'Frontend Development': '22222222-2222-2222-2222-222222222222',
          'Backend & APIs': '33333333-3333-3333-3333-333333333333',
          'Databases & Systems': '44444444-4444-4444-4444-444444444444'
        };
        if (fieldsToUpdatePayload.category) {
          const catId = catMap[fieldsToUpdatePayload.category] || '11111111-1111-1111-1111-111111111111';
          fieldsToUpdatePayload.category_id = catId;
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from('skill_categories') as any).insert([
            { id: catId, name: fieldsToUpdatePayload.category || 'Languages', display_order: 1 }
          ]).select().catch(() => {});
          
          delete fieldsToUpdatePayload.category;
        }
      }

      if (table === 'projects') {
        const catMap: Record<string, string> = {
          'Client Software': 'client_software',
          'ERP Systems': 'erp_system',
          'E-commerce': 'ecommerce',
          'AI Automation': 'ai_automation',
          'Quant Research': 'quant_research',
          'Websites': 'website',
          'Dashboards': 'dashboard'
        };
        if (fieldsToUpdatePayload.category) {
          fieldsToUpdatePayload.category = catMap[fieldsToUpdatePayload.category] || 'website';
        }
        
        const statusMap: Record<string, string> = {
          'Live': 'published',
          'In Development': 'draft',
          'Private': 'archived'
        };
        if (fieldsToUpdatePayload.status) {
          fieldsToUpdatePayload.status = statusMap[fieldsToUpdatePayload.status] || 'published';
        }
        
        if (fieldsToUpdatePayload.shortDescription) {
          fieldsToUpdatePayload.short_description = fieldsToUpdatePayload.shortDescription;
          delete fieldsToUpdatePayload.shortDescription;
        }
        if (fieldsToUpdatePayload.image) {
          fieldsToUpdatePayload.banner_image_url = fieldsToUpdatePayload.image;
          delete fieldsToUpdatePayload.image;
        }
        
        // Strip custom UI properties to match database columns
        const dbColumns = ['id', 'created_at', 'updated_at', 'slug', 'title', 'short_description', 'description', 'category', 'featured', 'status', 'banner_image_url'];
        Object.keys(fieldsToUpdatePayload).forEach(key => {
          if (!dbColumns.includes(key)) {
            delete fieldsToUpdatePayload[key];
          }
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: dbErr } = await (supabase.from(table) as any)
        .update(fieldsToUpdatePayload)
        .eq('id', id)
        .select()
        .single();

      if (dbErr) throw dbErr;

      // Log transaction
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('admin_audit_logs') as any).insert([{
        admin_email: email || 'system',
        action_performed: `UPDATE RECORD: ${body.title || body.name || id}`,
        target_table: table,
        record_id: id
      }]);

      return NextResponse.json({ success: true, data });
    } else {
      // Local Mock DB Update
      let filename = '';
      if (type === 'projects') filename = 'projects.json';
      else if (type === 'skills') filename = 'skills.json';
      else if (type === 'blogs') filename = 'blogs.json';

      if (!filename) {
        return NextResponse.json({ error: 'Invalid update target table.' }, { status: 400 });
      }

      const dbData = readLocalDb(filename);
      const recordIdx = dbData.findIndex((item) => item.id === id);

      if (recordIdx === -1) {
        return NextResponse.json({ error: 'Record not found.' }, { status: 404 });
      }

      const updatedRecord = {
        ...dbData[recordIdx],
        ...fieldsToUpdate,
        updated_at: new Date().toISOString(),
      };

      dbData[recordIdx] = updatedRecord;
      writeLocalDb(filename, dbData);

      return NextResponse.json({ success: true, data: updatedRecord });
    }
  } catch (err: unknown) {
    console.error('Admin PUT modification failure:', err);
    
    // Check if error is due to missing tables in Supabase (PGRST205)
    const isMissingTable = err && typeof err === 'object' && ('code' in err) && (err as { code?: string }).code === 'PGRST205';
    if (isMissingTable) {
      console.warn('Supabase tables are missing. Falling back to local offline JSON storage.');
      let filename = '';
      if (type === 'projects') filename = 'projects.json';
      else if (type === 'skills') filename = 'skills.json';
      else if (type === 'blogs') filename = 'blogs.json';

      if (filename) {
        try {
          const dbData = readLocalDb(filename);
          const recordIdx = dbData.findIndex((item) => item.id === id);
          if (recordIdx !== -1) {
            const updatedRecord = {
              ...dbData[recordIdx],
              ...fieldsToUpdate,
              updated_at: new Date().toISOString(),
            };
            dbData[recordIdx] = updatedRecord;
            writeLocalDb(filename, dbData);
            return NextResponse.json({ success: true, data: updatedRecord }, {
              headers: { 'x-supabase-warning': 'tables-missing' }
            });
          }
        } catch (fallbackErr) {
          console.error('Local mock DB fallback failed:', fallbackErr);
        }
      }
    }

    const message = err instanceof Error ? err.message : 'Database update error.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { authorized, email, error } = await checkAdminAuth();
  if (!authorized) {
    return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Record ID is required for deletion.' }, { status: 400 });
  }

  try {
    if (isSupabaseConfigured) {
      const supabase = await createServerSupabaseClient();
      let table = '';
      if (type === 'projects') table = 'projects';
      else if (type === 'skills') table = 'skills';
      else if (type === 'blogs') table = 'blog_posts';
      else if (type === 'inquiries') table = 'contact_messages';

      if (!table) {
        return NextResponse.json({ error: 'Invalid deletion target table.' }, { status: 400 });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dbErr } = await (supabase.from(table) as any).delete().eq('id', id);
      if (dbErr) throw dbErr;

      // Log transaction
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('admin_audit_logs') as any).insert([{
        admin_email: email || 'system',
        action_performed: `DELETE RECORD: ${id}`,
        target_table: table,
        record_id: id
      }]);

      return NextResponse.json({ success: true });
    } else {
      // Local Mock DB Deletion
      let filename = '';
      if (type === 'projects') filename = 'projects.json';
      else if (type === 'skills') filename = 'skills.json';
      else if (type === 'blogs') filename = 'blogs.json';
      else if (type === 'inquiries') filename = 'messages.json';

      if (!filename) {
        return NextResponse.json({ error: 'Invalid deletion target table.' }, { status: 400 });
      }

      const dbData = readLocalDb(filename);
      const filtered = dbData.filter((item) => item.id !== id);

      if (filtered.length === dbData.length) {
        return NextResponse.json({ error: 'Record not found.' }, { status: 404 });
      }

      writeLocalDb(filename, filtered);
      return NextResponse.json({ success: true });
    }
  } catch (err: unknown) {
    console.error('Admin DELETE removal failure:', err);
    
    // Check if error is due to missing tables in Supabase (PGRST205)
    const isMissingTable = err && typeof err === 'object' && ('code' in err) && (err as { code?: string }).code === 'PGRST205';
    if (isMissingTable) {
      console.warn('Supabase tables are missing. Falling back to local offline JSON storage.');
      let filename = '';
      if (type === 'projects') filename = 'projects.json';
      else if (type === 'skills') filename = 'skills.json';
      else if (type === 'blogs') filename = 'blogs.json';
      else if (type === 'inquiries') filename = 'messages.json';

      if (filename) {
        try {
          const dbData = readLocalDb(filename);
          const filtered = dbData.filter((item) => item.id !== id);
          writeLocalDb(filename, filtered);
          return NextResponse.json({ success: true }, {
            headers: { 'x-supabase-warning': 'tables-missing' }
          });
        } catch (fallbackErr) {
          console.error('Local mock DB fallback failed:', fallbackErr);
        }
      }
    }

    const message = err instanceof Error ? err.message : 'Database delete error.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
