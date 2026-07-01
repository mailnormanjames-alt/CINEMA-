import EmblaCarousel, { type EmblaOptionsType } from 'embla-carousel';

export interface FilmstripConfig {
  container: HTMLElement;
  options?: EmblaOptionsType;
  autoplay?: boolean;
  interval?: number;
}

export class FilmstripGallery {
  private embla: ReturnType<typeof EmblaCarousel> | null = null;
  private autoplayTimer: ReturnType<typeof setInterval> | null = null;
  private container: HTMLElement;

  constructor(config: FilmstripConfig) {
    this.container = config.container;
    this.init(config);
  }

  private init(config: FilmstripConfig): void {
    const viewport = this.container.querySelector('.embla__viewport') as HTMLElement;
    if (!viewport) return;

    const options: EmblaOptionsType = {
      loop: true,
      align: 'center',
      containScroll: 'trimSnaps',
      dragFree: true,
      ...config.options,
    };

    this.embla = EmblaCarousel(viewport, options);

    if (config.autoplay) {
      this.startAutoplay(config.interval || 3000);
    }
  }

  private startAutoplay(interval: number): void {
    this.autoplayTimer = setInterval(() => {
      if (this.embla) {
        this.embla.scrollNext();
      }
    }, interval);
  }

  stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  scrollPrev(): void {
    this.embla?.scrollPrev();
  }

  scrollNext(): void {
    this.embla?.scrollNext();
  }

  destroy(): void {
    this.stopAutoplay();
    this.embla?.destroy();
  }
}