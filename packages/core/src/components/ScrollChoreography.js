// ============================================
// ScrollChoreography — 7-Scene Rhythm System
// ============================================
// Reveal → Pause → Accelerate → Breathe → Seduce → Expand → Reflect
//
// COMPLIANCE:
// - Mobile matchMedia: independent animation systems per Cinema+Fashion Mobile doctrine
// - Animate ONLY: transform, opacity
// - Pinning limited to key storytelling moments (max 100vh–200vh)

export class ScrollChoreography {
  constructor(el, config = {}) {
    this.el = el;
    this.scenes = config.scenes || this.getDefaultScenes();
    this.rhythm = config.rhythm || [
      { name: 'reveal',    duration: 1.2, ease: 'power3.out' },
      { name: 'pause',     duration: 0.8, ease: 'none' },
      { name: 'accelerate', duration: 0.6, ease: 'power2.in' },
      { name: 'breathe',   duration: 1.5, ease: 'power1.inOut' },
      { name: 'seduce',    duration: 1.0, ease: 'power3.out' },
      { name: 'expand',    duration: 1.3, ease: 'power2.out' },
      { name: 'reflect',   duration: 2.0, ease: 'power1.out' }
    ];
    this.pinned = config.pinned || false;
    this.onSceneEnter = config.onSceneEnter || null;
    this.onSceneLeave = config.onSceneLeave || null;

    // Mobile: reduce all durations by 50% per Mobile doctrine
    this.isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;
    if (this.isMobile) {
      this.rhythm = this.rhythm.map(r => ({
        ...r,
        duration: r.duration * 0.5
      }));
    }

    if (this.el) this.init();
  }

  getDefaultScenes() {
    return [
      { id: 'invitation',    label: 'Scene I — Invitation',    cue: 'reveal' },
      { id: 'vision',        label: 'Scene II — Vision',       cue: 'pause' },
      { id: 'work',          label: 'Scene III — Work',        cue: 'accelerate' },
      { id: 'process',       label: 'Scene IV — Process',      cue: 'breathe' },
      { id: 'craft',         label: 'Scene V — Craft',         cue: 'seduce' },
      { id: 'transformation', label: 'Scene VI — Transformation', cue: 'expand' },
      { id: 'connection',    label: 'Scene VII — Connection',  cue: 'reflect' }
    ];
  }

  init() {
    gsap.registerPlugin(ScrollTrigger);

    const sections = this.el.querySelectorAll('[data-scene]');
    if (!sections.length) return;

    sections.forEach((section, i) => {
      const scene = this.scenes[i] || this.scenes[this.scenes.length - 1];
      const rhythm = this.getRhythmForCue(scene.cue);

      this.animateScene(section, rhythm, i);
    });
  }

  getRhythmForCue(cueName) {
    return this.rhythm.find(r => r.name === cueName) || this.rhythm[0];
  }

  animateScene(section, rhythm, index) {
    const children = section.querySelectorAll('[data-scene-child]');
    const hasPinnable = section.dataset.scenePin === 'true';

    // Base config
    const baseConfig = {
      trigger: section,
      start: 'top 80%',
      end: 'top 20%',
      toggleActions: 'play none none reverse'
    };

    // Scene enter/leave callbacks
    if (this.onSceneEnter || this.onSceneLeave) {
      ScrollTrigger.create({
        ...baseConfig,
        onEnter: () => this.onSceneEnter?.(index, section),
        onLeave: () => this.onSceneLeave?.(index, section),
        onEnterBack: () => this.onSceneEnter?.(index, section),
        onLeaveBack: () => this.onSceneLeave?.(index, section)
      });
    }

    // Animate children — ONLY transform + opacity per Motion Doctrine
    if (children.length) {
      children.forEach(child => {
        child.style.willChange = 'transform';
      });

      gsap.fromTo(children,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: rhythm.duration,
          ease: rhythm.ease,
          stagger: 0.08,
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // Pinning — only for key storytelling moments, max 100vh
    // Per Great-Grandmaster: "Maximum 100vh–200vh, clear exit when pin releases"
    if (hasPinnable) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${window.innerHeight}`,
        pin: true,
        scrub: 1,
        onLeave: () => {
          // Visual cue when pin releases
          gsap.to(section, { opacity: 1, duration: 0.3 });
        }
      });
    }

    // Character-by-character text reveal (if data-scene-text)
    const textEls = section.querySelectorAll('[data-scene-text]');
    textEls.forEach(textEl => {
      this.initTextReveal(textEl, rhythm);
    });

    // Horizontal scroll within scene (if data-scene-horizontal)
    const horizontalTrack = section.querySelector('[data-scene-horizontal]');
    if (horizontalTrack) {
      this.initHorizontalScroll(section, horizontalTrack);
    }

    // Clip-path reveal (if data-scene-clip)
    const clipEls = section.querySelectorAll('[data-scene-clip]');
    clipEls.forEach(clipEl => {
      clipEl.style.willChange = 'transform';
      gsap.fromTo(clipEl,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: rhythm.duration * 1.5,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: clipEl,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1
          }
        }
      );
    });
  }

  initTextReveal(textEl, rhythm) {
    const text = textEl.textContent;
    textEl.innerHTML = '';

    [...text].forEach(char => {
      const span = document.createElement('span');
      span.classList.add('char');
      span.textContent = char === ' ' ? '\u00A0' : char;
      textEl.appendChild(span);
    });

    const chars = textEl.querySelectorAll('.char');
    gsap.to(chars, {
      opacity: 1,
      stagger: 0.015,
      scrollTrigger: {
        trigger: textEl,
        start: 'top 70%',
        end: 'bottom 40%',
        scrub: 1
      }
    });
  }

  initHorizontalScroll(container, track) {
    const items = track.children;
    if (!items.length) return;

    track.style.willChange = 'transform';

    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        end: () => `+=${track.scrollWidth - window.innerWidth}`,
        invalidateOnRefresh: true
      }
    });
  }

  // --- Public API ---

  goTo(sceneId) {
    const section = this.el.querySelector(`[data-scene="${sceneId}"]`);
    if (section && window.lenis) {
      window.lenis.scrollTo(section, { offset: -50 });
    }
  }

  getCurrentScene() {
    const sections = this.el.querySelectorAll('[data-scene]');
    let current = 0;
    sections.forEach((section, i) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.5) current = i;
    });
    return current;
  }

  destroy() {
    ScrollTrigger.getAll().forEach(st => st.kill());
  }
}
