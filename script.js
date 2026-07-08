/* =========================================================
   Portfolio Landing — Interactions
   Vanilla JS (ES6). No dependencies.
   ========================================================= */

(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- NAV: scrolled state ---------- */
  const nav = $('#nav');
  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
    updateProgress();
    toggleBackTop();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const closeMobile = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', closeMobile));

  /* ---------- Scroll progress bar ---------- */
  const progressBar = $('#progressBar');
  const updateProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    progressBar.style.width = Math.min(100, Math.max(0, scrolled * 100)) + '%';
  };

  /* ---------- Back to top ---------- */
  const backTop = $('#backTop');
  const toggleBackTop = () => {
    backTop.classList.toggle('show', window.scrollY > 500);
  };
  backTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  /* ---------- Active section highlight ---------- */
  const sections = $$('main section[id]');
  const navLinks = $$('.nav-link');
  const setActive = (id) => {
    navLinks.forEach(link => {
      const match = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', match);
    });
  };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => sectionObserver.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger inside a container of siblings a bit
        entry.target.style.transitionDelay = Math.min(i * 40, 240) + 'ms';
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = $$('.counter');
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const runCounter = (el) => {
    const target = parseFloat(el.dataset.target || '0');
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const val = Math.round(easeOut(p) * target);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(tick);
  };
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        runCounter(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObs.observe(c));

  /* ---------- Service card cursor glow ---------- */
  $$('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', mx + '%');
      card.style.setProperty('--my', my + '%');
    });
  });

  /* ---------- Smooth anchor scroll (extra offset control) ---------- */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Contact form (demo submit) ---------- */
  const form = $('#contactForm');
  const formNote = $('#formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      if (!data.get('name') || !data.get('email') || !data.get('message')) {
        formNote.style.color = 'var(--danger)';
        formNote.textContent = 'Please fill in your name, email, and a short message.';
        return;
      }
      formNote.style.color = 'var(--accent)';
      formNote.textContent = 'Thanks! Your message is queued — I will get back within 24 hours.';
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Init ---------- */
  onScroll();
})();
