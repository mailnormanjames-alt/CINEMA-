// ============================================
// FilmstripGallery — 5 Gallery Types
// ============================================
// Types: film-stills, contact-sheets, bts, scene-stills, mood-boards

export class FilmstripGallery {
  constructor(el, config = {}) {
    this.el = el;
    this.type = config.type || el?.dataset?.cinemaGallery || 'film-stills';
    this.items = config.items || [];
    this.horizontal = config.horizontal !== false;
    this.sprockets = config.sprockets !== false;
    this.gap = config.gap || '2rem';
    this.itemWidth = config.itemWidth || 380;
    this.itemHeight = config.itemHeight || 520;

    if (this.el) this.init();
  }

  init() {
    gsap.registerPlugin(ScrollTrigger);

    // Apply gallery-type-specific styling
    this.applyTypeStyles();

    // Animate header
    this.animateHeader();

    // Horizontal scroll
    if (this.horizontal) {
      this.initHorizontalScroll();
    } else {
      this.initGridReveal();
    }

    // Item hover interactions
    this.initItemInteractions();

    // Sprocket decoration
    if (this.sprockets) {
      this.initSprockets();
    }
  }

  applyTypeStyles() {
    const track = this.el.querySelector('[data-gallery-track]');
    if (!track) return;

    switch (this.type) {
      case 'film-stills':
        // Cinematic aspect ratio, sequential storytelling
        track.style.gap = this.gap;
        this.el.querySelectorAll('[data-gallery-item]').forEach(item => {
          item.style.aspectRatio = '2.39/1';
          item.style.overflow = 'hidden';
        });
        break;

      case 'contact-sheets':
        // Grid layout, raw aesthetics, film school energy
        track.style.display = 'grid';
        track.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
        track.style.gap = '4px';
        track.style.background = '#111';
        track.style.padding = '4px';
        this.el.querySelectorAll('[data-gallery-item]').forEach(item => {
          item.style.aspectRatio = '1/1';
          item.style.overflow = 'hidden';
          item.style.border = '1px solid rgba(255,255,255,0.06)';
        });
        this.horizontal = false;
        break;

      case 'bts':
        // Humanity, authenticity, spontaneous — mixed sizes
        track.style.gap = this.gap;
        this.el.querySelectorAll('[data-gallery-item]').forEach((item, i) => {
          item.style.height = i % 3 === 0 ? '480px' : '360px';
          item.style.width = i % 2 === 0 ? '320px' : '280px';
          item.style.overflow = 'hidden';
        });
        break;

      case 'scene-stills':
        // Emotional beats, key moments — uniform cinematic
        track.style.gap = this.gap;
        this.el.querySelectorAll('[data-gallery-item]').forEach(item => {
          item.style.aspectRatio = '16/9';
          item.style.overflow = 'hidden';
        });
        break;

      case 'mood-boards':
        // Visual influences — Pinterest-style masonry
        track.style.display = 'grid';
        track.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
        track.style.gap = this.gap;
        this.el.querySelectorAll('[data-gallery-item]').forEach((item, i) => {
          item.style.height = `${200 + (i % 3) * 100}px`;
          item.style.overflow = 'hidden';
          item.style.borderRadius = '2px';
        });
        this.horizontal = false;
        break;
    }
  }

  animateHeader() {
    const header = this.el.querySelector('[data-gallery-header]');
    if (!header) return;

    gsap.from(header, {
      y: 50, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: this.el, start: 'top 80%' }
    });
  }

  initHorizontalScroll() {
    const track = this.el.querySelector('[data-gallery-track]');
    if (!track) return;

    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: this.el,
        pin: true,
        scrub: 1,
        end: () => `+=${track.scrollWidth - window.innerWidth}`,
        invalidateOnRefresh: true
      }
    });

    // Staggered item entrance
    const items = track.querySelectorAll('[data-gallery-item]');
    items.forEach((item, i) => {
      gsap.from(item, {
        y: 60 + (i % 2 === 0 ? 0 : 40),
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 90%' }
      });
    });
  }

  initGridReveal() {
    const items = this.el.querySelectorAll('[data-gallery-item]');
    items.forEach((item, i) => {
      gsap.from(item, {
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
        delay: i * 0.08,
        scrollTrigger: { trigger: item, start: 'top 90%' }
      });
    });
  }

  initItemInteractions() {
    const items = this.el.querySelectorAll('[data-gallery-item]');
    items.forEach(item => {
      const img = item.querySelector('img');
      const overlay = item.querySelector('[data-gallery-overlay]');
      const border = item.querySelector('[data-gallery-border]');

      item.addEventListener('mouseenter', () => {
        if (img) gsap.to(img, { scale: 1.08, duration: 1.2, ease: 'power2.out' });
        if (border) gsap.to(border, { opacity: 1, duration: 0.5 });
        if (overlay) gsap.to(overlay, { opacity: 1, duration: 0.5 });
      });

      item.addEventListener('mouseleave', () => {
        if (img) gsap.to(img, { scale: 1, duration: 1.2, ease: 'power2.out' });
        if (border) gsap.to(border, { opacity: 0, duration: 0.5 });
        if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.5 });
      });
    });
  }

  initSprockets() {
    const container = this.el.querySelector('[data-gallery-sprockets]');
    if (!container) return;

    // Animate sprockets scrolling
    const sprockets = container.querySelectorAll('.sprocket');
    if (sprockets.length) {
      gsap.to(container, {
        x: -200,
        ease: 'none',
        scrollTrigger: {
          trigger: this.el,
          start: 'top center',
          end: 'bottom center',
          scrub: 2
        }
      });
    }
  }

  // --- Public API ---

  /** Switch gallery type dynamically */
  setType(newType) {
    this.type = newType;
    this.applyTypeStyles();
    ScrollTrigger.refresh();
  }

  /** Add items dynamically */
  addItems(newItems) {
    this.items = [...this.items, ...newItems];
    // Re-render would go here in a full implementation
    ScrollTrigger.refresh();
  }

  destroy() {
    ScrollTrigger.getAll().forEach(st => st.kill());
  }
}
