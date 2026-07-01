(function () {
  'use strict';

  function hidePreloader() {
    var preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(function () {
        preloader.classList.add('is-hidden');
        initAnimations();
      }, 2500);
    }
  }

  function initCursor() {
    var cursor = document.getElementById('cursor');
    var follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    var mx = 0, my = 0;
    var fx = 0, fy = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });

    function animateFollower() {
      fx += (mx - fx) * 0.1;
      fy += (my - fy) * 0.1;
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    var hoverTargets = document.querySelectorAll(
      'a, button, [data-magnetic], .score__card, .filmstrip__item, .services__card'
    );

    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.classList.add('is-hover');
        follower.classList.add('is-hover');
      });
      el.addEventListener('mouseleave', function () {
        cursor.classList.remove('is-hover');
        follower.classList.remove('is-hover');
      });
    });
  }

  function initMagnetic() {
    var magnets = document.querySelectorAll('[data-magnetic]');
    magnets.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, {
          x: x * 0.25,
          y: y * 0.25,
          duration: 0.4,
          ease: 'power2.out',
        });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
      });
    });
  }

  function initScrollProgress() {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;

    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = (scrollTop / docHeight) * 100;
      bar.style.width = progress + '%';
    });
  }

  function initNav() {
    var nav = document.getElementById('nav');
    var menuBtn = document.getElementById('menuBtn');
    var mobileMenu = document.getElementById('mobileMenu');
    var mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

    window.addEventListener('scroll', function () {
      if (window.scrollY > 80) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    });

    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', function () {
        menuBtn.classList.toggle('is-active');
        mobileMenu.classList.toggle('is-open');
        document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
      });

      mobileLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          menuBtn.classList.remove('is-active');
          mobileMenu.classList.remove('is-open');
          document.body.style.overflow = '';
        });
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id === '#') return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function initScoreToSceneSync() {
    var cards = document.querySelectorAll('.score__card');
    cards.forEach(function (card) {
      var bars = card.querySelectorAll('.score__bar');
      var isHovered = false;
      var animFrame = null;

      function animateBars() {
        if (!isHovered) return;
        bars.forEach(function (bar, i) {
          var time = Date.now() / 1000;
          var freq = 0.8 + (i * 0.15);
          var phase = i * 0.5;
          var scale = 1 + 0.2 * Math.sin(time * freq + phase);
          bar.style.transform = 'scaleY(' + scale + ')';
        });
        animFrame = requestAnimationFrame(animateBars);
      }

      card.addEventListener('mouseenter', function () {
        isHovered = true;
        animateBars();
      });

      card.addEventListener('mouseleave', function () {
        isHovered = false;
        if (animFrame) cancelAnimationFrame(animFrame);
        bars.forEach(function (bar) {
          bar.style.transform = 'scaleY(1)';
        });
      });
    });
  }

  function initHeroParallax() {
    var glows = document.querySelectorAll('.hero__glow');
    glows.forEach(function (g) {
      gsap.to(g, {
        yPercent: 25,
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    });
  }

  function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    var lenis = new Lenis({
      duration: 1.4,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    var reveals = document.querySelectorAll('[data-reveal]');
    reveals.forEach(function (el, i) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: function () {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: (i % 3) * 0.12,
            ease: 'power3.out',
            onStart: function () { el.classList.add('is-revealed'); },
          });
        },
      });
    });

    initHeroParallax();

    var statsNums = document.querySelectorAll('.about__stat-num');
    statsNums.forEach(function (el) {
      var target = parseInt(el.textContent, 10);
      if (isNaN(target)) return;
      el.textContent = '0';
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 2.2,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = Math.round(this.targets()[0].val);
            },
          });
        },
      });
    });

    var filmItems = document.querySelectorAll('.filmstrip__item');
    filmItems.forEach(function (item) {
      gsap.from(item, {
        x: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          once: true,
        },
      });
    });

    var bars = document.querySelectorAll('.score__bar');
    bars.forEach(function (bar) {
      var origH = bar.style.getPropertyValue('--h');
      ScrollTrigger.create({
        trigger: bar.closest('.score__card'),
        start: 'top 80%',
        once: true,
        onEnter: function () {
          gsap.fromTo(bar,
            { scaleY: 0 },
            { scaleY: 1, duration: 0.6, delay: Math.random() * 0.3, ease: 'power2.out' }
          );
        },
      });
    });

    initScoreToSceneSync();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initCursor();
    initMagnetic();
    initScrollProgress();
    initNav();
    hidePreloader();
  });
})();
