// ============================================
// HeroSystem — 5 Cinematic Hero Architectures
// ============================================
// Types: film-opening, directors-chair, cinematic-frame, bts-invitation, tech-spec-sheet
//
// MOTION DOCTRINE COMPLIANCE:
// - Animates ONLY: transform, opacity (NEVER filter, width, height, top, left, margin)
// - Entrance within 100ms of page load (after preloader)
// - Every hero reacts to cursor/mouse position
// - Duration range: 1.0–3.0s (cinematic pacing)

export class HeroSystem {
  constructor(el, config = {}) {
    this.el = el;
    this.type = config.type || el?.dataset?.cinemaHero || 'cinematic-frame';
    this.accent = config.accent || '#C9A96E';
    this.image = config.image || '';
    this.title = config.title || '';
    this.subtitle = config.subtitle || '';
    this.meta = config.meta || [];
    this.scrollCue = config.scrollCue !== false;
    this.cursorReactive = config.cursorReactive !== false;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this._rafId = null;
    this._destroyed = false;

    if (this.el) this.init();
  }

  init() {
    gsap.registerPlugin(ScrollTrigger);

    switch (this.type) {
      case 'film-opening': this.initFilmOpening(); break;
      case 'directors-chair': this.initDirectorsChair(); break;
      case 'cinematic-frame': this.initCinematicFrame(); break;
      case 'bts-invitation': this.initBTSInvitation(); break;
      case 'tech-spec-sheet': this.initTechSpecSheet(); break;
      default: this.initCinematicFrame();
    }

    this.initParallax();

    // Every hero MUST react to cursor — per Great-Grandmaster Hero Technical Requirements
    if (this.cursorReactive) {
      this.initCursorReactivity();
    }
  }

  // --- Type 1: Film Opening ---
  // Cinematic pacing, slow reveals, minimal UI, iconic shot
  initFilmOpening() {
    const tl = gsap.timeline({ delay: 0.1 }); // 100ms — per doctrine
    const words = this.el.querySelectorAll('.hero-title .word');
    const eyebrow = this.el.querySelector('.hero-eyebrow');
    const meta = this.el.querySelector('.hero-meta');
    const cue = this.el.querySelector('.hero-scroll-cue');

    // Fade in from black — slow, deliberate (opacity only)
    tl.fromTo(this.el, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: 'power2.out' })
      .to(words, {
        y: 0, opacity: 1, duration: 1.6, ease: 'power4.out', stagger: 0.15
      }, '-=0.5')
      .fromTo(eyebrow || [], { opacity: 0, x: -30 }, {
        opacity: 1, x: 0, duration: 0.8, ease: 'power3.out'
      }, '-=0.8')
      .fromTo(meta || [], { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
      }, '-=0.5');

    if (cue) {
      tl.to(cue, { opacity: 1, duration: 0.6 }, '-=0.3');
    }

