// ============================================
// SplitReveal — Text split reveal animations
// ============================================

export class SplitReveal {
  static init(el, config = {}) {
    const mode = config.mode || 'chars'; // chars, words, lines
    const text = el.textContent;
    el.innerHTML = '';

    if (mode === 'chars') {
      [...text].forEach(char => {
        const span = document.createElement('span');
        span.classList.add('char');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.opacity = '0.15';
        el.appendChild(span);
      });
    } else if (mode === 'words') {
      text.split(' ').forEach((word, i, arr) => {
        const span = document.createElement('span');
        span.classList.add('word');
        span.textContent = word;
        span.style.display = 'inline-block';
        span.style.overflow = 'hidden';
        const inner = document.createElement('span');
        inner.classList.add('word-inner');
        inner.textContent = word;
        inner.style.display = 'inline-block';
        inner.style.transform = 'translateY(110%)';
        inner.style.willChange = 'transform';
        span.appendChild(inner);
        el.appendChild(span);
        if (i < arr.length - 1) {
          const space = document.createElement('span');
          space.textContent = '\u00A0';
          el.appendChild(space);
        }
      });
    } else if (mode === 'lines') {
      text.split('\n').forEach(line => {
        const div = document.createElement('div');
        div.classList.add('line');
        div.style.overflow = 'hidden';
        const inner = document.createElement('span');
        inner.classList.add('line-inner');
        inner.textContent = line;
        inner.style.display = 'inline-block';
        inner.style.transform = 'translateY(110%)';
        inner.style.willChange = 'transform';
        inner.style.willChange = 'transform';
        div.appendChild(inner);
        el.appendChild(div);
      });
    }

    // Animate on scroll
    const targets = el.querySelectorAll(`.${mode === 'chars' ? 'char' : mode === 'words' ? 'word-inner' : 'line-inner'}`);

    gsap.to(targets, {
      opacity: mode === 'chars' ? 1 : 1,
      y: 0,
      duration: mode === 'chars' ? 0.08 : 1,
      stagger: mode === 'chars' ? 0.015 : mode === 'words' ? 0.06 : 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: config.start || 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  }

  static initAll(selector = '[data-cinema-split-reveal]', config = {}) {
    document.querySelectorAll(selector).forEach(el => {
      SplitReveal.init(el, config);
    });
  }
}
