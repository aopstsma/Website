import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('/school-login', {
  title: 'Member School Login — AOPSTSMA Authorized Portal',
  description:
    'Authorized login portal for AOPSTSMA member training schools. Sign in to upload student rosters, manage enrollment records, and pay association fees securely.',
});

export default function SchoolLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
