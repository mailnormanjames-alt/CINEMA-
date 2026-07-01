export class GeometricReveal {
  constructor() {
    this.elements = [];
    this.observer = null;
  }

  init() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-geometric-reveal]').forEach(el => {
      this.observer.observe(el);
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
