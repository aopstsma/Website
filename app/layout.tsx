import type { Metadata } from 'next';
import './globals.css';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import ScrollReveal from './components/ScrollReveal';
import MotionEffects from './components/MotionEffects';

export const metadata: Metadata = {
  title: 'All Orissa Private Secondary Training Schools Management Association',
  description:
    'The association of private secondary training schools across Odisha. Six zones, member schools, legal records and services. Established 1980.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&family=Barlow:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ScrollReveal />
        <MotionEffects />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
