// ============================================
// LenisSmooth — Lenis smooth scroll with GSAP integration
// ============================================
// COMPLIANCE:
// - ScrollTrigger.scrollerProxy per Great-Grandmaster canonical stack
// - Reduced-motion respect per all skill docs
// - 7 motion personalities supported (mechanical/flowing/glitch/pulsing/vibrating/binary/meditative)
// - Mobile: Lenis disabled by default per Cinema+Fashion Mobile doctrine

export class LenisSmooth {
  constructor(config = {}) {
    // Motion personality presets (Great-Grandmaster §E)
    const PERSONALITIES = {
      mechanical:  { lerp: 0.1,  duration: 1.0 },
      flowing:     { lerp: 0.08, duration: 1.6 },
      glitch:      { lerp: 0.12, duration: 0.8 },
      pulsing:     { lerp: 0.06, duration: 2.0 },
      vibrating:   { lerp: 0.09, duration: 1.4 },
      binary:      { lerp: 0.1,  duration: 1.0 },
      meditative:  { lerp: 0.05, duration: 2.2 }
    };

    const personality = config.personality || 'flowing';
    const preset = PERSONALITIES[personality] || PERSONALITIES.flowing;

    this.config = {
      lerp: config.lerp ?? preset.lerp,
      duration: config.duration ?? preset.duration,
      smoothWheel: config.smoothWheel !== false,
      smoothTouch: config.smoothTouch || false,
      wheelMultiplier: config.wheelMultiplier || 1,
      touchMultiplier: config.touchMultiplier || 2
    };

    // Mobile policy: Lenis disabled by default on mobile
    // Per Cinema Mobile + Fashion Mobile: "Default = Native Scrolling"
    this.isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;
    if (this.isMobile && config.enableOnMobile !== true) {
      this.config.smoothWheel = false;
      this.config.smoothTouch = false;
    }

    this.init();
  }

  init() {
    // Respect reduced motion — all three skill docs require this
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.config.smoothWheel = false;
      this.config.smoothTouch = false;
    }

    this.lenis = new Lenis(this.config);

    // Make globally available
    window.lenis = this.lenis;

    // GSAP ticker integration
    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Update ScrollTrigger on scroll
    this.lenis.on('scroll', ScrollTrigger.update);

    // ScrollTrigger.scrollerProxy — per Great-Grandmaster canonical stack
    // This ensures scroll-linked animations work correctly with Lenis
    const lenisRef = this.lenis;
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        return arguments.length
          ? lenisRef.scrollTo(value)
          : lenisRef.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      pinType: 'transform'
    });

    // Refresh ScrollTrigger after setup
    ScrollTrigger.refresh();
  }

  scrollTo(target, config = {}) {
    this.lenis.scrollTo(target, config);
  }

  /** Switch motion personality — must destroy and recreate Lenis */
  setPersonality(name) {
    const PERSONALITIES = {
      mechanical:  { lerp: 0.1,  duration: 1.0 },
      flowing:     { lerp: 0.08, duration: 1.6 },
      glitch:      { lerp: 0.12, duration: 0.8 },
      pulsing:     { lerp: 0.06, duration: 2.0 },
      vibrating:   { lerp: 0.09, duration: 1.4 },
      binary:      { lerp: 0.1,  duration: 1.0 },
      meditative:  { lerp: 0.05, duration: 2.2 }
    };
    const preset = PERSONALITIES[name];
    if (preset) {
      this.destroy();
      this.config.lerp = preset.lerp;
      this.config.duration = preset.duration;
      this.init();
    }
  }

  destroy() {
    this.lenis.destroy();
  }
}
