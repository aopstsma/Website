import type { Metadata } from 'next';
import { Suspense } from 'react';
import SchoolsClient from './SchoolsClient';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('/schools', {
  title: 'Member Schools Directory — 90 Affiliated Institutions',
  description:
    'Complete directory of 90 private secondary training schools affiliated with AOPSTSMA across 5 zones and 30 districts of Odisha. Search by name, zone, or district.',
});

export default function SchoolsPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>Member schools</h1>
          <p className="lede">Search by school name, district or zone.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Suspense fallback={<p className="school-count">Loading member directory...</p>}>
            <SchoolsClient />
          </Suspense>
        </div>
      </section>
    </>
  );
}
