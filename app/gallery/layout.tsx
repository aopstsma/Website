import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('/gallery', {
  title: 'Photo Gallery — AOPSTSMA',
  description:
    'Official photo gallery of AOPSTSMA events — association general assemblies, zonal committee meetings, legal cell proceedings, and award ceremonies across Odisha.',
});

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
