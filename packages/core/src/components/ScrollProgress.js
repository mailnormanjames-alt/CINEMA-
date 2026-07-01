// ============================================
// ScrollProgress — Top scroll progress bar
// ============================================

export class ScrollProgress {
  constructor(config = {}) {
    this.color = config.color || null;
    this.height = config.height || '1px';
    this.position = config.position || 'top';
    this.zIndex = config.zIndex || 999;
    this.init();
  }

  init() {
    let bar = document.querySelector('.scroll-progress, [data-cinema-progress]');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'scroll-progress';
      bar.setAttribute('data-cinema-progress', '');
      document.body.appendChild(bar);
    }

    bar.style.cssText = `
      position: fixed;
      ${this.position}: 0;
      left: 0;
      width: 0%;
      height: ${this.height};
      z-index: ${this.zIndex};
      transform-origin: left;
      ${this.color ? `background: ${this.color};` : ''}
    `;

    this.bar = bar;

    // Listen to scroll
    window.addEventListener('scroll', () => this.update(), { passive: true });

    // Or listen to Lenis
    if (window.lenis) {
      window.lenis.on('scroll', (e) => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? (e.animatedScroll / maxScroll) * 100 : 0;
        bar.style.width = progress + '%';
      });
    }

    this.update();
  }

  update() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    this.bar.style.width = progress + '%';
  }

  destroy() {
    if (this.bar) this.bar.remove();
  }
}
