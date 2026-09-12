import { NextResponse } from 'next/server';
import { SCHOOLS } from '@/lib/data/schools';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zone = searchParams.get('zone');
  const query = searchParams.get('q')?.toLowerCase();

  try {
    // Attempt Supabase query first
    const supabase = createAdminClient();
    let dbQuery = supabase.from('schools').select('id, code, name, zone, district, contact_phone');

    if (zone && zone !== 'all') {
      dbQuery = dbQuery.eq('zone', zone);
    }

    const { data: dbSchools, error } = await dbQuery;

    if (!error && dbSchools && dbSchools.length > 0) {
      let filtered = dbSchools;
      if (query) {
        filtered = filtered.filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            s.district?.toLowerCase().includes(query) ||
            s.code?.toLowerCase().includes(query)
        );
      }
      return NextResponse.json({
        source: 'supabase',
        count: filtered.length,
        schools: filtered,
      });
    }
  } catch (err) {
    console.warn('[Schools API] Supabase query fallback to local data:', err);
  }

  // High-performance static fallback from lib/data/schools.ts
  let list = SCHOOLS;
  if (zone && zone !== 'all') {
    list = list.filter((s) => s.zone === zone);
  }
  if (query) {
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.district.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    source: 'static_registry',
    count: list.length,
    schools: list,
  });
}
