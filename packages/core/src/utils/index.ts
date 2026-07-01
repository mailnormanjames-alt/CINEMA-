import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initLenis() {
  // Lazy import - caller should install lenis
  return null;
}

export function initGSAP() {
  gsap.defaults({ ease: 'power2.out', duration: 0.6 });
  return { gsap, ScrollTrigger };
}