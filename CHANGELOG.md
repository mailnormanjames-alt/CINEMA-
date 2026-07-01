# Changelog

All notable changes to this project will be documented in this file.

## [v1.6.0] — 2026-07-01

### Removed — "Atelier Noir" branding
All instances of "Atelier Noir" removed from all 10 profiles. Replaced with unique brand names per profile:
- Marie Dubois → "Dubois"
- Thomas Renard → "Renard Production"
- Kofi Mensah → "Mensah Lens"
- Léa Moreau → "Moreau Scripts"
- Yuki Tanaka → "Tanaka Design"
- Clara Voss → "Voss Edit"
- Amin Hassani → "Sonic Architecture"
- Isabelle Frost → "Frost Casting"
- Rafael Santos → "Santos Compositions"
- Nadia Okafor → "Okafor Costume"

## [v1.5.0] — 2026-07-01

### Fixed — Placeholder Images
- `packages/profiles/thomas-renard/` — Replaced broken `<img>` references with CSS gradient backgrounds (neutral/blue/technical palette)
- `packages/profiles/kofi-mensah/` — Replaced broken `<img>` references with CSS gradient backgrounds (warm/golden palette)
- `packages/profiles/clara-voss/` — Replaced broken `<img>` references with CSS gradient backgrounds (clinical/black/white palette)

### Rewritten — Creative Content
- `packages/profiles/thomas-renard/` — New philosophy quote, approach bio with grandfather's textile factory story, unique film "Les Lumières de Lyon" (was duplicate "Nuit Blanche")
- `packages/profiles/clara-voss/` — New philosophy quote, about bio with Avid editing origin story, unique contact headline
- `packages/profiles/amin-hassani/` — New philosophy quote, about bio with father's radio repair shop story, removed overwritten "cathedral of emotion" language
- `packages/profiles/isabelle-frost/` — New philosophy section, about bio with New York casting assistant origin, unique contact headline "The reading room is open"
- `packages/profiles/yuki-tanaka/` — Removed "Born in Tokyo, trained in architecture" template opening
- `packages/profiles/rafael-santos/` — Removed "Born in the echo" template opening
- `packages/profiles/nadia-okafor/` — Removed "Born in Lagos, trained at RCA" template opening, new sensory details

### What Was Fixed
- Eliminated "Nuit Blanche" duplication between Marie Dubois and Thomas Renard
- Eliminated "Born in Lyon" appearing in 3 profiles
- Broke the "I don't [X]. I [poetic rephrasing]" quote template pattern
- Each profile now has unique bio structure and voice
- Film titles verified unique across all profiles

## [v1.4.0] — 2026-07-01

### Rebuilt — Full Profile Differentiation (9 profiles)
All 9 profiles (excluding Marie Dubois) completely rebuilt with unique HTML structure, CSS, and init.js per GRANDMASTER rules. Each profile is now a standalone, hand-built world.

- `packages/profiles/thomas-renard/` — **Producer / Technical Master**: Tech spec sheet hero, grid overlay, equipment cards with hover lines, blueprint preloader, IBM Plex Mono + Space Grotesk, neutral/clean palette, TheWorkshop footer
- `packages/profiles/kofi-mensah/` — **Cinematographer / Technical Master**: Cinematic frame hero with light leak, aperture preloader, lens cards with ring animation, Cormorant Garamond + JetBrains Mono, warm/golden palette, floating glass nav, TheCredits footer
- `packages/profiles/lea-moreau/` — **Screenwriter / Artistic Auteur**: Manuscript page hero with paper texture, typewriter preloader, script beats interaction, Courier Prime + DM Serif Display + Source Serif 4, sage green palette, editorial nav with act numbering, TheCredits footer
- `packages/profiles/yuki-tanaka/` — **Production Designer / Artistic Auteur**: Blueprint grid hero with architectural axes, coordinate preloader, space construction interaction, DM Sans + Instrument Serif + Space Mono, muted stone palette, grid-based nav, TheWorkshop footer
- `packages/profiles/clara-voss/` — **Editor / Technical Master**: Timeline interface hero with timecodes, cut/splice preloader with vertical lines, cut rhythm interaction, Bebas Neue + IBM Plex Sans + IBM Plex Mono, clinical white palette, timeline-bar nav, TheWorkshop footer
- `packages/profiles/amin-hassani/` — **Sound Designer / Technical Master**: Tech spec sheet hero with VU meters, waveform preloader, frequency spectrum canvas interaction, DM Sans + Instrument Serif + Space Mono, deep charcoal/amber palette, VU bar nav accent, TheWorkshop footer
- `packages/profiles/isabelle-frost/` — **Casting Director / Intimate Storyteller**: Director's chair hero with reading room feel, page-turn preloader, casting tape mosaic interaction, DM Serif Display + Source Serif 4 + DM Sans, warm cream/tan palette, reading room nav, ThePremiere footer
- `packages/profiles/rafael-santos/` — **Composer / Artistic Auteur**: Concert hall hero with spotlight glows, musical score preloader with staff lines, score-to-scene sync interaction, Playfair Display + DM Sans + JetBrains Mono, orchestra red/oak palette, score-style nav, TheFestival footer
- `packages/profiles/nadia-okafor/` — **Costume Designer / Artistic Auteur**: Wardrobe room hero with floating racks, fabric swatch preloader, geometric reveal interaction, DM Serif Display + DM Sans + JetBrains Mono, rich silk palette, textile-inspired nav, TheWorkshop footer

