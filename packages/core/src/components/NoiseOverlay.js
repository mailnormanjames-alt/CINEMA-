// ============================================
// NoiseOverlay — Animated film grain texture
// ============================================

export class NoiseOverlay {
  constructor(config = {}) {
    this.opacity = config.opacity || 0.035;
    this.baseFrequency = config.baseFrequency || 0.9;
    this.init();
  }

  init() {
    // Check if overlay already exists in DOM
    let overlay = document.querySelector('.noise-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'noise-overlay';
      overlay.setAttribute('data-cinema-noise', '');
      document.body.appendChild(overlay);
    }

    // Apply styles
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      opacity: ${this.opacity};
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${this.baseFrequency}' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      background-repeat: repeat;
      background-size: 128px 128px;
    `;

    // Create animated grain layer
    const grain = document.createElement('div');
    grain.style.cssText = `
      position: absolute;
      inset: -200%;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E");
      background-size: 256px 256px;
      animation: cinemaGrain 8s steps(10) infinite;
    `;
    overlay.appendChild(grain);

    // Inject keyframes if not already present
    if (!document.querySelector('#cinema-grain-keyframes')) {
      const style = document.createElement('style');
      style.id = 'cinema-grain-keyframes';
      style.textContent = `
        @keyframes cinemaGrain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  setOpacity(val) {
    const overlay = document.querySelector('.noise-overlay');
    if (overlay) overlay.style.opacity = val;
  }

  destroy() {
    const overlay = document.querySelector('.noise-overlay');
    if (overlay) overlay.remove();
  }
}
