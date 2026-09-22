import { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('/students', {
  title: 'Student Portal — Free Registration & Board Admit Card Download — AOPSTSMA',
  description:
    'Official AOPSTSMA Student Portal for teacher trainees in Odisha. Free student registration, secure OTP authentication, Board examination admit card download, and ₹2,500 fee status verification.',
});

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
