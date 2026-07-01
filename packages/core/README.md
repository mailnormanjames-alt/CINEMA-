# @cinema-sotd/core

Cinematic component library for filmmaker portfolio experiences.

## Architecture

```
packages/core/
├── package.json
├── README.md
└── src/
    ├── index.js          ← Entry point
    ├── init.js           ← Auto-init (scans DOM)
    ├── components/
    │   ├── HeroSystem.js        ← 5 hero architectures
    │   ├── ScrollChoreography.js ← 7-scene rhythm
    │   ├── FilmstripGallery.js  ← 5 gallery types
    │   ├── Preloader.js         ← Loading sequence
    │   ├── CustomCursor.js      ← Dot + ring cursor
    │   ├── MagneticHover.js     ← Magnetic pull
    │   ├── NoiseOverlay.js      ← Film grain
    │   ├── WebGLAmbient.js      ← Particle system
    │   ├── ScrollProgress.js    ← Progress bar
    │   ├── LenisSmooth.js       ← Smooth scroll
    │   ├── SplitReveal.js       ← Text reveals
    │   └── CounterAnimation.js  ← Number counters
    └── styles/
        └── cinema-core.css      ← Design system
```

## HeroSystem — 5 Architectures

| Type | Purpose | Emotions |
|------|---------|----------|
| `film-opening` | Cinematic pacing, slow reveals, minimal UI | Excitement · Prestige · Wonder |
| `directors-chair` | Portrait focus, editorial confidence | Trust · Respect · Admiration |
| `cinematic-frame` | Filmic composition, atmospheric motion | Wonder · Awe · Immersion |
| `bts-invitation` | Process imagery, raw authenticity | Intimacy · Trust · Curiosity |
| `tech-spec-sheet` | Equipment focus, detail emphasis | Respect · Fascination · Trust |

### Usage

```js
import { HeroSystem } from '@cinema-sotd/core';

new HeroSystem(document.querySelector('[data-cinema-hero="cinematic-frame"]'), {
  type: 'cinematic-frame',
  accent: '#C9A96E'
});
```

### HTML

```html
<section data-cinema-hero="cinematic-frame">
  <div class="hero-image"><img src="hero.jpg" alt=""></div>
  <div class="hero-content">
    <div class="hero-eyebrow">...</div>
    <h1 class="hero-title">
      <span class="line"><span class="word">Marie</span></span>
      <span class="line"><span class="word"><em>Dubois</em></span></span>
    </h1>
    <div class="hero-meta">...</div>
  </div>
  <div class="hero-scroll-cue">...</div>
</section>
```

## ScrollChoreography — 7-Scene Rhythm

```
Reveal → Pause → Accelerate → Breathe → Seduce → Expand → Reflect
```

### Usage

```js
import { ScrollChoreography } from '@cinema-sotd/core';

new ScrollChoreography(document.querySelector('[data-cinema-choreography]'), {
  onSceneEnter: (index, section) => console.log(`Scene ${index} entered`),
  rhythm: [
    { name: 'reveal', duration: 1.2, ease: 'power3.out' },
    // ...
  ]
});
```

## FilmstripGallery — 5 Gallery Types

| Type | Character | When to Use |
|------|-----------|-------------|
| `film-stills` | Cinematic frames, sequential | Primary work showcase |
| `contact-sheets` | Process transparency, raw | BTS / craft sections |
| `bts` | Humanity, authenticity | Behind-the-scenes |
| `scene-stills` | Emotional beats, key moments | Film deep-dives |
| `mood-boards` | Visual influences | Vision sections |

## Auto-Init

```html
<script type="module">
  import { initAllComponents } from '@cinema-sotd/core';
  initAllComponents({ accent: '#C9A96E' });
</script>
```

## Peer Dependencies

- GSAP 3.12+
- Lenis 1.1+
- SplitType 1.0+
- Three.js r128+

## License

MIT
