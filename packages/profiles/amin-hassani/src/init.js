import { FrequencySpectrum } from './components/FrequencySpectrum.js';

(function() {
  'use strict';

  // PRELOADER
  const preloader = document.getElementById('preloader');
  const vuNeedle = document.querySelector('.vu-needle');
  const dbDisplay = document.querySelector('.preloader__db');
  let loadProgress = 0;
  let preloaderReady = false;
  const MIN_PRELOADER_TIME = 2500;
  const preloaderStartTime = Date.now();

  function updatePreloader() {
    loadProgress += Math.random() * 4 + 1;
    if (loadProgress > 95) loadProgress = 95;

    const dbValue = -60 + (loadProgress * 0.6);
    dbDisplay.textContent = dbValue.toFixed(1) + ' dB';

    if (vuNeedle) {
      const angle = -40 + (loadProgress * 0.8);
      vuNeedle.style.transform = `rotate(${angle}deg)`;
    }

    if (loadProgress < 95) {
      requestAnimationFrame(updatePreloader);
    } else {
      checkPreloaderComplete();
    }
  }

  function checkPreloaderComplete() {
    const elapsed = Date.now() - preloaderStartTime;
    if (elapsed >= MIN_PRELOADER_TIME) {
      dismissPreloader();
    } else {
      setTimeout(dismissPreloader, MIN_PRELOADER_TIME - elapsed);
    }
  }

  function dismissPreloader() {
    if (preloaderReady) return;
    preloaderReady = true;

    loadProgress = 100;
    if (dbDisplay) dbDisplay.textContent = '0.0 dB';
    if (vuNeedle) vuNeedle.style.transform = 'rotate(40deg)';

    setTimeout(() => {
      preloader.style.transition = 'opacity 1s cubic-bezier(0.23, 1, 0.32, 1), visibility 1s';
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      setTimeout(() => {
        preloader.style.display = 'none';
        initAnimations();
      }, 1000);
    }, 300);
  }

  const heroImg = document.getElementById('heroBgImg');
  if (heroImg) {
    heroImg.onload = () => { requestAnimationFrame(updatePreloader); };
    if (heroImg.complete) requestAnimationFrame(updatePreloader);
  } else {
    requestAnimationFrame(updatePreloader);
  }

  // LENIS SMOOTH SCROLL
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // SCROLL PROGRESS
  const scrollProgressFill = document.getElementById('scrollProgress');

  lenis.on('scroll', ({ progress }) => {
    if (scrollProgressFill) {
      scrollProgressFill.style.width = (progress * 100) + '%';
    }
  });

  // GSAP ANIMATIONS
  function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    const heroTl = gsap.timeline({ delay: 0.3 });

    heroTl
      .from('.hero__spec-tag', {
        opacity: 0,
        x: -20,
        duration: 0.8,
        ease: 'power3.out'
      })
      .from('.hero__spec-id', {
        opacity: 0,
        x: 20,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.6')
      .from('.spec-row', {
        opacity: 0,
        y: 20,
        stagger: 0.12,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.4')
      .from('.hero__vu-display', {
        opacity: 0,
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.3')
      .from('.hero__scroll-cue', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.2');

    // VU meter animation
    const vuLeft = document.querySelector('#heroVuLeft .vu-meter__fill');
    const vuRight = document.querySelector('#heroVuRight .vu-meter__fill');
    const vuPeakLeft = document.querySelector('#heroVuLeft .vu-meter__peak');
    const vuPeakRight = document.querySelector('#heroVuRight .vu-meter__peak');

    function animateVuMeters() {
      const baseLevel = 55 + Math.random() * 30;

      if (vuLeft) {
        vuLeft.style.width = baseLevel + '%';
      }
      if (vuRight) {
        vuRight.style.width = (baseLevel + (Math.random() * 10 - 5)) + '%';
      }
      if (vuPeakLeft) {
        vuPeakLeft.style.left = Math.min(100, baseLevel + 5 + Math.random() * 10) + '%';
      }
      if (vuPeakRight) {
        vuPeakRight.style.left = Math.min(100, baseLevel + 3 + Math.random() * 12) + '%';
      }

      setTimeout(animateVuMeters, 100 + Math.random() * 200);
    }
    animateVuMeters();

    // Philosophy section
    gsap.from('.philosophy__statement', {
      scrollTrigger: {
        trigger: '.philosophy__statement',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      x: -40,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.philosophy__ref', {
      scrollTrigger: {
        trigger: '.philosophy__refs',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 10,
      stagger: 0.15,
      duration: 0.6,
      ease: 'power3.out'
    });

    // VU strip animation
    const vuMinis = document.querySelectorAll('.vu-mini');
    ScrollTrigger.create({
      trigger: '.philosophy__vu-strip',
      start: 'top 85%',
      onEnter: () => {
        vuMinis.forEach((el, i) => {
          setTimeout(() => {
            el.classList.add('active');
          }, i * 100);
        });
      }
    });

    // Frequency spectrum header
    gsap.from('.frequency__header', {
      scrollTrigger: {
        trigger: '.frequency__header',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from('.frequency__canvas-wrap', {
      scrollTrigger: {
        trigger: '.frequency__canvas-wrap',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      scaleY: 0,
      transformOrigin: 'bottom center',
      duration: 1,
      ease: 'power3.out'
    });

    // Filmstrip items
    const filmstripItems = document.querySelectorAll('.filmstrip__item');
    filmstripItems.forEach((item, i) => {
      gsap.to(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'power3.out'
      });
    });

    // About section
    gsap.from('.about__portrait-frame', {
      scrollTrigger: {
        trigger: '.about__portrait-frame',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      scale: 0.9,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.about__text', {
      scrollTrigger: {
        trigger: '.about__bio',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 20,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from('.about__stat', {
      scrollTrigger: {
        trigger: '.about__stats',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 20,
      stagger: 0.15,
      duration: 0.6,
      ease: 'power3.out'
    });

    // Services
    const serviceVuFills = document.querySelectorAll('.service__vu-fill');
    const services = document.querySelectorAll('.service');

    services.forEach((service, i) => {
      gsap.from(service, {
        scrollTrigger: {
          trigger: service,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 0.7,
        delay: i * 0.1,
        ease: 'power3.out'
      });
    });

    ScrollTrigger.create({
      trigger: '.services__grid',
      start: 'top 75%',
      onEnter: () => {
        serviceVuFills.forEach((fill) => {
          const level = fill.getAttribute('data-level');
          fill.style.width = level + '%';
        });
      }
    });

    // Contact section
    gsap.from('.contact__heading', {
      scrollTrigger: {
        trigger: '.contact__heading',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.contact__item', {
      scrollTrigger: {
        trigger: '.contact__info',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      x: -20,
      stagger: 0.15,
      duration: 0.6,
      ease: 'power3.out'
    });

    gsap.from('.contact__cta', {
      scrollTrigger: {
        trigger: '.contact__cta',
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Contact VU on scroll
    const contactVu = document.getElementById('contactVu');
    if (contactVu) {
      ScrollTrigger.create({
        trigger: '.section--contact',
        start: 'top 50%',
        onUpdate: (self) => {
          const progress = self.progress;
          contactVu.style.width = (progress * 100) + '%';
        }
      });
    }

    // Section labels
    gsap.utils.toArray('.section__number, .section__label').forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: -10,
        duration: 0.6,
        ease: 'power3.out'
      });
    });
  }

  // CURSOR
  const cursor = document.getElementById('cursor');
  const cursorDot = cursor.querySelector('.cursor__dot');
  const cursorRing = cursor.querySelector('.cursor__ring');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;

    cursorX += dx * 0.15;
    cursorY += dy * 0.15;

    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(updateCursor);
  }
  requestAnimationFrame(updateCursor);

  // Cursor hover states
  const hoverTargets = document.querySelectorAll('a, button, .filmstrip__card, .service, .contact__cta');
  hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    target.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  // MAGNETIC HOVER
  const magneticElements = document.querySelectorAll('.nav__logo, .contact__cta, .filmstrip__title');

  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  });

  // MOBILE MENU
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');

    if (mobileMenu.classList.contains('active')) {
      lenis.stop();
      document.body.style.overflow = 'hidden';

      mobileLinks.forEach((link, i) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        setTimeout(() => {
          link.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
          link.style.opacity = '1';
          link.style.transform = 'translateY(0)';
        }, 100 + i * 80);
      });
    } else {
      lenis.start();
      document.body.style.overflow = '';
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      lenis.start();
      document.body.style.overflow = '';
    });
  });

  // FREQUENCY SPECTRUM COMPONENT
  try {
    const spectrumInstance = new FrequencySpectrum('spectrumCanvas', 'frequencySpectrum');
    spectrumInstance.init();
  } catch (e) {
    console.log('FrequencySpectrum not available, using canvas fallback');
    initCanvasFallback();
  }

  function initCanvasFallback() {
    const canvas = document.getElementById('spectrumCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animFrame;
    let mouseX = 0;

    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.parentElement.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
    });

    function drawSpectrum(time) {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = 'rgba(42, 42, 42, 0.5)';
      ctx.lineWidth = 0.5;

      for (let i = 0; i <= 7; i++) {
        const x = (w / 7) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      for (let i = 0; i <= 5; i++) {
        const y = (h / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Spectrum bars
      const barCount = 64;
      const barWidth = w / barCount;
      const barGap = 1;

      for (let i = 0; i < barCount; i++) {
        const x = i * barWidth;
        const distFromMouse = Math.abs(i / barCount - mouseX);
        const mouseInfluence = Math.max(0, 1 - distFromMouse * 4);

        const baseHeight = (Math.sin(time * 0.002 + i * 0.3) * 0.3 + 0.5) * h * 0.6;
        const height = baseHeight + mouseInfluence * h * 0.2;

        const normalizedPos = i / barCount;
        const r = 212;
        const g = 168 - normalizedPos * 40;
        const b = 83 - normalizedPos * 30;

        const gradient = ctx.createLinearGradient(x, h, x, h - height);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.1)`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.6)`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.9)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(x + barGap / 2, h - height, barWidth - barGap, height);

        // Peak glow
        if (mouseInfluence > 0.3) {
          ctx.shadowColor = `rgba(212, 168, 83, ${mouseInfluence * 0.5})`;
          ctx.shadowBlur = 10;
          ctx.fillRect(x + barGap / 2, h - height, barWidth - barGap, 2);
          ctx.shadowBlur = 0;
        }
      }

      animFrame = requestAnimationFrame(() => drawSpectrum(performance.now()));
    }

    animFrame = requestAnimationFrame(() => drawSpectrum(performance.now()));

    // Update info displays
    const peakEl = document.getElementById('freqPeak');
    const rmsEl = document.getElementById('freqRms');
    const crestEl = document.getElementById('freqCrest');

    setInterval(() => {
      if (peakEl) peakEl.textContent = (-3 - Math.random() * 3).toFixed(1) + ' dB';
      if (rmsEl) rmsEl.textContent = (-16 - Math.random() * 4).toFixed(1) + ' dB';
      if (crestEl) crestEl.textContent = (14 + Math.random() * 3).toFixed(1) + ' dB';
    }, 800);
  }

})();
