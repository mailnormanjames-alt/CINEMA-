/**
 * ColorPalette — Signature Interaction Component
 * Rafael Santos / Tropical Modernism
 *
 * Color cards with palette swatches animate on hover.
 * Colors shift per palette type: warm, cool, earth, sky.
 */

(function () {
  'use strict';

  const PALETTE_CONFIGS = {
    warm: {
      base: ['#C44536', '#F4A261', '#E76F51', '#E9C46A', '#D4A373'],
      hover: ['#D4533F', '#FFB874', '#F48060', '#F5D078', '#E4B890'],
      glow: '#C44536',
    },
    cool: {
      base: ['#264653', '#2A9D8F', '#457B9D', '#1D3557', '#588157'],
      hover: ['#2E5666', '#34B5A5', '#5593B5', '#254770', '#6B9A6A'],
      glow: '#2A9D8F',
    },
    earth: {
      base: ['#8B5E3C', '#A67C52', '#6B4226', '#C9A882', '#4A3728'],
      hover: ['#A06E48', '#BC8E62', '#7E5030', '#D9BA94', '#5C4532'],
      glow: '#8B5E3C',
    },
    sky: {
      base: ['#89C2D9', '#A9D6E5', '#CAF0F8', '#61A5C2', '#2E8BC0'],
      hover: ['#9BD0E5', '#BBE4F1', '#DCF8FF', '#73B5D4', '#389BD4'],
      glow: '#89C2D9',
    },
  };

  class ColorPalette {
    constructor(container) {
      this.container = container;
      this.cards = container.querySelectorAll('.color-card');
      this.init();
    }

    init() {
      this.cards.forEach((card) => {
        const type = card.dataset.palette;
        const config = PALETTE_CONFIGS[type];
        if (!config) return;

        const swatches = card.querySelectorAll('.color-card__swatch');

        card.addEventListener('mouseenter', () => this.onEnter(card, swatches, config));
        card.addEventListener('mouseleave', () => this.onLeave(card, swatches, config));
        card.addEventListener('mousemove', (e) => this.onMove(e, card, config));
      });
    }

    onEnter(card, swatches, config) {
      swatches.forEach((swatch, i) => {
        const color = config.hover[i] || config.base[i];
        gsap.to(swatch, {
          backgroundColor: color,
          duration: 0.4,
          delay: i * 0.05,
          ease: 'power2.out',
        });
      });

      gsap.to(card, {
        boxShadow: `0 20px 60px ${config.glow}33, 0 0 80px ${config.glow}15`,
        duration: 0.5,
        ease: 'power2.out',
      });
    }

    onLeave(card, swatches, config) {
      swatches.forEach((swatch, i) => {
        gsap.to(swatch, {
          backgroundColor: config.base[i],
          duration: 0.6,
          delay: i * 0.03,
          ease: 'power2.out',
        });
      });

      gsap.to(card, {
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        duration: 0.5,
        ease: 'power2.out',
      });
    }

    onMove(e, card, config) {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotateX: y * -5,
        rotateY: x * 5,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 800,
      });
    }
  }

  // Auto-init when DOM is ready
  function autoInit() {
    const container = document.getElementById('colorPalette');
    if (container) {
      new ColorPalette(container);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  // Expose globally
  window.ColorPalette = ColorPalette;
})();
