import CastingTapeMosaic from './components/CastingTapeMosaic.js';

(function () {
  'use strict';

  class Preloader {
    constructor() {
      this.el = document.getElementById('preloader');
      this.progress = document.getElementById('preloader-progress');
      this.load();
    }

    load() {
      let loaded = 0;
      const images = document.querySelectorAll('img');
      const total = images.length || 1;

      const tick = () => {
        loaded++;
        if (this.progress) {
          this.progress.style.width = `${(loaded / total) * 100}%`;
        }
        if (loaded >= total) this.done();
      };

      images.forEach((img) => {
        if (img.complete) tick();
        else {
          img.addEventListener('load', tick);
          img.addEventListener('error', tick);
        }
      });

      setTimeout(() => this.done(), 3500);
    }

    done() {
      if (this.progress) this.progress.style.width = '100%';
      setTimeout(() => {
        this.el?.classList.add('is-hidden');
        document.body.style.overflow = '';
        window.__preloaderDone = true;
        this.animateHeroEntry();
      }, 800);
    }

    animateHeroEntry() {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.from('.hero__stage', {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: 'power3.out',
      })
        .from(
          '.hero__label-line',
          {
            opacity: 0,
            y: 15,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .from(
          '.hero__title-line',
          {
            y: 80,
            opacity: 0,
            duration: 1,
            stagger: 0.12,
            ease: 'power3.out',
          },
          '-=0.4'
        )
        .from(
          '.hero__subtitle',
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .from(
          '.hero__cta .btn',
          {
            opacity: 0,
            y: 15,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '-=0.4'
        )
        .from(
          '.hero__scroll-hint',
          {
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.2'
        )
        .from(
          '.hero__paper',
          {
            opacity: 0,
            y: 30,
            rotation: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
          },
          '-=0.6'
        );
    }
  }

  class CustomCursor {
    constructor() {
      this.el = document.getElementById('cursor');
      if (!this.el) return;
      this.dot = this.el.querySelector('.cursor__dot');
      this.ring = this.el.querySelector('.cursor__ring');
      this.pos = { x: 0, y: 0 };
      this.mouse = { x: 0, y: 0 };
      this.bind();
      this.render();
    }

    bind() {
      document.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });

      document.querySelectorAll('[data-cursor]').forEach((el) => {
        const type = el.dataset.cursor;
        el.addEventListener('mouseenter', () => this.el.classList.add(`is-${type}`));
        el.addEventListener('mouseleave', () => this.el.classList.remove(`is-${type}`));
      });

      if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', () => {
          this.el.style.opacity = '1';
        });
      } else {
        this.el.style.display = 'none';
      }
    }

    render() {
      this.pos.x += (this.mouse.x - this.pos.x) * 0.12;
      this.pos.y += (this.mouse.y - this.pos.y) * 0.12;

      if (this.dot) {
        this.dot.style.transform = `translate(${this.mouse.x}px, ${this.mouse.y}px)`;
      }
      if (this.ring) {
        this.ring.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px)`;
      }

      requestAnimationFrame(() => this.render());
    }
  }

  class MagneticHover {
    constructor() {
      this.elements = document.querySelectorAll('.magnetic');
      this.bind();
    }

    bind() {
      this.elements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(el, {
            x: x * 0.25,
            y: y * 0.25,
            duration: 0.4,
            ease: 'power2.out',
          });
        });

        el.addEventListener('mouseleave', () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
        });
      });
    }
  }

  class ScrollProgress {
    constructor() {
      this.bar = document.getElementById('scroll-progress');
      if (!this.bar) return;
      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        this.bar.style.width = `${progress}%`;
      });
    }
  }

  class RevealOnScroll {
    constructor() {
      this.elements = document.querySelectorAll('[data-reveal]');
      if (!this.elements.length) return;

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const delay = parseInt(entry.target.dataset.delay || 0, 10);
              setTimeout(() => {
                entry.target.classList.add('is-revealed');
              }, delay);
              this.observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );

      this.elements.forEach((el) => this.observer.observe(el));
    }
  }

  class SmoothScroll {
    constructor() {
      this.lenis = new Lenis({
        duration: 1.3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      this.lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        this.lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);

      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(anchor.getAttribute('href'));
          if (target) this.lenis.scrollTo(target, { offset: -70 });
        });
      });
    }
  }

  class Navigation {
    constructor() {
      this.btn = document.getElementById('menu-btn');
      this.menu = document.getElementById('mobile-menu');
      this.nav = document.getElementById('nav');
      this.isOpen = false;

      if (!this.btn || !this.menu) return;

      this.btn.addEventListener('click', () => this.toggle());

      this.menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => this.close());
      });

      window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
          this.nav?.classList.add('is-scrolled');
        } else {
          this.nav?.classList.remove('is-scrolled');
        }
      });
    }

    toggle() {
      this.isOpen = !this.isOpen;
      this.btn.classList.toggle('is-active', this.isOpen);
      this.menu.classList.toggle('is-active', this.isOpen);
      document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }

    close() {
      this.isOpen = false;
      this.btn.classList.remove('is-active');
      this.menu.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  class GlowParallax {
    constructor() {
      gsap.to('.hero__glow', {
        y: -60,
        x: 30,
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        },
      });

      gsap.to('.hero__lamp', {
        y: -40,
        opacity: 0.1,
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      gsap.to('.hero__paper--1', {
        y: -30,
        rotation: 8,
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.8,
        },
      });

      gsap.to('.hero__paper--2', {
        y: -50,
        rotation: -5,
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 2.2,
        },
      });

      gsap.to('.hero__paper--3', {
        y: -20,
        rotation: 12,
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    }
  }

  function init() {
    document.body.style.overflow = 'hidden';
    new Preloader();
    new CustomCursor();
    new MagneticHover();
    new ScrollProgress();
    new Navigation();
    new RevealOnScroll();

    gsap.registerPlugin(ScrollTrigger);

    new SmoothScroll();
    new GlowParallax();

    const mosaicEl = document.getElementById('casting-tape-mosaic');
    if (mosaicEl) {
      new CastingTapeMosaic(mosaicEl);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
