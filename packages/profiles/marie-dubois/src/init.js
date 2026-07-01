// ============================================
// @cinema-sotd/profile-marie-dubois — Init
// ============================================
// CDN-based initialization — uses GSAP/Lenis/Three globals from CDN.
// When pnpm install + bundler is configured, switch to ES module imports.

import { ScriptToScreenReveal } from './components/ScriptToScreenReveal.js';

// --- Config ---
const CONFIG = {
  lenis: { lerp: 0.07, duration: 1.6, smoothTouch: false },
  preloader: { brand: 'Atelier Noir', countDuration: 2.5, exitDuration: 1.2 },
  hero: { accent: '#C9A96E' },
  webgl: { color: 0xC9A96E, opacity: 0.4, particleCount: 2000 }
};

// ============================================
// BOOT SEQUENCE
// ============================================

(function() {
  const preloaderEl = document.querySelector('[data-cinema-preloader]');
  if (!preloaderEl) { initSite(); return; }

  const countEl = preloaderEl.querySelector('.preloader-count');
  const barFill = preloaderEl.querySelector('.preloader-bar-fill');
  const top = preloaderEl.querySelector('.preloader-top');
  const bottom = preloaderEl.querySelector('.preloader-bottom');

  if (top) gsap.to(top, { opacity: 1, duration: 1, delay: 0.3 });
  if (bottom) gsap.to(bottom, { opacity: 1, duration: 0.8, delay: 0.6 });
  if (barFill) gsap.to(barFill, { width: '100%', duration: CONFIG.preloader.countDuration, ease: 'power2.inOut', delay: 0.5 });

  if (countEl) {
    gsap.to({ val: 0 }, {
      val: 100, duration: CONFIG.preloader.countDuration, ease: 'power2.inOut', delay: 0.5,
      onUpdate() { countEl.textContent = Math.round(this.targets()[0].val); },
      onComplete() {
        gsap.to(preloaderEl, {
          yPercent: -100, duration: CONFIG.preloader.exitDuration, ease: 'power4.inOut',
          onComplete: initSite
        });
      }
    });
  } else {
    gsap.to(preloaderEl, {
      yPercent: -100, duration: CONFIG.preloader.exitDuration, ease: 'power4.inOut',
      onComplete: initSite
    });
  }
})();

// ============================================
// SITE INIT — called after preloader exits
// ============================================

function initSite() {
  // 1. Lenis (flowing personality — Marie Dubois)
  const lenis = new Lenis({
    lerp: CONFIG.lenis.lerp,
    duration: CONFIG.lenis.duration,
    smoothWheel: true,
    smoothTouch: CONFIG.lenis.smoothTouch
  });
  window.lenis = lenis;
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.on('scroll', ScrollTrigger.update);

  // ScrollTrigger.scrollerProxy — canonical stack
  const lenisRef = lenis;
  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) { return arguments.length ? lenisRef.scrollTo(value) : lenisRef.scroll; },
    getBoundingClientRect() { return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }; },
    pinType: 'transform'
  });
  gsap.registerPlugin(ScrollTrigger);

  // 2. Scroll progress
  const progressBar = document.querySelector('[data-cinema-progress]');
  if (progressBar) {
    lenis.on('scroll', (e) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (e.animatedScroll / maxScroll) * 100 : 0;
      progressBar.style.width = progress + '%';
    });
  }

  // 3. Custom cursor
  initCursor();

  // 4. Magnetic hover
  document.querySelectorAll('[data-cinema-magnetic], .magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });

  // 5. WebGL particles
  initWebGL(lenis);

  // 6. Hero — Cinematic Frame (100ms entrance, cursor reactivity)
  initHero();

  // 7. Filmstrip gallery — horizontal scroll
  initFilmstrip();

  // 8. Signature interaction: Script-to-Screen Reveal
  const scriptRevealEl = document.querySelector('[data-cinema-script-reveal]');
  if (scriptRevealEl) {
    new ScriptToScreenReveal(scriptRevealEl, {
      imageSrc: 'assets/images/hero/lucid-origin_a_cinematic_photo_of_Cinematic_wide-angle_shot_of_a_narrow_Parisian_alley_at_nig-0.jpg',
      imageAlt: 'Canal Saint-Martin at night — cinematic frame'
    });
  }

  // 9. Statement character reveal (scrub-linked)
  initStatement();

  // 10. Profile scroll animations
  initScrollAnimations();

  // 11. Counter animations
  document.querySelectorAll('[data-cinema-counter]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, { val: target, duration: 2.5, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(obj.val); }
        });
      }
    });
  });

  // 12. Refresh
  ScrollTrigger.refresh();
}

