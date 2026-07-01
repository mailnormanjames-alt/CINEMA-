// ============================================
// CustomCursor — Dot + Ring + Text Label
// ============================================

export class CustomCursor {
  constructor(config = {}) {
    this.dotEl = document.querySelector('.cursor-dot, [data-cursor-dot]');
    this.ringEl = document.querySelector('.cursor-ring, [data-cursor-ring]');
    this.textEl = document.querySelector('.cursor-text, [data-cursor-text]');
    this.cursorWrapper = document.querySelector('.cursor, [data-cinema-cursor]');

    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.dotX = this.mouseX;
    this.dotY = this.mouseY;
    this.ringX = this.mouseX;
    this.ringY = this.mouseY;

    this.dotLerp = config.dotLerp || 0.35;
    this.ringLerp = config.ringLerp || 0.12;
    this.accent = config.accent || null;

    this.isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;
    this._rafId = null;

    if (!this.isMobile) this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // Hover targets
    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => this.onHoverEnter(el));
      el.addEventListener('mouseleave', () => this.onHoverLeave(el));
    });

    // Also support data-cursor="pointer" on any element
    document.querySelectorAll('a, button').forEach(el => {
      if (!el.hasAttribute('data-cursor')) {
        el.setAttribute('data-cursor', 'pointer');
      }
    });

    this._rafLoop();
  }

  _rafLoop() {
    this.animate();
    this._rafId = requestAnimationFrame(() => this._rafLoop());
  }

  onHoverEnter(el) {
    const type = el.dataset.cursor;
    if (this.cursorWrapper) this.cursorWrapper.classList.add('active');
    if (this.dotEl) this.dotEl.classList.add('active');
    if (this.ringEl) this.ringEl.classList.add('active');

    if (type === 'play' || type === 'view') {
      if (this.cursorWrapper) this.cursorWrapper.classList.add('dragging');
      if (this.textEl) {
        this.textEl.textContent = type === 'play' ? 'Watch' : 'View';
        gsap.to(this.textEl, { opacity: 1, duration: 0.3 });
      }
    }

    const text = el.dataset.cursorText;
    if (text && this.textEl) {
      this.textEl.textContent = text;
      gsap.to(this.textEl, { opacity: 1, duration: 0.3 });
    }
  }

  onHoverLeave(el) {
    if (this.cursorWrapper) this.cursorWrapper.classList.remove('active', 'dragging');
    if (this.dotEl) this.dotEl.classList.remove('active');
    if (this.ringEl) this.ringEl.classList.remove('active');
    if (this.textEl) gsap.to(this.textEl, { opacity: 0, duration: 0.3 });
  }

  animate() {
    this.dotX += (this.mouseX - this.dotX) * this.dotLerp;
    this.dotY += (this.mouseY - this.dotY) * this.dotLerp;
    this.ringX += (this.mouseX - this.ringX) * this.ringLerp;
    this.ringY += (this.mouseY - this.ringY) * this.ringLerp;

    if (this.dotEl) {
      this.dotEl.style.transform = `translate(${this.dotX - 3}px, ${this.dotY - 3}px)`;
    }
    if (this.ringEl) {
      this.ringEl.style.transform = `translate(${this.ringX - 24}px, ${this.ringY - 24}px)`;
    }
    if (this.textEl) {
      const opacity = parseFloat(getComputedStyle(this.textEl).opacity) || 0;
      if (opacity > 0) {
        this.textEl.style.transform = `translate(${this.dotX + 20}px, ${this.dotY - 8}px)`;
      }
    }

    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (this.dotEl) this.dotEl.style.display = 'none';
    if (this.ringEl) this.ringEl.style.display = 'none';
    if (this.textEl) this.textEl.style.display = 'none';
  }
}
