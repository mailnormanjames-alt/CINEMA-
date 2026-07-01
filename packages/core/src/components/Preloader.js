// ============================================
// Preloader — Cinematic Loading Sequence
// ============================================

export class Preloader {
  constructor(el, config = {}) {
    this.el = el;
    this.brand = config.brand || 'Atelier Noir';
    this.countDuration = config.countDuration || 2.5;
    this.exitDuration = config.exitDuration || 1.2;
    this.onComplete = config.onComplete || null;

    if (this.el) this.init();
  }

  init() {
    gsap.registerPlugin(ScrollTrigger);

    const brandEl = this.el.querySelector('.preloader-brand, [data-preloader-brand]');
    const countEl = this.el.querySelector('.preloader-count, [data-preloader-counter]');
    const barFill = this.el.querySelector('.preloader-bar-fill, [data-preloader-bar-fill]');
    const top = this.el.querySelector('.preloader-top, [data-preloader-top]');
    const bottom = this.el.querySelector('.preloader-bottom, [data-preloader-bottom]');

    // Fade in elements
    if (top) gsap.to(top, { opacity: 1, duration: 1, delay: 0.3 });
    if (bottom) gsap.to(bottom, { opacity: 1, duration: 0.8, delay: 0.6 });
    if (brandEl) gsap.to(brandEl, { opacity: 1, duration: 0.8, delay: 0.3 });

    // Animate bar
    if (barFill) {
      gsap.to(barFill, {
        width: '100%',
        duration: this.countDuration,
        ease: 'power2.inOut',
        delay: 0.5
      });
    }

    // Animate counter
    if (countEl) {
      gsap.to({ val: 0 }, {
        val: 100,
        duration: this.countDuration,
        ease: 'power2.inOut',
        delay: 0.5,
        onUpdate() {
          countEl.textContent = Math.round(this.targets()[0].val);
        }
      });
    }

    // Exit sequence — use GSAP timeline to stay synchronized
    const exitTl = gsap.timeline({ delay: this.countDuration + 0.7 });
    exitTl.call(() => this.exit());
  }

  exit() {
    const exitEl = this.el.querySelector('.preloader-exit, [data-preloader-exit]');

    if (exitEl) {
      // Two-phase exit: slide up overlay, then hide preloader
      gsap.to(exitEl, {
        yPercent: 0,
        duration: this.exitDuration,
        ease: 'power4.inOut',
        onComplete: () => {
          this.el.style.display = 'none';
          exitEl.style.display = 'none';
          this.onComplete?.();
        }
      });
    } else {
      // Simple slide-up exit
      gsap.to(this.el, {
        yPercent: -100,
        duration: this.exitDuration,
        ease: 'power4.inOut',
        onComplete: () => {
          this.el.style.display = 'none';
          this.onComplete?.();
        }
      });
    }
  }

  destroy() {
    this.el.style.display = 'none';
  }
}
