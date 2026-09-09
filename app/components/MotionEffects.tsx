'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function MotionEffects() {
  const pathname = usePathname();

  useEffect(() => {
    /* ---- 1. Scroll progress bar ---- */
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    let progressTicking = false;
    function updateProgress() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
      progressTicking = false;
    }
    const onProgressScroll = () => {
      if (!progressTicking) {
        progressTicking = true;
        requestAnimationFrame(updateProgress);
      }
    };
    window.addEventListener('scroll', onProgressScroll, { passive: true });
    updateProgress();

    /* ---- 2. Sticky header state ---- */
    const header = document.querySelector('.site-header');
    let headerTicking = false;
    function updateHeader() {
      if (header) {
        header.classList.toggle('is-stuck', window.scrollY > 20);
      }
      headerTicking = false;
    }
    const onHeaderScroll = () => {
      if (!headerTicking) {
        headerTicking = true;
        requestAnimationFrame(updateHeader);
      }
    };
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
    updateHeader();

    /* ---- 3. Animated counters ---- */
    const nums = document.querySelectorAll('.facts__n');
    const counterIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        counterIo.unobserve(e.target);
        const el = e.target as HTMLElement;
        const target = parseInt(el.textContent?.replace(/\D/g, '') || '0', 10);
        if (!target) return;
        const dur = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = String(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });

    nums.forEach((n) => counterIo.observe(n));

    /* ---- Cleanup on unmount ---- */
    return () => {
      window.removeEventListener('scroll', onProgressScroll);
      window.removeEventListener('scroll', onHeaderScroll);
      if (bar.parentNode) bar.parentNode.removeChild(bar);
      if (header) header.classList.remove('is-stuck');
      counterIo.disconnect();
    };
  }, [pathname]);

  return null;
}
