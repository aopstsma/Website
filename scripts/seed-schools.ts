import { SCHOOLS } from '../lib/data/schools';
import { createAdminClient } from '../lib/supabase/server';

/**
 * Seed script to populate the 56+ member training schools from lib/data/schools.ts
 * into the Supabase `schools` table.
 * 
 * Usage:
 * npx tsx scripts/seed-schools.ts
 */
export async function seedSchools() {
  console.log(`[Seed] Preparing to seed ${SCHOOLS.length} member schools...`);

  const client = createAdminClient();

  // Zone code mapping for clean institutional codes
  const zonePrefixes: Record<string, string> = {
    balasore: 'BAL',
    cuttack: 'CTC',
    bhubaneswar: 'BBS',
    'zone-four': 'BAR',
    sambalpur: 'SBP',
    berhampur: 'BAM',
  };

  const zoneCounters: Record<string, number> = {};

  const records = SCHOOLS.map((s) => {
    const prefix = zonePrefixes[s.zone] || 'SCH';
    zoneCounters[prefix] = (zoneCounters[prefix] || 0) + 1;
    const code = `OD-${prefix}-${String(zoneCounters[prefix]).padStart(3, '0')}`;

    return {
      code,
      name: s.name,
      zone: s.zone,
      district: s.district || 'Odisha',
      contact_name: 'Principal / Management Trustee',
      contact_phone: '+91 63709 87576',
    };
  });

  console.log(`[Seed] Inserting records via Supabase upsert...`);
  const { data, error } = await client
    .from('schools')
    .upsert(records, { onConflict: 'code' })
    .select();

  if (error) {
    console.error('[Seed] Error seeding schools:', error);
    return false;
  }

  console.log(`[Seed] Successfully seeded ${data?.length || records.length} schools into database.`);
  return true;
}

// Auto-execute if run directly via tsx/node
if (require.main === module) {
  seedSchools().catch((err) => {
    console.error('[Seed] Fatal error:', err);
    process.exit(1);
  });
}
