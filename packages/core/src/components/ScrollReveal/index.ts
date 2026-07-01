import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollRevealConfig {
  selector: string;
  trigger?: string;
  start?: string;
  stagger?: number;
  duration?: number;
  y?: number;
  opacity?: number;
  ease?: string;
}

export class ScrollReveal {
  private triggers: ScrollTrigger[] = [];

  constructor(configs: ScrollRevealConfig[]) {
    configs.forEach((config) => this.create(config));
  }

  private create(config: ScrollRevealConfig): void {
    const {
      selector,
      trigger,
      start = 'top 85%',
      stagger = 0.08,
      duration = 0.9,
      y = 50,
      opacity = 0,
      ease = 'power2.out',
    } = config;

    const elements = document.querySelectorAll<HTMLElement>(selector);
    if (!elements.length) return;

    elements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = `translateY(${y}px)`;
    });

    const st = ScrollTrigger.create({
      trigger: trigger || selector,
      start,
      onEnter: () => {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease,
        });
      },
      once: true,
    });

    this.triggers.push(st);
  }

  destroy(): void {
    this.triggers.forEach((st) => st.kill());
    this.triggers = [];
  }
}