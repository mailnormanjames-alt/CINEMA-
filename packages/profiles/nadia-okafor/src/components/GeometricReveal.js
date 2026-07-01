/* GeometricReveal — Nadia Okafor Signature Interaction
   Geometric shape cards animate on hover · Shapes transform and reveal patterns */

export default class GeometricReveal {
  constructor(container) {
    this.container = container;
    this.cards = container.querySelectorAll('.geo-card');
    this.init();
  }

  init() {
    this.cards.forEach((card) => {
      card.addEventListener('mouseenter', () => this.onEnter(card));
      card.addEventListener('mouseleave', () => this.onLeave(card));
    });
  }

  onEnter(card) {
    const shape = card.querySelector('.geo-shape');
    const pattern = card.querySelector('.geo-pattern');
    const name = card.querySelector('.geo-card-name');
    const use = card.querySelector('.geo-card-use');
    const cardType = card.getAttribute('data-shape');

    if (shape) {
      gsap.to(shape, {
        scale: 1.15,
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    if (pattern) {
      gsap.to(pattern, {
        opacity: 1,
        duration: 0.5,
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

    if (cardType === 'circle') {
      this.animateCircle(card);
    } else if (cardType === 'triangle') {
      this.animateTriangle(card);
    } else if (cardType === 'square') {
      this.animateSquare(card);
    } else if (cardType === 'wave') {
      this.animateWave(card);
    }
  }

  onLeave(card) {
    const shape = card.querySelector('.geo-shape');
    const pattern = card.querySelector('.geo-pattern');
    const name = card.querySelector('.geo-card-name');
    const use = card.querySelector('.geo-card-use');

    if (shape) {
      gsap.to(shape, {
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    }

    if (pattern) {
      gsap.to(pattern, {
        opacity: 0,
        duration: 0.3,
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

    const circleEl = card.querySelector('.geo-circle');
    const triangleEl = card.querySelector('.geo-triangle');
    const squareEl = card.querySelector('.geo-square');
    const waveEl = card.querySelector('.geo-wave');

    if (circleEl) {
      gsap.to(circleEl, {
        borderRadius: '50%',
        duration: 0.6,
        ease: 'power2.out',
      });
    }
    if (triangleEl) {
      gsap.to(triangleEl, {
        rotation: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
    if (squareEl) {
      gsap.to(squareEl, {
        rotation: 0,
        borderRadius: '0%',
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  }

  animateCircle(card) {
    const circle = card.querySelector('.geo-circle');
    if (circle) {
      gsap.to(circle, {
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        duration: 0.8,
        ease: 'power2.out',
      });
    }
  }

  animateTriangle(card) {
    const triangle = card.querySelector('.geo-triangle');
    if (triangle) {
      gsap.to(triangle, {
        rotation: 15,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  }

  animateSquare(card) {
    const square = card.querySelector('.geo-square');
    if (square) {
      gsap.to(square, {
        rotation: 15,
        borderRadius: '12px',
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  }

  animateWave(card) {
    const wave = card.querySelector('.geo-wave');
    if (wave) {
      gsap.to(wave, {
        scaleX: 1.2,
        duration: 0.8,
        ease: 'power2.out',
      });
    }
  }
}
