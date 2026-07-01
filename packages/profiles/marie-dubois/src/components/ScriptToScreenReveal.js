// ============================================
// ScriptToScreenReveal — Marie Dubois Signature Interaction
// ============================================
// Screenplay text transforms into cinematic frames as user scrolls.
// The text fades out character-by-character while the image fades in,
// creating the illusion of a script becoming reality.
//
// DNA: "I don't make films. I make rooms you can't leave."
// Interaction must: reinforce identity, strengthen emotion, remain performant.

export class ScriptToScreenReveal {
  constructor(el, config = {}) {
    this.el = el;
    this.scriptLines = config.scriptLines || this.getScriptLines();
    this.imageSrc = config.imageSrc || '';
    this.imageAlt = config.imageAlt || 'Cinematic frame';
    this.accent = config.accent || '#C9A96E';

    this.build();
    this.animate();
  }

  getScriptLines() {
    return [
      'EXT. CANAL SAINT-MARTIN — NIGHT',
      '',
      'Rain falls in silence. A figure stands',
      'at the water\'s edge, motionless.',
      '',
      'The camera holds. Five seconds.',
      'Ten. The audience leans forward.',
      '',
      'She turns. Not toward us —',
      'toward the light across the water.',
      '',
      'And we understand:',
      'this is not a scene.',
      'This is a memory.'
    ];
  }

  build() {
    this.el.classList.add('script-reveal');

    // Create the two layers
    const scriptLayer = document.createElement('div');
    scriptLayer.classList.add('script-reveal__script');

    this.scriptLines.forEach((line, i) => {
      const lineEl = document.createElement('div');
      lineEl.classList.add('script-reveal__line');
      if (line === '') {
        lineEl.classList.add('script-reveal__line--blank');
      } else if (line.startsWith('EXT.') || line.startsWith('INT.')) {
        lineEl.classList.add('script-reveal__line--slug');
      }
      lineEl.textContent = line;
      lineEl.dataset.lineIndex = i;
      scriptLayer.appendChild(lineEl);
    });

    const imageLayer = document.createElement('div');
    imageLayer.classList.add('script-reveal__image');
    imageLayer.innerHTML = `<img src="${this.imageSrc}" alt="${this.imageAlt}" loading="lazy">`;

    // Overlay gradient
    const overlay = document.createElement('div');
    overlay.classList.add('script-reveal__overlay');

    // Line number decoration
    const lineNumber = document.createElement('div');
    lineNumber.classList.add('script-reveal__number');
    lineNumber.textContent = '001';

    this.el.innerHTML = '';
    this.el.appendChild(scriptLayer);
    this.el.appendChild(imageLayer);
    this.el.appendChild(overlay);
    this.el.appendChild(lineNumber);

    this.scriptLayer = scriptLayer;
    this.imageLayer = imageLayer;
    this.lines = scriptLayer.querySelectorAll('.script-reveal__line');
  }

  animate() {
    // Script lines reveal character-by-character on scroll
    this.lines.forEach((line, i) => {
      if (line.classList.contains('script-reveal__line--blank')) return;

      const text = line.textContent;
      line.innerHTML = '';
      [...text].forEach(char => {
        const span = document.createElement('span');
        span.classList.add('script-reveal__char');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.opacity = '0';
        line.appendChild(span);
      });

      const chars = line.querySelectorAll('.script-reveal__char');
      gsap.to(chars, {
        opacity: 1,
        duration: 0.08,
        stagger: 0.02,
        ease: 'none',
        scrollTrigger: {
          trigger: line,
          start: 'top 85%',
          end: 'top 60%',
          scrub: 1
        }
      });
    });

    // Image fades in as script fades out
    gsap.fromTo(this.imageLayer, {
      clipPath: 'inset(100% 0 0 0)',
      opacity: 0
    }, {
      clipPath: 'inset(0% 0 0 0)',
      opacity: 1,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: this.el,
        start: 'top 40%',
        end: 'bottom 60%',
        scrub: 1
      }
    });

    // Script layer fades out as image takes over
    gsap.to(this.scriptLayer, {
      opacity: 0,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: this.el,
        start: '50% 50%',
        end: '80% 50%',
        scrub: 1
      }
    });

    // Line number increments
    const totalLines = this.scriptLines.length;
    gsap.to({ val: 1 }, {
      val: totalLines,
      ease: 'none',
      scrollTrigger: {
        trigger: this.el,
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 1
      },
      onUpdate: (self) => {
        const num = Math.round(self.targets()[0].val);
        if (this.el.querySelector('.script-reveal__number')) {
          this.el.querySelector('.script-reveal__number').textContent =
            String(num).padStart(3, '0');
        }
      }
    });
  }

  destroy() {
    ScrollTrigger.getAll().forEach(st => st.kill());
  }
}
