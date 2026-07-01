export interface FooterConfig {
  identity: 'TheCredits' | 'TheWorkshop' | 'ThePremiere' | 'TheFestival';
  name: string;
  role: string;
  email?: string;
  social?: Record<string, string>;
  bio?: string;
}

export class FooterWorld {
  private container: HTMLElement;
  private config: FooterConfig;

  constructor(container: HTMLElement, config: FooterConfig) {
    this.container = container;
    this.config = config;
    this.init();
  }

  private init(): void {
    this.container.classList.add('footer', `footer--${this.config.identity.toLowerCase()}`);
    this.build();
  }

  private build(): void {
    const { identity, name, role, email, social, bio } = this.config;

    const socialLinks = social
      ? Object.entries(social)
          .map(([platform, url]) => `<a class="footer__social-link" href="${url}" target="_blank" rel="noopener">${platform}</a>`)
          .join('')
      : '';

    this.container.innerHTML = `
      <div class="footer__inner">
        <div class="footer__top">
          <div class="footer__identity">
            <span class="footer__name">${name}</span>
            <span class="footer__role">${role}</span>
          </div>
          ${bio ? `<p class="footer__bio">${bio}</p>` : ''}
        </div>
        <div class="footer__bottom">
          ${email ? `<a class="footer__email" href="mailto:${email}">${email}</a>` : ''}
          ${socialLinks ? `<div class="footer__social">${socialLinks}</div>` : ''}
        </div>
      </div>
    `;
  }

  destroy(): void {
    this.container.innerHTML = '';
    this.container.classList.remove('footer', `footer--${this.config.identity.toLowerCase()}`);
  }
}