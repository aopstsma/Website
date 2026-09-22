import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('/achievements', {
  title: 'High Court Orders, Legal Precedents & Achievements — AOPSTSMA',
  description:
    'Authenticated High Court of Orissa judgments, Supreme Court orders, BSE communicated orders, and association achievements. Landmark judicial precedents protecting 90 private secondary training schools in Odisha.',
});

export default function AchievementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
