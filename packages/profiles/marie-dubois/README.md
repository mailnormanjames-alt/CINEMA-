# Marie Dubois — Director | Atelier Noir

> *"I don't make films. I make rooms you can't leave."*

## Filmmaker Summary

Marie Dubois is a Paris-based film director whose work lives in the space between memory and desire. Her cinematic language draws from Claire Denis and Chantal Akerman — intimate, nocturnal, quietly intense. She has directed 10 feature films, won 7 awards, and premiered at 5 international festivals.

## Experience Overview

A dark luxury cinematic portfolio that unfolds like a film screening. The experience moves through 7 narrative scenes — from an atmospheric Parisian alley hero to a haunting contact form — each beat choreographed to reveal Marie's artistic vision.

## Design Philosophy

**Archetype:** Intimate Storyteller  
**Vibe:** Claire Denis × Chantal Akerman × Paris nocturnal  
**World:** Paris editing suite at 3am  
**Promise:** Observer → Participant  

## Visual System

| Element | Value |
|---------|-------|
| Color Palette | Desaturated teal shadows, warm amber highlights |
| Film Stock | Kodak Vision3 500T |
| Grain | Fine 35mm |
| Lenses | Zeiss Master Primes |
| Lighting | Natural available light, high contrast |
| Color Grade | Teal-orange cinematic, muted midtones |
| Atmosphere | Quiet, melancholy, contemplative |

## Story Architecture (7 Scenes)

| Scene | Section | Rhythm |
|-------|---------|--------|
| I — Invitation | Hero (Cinematic Frame) | Reveal |
| II — Vision | Statement (Character Reveal) | Pause |
| III — Work | Filmstrip Gallery | Accelerate |
| IV — Process | Script-to-Screen Reveal | Breathe |
| V — Craft | About (Split Layout) | Seduce |
| VI — Transformation | Services + Work | Expand |
| VII — Connection | Stats + Contact + Footer | Reflect |

## Motion Doctrine

- **Hero:** Cinematic Frame — 100ms entrance delay, transform+opacity only, cursor reactivity
- **Scroll:** Lenis flowing personality (lerp 0.07, duration 1.6s)
- **Transitions:** Cinema Dissolve
- **Gallery:** Filmstrip horizontal scroll with sprocket decoration
- **Signature:** Script-to-Screen Reveal — screenplay text transforms into cinematic frames

## Signature Interaction

**Script-to-Screen Reveal** — A screenplay excerpt appears line-by-line, character-by-character, synced to scroll. As the reader reaches the midpoint, a cinematic frame emerges through a clip-path reveal, replacing the script with the image. The line number counter increments. The text fades. The image takes over.

## Technical Stack

- `@cinema-sotd/core` — 12 cinematic components (auto-init)
- GSAP 3.12.5 + ScrollTrigger
- Lenis smooth scroll (flowing personality)
- SplitType for editorial typography
- Three.js WebGL ambient particles
- CSS custom properties design system

## Profile Structure

```
marie-dubois/
├── index.html                    ← Entry point (uses core auto-init)
├── package.json                  ← @cinema-sotd/profile-marie-dubois
├── README.md                     ← This file
├── IMAGE-PROMPTS.txt             ← Full image generation prompts
├── src/
│   ├── components/
│   │   └── ScriptToScreenReveal.js  ← Signature interaction
│   ├── styles/
│   │   └── marie-dubois.css      ← All profile styles
│   ├── content/
│   │   └── dna.json              ← Project DNA
│   └── init.js                   ← Profile initialization
├── assets/
│   ├── images/hero/
│   ├── images/gallery/
│   └── images/portraits/
├── documentation/
│   └── animation-guide.md
└── deployment/
    └── hosting-guide.md
```

## Installation

```bash
cd cinema-sotd
pnpm install
cd packages/profiles/marie-dubois
pnpm dev
```

## Deployment

Designed for static hosting (Vercel, Netlify, Cloudflare Pages). No server required.

## Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 90+ |
| Desktop FPS | 60fps |
| Mobile FPS | 45–60fps |
| LCP | < 2.5s |
| CLS | < 0.1 |

## Credits

- **Director:** Marie Dubois
- **Studio:** Atelier Noir, Paris
- **Built with:** @cinema-sotd/core
- **License:** MIT