### What Changed Per Profile
- **HTML**: Completely rewritten with unique preloader, nav, hero, section order, and footer
- **CSS**: Unique color palette, typography, layout patterns, and component styles
- **init.js**: Self-contained with inline preloader, unique animations, no @cinema-sotd/core imports
- **Components**: New signature interaction components where applicable (FrequencySpectrum, CastingTapeMosaic, GeometricReveal)

### Philosophy
- Each profile now expresses its DNA through structure, not just color
- No shared HTML templates between profiles
- Each is a standalone world per GRANDMASTER rule: "Each project is a standalone, hand-built world"

## [v1.3.0] — 2026-07-01

### Fixed
- `packages/profiles/*/index.html` — Footer updated across all 10 profiles: `© Norman James` / `made with ❤️ by Empathy Studio` (red heart `#e53e3e`)
- `packages/profiles/*/dist/index.html` — Footer updated in 9 dist folders (20 files total)
- `packages/profiles/amin-hassani/src/init.js` — Removed `@cinema-sotd/core` imports, added inline preloader boot sequence (fixes blank screen after preloader)
- `packages/profiles/nadia-okafor/src/init.js` — Removed `@cinema-sotd/core` imports, added inline preloader boot sequence (fixes blank screen after preloader)
- `packages/profiles/thomas-renard/src/init.js` — Removed `@cinema-sotd/core` imports, added inline preloader (fixed in prior session)
- `packages/profiles/kofi-mensah/src/init.js` — Removed `@cinema-sotd/core` imports, added inline preloader (fixed in prior session)
- `packages/profiles/lea-moreau/src/init.js` — Removed `@cinema-sotd/core` imports, added inline preloader (fixed in prior session)
- `packages/profiles/yuki-tanaka/src/init.js` — Removed `@cinema-sotd/core` imports, added inline preloader (fixed in prior session)
- `packages/profiles/clara-voss/src/init.js` — Removed `@cinema-sotd/core` imports, added inline preloader (fixed in prior session)

### Verified
- `packages/profiles/isabelle-frost/src/init.js` — Already self-contained (no core imports), no fix needed
- `packages/profiles/rafael-santos/src/init.js` — Already self-contained (no core imports), no fix needed

### Root Cause
- `packages/core/src/components/Preloader/index.ts` imports `gsap` as ES module, but GSAP is loaded via CDN `<script>` tags in HTML, not as an npm module → Vite cannot resolve the import → blank screen after preloader

## [v1.2.0] — 2026-06-28

### Added
- `cinema-sotd/packages/profiles/marie-dubois/src/styles/marie-dubois.css` — Creative upgrade: new color palette (#050505/#d4a853), Playfair Display + DM Sans + Caveat fonts, refined spacing/motion
- `cinema-sotd/packages/profiles/marie-dubois/index.html` — Updated Google Fonts link, theme-color, nav/footer font references
- `cinema-sotd/packages/profiles/thomas-renard/` — Full profile build: "Blueprint Precision" visual identity (Space Grotesk, IBM Plex Mono, electric blue #2563EB)
- `cinema-sotd/packages/profiles/kofi-mensah/` — Full profile build: "Chiaroscuro Light" visual identity (Cormorant Garamond, JetBrains Mono, deep crimson #9B1B30)
- `cinema-sotd/packages/profiles/lea-moreau/` — Full profile build: "Literary Manuscript" visual identity (DM Serif Display, Source Serif 4, sage green #5B7553)

### Changed
- Marie Dubois accent: `#C9A96E` → `#d4a853` (brighter gold)
- Marie Dubois background: `#0a0a0a` → `#050505` (deeper black)
- Marie Dubois display font: Cormorant Garamond → Playfair Display
- Marie Dubois body font: Inter → DM Sans
- Marie Dubois motion timing: micro 180ms, macro 900ms, cinematic 2.2s, ambient 14s

### Philosophy
- Each profile now gets a completely unique visual identity (fonts, colors, mood, motion)
- No shared design system between profiles — each is a standalone world

## [v1.1.0] — 2026-06-27

### Added
- `cinema-sotd/packages/profiles/marie-dubois/` — Full monorepo profile package
  - `package.json` — @cinema-sotd/profile-marie-dubois
  - `index.html` — Refactored to use @cinema-sotd/core auto-init
  - `src/styles/marie-dubois.css` — Extracted from monolithic HTML
  - `src/components/ScriptToScreenReveal.js` — Signature interaction
  - `src/init.js` — Profile initialization with core component boot
  - `README.md` — Full documentation per doctrine
  - `IMAGE-PROMPTS.txt` — 22 image prompts per Vol 2+3 protocol
- `.gitignore` — Comprehensive ignore rules
- `CHANGELOG.md` — This file

### Fixed
- `turbo.json` — Changed `pipeline` → `tasks` for Turbo v2 compatibility
- `pnpm-workspace.yaml` — Removed literal text on line 1 that broke YAML parsing

### Removed
- Duplicate `marie-dubois/` folders inside 9 other profile directories (copy-paste error)

### Changed
- Marie Dubois profile refactored from 1121-line monolithic HTML to modular architecture using @cinema-sotd/core imports
