// ============================================
// CounterAnimation — Animated number counters
// ============================================

export class CounterAnimation {
  static init(el, config = {}) {
    const target = parseInt(el.dataset.count || el.dataset.cinemaCounter || '0', 10);
    const prefix = config.prefix || '';
    const suffix = config.suffix || '';
    const duration = config.duration || 2.5;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration,
          ease: 'power2.out',
          onUpdate() {
            el.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix;
          }
        });
      },
      once: true
    });
  }

  static initAll(selector = '[data-cinema-counter], [data-count]', config = {}) {
    document.querySelectorAll(selector).forEach(el => {
      CounterAnimation.init(el, config);
    });
  }
}
