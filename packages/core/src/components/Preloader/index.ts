import { gsap } from 'gsap';

export interface PreloaderConfig {
  logo?: string;
  tagline?: string;
  duration?: number;
  onComplete?: () => void;
}

export class Preloader {
  private element: HTMLElement;
  private config: PreloaderConfig;
  private tl: gsap.core.Timeline;

  constructor(config: PreloaderConfig = {}) {
    this.config = config;
    this.element = document.createElement('div');
    this.element.className = 'preloader';
    this.tl = gsap.timeline({ onComplete: () => this.onComplete() });
    this.init();
  }

  private init(): void {
    this.element.innerHTML = `
      <div class="preloader__inner">
        <div class="preloader__logo">${this.config.logo || ''}</div>
        <div class="preloader__bar">
          <div class="preloader__progress"></div>
        </div>
        <div class="preloader__tagline">${this.config.tagline || ''}</div>
      </div>
    `;
    document.body.prepend(this.element);
    this.buildTimeline();
  }

  private buildTimeline(): void {
    const progress = this.element.querySelector('.preloader__progress') as HTMLElement;
    const inner = this.element.querySelector('.preloader__inner') as HTMLElement;
    const duration = this.config.duration || 1.5;

    this.tl
      .fromTo(inner, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      .to(progress, { scaleX: 1, duration, ease: 'power2.inOut' }, 0)
      .to(inner, { opacity: 0, duration: 0.3 }, duration + 0.1)
      .to(this.element, { yPercent: -100, duration: 0.5, ease: 'power3.inOut' }, duration + 0.4);
  }

  private onComplete(): void {
    this.element.remove();
    this.config.onComplete?.();
  }

  play(): void {
    this.tl.restart();
  }

  destroy(): void {
    this.tl.kill();
    this.element.remove();
  }
}