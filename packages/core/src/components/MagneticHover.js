// ============================================
// MagneticHover — Magnetic pull effect
// ============================================

export class MagneticHover {
  static init(el, config = {}) {
    const strength = config.strength || 0.3;
    const ease = config.ease || 'elastic.out(1, 0.4)';

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power3.out' });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease });
    });
  }

  static initAll(selector = '[data-cinema-magnetic]', config = {}) {
    document.querySelectorAll(selector).forEach(el => {
      MagneticHover.init(el, config);
    });
  }
}
