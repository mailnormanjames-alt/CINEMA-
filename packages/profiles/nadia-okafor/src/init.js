(function() {
  'use strict';

  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
        initAnimations();
      }, 2500);
    });
  }

  let lenis;
  function initLenis() {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          lenis.scrollTo(target, { offset: -80 });
        }
      });
    });
  }

  function initCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor || window.innerWidth < 768) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, [data-magnetic]').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  function initMagnetic() {
    if (window.innerWidth < 768) return;

    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.4s ease';
        setTimeout(() => el.style.transition = '', 400);
      });
    });
  }

  function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      progressBar.style.transform = `scaleX(${progress})`;
    });
  }

  function initNav() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    if (!nav) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });

    if (toggle && links) {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
      });

      links.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
          toggle.classList.remove('active');
          links.classList.remove('open');
        });
      });
    }
  }

  function initAnimations() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero__swatch', {
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.3,
    });

    gsap.from('.hero__role', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.6,
    });

    gsap.from('.hero__title-line', {
      y: 60,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: 'power3.out',
      delay: 0.8,
    });

    gsap.from('.hero__subtitle', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: 1.2,
    });

    gsap.from('.hero__cta', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: 1.4,
    });

    document.querySelectorAll('.hero__garment').forEach((garment, i) => {
      gsap.to(garment, {
        y: 20,
        duration: 2 + i * 0.3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    gsap.from('.philosophy__statement p', {
      scrollTrigger: {
        trigger: '.philosophy__statement',
        start: 'top 80%',
      },
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    });

    gsap.from('.fabric-library__item', {
      scrollTrigger: {
        trigger: '.fabric-library__grid',
        start: 'top 80%',
      },
      y: 60,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out',
    });

    gsap.from('.filmstrip__item', {
      scrollTrigger: {
        trigger: '.filmstrip__reel',
        start: 'top 80%',
      },
      y: 40,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power2.out',
    });

    gsap.from('.about__portrait-frame', {
      scrollTrigger: {
        trigger: '.about__inner',
        start: 'top 70%',
      },
      x: -60,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    });

    gsap.from('.about__bio', {
      scrollTrigger: {
        trigger: '.about__inner',
        start: 'top 70%',
      },
      x: 60,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      delay: 0.2,
    });

    gsap.from('.services__item', {
      scrollTrigger: {
        trigger: '.services__grid',
        start: 'top 80%',
      },
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
    });

    gsap.from('.contact__info', {
      scrollTrigger: {
        trigger: '.contact__content',
        start: 'top 80%',
      },
      x: -40,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    });

    gsap.from('.contact__form', {
      scrollTrigger: {
        trigger: '.contact__content',
        start: 'top 80%',
      },
      x: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.2,
    });
  }

  function init() {
    document.body.style.overflow = 'hidden';
    initPreloader();
    initLenis();
    initCursor();
    initMagnetic();
    initScrollProgress();
    initNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
