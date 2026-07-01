/* InteractiveScriptBeats — Léa Moreau Signature Interaction
   Manuscript card flip · Beat reveals · Page-turn rhythm */

export default class InteractiveScriptBeats {
  constructor(container) {
    this.container = container;
    this.cards = container.querySelectorAll('.script-card');
    this.init();
  }

  init() {
    this.cards.forEach((card) => {
      card.addEventListener('mouseenter', () => this.onEnter(card));
      card.addEventListener('mouseleave', () => this.onLeave(card));
    });
  }

  onEnter(card) {
    const marker = card.querySelector('.script-card-marker');
    const name = card.querySelector('.script-card-name');

    if (marker) {
      gsap.to(marker, {
        scale: 1.2,
        color: 'var(--accent-warm)',
        duration: 0.5,
        ease: 'power2.out',
      });
    }

    if (name) {
      gsap.to(name, {
        letterSpacing: '0.05em',
        duration: 0.4,
        ease: 'power2.out',
      });
    }

    gsap.to(card, {
      y: -4,
      duration: 0.4,
      ease: 'power2.out',
    });
  }

  onLeave(card) {
    const marker = card.querySelector('.script-card-marker');
    const name = card.querySelector('.script-card-name');

    if (marker) {
      gsap.to(marker, {
        scale: 1,
        color: 'var(--accent-warm)',
        duration: 0.4,
        ease: 'power2.out',
      });
    }

    if (name) {
      gsap.to(name, {
        letterSpacing: '0',
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    gsap.to(card, {
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  }
}
