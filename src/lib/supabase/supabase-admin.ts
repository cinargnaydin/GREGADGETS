import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Server-side Supabase client. Uses the service-role key, so it must only ever
// be imported from server code (API routes / server libs), never the browser.
let cachedClient: SupabaseClient | null = null;

export function hasSupabaseConfig(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getApp(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  cachedClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cachedClient;
}

// Lazy accessor — never evaluated at module load / build time.
export function getSupabaseAdmin(): SupabaseClient {
  return getApp();
}

// Mirrors the previous Firestore accessor: returns a client when configured, or
// null to trigger the in-memory dev fallback locally. In production, missing
// config is a hard error so we never silently drop bookings/leads.
export function getOptionalSupabaseAdmin(): SupabaseClient | null {
  if (!hasSupabaseConfig()) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
      );
    }

    console.warn('Supabase is not configured. Using development-only in-memory fallback.');
    return null;
  }

  return getApp();
}

// Postgres error code for an exclusion-constraint violation. The appointments
// table has a tstzrange exclusion constraint, so an overlapping insert raises
// this — that's our atomic, race-proof double-booking guard.
export const PG_EXCLUSION_VIOLATION = '23P01';
