import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client for administrative functions, lookups, and migrations.
 * Configured with the Supabase transaction pooler (port 6543) and service role key.
 * 
 * Rules from SPEC.md:
 * - Must only be executed on the server, never imported in client components.
 * - Transactions pooler port: 6543
 * - No direct connection to port 5432
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key';

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public',
    },
  });
}
