/* EquipmentExplorer — Thomas Renard Signature Interaction
   Blueprint grid reveal · Hover to expose specs · Mechanical precision */

export default class EquipmentExplorer {
  constructor(container) {
    this.container = container;
    this.cards = container.querySelectorAll('.equipment-card');
    this.init();
  }

  init() {
    this.cards.forEach((card) => {
      card.addEventListener('mouseenter', () => this.onEnter(card));
      card.addEventListener('mouseleave', () => this.onLeave(card));
      card.addEventListener('mousemove', (e) => this.onMove(card, e));
    });
  }

  onEnter(card) {
    const num = card.querySelector('.equipment-card-num');
    const spec = card.querySelector('.equipment-card-spec');

    gsap.to(card, {
      borderColor: 'var(--accent)',
      duration: 0.3,
      ease: 'power2.out',
    });

    if (num) {
      gsap.to(num, {
        color: 'var(--accent)',
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    if (spec) {
      gsap.to(spec, {
        color: 'var(--text)',
        letterSpacing: '0.2em',
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }

  onLeave(card) {
    const num = card.querySelector('.equipment-card-num');
    const spec = card.querySelector('.equipment-card-spec');

    gsap.to(card, {
      borderColor: 'var(--border)',
      duration: 0.4,
      ease: 'power2.out',
    });

    if (num) {
      gsap.to(num, {
        color: 'var(--accent)',
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    if (spec) {
      gsap.to(spec, {
        color: 'var(--text-dim)',
        letterSpacing: '0.1em',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }

  onMove(card, e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  }
}
