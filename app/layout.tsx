import type { Metadata, Viewport } from 'next';
import './globals.css';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import ScrollReveal from './components/ScrollReveal';
import MotionEffects from './components/MotionEffects';
import WhatsAppButton from './components/WhatsAppButton';
import Analytics from './components/Analytics';
import { defaultMetadata, structuredDataGraph } from '@/lib/seo';

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B2545',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicon & PWA Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&family=Barlow:wght@400;500;600&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD Structured Data for Google Rich Results & AEO (Answer Engine Optimization) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataGraph) }}
        />
      </head>
      <body>
        <ScrollReveal />
        <MotionEffects />
        <Analytics />
        <SiteHeader />
        <main>{children}</main>
        <WhatsAppButton />
        <SiteFooter />
      </body>
    </html>
  );
}
