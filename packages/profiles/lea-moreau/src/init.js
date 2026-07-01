(() => {
    'use strict';

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    // ─── PRELOADER ───
    const preloader = $('#preloader');
    const lines = $$('.preloader__line');
    const progressBar = $('.preloader__progress-bar');
    let preloaderDone = false;

    function runPreloader() {
        let i = 0;
        const total = lines.length;
        const interval = setInterval(() => {
            if (i < total) {
                lines[i].classList.add('visible');
                progressBar.style.width = ((i + 1) / total * 100) + '%';
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    preloader.classList.add('hidden');
                    preloaderDone = true;
                    document.body.style.overflow = '';
                    initAnimations();
                }, 600);
            }
        }, 280);
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('load', () => {
        setTimeout(runPreloader, 300);
    });

    // ─── LENIS SMOOTH SCROLL ───
    let lenis;
    try {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    } catch (e) {
        console.warn('Lenis not available');
    }

    // ─── NAV SCROLL STATE ───
    const nav = $('#nav');
    const scrollProgress = $('#scrollProgress');
    const sceneNumber = $('#sceneNumber');

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        nav.classList.toggle('scrolled', y > 80);
        scrollProgress.classList.toggle('visible', y > 400);

        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = Math.min(y / docHeight, 1);
        const scene = Math.floor(pct * 12) + 1;
        if (sceneNumber) sceneNumber.textContent = scene;

        const bar = $('.scroll-progress__bar');
        if (bar) bar.style.setProperty('--progress', (pct * 100) + '%');
    });

    // ─── MOBILE MENU ───
    const menuBtn = $('#menuBtn');
    const menuClose = $('#menuClose');
    const mobileMenu = $('#mobileMenu');

    function openMenu() {
        mobileMenu.classList.add('open');
        menuBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.remove('open');
        menuBtn.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);

    $$('.mobile-menu__act').forEach(a => {
        a.addEventListener('click', () => {
            closeMenu();
        });
    });

    // ─── CURSOR ───
    const cursor = $('#cursor');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        if (cursor) {
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        }
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    const hoverElements = $$('a, button, .script-card, .service, .filmstrip__frame');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hovering'));
    });

    // ─── MAGNETIC HOVER ───
    const magneticEls = $$('.nav__cta, .contact__submit');
    magneticEls.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(el, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });

    // ─── GSAP ANIMATIONS ───
    function initAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Hero entrance
        const heroTl = gsap.timeline({ delay: 0.3 });
        heroTl
            .from('.hero__scene-number', { opacity: 0, y: 10, duration: 0.6 })
            .from('.hero__slugline', { opacity: 0, y: 10, duration: 0.6 }, '-=0.3')
            .from('.hero__action-line', { opacity: 0, y: 10, duration: 0.6 }, '-=0.3')
            .from('.hero__title-line--1', { opacity: 0, y: 30, duration: 0.8 }, '-=0.2')
            .from('.hero__title-line--2', { opacity: 0, y: 30, duration: 0.8 }, '-=0.5')
            .from('.hero__character-name', { opacity: 0, duration: 0.4 }, '-=0.3')
            .from('.hero__dialogue', { opacity: 0, duration: 0.4 }, '-=0.2')
            .from('.hero__dialogue-text', { opacity: 0, y: 10, duration: 0.6 }, '-=0.2')
            .from('.hero__footer > *', { opacity: 0, y: 10, duration: 0.5, stagger: 0.1 }, '-=0.3');

        // Voice section
        gsap.utils.toArray('.voice__line').forEach((line, i) => {
            gsap.to(line, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: i * 0.15,
                scrollTrigger: {
                    trigger: line,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Script cards
        gsap.utils.toArray('.script-card').forEach((card, i) => {
            gsap.from(card, {
                opacity: 0,
                y: 40,
                duration: 0.8,
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Filmstrip
        gsap.from('.filmstrip__frame', {
            opacity: 0,
            y: 30,
            stagger: 0.15,
            duration: 0.8,
            scrollTrigger: {
                trigger: '.filmstrip__reel',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        // About
        gsap.from('.about__name', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            scrollTrigger: {
                trigger: '.about__name',
                start: 'top 85%'
            }
        });

        gsap.from('.about__bio-text p', {
            opacity: 0,
            y: 15,
            stagger: 0.15,
            duration: 0.6,
            scrollTrigger: {
                trigger: '.about__bio-text',
                start: 'top 80%'
            }
        });

        gsap.from('.about__detail-group', {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.6,
            scrollTrigger: {
                trigger: '.about__details',
                start: 'top 80%'
            }
        });

        // Services
        gsap.from('.service', {
            opacity: 0,
            y: 30,
            stagger: 0.1,
            duration: 0.6,
            scrollTrigger: {
                trigger: '.services__grid',
                start: 'top 80%'
            }
        });

        // Contact
        gsap.from('.contact__title', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            scrollTrigger: {
                trigger: '.contact__title',
                start: 'top 85%'
            }
        });

        gsap.from('.contact__form > *', {
            opacity: 0,
            y: 15,
            stagger: 0.08,
            duration: 0.5,
            scrollTrigger: {
                trigger: '.contact__form',
                start: 'top 80%'
            }
        });

        // Footer
        gsap.from('.footer__credits-line', {
            opacity: 0,
            x: -20,
            stagger: 0.1,
            duration: 0.6,
            scrollTrigger: {
                trigger: '.footer__top',
                start: 'top 90%'
            }
        });

        gsap.from('.footer__logo', {
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            scrollTrigger: {
                trigger: '.footer__middle',
                start: 'top 90%'
            }
        });
    }

    // ─── SCRIPT BEATS TYPEWRITER ───
    const scriptCards = $$('.script-card');
    scriptCards.forEach(card => {
        const beat = $('.script-card__beat', card);
        if (!beat) return;

        const sceneEl = $('.script-card__scene', beat);
        const actionEl = $('.script-card__action', beat);
        const dialogueEl = $('.script-card__dialogue', beat);

        const sceneText = sceneEl ? sceneEl.textContent : '';
        const actionText = actionEl ? actionEl.textContent : '';
        const dialogueText = dialogueEl ? dialogueEl.textContent : '';

        let typed = false;

        card.addEventListener('mouseenter', () => {
            if (typed) return;
            typed = true;

            if (sceneEl) sceneEl.textContent = '';
            if (actionEl) actionEl.textContent = '';
            if (dialogueEl) dialogueEl.textContent = '';

            let charIndex = 0;
            const fullText = sceneText + actionText + dialogueText;
            const elements = [
                { el: sceneEl, text: sceneText },
                { el: actionEl, text: actionText },
                { el: dialogueEl, text: dialogueText }
            ];

            let elIndex = 0;
            let elCharIndex = 0;

            function typeChar() {
                if (elIndex >= elements.length) return;

                const current = elements[elIndex];
                if (elCharIndex < current.text.length) {
                    current.el.textContent += current.text[elCharIndex];
                    elCharIndex++;
                    setTimeout(typeChar, 15 + Math.random() * 20);
                } else {
                    elIndex++;
                    elCharIndex = 0;
                    if (elIndex < elements.length) {
                        setTimeout(typeChar, 50);
                    }
                }
            }

            typeChar();
        });
    });

    // ─── SMOOTH ANCHOR SCROLL ───
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = $(anchor.getAttribute('href'));
            if (target && lenis) {
                lenis.scrollTo(target, { offset: -80 });
            } else if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ─── CONTACT FORM ───
    const contactForm = $('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = $('.contact__submit', contactForm);
            const originalText = $('.contact__submit-text', btn).textContent;
            $('.contact__submit-text', btn).textContent = 'Draft Sent';
            btn.style.background = 'var(--color-sage)';
            setTimeout(() => {
                $('.contact__submit-text', btn).textContent = originalText;
                btn.style.background = '';
                contactForm.reset();
            }, 2500);
        });
    }

    // ─── PARALLAX ON HERO ───
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        const hero = $('.hero__paper');
        if (hero && y < window.innerHeight) {
            hero.style.transform = `translateY(${y * 0.08}px)`;
        }
    });

    // ─── SCROLL PROGRESS BAR FILL ───
    const progressFill = $('.scroll-progress__bar');
    if (progressFill) {
        window.addEventListener('scroll', () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = Math.min(window.scrollY / docHeight, 1);
            progressFill.style.background = `linear-gradient(to top, var(--color-sage) ${pct * 100}%, var(--color-margin) ${pct * 100}%)`;
        });
    }

})();