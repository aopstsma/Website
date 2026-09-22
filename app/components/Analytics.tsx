'use client';

import Script from 'next/script';

/**
 * Analytics — Google Analytics 4 + Microsoft Clarity
 * 
 * Environment variables:
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID  — GA4 Measurement ID (G-XXXXXXXXXX)
 *   NEXT_PUBLIC_CLARITY_PROJECT_ID — Microsoft Clarity Project ID
 * 
 * Both scripts load asynchronously after page hydration (afterInteractive)
 * to avoid blocking the initial render and hurting Core Web Vitals.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || '';

export default function Analytics() {
  return (
    <>
      {/* ============================================================
          GOOGLE ANALYTICS 4 (GA4)
          Tracks: Page views, scroll depth, outbound clicks, file downloads
          Enhanced Measurement is enabled by default in the GA4 dashboard.
          ============================================================ */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
                send_page_view: true
              });
            `}
          </Script>
        </>
      )}

      {/* ============================================================
          MICROSOFT CLARITY
          Tracks: Heatmaps, session recordings, rage clicks, dead clicks
          Free for unlimited traffic. Dashboard: clarity.microsoft.com
          ============================================================ */}
      {CLARITY_ID && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
          `}
        </Script>
      )}
    </>
  );
}
