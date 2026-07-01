(function () {
  'use strict';

  var lenis = new Lenis({ duration: 1.0, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, orientation: 'vertical', smoothWheel: true });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  var preloaderEl = document.getElementById('preloader');
  if (!preloaderEl) { initSite(); return; }

  var timecodeEl = document.getElementById('preloaderTimecode');
  var statusEl = document.getElementById('preloaderStatus');
  var barFill = document.getElementById('preloaderBarFill');
  var cuts = preloaderEl.querySelectorAll('.preloader-cut');

  cuts.forEach(function (cut, i) {
    gsap.to(cut, { scaleY: 1, duration: 0.3, delay: i * 0.08, ease: 'power2.out' });
  });

  if (barFill) gsap.to(barFill, { width: '100%', duration: 2.5, ease: 'power2.inOut', delay: 0.4 });

  if (timecodeEl) {
    gsap.to({ val: 0 }, {
      val: 9000, duration: 2.5, ease: 'power2.inOut', delay: 0.4,
      onUpdate: function () {
        var v = Math.round(this.targets()[0].val);
        var f = v % 24;
        var s = Math.floor(v / 24) % 60;
        var m = Math.floor(v / 1440) % 60;
        var h = Math.floor(v / 86400);
        timecodeEl.textContent = pad(h) + ':' + pad(m) + ':' + pad(s) + ':' + pad(f);
      },
      onComplete: function () {
        if (statusEl) statusEl.textContent = 'READY';
        gsap.to(preloaderEl, { yPercent: -100, duration: 1.2, ease: 'power4.inOut', onComplete: initSite });
      }
    });
  } else {
    gsap.to(preloaderEl, { yPercent: -100, duration: 1.2, ease: 'power4.inOut', onComplete: initSite });
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function initSite() {
    gsap.registerPlugin(ScrollTrigger);

    var heroTcEl = document.getElementById('heroTimecode');
    if (heroTcEl) {
      gsap.to({ val: 0 }, {
        val: 7200, duration: 4, ease: 'none', repeat: -1,
        onUpdate: function () {
          var v = Math.round(this.targets()[0].val) % 7200;
          var f = v % 24;
          var s = Math.floor(v / 24) % 60;
          var m = Math.floor(v / 1440) % 60;
          var h = Math.floor(v / 86400);
          heroTcEl.textContent = pad(h) + ':' + pad(m) + ':' + pad(s) + ':' + pad(f);
        }
      });
    }

    var navTcEl = document.getElementById('navTimecode');
    if (navTcEl) {
      gsap.to({ val: 0 }, {
        val: 3600, duration: 3, ease: 'none', repeat: -1,
        onUpdate: function () {
          var v = Math.round(this.targets()[0].val) % 3600;
          var s = Math.floor(v / 24) % 60;
          var m = Math.floor(v / 1440) % 60;
          var h = Math.floor(v / 86400);
          navTcEl.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
        }
      });
    }

    var mobileTcEl = document.getElementById('mobileTimecode');
    if (mobileTcEl) {
      gsap.to({ val: 0 }, {
        val: 3600, duration: 3, ease: 'none', repeat: -1,
        onUpdate: function () {
          var v = Math.round(this.targets()[0].val) % 3600;
          var s = Math.floor(v / 24) % 60;
          var m = Math.floor(v / 1440) % 60;
          var h = Math.floor(v / 86400);
          mobileTcEl.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
        }
      });
    }

    var hero = document.querySelector('.hero');
    if (hero) {
      gsap.to(hero.querySelector('.hero-image'), {
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        y: 100, scale: 1.05
      });
      var words = hero.querySelectorAll('.hero-title .word');
      gsap.fromTo(words, { y: '110%', opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15, delay: 0.3, ease: 'power4.out' });
      var metaItems = hero.querySelectorAll('.hero-meta-item');
      gsap.fromTo(metaItems, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, delay: 1.2, ease: 'power3.out' });
      gsap.to('.hero-scroll-cue', { opacity: 1, duration: 0.6, delay: 1.5 });

      var playhead = document.getElementById('heroPlayhead');
      if (playhead) {
        gsap.to(playhead, { yPercent: 100, scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      }
    }

    var philosophyQuote = document.getElementById('philosophyQuote');
    if (philosophyQuote) {
      gsap.fromTo(philosophyQuote, { opacity: 0, y: 40 }, {
        scrollTrigger: { trigger: '.philosophy', start: 'top 70%', end: 'top 30%', scrub: 1 },
        opacity: 1, y: 0
      });
    }

    var cutBars = document.querySelectorAll('.cut-rhythm-bar');
    if (cutBars.length) {
      var playheadEl = document.querySelector('.cut-rhythm-playhead');
      cutBars.forEach(function (bar, i) {
        var segments = bar.querySelectorAll('.cut-rhythm-segment');
        var cutsInner = bar.querySelectorAll('.cut-rhythm-cut');
        gsap.fromTo(bar, { opacity: 0, x: -40 }, {
          scrollTrigger: { trigger: bar, start: 'top 85%', toggleActions: 'play none none none' },
          opacity: 1, x: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out'
        });
        gsap.fromTo(segments, { scaleX: 0 }, {
          scrollTrigger: { trigger: bar, start: 'top 85%', toggleActions: 'play none none none' },
          scaleX: 1, duration: 0.6, stagger: 0.05, delay: i * 0.15 + 0.3, ease: 'power2.out', transformOrigin: 'left center'
        });
        gsap.fromTo(cutsInner, { scaleY: 0 }, {
          scrollTrigger: { trigger: bar, start: 'top 85%', toggleActions: 'play none none none' },
          scaleY: 1, duration: 0.3, stagger: 0.05, delay: i * 0.15 + 0.5, ease: 'power2.out', transformOrigin: 'center center'
        });
      });
      if (playheadEl) {
        gsap.to(playheadEl, {
          opacity: 0.6,
          left: '100%',
          scrollTrigger: { trigger: '.cut-rhythm-timeline', start: 'top 70%', end: 'bottom 30%', scrub: true }
        });
      }
    }

    gsap.utils.toArray('.filmstrip-item').forEach(function (item, i) {
      gsap.fromTo(item, { opacity: 0, y: 60 }, {
        scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' },
        opacity: 1, y: 0, duration: 0.9, delay: i * 0.12, ease: 'power3.out'
      });
    });

    var aboutTitleWords = document.querySelectorAll('.about-title .word');
    if (aboutTitleWords.length) {
      gsap.fromTo(aboutTitleWords, { y: 60, opacity: 0 }, {
        scrollTrigger: { trigger: '.about', start: 'top 65%', toggleActions: 'play none none none' },
        y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out'
      });
    }

    gsap.utils.toArray('.about-stat-num').forEach(function (numEl) {
      var countTo = parseInt(numEl.getAttribute('data-count'), 10);
      gsap.fromTo(numEl, { textContent: '0' }, {
        scrollTrigger: { trigger: numEl, start: 'top 85%', toggleActions: 'play none none none' },
        textContent: countTo, duration: 2, ease: 'power2.out',
        snap: { textContent: 1 }
      });
    });

    gsap.utils.toArray('.service-row').forEach(function (row, i) {
      gsap.fromTo(row, { opacity: 0, x: -30 }, {
        scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none none' },
        opacity: 1, x: 0, duration: 0.7, delay: i * 0.08, ease: 'power3.out'
      });
    });

    var contactWords = document.querySelectorAll('.contact-title .word');
    if (contactWords.length) {
      gsap.fromTo(contactWords, { y: 80, opacity: 0 }, {
        scrollTrigger: { trigger: '.contact', start: 'top 65%', toggleActions: 'play none none none' },
        y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out'
      });
    }

    var navCutMarkers = document.querySelectorAll('.nav-cut-marker');
    var navLinks = document.querySelectorAll('.nav-link');
    var sections = ['philosophy', 'cut-rhythm', 'filmstrip', 'about', 'services', 'contact'];
    sections.forEach(function (id, i) {
      var section = document.getElementById(id);
      if (!section) return;
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: function () { setActiveNav(i); },
        onEnterBack: function () { setActiveNav(i); }
      });
    });

    function setActiveNav(index) {
      navCutMarkers.forEach(function (m, i) {
        m.style.background = i === index ? 'var(--accent)' : 'var(--text-muted)';
        m.style.opacity = i === index ? '1' : '0.4';
        m.style.height = i === index ? '4px' : '100%';
      });
      navLinks.forEach(function (l, i) {
        l.style.color = i === index ? 'var(--accent)' : '';
      });
    }

    var cursor = document.getElementById('cursor');
    var cursorText = document.getElementById('cursorText');
    var mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    document.addEventListener('mousemove', function (e) { mouseX = e.clientX; mouseY = e.clientY; });

    function updateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      if (cursor) cursor.style.transform = 'translate(' + cursorX + 'px, ' + cursorY + 'px)';
      if (cursorText) { cursorText.style.left = (mouseX + 20) + 'px'; cursorText.style.top = (mouseY - 10) + 'px'; }
      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    document.querySelectorAll('[data-cursor="pointer"]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-pointer'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-pointer'); });
    });
    document.querySelectorAll('[data-cursor="view"]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-view'); if (cursorText) cursorText.textContent = 'VIEW'; });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-view'); if (cursorText) cursorText.textContent = ''; });
    });

    document.querySelectorAll('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - rect.left - rect.width / 2) * 0.3, y: (e.clientY - rect.top - rect.height / 2) * 0.3, duration: 0.3, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      });
    });

    var progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
      lenis.on('scroll', function (e) {
        var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = maxScroll > 0 ? (e.animatedScroll / maxScroll) * 100 + '%' : '0%';
      });
    }

    var menuBtn = document.getElementById('menuBtn');
    var mobileMenu = document.getElementById('mobileMenu');
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', function () {
        document.body.classList.toggle('menu-open');
      });
      mobileMenu.querySelectorAll('.mobile-menu-link').forEach(function (link) {
        link.addEventListener('click', function () {
          document.body.classList.remove('menu-open');
        });
      });
    }

    ScrollTrigger.refresh();
  }
})();
