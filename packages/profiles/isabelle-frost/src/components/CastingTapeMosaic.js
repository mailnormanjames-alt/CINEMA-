export default class CastingTapeMosaic {
  constructor(container) {
    this.container = container;
    this.tapes = container.querySelectorAll('.casting-tape');
    this.activeIndex = -1;

    this.tapes.forEach((tape, i) => {
      this.initTape(tape, i);
    });
  }

  initTape(tape, index) {
    const reel = tape.querySelector('.casting-tape__reel');
    const info = tape.querySelector('.casting-tape__info');

    tape.addEventListener('mouseenter', () => {
      this.activeIndex = index;
      tape.classList.add('is-active');

      gsap.to(tape, {
        scale: 1.02,
        duration: 0.5,
        ease: 'power3.out',
      });

      if (reel) {
        gsap.to(reel, {
          rotationY: 5,
          rotationX: -3,
          duration: 0.6,
          ease: 'power2.out',
        });
      }

      if (info) {
        gsap.to(info, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      }

      this.tapes.forEach((t, i) => {
        if (i !== index) {
          gsap.to(t, {
            opacity: 0.5,
            scale: 0.98,
            duration: 0.4,
            ease: 'power2.out',
          });
        }
      });
    });

    tape.addEventListener('mouseleave', () => {
      this.activeIndex = -1;
      tape.classList.remove('is-active');

      gsap.to(tape, {
        scale: 1,
        duration: 0.5,
        ease: 'power3.out',
      });

      if (reel) {
        gsap.to(reel, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      }

      if (info) {
        gsap.to(info, {
          y: 10,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      this.tapes.forEach((t) => {
        gsap.to(t, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      });
    });

    tape.addEventListener('mousemove', (e) => {
      const rect = tape.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      if (reel) {
        gsap.to(reel, {
          rotationY: x * 8,
          rotationX: -y * 5,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });

    gsap.from(tape, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: tape,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  }
}
