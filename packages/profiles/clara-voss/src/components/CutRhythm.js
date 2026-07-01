/* CutRhythm — Clara Voss Signature Interaction
   Wave bars animate on hover · Fast/Slow/Match/Jump rhythms */

export default class CutRhythm {
  constructor(container) {
    this.container = container;
    this.cards = container.querySelectorAll('.process-card');
    this.init();
  }

  init() {
    this.cards.forEach((card) => {
      card.addEventListener('mouseenter', () => this.onEnter(card));
      card.addEventListener('mouseleave', () => this.onLeave(card));
    });
  }

  onEnter(card) {
    const name = card.querySelector('.process-card-name');
    const bars = card.querySelectorAll('.wave-bar');

    if (name) {
      gsap.to(name, {
        letterSpacing: '0.1em',
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    bars.forEach((bar, i) => {
      gsap.to(bar, {
        background: 'var(--accent-warm)',
        duration: 0.2,
        delay: i * 0.03,
        ease: 'power2.out',
      });
    });

    gsap.to(card, {
      y: -4,
      duration: 0.3,
      ease: 'power2.out',
    });
  }

  onLeave(card) {
    const name = card.querySelector('.process-card-name');
    const bars = card.querySelectorAll('.wave-bar');

    if (name) {
      gsap.to(name, {
        letterSpacing: '0.05em',
        duration: 0.2,
        ease: 'power2.out',
      });
    }

    bars.forEach((bar, i) => {
      gsap.to(bar, {
        background: 'var(--border-light)',
        duration: 0.2,
        delay: i * 0.02,
        ease: 'power2.out',
      });
    });

    gsap.to(card, {
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    });
  }
}
