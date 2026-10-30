import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('/refund-policy', {
  title: 'Refund Policy — AOPSTSMA',
  description: 'Refund Policy of All Orissa Private Secondary Training Schools Management Association (AOPSTSMA).',
});

export default function RefundPolicyPage() {
  return <div style={{ minHeight: '60vh' }} />;
}

