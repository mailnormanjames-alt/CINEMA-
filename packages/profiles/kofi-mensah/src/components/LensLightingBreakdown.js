/* LensLightingBreakdown — Kofi Mensah Signature Interaction
   Lens circle animation · Hover to reveal lighting personality · Warm/cool tension */

export default class LensLightingBreakdown {
  constructor(container) {
    this.container = container;
    this.cards = container.querySelectorAll('.lens-card');
    this.init();
  }

  init() {
    this.cards.forEach((card) => {
      card.addEventListener('mouseenter', () => this.onEnter(card));
      card.addEventListener('mouseleave', () => this.onLeave(card));
    });
  }

  onEnter(card) {
    const circle = card.querySelector('.lens-card-circle');
    const ring = card.querySelector('.lens-card-ring');
    const name = card.querySelector('.lens-card-name');
    const use = card.querySelector('.lens-card-use');

    if (circle) {
      gsap.to(circle, {
        scale: 1.15,
        borderColor: 'var(--accent-warm)',
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    if (ring) {
      gsap.to(ring, {
        scale: 0.85,
        borderColor: 'var(--accent-warm)',
        rotation: 15,
        duration: 0.8,
        ease: 'power2.out',
      });
    }

    if (name) {
      gsap.to(name, {
        color: 'var(--accent-warm)',
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    if (use) {
      gsap.to(use, {
        letterSpacing: '0.25em',
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }

  onLeave(card) {
    const circle = card.querySelector('.lens-card-circle');
    const ring = card.querySelector('.lens-card-ring');
    const name = card.querySelector('.lens-card-name');
    const use = card.querySelector('.lens-card-use');

    if (circle) {
      gsap.to(circle, {
        scale: 1,
        borderColor: 'var(--accent-warm)',
        duration: 0.5,
        ease: 'power2.out',
      });
    }

    if (ring) {
      gsap.to(ring, {
        scale: 1,
        borderColor: 'var(--border-light)',
        rotation: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    if (name) {
      gsap.to(name, {
        color: 'var(--text)',
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    if (use) {
      gsap.to(use, {
        letterSpacing: '0.15em',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }
}
