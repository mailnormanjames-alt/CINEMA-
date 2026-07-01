// ============================================
// @cinema-sotd/core — Auto-Init
// Scans DOM for [data-cinema-*] attributes and boots components
// ============================================

import { HeroSystem } from './components/HeroSystem.js';
import { ScrollChoreography } from './components/ScrollChoreography.js';
import { FilmstripGallery } from './components/FilmstripGallery.js';
import { Preloader } from './components/Preloader.js';
import { CustomCursor } from './components/CustomCursor.js';
import { MagneticHover } from './components/MagneticHover.js';
import { NoiseOverlay } from './components/NoiseOverlay.js';
import { WebGLAmbient } from './components/WebGLAmbient.js';
import { ScrollProgress } from './components/ScrollProgress.js';
import { LenisSmooth } from './components/LenisSmooth.js';
import { SplitReveal } from './components/SplitReveal.js';
import { CounterAnimation } from './components/CounterAnimation.js';

/**
 * Initialize all cinema-sotd components found in the DOM.
 * Call this after DOMContentLoaded or at end of <body>.
 *
 * @param {Object} config — Optional overrides { accent, fontFamily, ... }
 * @returns {Object} — All instantiated component references
 */
export function initAllComponents(config = {}) {
  const instances = {};

  // Smooth scroll
  const lenisEl = document.querySelector('[data-cinema-lenis]');
  if (lenisEl || config.lenis !== false) {
    instances.lenis = new LenisSmooth(config.lenis);
  }

  // Noise overlay
  if (document.querySelector('[data-cinema-noise]') || config.noise !== false) {
    instances.noise = new NoiseOverlay(config.noise);
  }

  // Scroll progress
  if (document.querySelector('[data-cinema-progress]') || config.progress !== false) {
    instances.progress = new ScrollProgress(config.progress);
  }

  // Custom cursor
  if (document.querySelector('[data-cinema-cursor]') || config.cursor !== false) {
    instances.cursor = new CustomCursor(config.cursor);
  }

  // Magnetic hover
  document.querySelectorAll('[data-cinema-magnetic]').forEach(el => {
    MagneticHover.init(el);
  });

  // Preloader
  const preloaderEl = document.querySelector('[data-cinema-preloader]');
  if (preloaderEl) {
    instances.preloader = new Preloader(preloaderEl, {
      ...config.preloader,
      onComplete: () => {
        // Boot all deferred components
        bootDeferredComponents(config, instances);
      }
    });
  } else {
    // No preloader — boot immediately
    bootDeferredComponents(config, instances);
  }

  return instances;
}

function bootDeferredComponents(config, instances) {
  // Hero system
  document.querySelectorAll('[data-cinema-hero]').forEach(el => {
    const type = el.dataset.cinemaHero || 'cinematic-frame';
    instances.hero = new HeroSystem(el, { type, ...config.hero });
  });

  // Scroll choreography
  document.querySelectorAll('[data-cinema-choreography]').forEach(el => {
    instances.choreography = new ScrollChoreography(el, config.choreography);
  });

  // Filmstrip gallery
  document.querySelectorAll('[data-cinema-gallery]').forEach(el => {
    const type = el.dataset.cinemaGallery || 'film-stills';
    instances.gallery = new FilmstripGallery(el, { type, ...config.gallery });
  });

  // Split reveals
  document.querySelectorAll('[data-cinema-split-reveal]').forEach(el => {
    SplitReveal.init(el, config.splitReveal);
  });

  // Counter animations
  document.querySelectorAll('[data-cinema-counter]').forEach(el => {
    CounterAnimation.init(el);
  });

  // WebGL ambient
  const canvas = document.querySelector('[data-cinema-webgl]');
  if (canvas || config.webgl !== false) {
    instances.webgl = new WebGLAmbient(canvas, config.webgl);
  }

  // Refresh ScrollTrigger after everything is laid out
  if (window.ScrollTrigger) {
    setTimeout(() => ScrollTrigger.refresh(), 100);
  }
}