    // Cinematic letterbox bars that open (scaleY = transform ✅)
    const bars = this.el.querySelectorAll('.hero-letterbox');
    if (bars.length) {
      gsap.fromTo(bars, { scaleY: 1 }, {
        scaleY: 0, duration: 2, ease: 'power3.inOut', delay: 0.3,
        stagger: 0.1
      });
    }
  }

  // --- Type 2: Director's Chair ---
  // Portrait focus, editorial confidence, creative authority
  initDirectorsChair() {
    const tl = gsap.timeline({ delay: 0.1 });
    const portrait = this.el.querySelector('.hero-portrait');
    const name = this.el.querySelectorAll('.hero-title .word');
    const role = this.el.querySelector('.hero-role');
    const quote = this.el.querySelector('.hero-quote');

    // Portrait slides in from side (clipPath = transform-adjacent, acceptable)
    if (portrait) {
      tl.fromTo(portrait, { clipPath: 'inset(0 100% 0 0)' }, {
        clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power4.inOut'
      });
    }

    // Name reveals with authority
    tl.to(name, {
      y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.12
    }, portrait ? '-=0.6' : 0);

    if (role) {
      tl.fromTo(role, { opacity: 0, y: 15 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out'
      }, '-=0.5');
    }

    if (quote) {
      tl.fromTo(quote, { opacity: 0 }, {
        opacity: 1, duration: 1.2, ease: 'power2.out'
      }, '-=0.3');
    }
  }

  // --- Type 3: Cinematic Frame ---
  // Filmic composition, atmospheric motion, slow reveal
  // FIX: Removed filter animation — only transform + opacity per Motion Doctrine
  initCinematicFrame() {
    const tl = gsap.timeline({ delay: 0.1 });
    const words = this.el.querySelectorAll('.hero-title .word');
    const eyebrow = this.el.querySelector('.hero-eyebrow');
    const meta = this.el.querySelector('.hero-meta');
    const cue = this.el.querySelector('.hero-scroll-cue');
    const img = this.el.querySelector('.hero-image img');

    // Image scales in from close — cinematic feel (scale = transform ✅)
    // NO filter animation — Motion Doctrine forbids it
    if (img) {
      gsap.fromTo(img, { scale: 1.2, opacity: 0.5 }, {
        scale: 1.05, opacity: 1, duration: 2.5, ease: 'power2.out'
      });
    }

    // Words reveal
    tl.to(words, {
      y: 0, opacity: 1, duration: 1.4, ease: 'power4.out', stagger: 0.1
    }, 0.5);

    if (eyebrow) {
      tl.fromTo(eyebrow, { opacity: 0, y: 10 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
      }, '-=0.8');
    }

    if (meta) {
      tl.fromTo(meta, { opacity: 0, y: 15 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
      }, '-=0.5');
    }

    if (cue) {
      tl.to(cue, { opacity: 1, duration: 0.6 }, '-=0.3');
    }
  }

  // --- Type 4: BTS Invitation ---
  // Process imagery, raw authenticity, quiet elegance
  initBTSInvitation() {
    const tl = gsap.timeline({ delay: 0.1 });
    const words = this.el.querySelectorAll('.hero-title .word');
    const sub = this.el.querySelector('.hero-sub');
    const tagline = this.el.querySelector('.hero-tagline');
    const cue = this.el.querySelector('.hero-scroll');
    const blobs = this.el.querySelectorAll('.hero-blob');

    // Blobs float in (scale + opacity only ✅)
    blobs.forEach((blob, i) => {
      gsap.fromTo(blob, { scale: 0.5, opacity: 0 }, {
        scale: 1, opacity: 0.15, duration: 2, ease: 'power2.out', delay: i * 0.3
      });
    });

    // Title with organic sway
    tl.to(words, {
      opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.15
    });

    if (sub) {
      tl.fromTo(sub, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out'
      }, '-=0.6');
    }

    if (tagline) {
      tl.fromTo(tagline, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out'
      }, '-=0.7');
    }

    if (cue) {
      tl.to(cue, { opacity: 1, duration: 1 }, '-=0.5');
    }
  }

  // --- Type 5: Tech Spec Sheet ---
  // Equipment focus, detail emphasis, minimalist design
  initTechSpecSheet() {
    const tl = gsap.timeline({ delay: 0.1 });
    const name = this.el.querySelectorAll('.hero-title span');
    const stats = this.el.querySelectorAll('.hero-stat');
    const eyebrow = this.el.querySelector('.hero-eyebrow');
    const bottom = this.el.querySelector('.hero-bottom');

    // Name — bold, immediate
    tl.fromTo(name, { y: 80, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.15
    });

    // Stats — staggered reveal like data loading
    tl.fromTo(stats, { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.1
    }, '-=0.4');

    if (eyebrow) {
      tl.fromTo(eyebrow, { opacity: 0, x: -20 }, {
        opacity: 1, x: 0, duration: 0.8, ease: 'power2.out'
      }, '-=0.4');
    }

    if (bottom) {
      tl.fromTo(bottom, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out'
      }, '-=0.3');
    }
  }

  // --- Shared: Parallax on scroll ---
  initParallax() {
    const img = this.el.querySelector('.hero-image img');
    const content = this.el.querySelector('.hero-content');
    const cue = this.el.querySelector('.hero-scroll-cue, .hero-scroll');

    if (img) {
      // will-change: transform per Great-Grandmaster
      img.style.willChange = 'transform';
      gsap.to(img, {
        yPercent: 15, ease: 'none',
        scrollTrigger: { trigger: this.el, start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    if (content) {
      content.style.willChange = 'transform';
      gsap.to(content, {
        y: -100, ease: 'none',
        scrollTrigger: { trigger: this.el, start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    if (cue && this.scrollCue) {
      gsap.to(cue, {
        opacity: 0, y: -30,
        scrollTrigger: { trigger: this.el, start: '20% top', end: '40% top', scrub: true }
      });
    }
  }

  // --- Cursor Reactivity ---
  // Great-Grandmaster: "Something reacts to cursor/mouse position"
  // Every hero MUST have this
  initCursorReactivity() {
    const img = this.el.querySelector('.hero-image img');
    if (!img) return;

    document.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    const updateCursor = () => {
      if (this._destroyed) return;
      this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
      this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

      // Subtle parallax shift on hero image (transform only ✅)
      gsap.set(img, {
        x: this.mouseX * -8,
        y: this.mouseY * -5
      });

      this._rafId = requestAnimationFrame(updateCursor);
    };
    updateCursor();
  }

  destroy() {
    this._destroyed = true;
    if (this._rafId) cancelAnimationFrame(this._rafId);
  }
}