// ============================================
// CUSTOM CURSOR
// ============================================

function initCursor() {
  const cursorEl = document.getElementById('cursor');
  const cursorTextEl = document.getElementById('cursorText');
  if (!cursorEl) return;

  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;
  if (isMobile) { cursorEl.style.display = 'none'; return; }

  const dot = cursorEl.querySelector('.cursor-dot');
  const ring = cursorEl.querySelector('.cursor-ring');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let dotX = mx, dotY = my, ringX = mx, ringY = my;

  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

  document.querySelectorAll('[data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorEl.classList.add('active');
      const type = el.dataset.cursor;
      if (type === 'play' || type === 'view') {
        cursorEl.classList.add('dragging');
        cursorTextEl.textContent = type === 'play' ? 'Watch' : 'View';
        gsap.to(cursorTextEl, { opacity: 1, duration: 0.3 });
      }
    });
    el.addEventListener('mouseleave', () => {
      cursorEl.classList.remove('active', 'dragging');
      gsap.to(cursorTextEl, { opacity: 0, duration: 0.3 });
    });
  });

  document.addEventListener('mousemove', (e) => {
    gsap.set(cursorTextEl, { x: e.clientX + 25, y: e.clientY - 10 });
  });

  function animate() {
    dotX += (mx - dotX) * 0.35; dotY += (my - dotY) * 0.35;
    ringX += (mx - ringX) * 0.12; ringY += (my - ringY) * 0.12;
    gsap.set(dot, { x: dotX, y: dotY });
    gsap.set(ring, { x: ringX, y: ringY });
    requestAnimationFrame(animate);
  }
  animate();
}

// ============================================
// WEBGL AMBIENT PARTICLES
// ============================================

