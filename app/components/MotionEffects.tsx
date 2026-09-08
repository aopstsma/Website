'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function MotionEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        header.classList.toggle('is-stuck', window.scrollY > 40);
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

    // If reduced motion is preferred, only scroll-progress & sticky header run
    if (reduced) {
      return () => {
        window.removeEventListener('scroll', onProgressScroll);
        window.removeEventListener('scroll', onHeaderScroll);
        if (bar.parentNode) bar.parentNode.removeChild(bar);
        if (header) header.classList.remove('is-stuck');
      };
    }

    /* ---- 3. Cursor glow (desktop pointer devices only) ---- */
    let glow: HTMLDivElement | null = null;
    let animLoopId = 0;
    const onPointerMove = (e: PointerEvent) => {
      if (!glow) return;
      tx = e.clientX;
      ty = e.clientY;
      glow.classList.add('is-on');
    };

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      glow = document.createElement('div');
      glow.className = 'cursor-glow';
      document.body.appendChild(glow);

      window.addEventListener('pointermove', onPointerMove, { passive: true });

      const loop = () => {
        x += (tx - x) * 0.12;
        y += (ty - y) * 0.12;
        if (glow) {
          glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
        animLoopId = requestAnimationFrame(loop);
      };
      animLoopId = requestAnimationFrame(loop);
    }

    /* ---- 4. Headline: reveal word by word ---- */
    const h = document.querySelector('.hero h1');
    if (h && !h.querySelector('.word')) {
      const wrap = (node: ChildNode) => {
        const frag = document.createDocumentFragment();
        const text = node.textContent || '';
        text.split(/(\s+)/).forEach((chunk) => {
          if (!chunk.trim()) {
            frag.appendChild(document.createTextNode(chunk));
            return;
          }
          const s = document.createElement('span');
          s.className = 'word';
          s.textContent = chunk;
          frag.appendChild(s);
        });
        if (node.parentNode) {
          node.parentNode.replaceChild(frag, node);
        }
      };

      Array.from(h.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          wrap(n);
        } else if (n.nodeType === 1) {
          Array.from(n.childNodes).forEach((c) => {
            if (c.nodeType === 3) wrap(c);
          });
        }
      });

      h.querySelectorAll('.word').forEach((w, i) => {
        (w as HTMLElement).style.animationDelay = (0.35 + i * 0.065) + 's';
      });
    }

    /* ---- 5. Animated counters ---- */
    const nums = document.querySelectorAll('.facts__n');
    const counterIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        counterIo.unobserve(e.target);
        const el = e.target as HTMLElement;
        const target = parseInt(el.textContent?.replace(/\D/g, '') || '0', 10);
        if (!target) return;
        const dur = 1500;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = String(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });

    nums.forEach((n) => counterIo.observe(n));

    /* ---- 6. 3D card tilt ---- */
    const cardCleanups: (() => void)[] = [];
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      document.querySelectorAll('.zone-card, .service').forEach((card) => {
        const el = card as HTMLElement;
        const handleMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const cx = (e.clientX - r.left) / r.width - 0.5;
          const cy = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = `perspective(900px) rotateX(${-cy * 7}deg) rotateY(${cx * 9}deg) translateY(-6px)`;
        };
        const handleLeave = () => {
          el.style.transform = '';
        };

        el.addEventListener('pointermove', handleMove as EventListener);
        el.addEventListener('pointerleave', handleLeave);

        cardCleanups.push(() => {
          el.removeEventListener('pointermove', handleMove as EventListener);
          el.removeEventListener('pointerleave', handleLeave);
          el.style.transform = '';
        });
      });
    }

    /* ---- 7. Staggered reveal for grids ---- */
    document.querySelectorAll('.zone-grid, .services, .bearers, .facts__grid').forEach((el) => {
      el.classList.add('reveal-stagger');
    });

    const staggerItems = document.querySelectorAll('.reveal-stagger');
    const staggerIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          staggerIo.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px' });

    staggerItems.forEach((el) => staggerIo.observe(el));

    /* ---- 8. Section headings animated rule ---- */
    const heads = document.querySelectorAll('.head');
    const headIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          headIo.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });

    heads.forEach((el) => headIo.observe(el));

    /* ---- Cleanup on unmount ---- */
    return () => {
      window.removeEventListener('scroll', onProgressScroll);
      window.removeEventListener('scroll', onHeaderScroll);
      if (bar.parentNode) bar.parentNode.removeChild(bar);

      if (glow && glow.parentNode) {
        window.removeEventListener('pointermove', onPointerMove);
        cancelAnimationFrame(animLoopId);
        glow.parentNode.removeChild(glow);
      }

      if (header) header.classList.remove('is-stuck');

      counterIo.disconnect();
      staggerIo.disconnect();
      headIo.disconnect();
      cardCleanups.forEach((fn) => fn());
    };
  }, [pathname]);

  return null;
}
