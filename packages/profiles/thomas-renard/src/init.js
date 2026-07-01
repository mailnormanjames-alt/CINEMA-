/* Thomas Renard — Producer Init
   Technical Master · Precision · Workshop */

(function () {
  'use strict';

  /* ---------- PRELOADER ---------- */
  const preloaderEl = document.querySelector('[data-cinema-preloader]');
  const countEl = preloaderEl?.querySelector('.preloader-count');
  const barEl = preloaderEl?.querySelector('.preloader-bar-fill');
  const statusEl = preloaderEl?.querySelector('.preloader-status');

  let loaded = 0;
  const images = document.querySelectorAll('img');
  const total = images.length || 1;
  const statuses = ['LOADING ASSETS', 'VERIFYING SYSTEMS', 'CALIBRATING', 'READY'];

  function tick() {
    loaded++;
    const pct = Math.round((loaded / total) * 100);
    if (countEl) countEl.textContent = String(pct).padStart(3, '0');
    if (barEl) barEl.style.width = `${pct}%`;
    if (statusEl && pct > 25) statusEl.textContent = statuses[Math.min(Math.floor(pct / 30), 2)];
    if (loaded >= total) done();
  }

  images.forEach((img) => {
    if (img.complete) tick();
    else { img.addEventListener('load', tick); img.addEventListener('error', tick); }
  });

  setTimeout(done, 3500);

  function done() {
    if (barEl) barEl.style.width = '100%';
    if (statusEl) statusEl.textContent = statuses[3];
    setTimeout(() => {
      if (preloaderEl) {
        gsap.to(preloaderEl, { opacity: 0, duration: 0.6, ease: 'power2.inOut', onComplete: () => { preloaderEl.remove(); } });
      }
      initHero(); initScrollAnimations(); initEquipment(); initMagnetic();
    }, 500);
  }

  /* ---------- LENIS ---------- */
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });

  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  /* ---------- HERO ---------- */
  function initHero() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero-spec-header', { opacity: 0, y: 20, duration: 1, delay: 0.3, ease: 'power3.out' });

    const tl = gsap.timeline({ delay: 0.2 });
    tl.from('.hero-title .word', { y: 80, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'power3.out' })
      .from('.hero-spec-item', { opacity: 0, y: 15, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, '-=0.4')
      .from('.hero-scroll-cue', { opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.2');

    gsap.to('.hero-grid-overlay', {
      opacity: 0.15,
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
    });
  }

  /* ---------- SCROLL ANIMATIONS ---------- */
  function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    const quote = document.querySelector('.statement-quote');
    if (quote) {
      gsap.fromTo(quote, { opacity: 0, y: 50 },
        { scrollTrigger: { trigger: '.statement', start: 'top 70%', end: 'top 30%', scrub: 1 }, opacity: 1, y: 0 });
    }

    document.querySelectorAll('.filmstrip-item').forEach((item, i) => {
      gsap.fromTo(item, { opacity: 0, y: 60 },
        { scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' }, opacity: 1, y: 0, duration: 1.1, delay: i * 0.15, ease: 'power3.out' });
    });

    document.querySelectorAll('.service-row').forEach((row, i) => {
      gsap.fromTo(row, { opacity: 0, x: -30 },
        { scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none none' }, opacity: 1, x: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out' });
    });

    document.querySelectorAll('.stat').forEach((stat, i) => {
      const numEl = stat.querySelector('.stat-num');
      const countTo = parseInt(numEl.getAttribute('data-count'), 10);
      gsap.fromTo(stat, { opacity: 0, y: 30 },
        { scrollTrigger: { trigger: '.stats', start: 'top 75%', toggleActions: 'play none none none', onEnter: () => animateCounter(numEl, countTo) }, opacity: 1, y: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out' });
    });

    document.querySelectorAll('.approach-title .word').forEach((word, i) => {
      gsap.fromTo(word, { y: 60, opacity: 0 },
        { scrollTrigger: { trigger: '.approach', start: 'top 65%', toggleActions: 'play none none none' }, y: 0, opacity: 1, duration: 1, delay: i * 0.1, ease: 'power3.out' });
    });

    document.querySelectorAll('.contact-title .word').forEach((word, i) => {
      gsap.fromTo(word, { y: 80, opacity: 0 },
        { scrollTrigger: { trigger: '.contact', start: 'top 65%', toggleActions: 'play none none none' }, y: 0, opacity: 1, duration: 1, delay: i * 0.12, ease: 'power3.out' });
    });
  }

  function animateCounter(el, target) {
    const obj = { val: 0 };
    gsap.to(obj, { val: target, duration: 2.5, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(obj.val); } });
  }

  /* ---------- EQUIPMENT ---------- */
  function initEquipment() {
    document.querySelectorAll('.equipment-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -4, duration: 0.4, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, duration: 0.6, ease: 'power3.out' });
      });
    });
  }

  /* ---------- MAGNETIC ---------- */
  function initMagnetic() {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - rect.left - rect.width / 2) * 0.3, y: (e.clientY - rect.top - rect.height / 2) * 0.3, duration: 0.3, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' }));
    });
  }

  /* ---------- CURSOR ---------- */
  const cursor = document.getElementById('cursor');
  const cursorText = document.getElementById('cursorText');
  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
  document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

  function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    if (cursor) cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    if (cursorText) { cursorText.style.left = `${mouseX + 20}px`; cursorText.style.top = `${mouseY - 10}px`; }
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  document.querySelectorAll('[data-cursor="pointer"]').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-pointer'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-pointer'));
  });

  document.querySelectorAll('[data-cursor="view"]').forEach(el => {
    el.addEventListener('mouseenter', () => { document.body.classList.add('cursor-view'); if (cursorText) cursorText.textContent = 'VIEW'; });
    el.addEventListener('mouseleave', () => { document.body.classList.remove('cursor-view'); if (cursorText) cursorText.textContent = ''; });
  });

  /* ---------- SCROLL PROGRESS ---------- */
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      progressBar.style.width = `${(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`;
    });
  }

  /* ---------- NAV ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('is-active');
      mobileMenu.classList.toggle('is-active');
      document.body.style.overflow = mobileMenu.classList.contains('is-active') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('is-active');
        mobileMenu.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    });
  }

})();
