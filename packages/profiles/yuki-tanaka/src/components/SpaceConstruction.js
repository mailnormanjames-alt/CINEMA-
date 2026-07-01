/* SpaceConstruction — Yuki Tanaka Signature Interaction
   Geometric shapes transform on hover · Void/light/texture/geometry */

export default class SpaceConstruction {
  constructor(container) {
    this.container = container;
    this.cards = container.querySelectorAll('.space-card');
    this.init();
  }

  init() {
    this.cards.forEach((card) => {
      card.addEventListener('mouseenter', () => this.onEnter(card));
      card.addEventListener('mouseleave', () => this.onLeave(card));
    });
  }

  onEnter(card) {
    const shape = card.querySelector('.space-card-shape');
    const name = card.querySelector('.space-card-name');

    if (shape) {
      gsap.to(shape, {
        scale: 1.3,
        duration: 0.6,
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
      y: -6,
      duration: 0.4,
      ease: 'power2.out',
    });
  }

  onLeave(card) {
    const shape = card.querySelector('.space-card-shape');
    const name = card.querySelector('.space-card-name');

    if (shape) {
      gsap.to(shape, {
        scale: 1,
        duration: 0.5,
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
