export class FrequencySpectrum {
  constructor(canvasId, containerId) {
    this.canvas = document.getElementById(canvasId);
    this.container = document.getElementById(containerId);
    this.ctx = this.canvas.getContext('2d');
    this.mouseX = 0.5;
    this.mouseY = 0.5;
    this.animFrame = null;
    this.barCount = 80;
    this.mouseInfluence = 0;
    this.time = 0;

    this.colors = {
      amber: { r: 212, g: 168, b: 83 },
      amberDim: { r: 154, g: 122, b: 62 },
      amberBright: { r: 232, g: 196, b: 106 }
    };
  }

  init() {
    if (!this.canvas || !this.container) return;

    this.resize();
    this.bindEvents();
    this.animate();
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
  }

  bindEvents() {
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      this.mouseX = (e.clientX - rect.left) / this.width;
      this.mouseY = (e.clientY - rect.top) / this.height;
    });

    this.container.addEventListener('mouseleave', () => {
      this.mouseInfluence = 0;
    });

    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  drawGrid() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.strokeStyle = 'rgba(42, 42, 42, 0.4)';
    ctx.lineWidth = 0.5;

    const cols = 14;
    for (let i = 0; i <= cols; i++) {
      const x = (w / cols) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    const rows = 8;
    for (let i = 0; i <= rows; i++) {
      const y = (h / rows) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // dB reference lines
    ctx.strokeStyle = 'rgba(212, 168, 83, 0.08)';
    ctx.setLineDash([4, 4]);
    for (let i = 1; i <= 4; i++) {
      const y = (h / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  drawSpectrum() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const barWidth = w / this.barCount;
    const barGap = 1;

    for (let i = 0; i < this.barCount; i++) {
      const x = i * barWidth;
      const normalizedI = i / this.barCount;

      const distFromMouse = Math.abs(normalizedI - this.mouseX);
      this.mouseInfluence = Math.max(0, 1 - distFromMouse * 3);

      const wave1 = Math.sin(this.time * 0.0015 + i * 0.25) * 0.25;
      const wave2 = Math.sin(this.time * 0.0025 + i * 0.15) * 0.15;
      const wave3 = Math.sin(this.time * 0.001 + i * 0.4) * 0.1;
      const baseHeight = (wave1 + wave2 + wave3 + 0.5) * h * 0.5;

      const mouseBoost = this.mouseInfluence * h * 0.25;
      const height = Math.min(h * 0.85, baseHeight + mouseBoost);

      const color = this.getBarColor(normalizedI, this.mouseInfluence);

      const gradient = ctx.createLinearGradient(x, h, x, h - height);
      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.05)`);
      gradient.addColorStop(0.3, `rgba(${color.r}, ${color.g}, ${color.b}, 0.25)`);
      gradient.addColorStop(0.7, `rgba(${color.r}, ${color.g}, ${color.b}, 0.65)`);
      gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0.95)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(x + barGap / 2, h - height, barWidth - barGap, height);

      // Peak dot
      if (height > 20) {
        ctx.fillStyle = `rgba(${this.colors.amberBright.r}, ${this.colors.amberBright.g}, ${this.colors.amberBright.b}, ${0.4 + this.mouseInfluence * 0.6})`;
        ctx.fillRect(x + barGap / 2, h - height - 3, barWidth - barGap, 2);

        if (this.mouseInfluence > 0.4) {
          ctx.shadowColor = `rgba(212, 168, 83, ${this.mouseInfluence * 0.4})`;
          ctx.shadowBlur = 8;
          ctx.fillRect(x + barGap / 2, h - height - 3, barWidth - barGap, 2);
          ctx.shadowBlur = 0;
        }
      }
    }
  }

  getBarColor(normalizedPos, mouseInf) {
    const base = this.colors.amber;
    const dim = this.colors.amberDim;
    const bright = this.colors.amberBright;

    const r = dim.r + (base.r - dim.r) * (1 - normalizedPos * 0.3);
    const g = dim.g + (base.g - dim.g) * (1 - normalizedPos * 0.3) + mouseInf * 20;
    const b = dim.b + (base.b - dim.b) * (1 - normalizedPos * 0.3);

    return {
      r: Math.min(255, r),
      g: Math.min(255, g),
      b: Math.min(255, b)
    };
  }

  drawMouseLine() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const x = this.mouseX * w;

    ctx.strokeStyle = `rgba(212, 168, 83, ${0.15 + this.mouseInfluence * 0.2})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Cursor crosshair at intersection
    const freq = Math.round(this.mouseX * 20000);
    const dbLevel = Math.round((1 - this.mouseY) * 48 - 48);

    ctx.fillStyle = 'rgba(13, 13, 13, 0.85)';
    ctx.fillRect(x - 35, 10, 70, 18);
    ctx.strokeStyle = 'rgba(212, 168, 83, 0.4)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x - 35, 10, 70, 18);

    ctx.font = '9px "Space Mono", monospace';
    ctx.fillStyle = '#d4a853';
    ctx.textAlign = 'center';
    ctx.fillText(`${freq >= 1000 ? (freq/1000).toFixed(1) + 'k' : freq}Hz ${dbLevel}dB`, x, 22);
  }

  updateInfoDisplays() {
    const peakEl = document.getElementById('freqPeak');
    const rmsEl = document.getElementById('freqRms');
    const crestEl = document.getElementById('freqCrest');

    if (peakEl) {
      const peak = -2 - Math.random() * 4 + this.mouseInfluence * 2;
      peakEl.textContent = peak.toFixed(1) + ' dB';
    }

    if (rmsEl) {
      const rms = -15 - Math.random() * 6 + this.mouseInfluence * 3;
      rmsEl.textContent = rms.toFixed(1) + ' dB';
    }

    if (crestEl) {
      const crest = 12 + Math.random() * 5 + this.mouseInfluence * 4;
      crestEl.textContent = crest.toFixed(1) + ' dB';
    }
  }

  animate() {
    this.time = performance.now();

    this.ctx.clearRect(0, 0, this.width, this.height);

    this.drawGrid();
    this.drawSpectrum();
    this.drawMouseLine();

    this.animFrame = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
    }
  }
}
