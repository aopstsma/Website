import type { Metadata } from 'next';
import './globals.css';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import ScrollReveal from './components/ScrollReveal';

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
      </head>
      <body>
        <ScrollReveal />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
