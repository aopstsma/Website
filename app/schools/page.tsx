import type { Metadata } from 'next';
import { Suspense } from 'react';
import SchoolsClient from './SchoolsClient';

export const metadata: Metadata = {
  title: 'Member schools — AOPSTSMA',
  description:
    'Directory of private secondary training schools that are members of the association, searchable by name, zone and district.',
};

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
