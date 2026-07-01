(function() {
  'use strict';

  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

  /* PRELOADER */
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        initPageAnimations();
      }
    });

    document.body.style.overflow = 'hidden';

    tl.to('.preloader__label', {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    })
    .to('.preloader__line--h', {
      width: '100%',
      opacity: 0.3,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.inOut'
    }, 0.2)
    .to('.preloader__line--v', {
      height: '100%',
      opacity: 0.3,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.inOut'
    }, 0.3)
    .to('.preloader__corner', {
      opacity: 0.6,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out'
    }, 0.5)
    .to('.preloader__label', {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    }, 1.2)
    .to(preloader, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power3.inOut'
    }, 1.4)
    .set(preloader, { display: 'none' });
  }

  /* LENIS SMOOTH SCROLL */
  let lenis;
  function initLenis() {
    lenis = new Lenis({
      duration: 1.2,
      easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function(time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* SCROLL PROGRESS */
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress__bar');
    if (!bar) return;

    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.height = progress + '%';
    });
  }

  /* CURSOR */
  function initCursor() {
    if (isMobile) {
      const cursor = document.getElementById('cursor');
      if (cursor) cursor.style.display = 'none';
      document.body.style.cursor = 'auto';
      return;
    }

    const cursor = document.getElementById('cursor');
    const dot = cursor.querySelector('.cursor__dot');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.transform = 'translate(' + cursorX + 'px, ' + cursorY + 'px)';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverElements = document.querySelectorAll('a, button, .spaces__item, .filmstrip__frame, .services__item, .nav__grid-toggle');
    hoverElements.forEach(function(el) {
      el.addEventListener('mouseenter', function() { cursor.classList.add('hovering'); });
      el.addEventListener('mouseleave', function() { cursor.classList.remove('hovering'); });
    });
  }

  /* MAGNETIC HOVER */
  function initMagnetic() {
    if (isMobile) return;

    const magneticElements = document.querySelectorAll('.nav__link, .contact__email');
    magneticElements.forEach(function(el) {
      el.addEventListener('mousemove', function(e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      el.addEventListener('mouseleave', function() {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)'
        });
      });
    });
  }

  /* MOBILE MENU */
  function initMobileMenu() {
    var toggle = document.getElementById('navGridToggle');
    var links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function() {
      toggle.classList.toggle('active');
      links.classList.toggle('active');
      document.body.style.overflow = links.classList.contains('active') ? 'hidden' : '';
    });

    links.querySelectorAll('.nav__link').forEach(function(link) {
      link.addEventListener('click', function() {
        toggle.classList.remove('active');
        links.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* PAGE ANIMATIONS */
  function initPageAnimations() {
    initHeroAnimation();
    initSectionAnimations();
    initSpaceConstruction();
    initFilmstripScroll();
  }

  /* HERO ANIMATION */
  function initHeroAnimation() {
    var tl = gsap.timeline({ delay: 0.2 });

    tl.from('.hero__axis--x', {
      scaleX: 0,
      duration: 1.2,
      ease: 'power3.inOut'
    })
    .from('.hero__axis--y', {
      scaleY: 0,
      duration: 1.2,
      ease: 'power3.inOut'
    }, '-=1')
    .from('.hero__tag', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.6')
    .from('.hero__title-line', {
      yPercent: 110,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: 'power3.out'
    }, '-=0.5')
    .from('.hero__meta', {
      opacity: 0,
      y: 15,
      duration: 0.7,
      ease: 'power2.out'
    }, '-=0.4')
    .from('.hero__dimension', {
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.3')
    .from('.hero__coord', {
      opacity: 0,
      x: -10,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.3');
  }

  /* SECTION ANIMATIONS */
  function initSectionAnimations() {
    gsap.utils.toArray('.section-header').forEach(function(header) {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out'
      });

      gsap.from(header.querySelector('.section-header__line'), {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1,
        ease: 'power3.inOut'
      });
    });

    gsap.from('.process__text--large', {
      scrollTrigger: {
        trigger: '.process__statement',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power2.out'
    });

    gsap.from('.process__text:not(.process__text--large)', {
      scrollTrigger: {
        trigger: '.process__statement',
        start: 'top 70%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.2,
      ease: 'power2.out'
    });

    gsap.utils.toArray('.process__step').forEach(function(step, i) {
      gsap.from(step, {
        scrollTrigger: {
          trigger: step,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: 30,
        duration: 0.7,
        delay: i * 0.1,
        ease: 'power2.out'
      });
    });

    gsap.utils.toArray('.spaces__item').forEach(function(item, i) {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power2.out'
      });
    });

    gsap.from('.about__portrait-frame', {
      scrollTrigger: {
        trigger: '.about__grid',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: 'power2.out'
    });

    gsap.from('.about__bio-lead', {
      scrollTrigger: {
        trigger: '.about__bio',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out'
    });

    gsap.utils.toArray('.about__bio-text').forEach(function(text, i) {
      gsap.from(text, {
        scrollTrigger: {
          trigger: text,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power2.out'
      });
    });

    gsap.utils.toArray('.about__stat').forEach(function(stat, i) {
      gsap.from(stat, {
        scrollTrigger: {
          trigger: '.about__stats',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power2.out'
      });
    });

    gsap.utils.toArray('.services__item').forEach(function(item, i) {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: i * 0.08,
        ease: 'power2.out'
      });
    });

    gsap.from('.contact__heading', {
      scrollTrigger: {
        trigger: '.contact__grid',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power2.out'
    });

    gsap.from('.contact__text', {
      scrollTrigger: {
        trigger: '.contact__grid',
        start: 'top 70%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 25,
      duration: 0.7,
      delay: 0.15,
      ease: 'power2.out'
    });

    gsap.from('.contact__email', {
      scrollTrigger: {
        trigger: '.contact__grid',
        start: 'top 65%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 0.3,
      ease: 'power2.out'
    });

    gsap.utils.toArray('.contact__loc').forEach(function(loc, i) {
      gsap.from(loc, {
        scrollTrigger: {
          trigger: '.contact__locations',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: 30,
        duration: 0.6,
        delay: i * 0.15,
        ease: 'power2.out'
      });
    });
  }

  /* SPACE CONSTRUCTION — Grid lines animating on scroll */
  function initSpaceConstruction() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    gsap.to('.hero__axis--x', {
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      opacity: 0,
      y: -50
    });

    gsap.to('.hero__axis--y', {
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      opacity: 0,
      x: 50
    });

    gsap.utils.toArray('.spaces__item').forEach(function(item) {
      var img = item.querySelector('.spaces__item-img img');
      if (!img) return;

      gsap.fromTo(img, {
        yPercent: 10
      }, {
        yPercent: -10,
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });

    gsap.utils.toArray('.services__item').forEach(function(item) {
      var line = item.querySelector('::before');
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          end: 'top 60%',
          scrub: 1
        },
        '--line-width': '0%',
        ease: 'none'
      });
    });
  }

  /* FILMSTRIP SCROLL */
  function initFilmstripScroll() {
    var track = document.getElementById('filmstripTrack');
    if (!track) return;

    var totalScroll = track.scrollWidth - window.innerWidth + 200;

    gsap.to(track, {
      x: -totalScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: '.filmstrip',
        start: 'top 20%',
        end: 'bottom 20%',
        scrub: 1
      }
    });
  }

  /* INIT */
  document.addEventListener('DOMContentLoaded', function() {
    gsap.registerPlugin(ScrollTrigger);

    initLenis();
    initPreloader();
    initCursor();
    initMagnetic();
    initMobileMenu();
    initScrollProgress();
  });

})();