function initWebGL(lenis) {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  try {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const count = CONFIG.webgl.particleCount;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sizes[i] = Math.random() * 2 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }, uScrollProgress: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor: { value: new THREE.Color(CONFIG.webgl.color) },
        uOpacity: { value: CONFIG.webgl.opacity }
      },
      vertexShader: `
        attribute float size; uniform float uTime; uniform float uScrollProgress; uniform vec2 uMouse;
        varying float vOpacity;
        void main() {
          vec3 pos = position;
          pos.x += sin(uTime * 0.3 + position.y * 0.5) * 0.15;
          pos.y += cos(uTime * 0.2 + position.x * 0.3) * 0.1;
          pos.z += sin(uTime * 0.15 + position.x * 0.2) * 0.08;
          vec2 mouseDir = pos.xy - uMouse;
          float mouseDist = length(mouseDir);
          if (mouseDist < 2.0) { float force = (2.0 - mouseDist) / 2.0; pos.xy += normalize(mouseDir) * force * 0.3; }
          pos.y -= uScrollProgress * 2.0;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          vOpacity = smoothstep(0.0, 0.3, 1.0 - abs(pos.z) / 5.0) * 0.6;
        }`,
      fragmentShader: `
        uniform vec3 uColor; uniform float uOpacity; varying float vOpacity;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d) * vOpacity * uOpacity;
          gl_FragColor = vec4(uColor, alpha);
        }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0, scrollProgress = 0, time = 0;

    document.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    if (lenis) lenis.on('scroll', (e) => { scrollProgress = e.progress || 0; });
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function animate() {
      requestAnimationFrame(animate);
      time += 0.01;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      material.uniforms.uTime.value = time;
      material.uniforms.uMouse.value.set(mouseX * 3, mouseY * 3);
      material.uniforms.uScrollProgress.value = scrollProgress;
      particles.rotation.y = mouseX * 0.1;
      particles.rotation.x = mouseY * 0.05;
      renderer.render(scene, camera);
    }
    animate();
  } catch (e) {
    console.warn('WebGLAmbient: WebGL not supported', e);
  }
}

// ============================================
// HERO — Cinematic Frame
// DOCTRINE: 100ms entrance, transform+opacity only, cursor reactivity
// ============================================

function initHero() {
  const heroEl = document.querySelector('[data-cinema-hero]');
  if (!heroEl) return;

  const tl = gsap.timeline({ delay: 0.1 }); // 100ms — DOCTRINE
  const words = heroEl.querySelectorAll('.hero-title .word');
  const img = heroEl.querySelector('.hero-image img');

  // DOCTRINE: Only transform + opacity — NEVER filter animation
  if (img) {
    gsap.fromTo(img, { scale: 1.2, opacity: 0.5 }, {
      scale: 1.05, opacity: 1, duration: 2.5, ease: 'power2.out'
    });
  }

  tl.to(words, { y: 0, opacity: 1, duration: 1.4, ease: 'power4.out', stagger: 0.1 }, 0.5)
    .to('.hero-eyebrow', { opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.8')
    .to('.hero-meta', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .to('.hero-scroll-cue', { opacity: 1, duration: 0.6 }, '-=0.3');

  // Parallax
  if (img) {
    img.style.willChange = 'transform';
    gsap.to(img, {
      yPercent: 15, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }
  gsap.to('.hero-content', {
    y: -100, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero-scroll-cue', {
    opacity: 0, y: -30,
    scrollTrigger: { trigger: '.hero', start: '20% top', end: '40% top', scrub: true }
  });

  // Cursor reactivity — hero image reacts to mouse
  if (img) {
    document.addEventListener('mousemove', (e) => {
      const mxx = (e.clientX / window.innerWidth - 0.5) * -8;
      const myy = (e.clientY / window.innerHeight - 0.5) * -5;
      gsap.to(img, { x: mxx, y: myy, duration: 1.5, ease: 'power2.out', overwrite: 'auto' });
    });
  }
}

// ============================================
// FILMSTRIP — Horizontal Scroll
// ============================================

function initFilmstrip() {
  const track = document.querySelector('.filmstrip-track');
  if (!track) return;

  gsap.from('.filmstrip-header', {
    y: 50, opacity: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.filmstrip', start: 'top 80%' }
  });

  gsap.to(track, {
    x: () => -(track.scrollWidth - window.innerWidth), ease: 'none',
    scrollTrigger: { trigger: '.filmstrip', pin: true, scrub: 1, end: () => `+=${track.scrollWidth - window.innerWidth}`, invalidateOnRefresh: true }
  });

  gsap.utils.toArray('.filmstrip-item').forEach((item, i) => {
    gsap.from(item, { y: 60 + (i % 2 === 0 ? 0 : 40), opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 90%' } });
  });
}

// ============================================
// STATEMENT — Character Reveal (scrub-linked)
// ============================================

function initStatement() {
  const quote = document.getElementById('statementQuote');
  if (!quote) return;

  const text = quote.textContent;
  quote.innerHTML = '';
  [...text].forEach(char => {
    const span = document.createElement('span');
    span.classList.add('char');
    span.textContent = char === ' ' ? '\u00A0' : char;
    quote.appendChild(span);
  });

  gsap.to(quote.querySelectorAll('.char'), {
    opacity: 0.9, stagger: 0.015,
    scrollTrigger: { trigger: '.statement', start: 'top 70%', end: 'bottom 40%', scrub: 1 }
  });
  gsap.from('.statement-attr', {
    opacity: 0, y: 20,
    scrollTrigger: { trigger: '.statement', start: '60% 60%', end: '80% 40%', scrub: true }
  });
}

// ============================================
// SCROLL ANIMATIONS — Profile-specific
// ============================================

function initScrollAnimations() {
  // About title word reveal
  gsap.from('.about-title .word', {
    y: '110%', duration: 1, stagger: 0.06, ease: 'power4.out',
    scrollTrigger: { trigger: '.about-title', start: 'top 85%' }
  });

  // About text paragraphs
  gsap.from('.about-text p', {
    y: 40, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
    scrollTrigger: { trigger: '.about-text', start: 'top 80%' }
  });

  // About quote
  gsap.from('.about-quote', {
    y: 30, opacity: 0, duration: 1.2,
    scrollTrigger: { trigger: '.about-quote', start: 'top 90%' }
  });

  // Services rows
  gsap.utils.toArray('.service-row').forEach((row, i) => {
    gsap.from(row, {
      y: 25, opacity: 0, duration: 0.7, delay: i * 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: row, start: 'top 92%' }
    });
  });

  // Stats entrance
  gsap.from('.stat', {
    y: 30, opacity: 0, duration: 0.8, stagger: 0.1,
    scrollTrigger: { trigger: '.stats', start: 'top 85%' }
  });

  // Contact title word reveal
  gsap.from('.contact-title .word', {
    y: '110%', duration: 1.1, stagger: 0.08, ease: 'power4.out',
    scrollTrigger: { trigger: '.contact-title', start: 'top 85%' }
  });

  // Contact elements stagger
  gsap.from('.contact-email', { y: 20, opacity: 0, duration: 0.8, delay: 0.5, scrollTrigger: { trigger: '.contact', start: 'top 75%' } });
  gsap.from('.contact-location', { y: 15, opacity: 0, duration: 0.6, delay: 0.7, scrollTrigger: { trigger: '.contact', start: 'top 75%' } });
  gsap.from('.contact-social a', { y: 10, opacity: 0, duration: 0.5, stagger: 0.1, delay: 0.9, scrollTrigger: { trigger: '.contact', start: 'top 75%' } });
}
