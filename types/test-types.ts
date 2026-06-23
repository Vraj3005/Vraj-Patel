import { createSimpleSupabaseClient } from '../lib/supabase/simple';
import { Database } from './supabase';
import { SupabaseClient } from '@supabase/supabase-js';

const client: SupabaseClient<Database> = createSimpleSupabaseClient();
const res = client.from('cli_command_logs');
