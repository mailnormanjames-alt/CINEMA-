import { gsap } from 'gsap';

export interface HeroConfig {
  system: 'CinematicFrame' | 'TechSpecSheet' | 'DirectorsChair' | 'BTSInvitation';
  image: string;
  overline?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  duration?: number;
}

export class HeroSystem {
  private container: HTMLElement;
  private config: HeroConfig;
  private tl: gsap.core.Timeline;

  constructor(container: HTMLElement, config: HeroConfig) {
    this.container = container;
    this.config = config;
    this.tl = gsap.timeline({ paused: true });
    this.init();
  }

  private init(): void {
    this.container.classList.add('hero', `hero--${this.config.system.toLowerCase()}`);
    this.buildDOM();
    this.buildTimeline();
  }

  private buildDOM(): void {
    const { image, overline, title, subtitle, ctaLabel } = this.config;

    this.container.innerHTML = `
      <div class="hero__media">
        <img class="hero__image" src="${image}" alt="${title}" loading="eager" />
        <div class="hero__grain"></div>
      </div>
      <div class="hero__content">
        ${overline ? `<span class="hero__overline">${overline}</span>` : ''}
        <h1 class="hero__title">${title}</h1>
        ${subtitle ? `<p class="hero__subtitle">${subtitle}</p>` : ''}
        ${ctaLabel ? `<a class="hero__cta" href="#work">${ctaLabel}</a>` : ''}
      </div>
    `;
  }

  private buildTimeline(): void {
    const content = this.container.querySelector('.hero__content') as HTMLElement;
    const image = this.container.querySelector('.hero__image') as HTMLElement;
    const overline = this.container.querySelector('.hero__overline') as HTMLElement;
    const title = this.container.querySelector('.hero__title') as HTMLElement;
    const subtitle = this.container.querySelector('.hero__subtitle') as HTMLElement;
    const cta = this.container.querySelector('.hero__cta') as HTMLElement;

    const duration = this.config.duration || 1.2;

    this.tl
      .fromTo(image, { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: duration * 1.2, ease: 'power3.out' }, 0);

    if (overline) {
      this.tl.fromTo(overline, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, duration * 0.3);
    }

    this.tl
      .fromTo(title, { opacity: 0, y: 40, clipPath: 'inset(100% 0% 0% 0%)' }, { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: duration, ease: 'power3.out' }, duration * 0.4);

    if (subtitle) {
      this.tl.fromTo(subtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, duration * 0.7);
    }

    if (cta) {
      this.tl.fromTo(cta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, duration * 0.85);
    }
  }

  play(): void {
    this.tl.restart();
  }

  pause(): void {
    this.tl.pause();
  }

  destroy(): void {
    this.tl.kill();
    this.container.innerHTML = '';
  }
}