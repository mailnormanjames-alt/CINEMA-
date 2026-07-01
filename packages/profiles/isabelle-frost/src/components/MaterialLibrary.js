/**
 * MaterialLibrary — Signature Interaction
 * Fabric cards with animated swatches that respond to hover,
 * changing color and drape effect per material type.
 */

const MATERIALS = {
  silk: {
    gradient: ['#c8d6e0', '#e8eff5', '#f0f4f7'],
    accentColor: '#c8d6e0',
    drapeOpacity: 0.4,
    shimmer: true,
    description: 'Fluid. Luminous. The backbone of draped silhouettes.',
  },
  wool: {
    gradient: ['#3a3f42', '#5a5f62', '#6a6f72'],
    accentColor: '#5a5f62',
    drapeOpacity: 0.6,
    shimmer: false,
    description: 'Structured. Warm. The armor against Scandinavian cold.',
  },
  leather: {
    gradient: ['#1a1a1a', '#2d2d2d', '#0f0f0f'],
    accentColor: '#2d2d2d',
    drapeOpacity: 0.3,
    shimmer: false,
    description: 'Protective. Raw. The edge between vulnerability and strength.',
  },
  linen: {
    gradient: ['#d4c5a9', '#e8dcc8', '#f2ead8'],
    accentColor: '#d4c5a9',
    drapeOpacity: 0.5,
    shimmer: false,
    description: 'Breathable. Organic. The language of summer restraint.',
  },
};

export default class MaterialLibrary {
  constructor(container) {
    this.container = container;
    this.cards = container.querySelectorAll('.fabric__card');
    this.activeCard = null;

    this.cards.forEach((card) => {
      this.initCard(card);
    });
  }

  initCard(card) {
    const material = card.dataset.material;
    const config = MATERIALS[material];
    if (!config) return;

    const swatch = card.querySelector('.fabric__swatch');
    const swatchFill = card.querySelector('.fabric__swatch-fill');
    const drape = card.querySelector('.fabric__swatch-drape');

    // Create shimmer element for silk
    if (config.shimmer) {
      const shimmer = document.createElement('div');
      shimmer.className = 'fabric__shimmer';
      shimmer.style.cssText = `
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
        pointer-events: none;
        z-index: 2;
      `;
      swatch.appendChild(shimmer);
    }

    // Mouse move: drape follows cursor
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const drapeAngle = Math.atan2(y - 50, x - 50) * (180 / Math.PI);
      const drapeDistance = Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2));

      // Animate drape shadow
      if (drape) {
        const shadowX = (x - 50) * 0.3;
        const shadowY = (y - 50) * 0.3;
        gsap.to(drape, {
          background: `linear-gradient(${drapeAngle}deg, transparent ${40 - drapeDistance * 0.2}%, rgba(8,10,12,${config.drapeOpacity}) 100%)`,
          duration: 0.4,
          ease: 'power2.out',
        });
      }

      // Subtle swatch tilt
      if (swatchFill) {
        const tiltX = (y - 50) * 0.05;
        const tiltY = (x - 50) * -0.05;
        gsap.to(swatchFill, {
          rotateX: tiltX,
          rotateY: tiltY,
          duration: 0.5,
          ease: 'power2.out',
        });
      }
    });

    // Enter: animate swatch
    card.addEventListener('mouseenter', () => {
      this.activeCard = card;

      gsap.to(swatchFill, {
        scale: 1.05,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Silk shimmer animation
      if (config.shimmer) {
        const shimmer = swatch.querySelector('.fabric__shimmer');
        if (shimmer) {
          gsap.fromTo(
            shimmer,
            { left: '-100%' },
            { left: '200%', duration: 1.2, ease: 'power2.inOut' }
          );
        }
      }

      // Color shift on info
      const title = card.querySelector('.fabric__card-title');
      if (title) {
        gsap.to(title, { color: config.accentColor, duration: 0.4 });
      }
    });

    // Leave: reset
    card.addEventListener('mouseleave', () => {
      this.activeCard = null;

      gsap.to(swatchFill, {
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power2.out',
      });

      if (drape) {
        gsap.to(drape, {
          background: `linear-gradient(transparent, rgba(8,10,12,${config.drapeOpacity}))`,
          duration: 0.6,
          ease: 'power2.out',
        });
      }

      const title = card.querySelector('.fabric__card-title');
      if (title) {
        gsap.to(title, { color: '', duration: 0.4 });
      }
    });

    // ScrollTrigger: reveal animation
    gsap.from(card, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }
}
