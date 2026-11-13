# Mostafa Lahfa — Portfolio

Personal portfolio of **Mostafa Lahfa**, Full Stack Developer (Java & Spring Boot) based in Morocco.

A cinematic dark/red developer portfolio that **builds itself while you watch**. On load, a swarm of
cursor agents (5 labelled leads + worker cursors; 24 on desktop, 12 on mobile) draws wireframes,
types headlines, drags duplicated elements into place and wipes in images. **At the same time the
page scrolls itself from top to bottom**, so the visitor reads the whole portfolio while it is
assembled. Speed adapts to how busy the swarm is.

The concept is inspired by Joel Califa's *Swarm* and Dhvanil Patel's *Swarm Rebuild*; the code here
is an original implementation.

Built with **React 18 + Vite**, **GSAP** (build timelines), **Framer Motion** (UI interactions),
**Canvas 2D** (all cursors on one canvas), **Lenis** (smooth scrolling) and **Tailwind CSS**.

### The tour

- A toolbar at the bottom shows the agents, built layers (`37 / 156 layers`), progress, **Touring**
  (pause/resume), **Skip** and, at the end, **Replay** ("Built by 24 agents in 63s").
- Scrolling with the wheel, touch or keyboard **pauses** the tour. Blocks keep building as they come
  into view, and anything scrolled past is shown instantly, so content is never left hidden.
- At the end the swarm gathers on the footer, then leaves. Your own cursor becomes a pointer with
  hover labels.
- With `prefers-reduced-motion: reduce` there is no tour, no agents and no hidden content.

## Quick start

Requirements: **Node.js 18+** and npm.

```bash
npm install
npm run dev       # http://localhost:5173
```

Production build:

```bash
npm run build     # outputs to dist/
npm run preview   # serves the production build at http://localhost:4173
```

> **Windows note:** `package.json` overrides Rollup with `@rollup/wasm-node`. Some Windows machines
> (Smart App Control / Application Control) block Rollup's native `.node` binary, which breaks
> `vite build`. The WebAssembly build behaves the same, just a little slower. You can remove the
> `overrides` block if your machine doesn't need it.

## The swarm system

| File | Role |
| --- | --- |
| `src/swarm/agents.js` | Lead agents (DESIGN, FRONTEND, BACKEND, MOTION, SYSTEM) and worker colours |
| `src/swarm/SwarmEngine.js` | One `<canvas>`: cursors, trails, click ripples, visitor crosshair/pointer. Spring physics; agent modes `roam` / `task` / `park`; agent pool (`acquire` / `release`) |
| `src/swarm/buildKit.js` | Build primitives for GSAP timelines: selection box with live W×H, typing with caret, drawn lines, alt-drag duplicates, wipe reveal, pop, fade, snap guides. `finalize()` restores everything |
| `src/swarm/tour.js` | Declarative block builder + `TourController` (auto-scroll, IntersectionObserver, pause/resume/skip/replay, finale) |
| `src/swarm/SwarmProvider.jsx` | Mounts engine + tour, renders the toolbar, exposes `ReplayButton` |

### Intro soundtrack

Put the track at `public/audio/ascension-slowed.mp3`. When it exists, an entry screen asks the
visitor to **Enter with sound** or **Enter silently** (browsers only allow audio after a click). The
music starts at **1:52** with a 2.5 s fade-in as the cursors appear, can be muted from the toolbar
(equaliser icon), and fades out when the build ends or is skipped. Settings (file, start second,
volume, title) live in `src/data/personal.js` → `intro.music`. Without the file the site starts
directly, silently.

> Use a track you have the rights to publish — music on a public site can be subject to copyright.

### Technology popups

Every technology label (hero list, logo row, featured project, project popup, toolkit, showcase,
experience tags) is clickable. The popup shows a short description, the GitHub projects that use
it, and two buttons: **Official docs** and **GitHub project**. Data lives in `src/data/tech.js`:
each entry has `docs` and `repos` (only real repositories, verified from pom.xml / package.json /
language). Labels such as "Java 17" or "Laravel 12" are matched by `techKey()`.

### Projects

AffiliateLink is the large featured card (different layout, tilted mockup, clickable stack).
The other projects use identical cards with one light line; all details open in the project popup.

### Cursor & hovers

- `src/components/ui/Cursor.jsx`: a "selection" cursor (red dot + four brackets, like the boxes the
  agents draw). Over links, buttons and cards the brackets snap around the element and show a label
  (`data-cursor="Open"` sets it). Mouse only; text fields keep the native cursor; off with reduced motion.
- Images (`.media-hover`): zoom, red duotone, scanlines and a light streak on hover.
- Hero: the portrait tilts toward the mouse while PORTFOLIO drifts the other way.
- `.glitch` on big titles, `.btn-sweep` on red buttons, `.stroke-hover` on the big numbers.

### Making any element buildable

Add `data-block` to a section (blocks can be nested; each block builds its own steps), then mark
elements inside it:

| Attribute | What the agents do |
| --- | --- |
| `data-b="frame"` | draw a wireframe box over it (stays visible) — `data-tag="label"` |
| `data-b="box"` | drag out a selection box, then fade the element in |
| `data-b="type"` | type its text (use on an inline element containing plain text) |
| `data-b="line"` | draw it from its origin (`data-axis="y"` for vertical) |
| `data-b="reveal"` | wipe it in left → right |
| `data-b="pop"` | click and pop it in |
| `data-b="fade"` | hover and fade it up |
| `data-b="dup"` | container: its `data-dup` children are alt-dragged out of the first one |

Steps run in DOM order with small overlaps (`data-gap` to tune).

## Editing content

All content lives in `src/data/`. You never need to touch components to update the site.

| File | What it controls |
| --- | --- |
| `src/data/personal.js` | Name, title, email, availability, hero text, about text, interests, contact copy, social links, nav |
| `src/data/projects.js` | Featured projects (title, description, highlights, stack, screenshots, GitHub / demo links) and "More on GitHub" |
| `src/data/skills.js` | Skill groups, concepts and the marquee |
| `src/data/experience.js` | Experience & education timeline |

**Project links:** GitHub and Live Demo buttons only render when the URL is set. Leave `demo: null`
until a real deployment exists.

**Screenshots:** put images in `public/images/projects/` (WebP, ~1600px wide is ideal) and reference
them as `/images/projects/your-file.webp`. A project with `image: null` shows the built-in illustrated
mockup instead.

**CV:** `public/Mostafa-Lahfa-CV.pdf` is served by the "Download CV" button. Replace the file to update
it, or set `cvUrl: null` in `personal.js` to hide the button.

## Contact form

In production, the form posts to the Vercel serverless function at `/api/contact`, which sends
the message through Gmail SMTP. For local development, the form opens the visitor's email client.

1. Enable 2-Step Verification on the Gmail account that will send the form messages, then create an
   [App Password](https://myaccount.google.com/apppasswords). Do not use your regular Gmail password.
2. In Vercel, open **Project Settings → Environment Variables** and add:
   - `SMTP_HOST` = `smtp.gmail.com`
   - `SMTP_PORT` = `465`
   - `SMTP_USER` = the Gmail address used to send messages
   - `SMTP_PASS` = its Google App Password
   - `CONTACT_TO` = the inbox that should receive messages
3. Apply the variables to the production environment and redeploy the project.

Keep SMTP credentials in Vercel environment variables (or a local, ignored `.env` file); never use
`VITE_` for secrets because Vite exposes those values in the browser bundle. `.env.example` documents
the variable names and placeholder values.

## Project structure

```
public/                     static assets (images, CV, favicon, og-image)
src/
  animations/variants.js    shared easing curves & motion variants
  components/
    layout/                 Navbar, Footer, ScrollProgress
    sections/               Hero, StackRow, Work, ExperienceSection, Showcase, AboutSection,
                            Toolkit, Journey, Contact
      projects/             ProjectPreview, ProjectModal, ModulesMockup
    ui/                     Heading, Button, Magnetic, BrowserFrame, TechIcon, SocialIcon
  swarm/                    engine, build kit, tour controller, provider + toolbar
  data/                     ← all editable content
  hooks/                    useSmoothScroll (Lenis), useActiveSection, useMediaQuery
  styles/index.css          Tailwind layers, design tokens, utilities
  App.jsx, main.jsx
```

**Palette** (black / red / white) in `tailwind.config.js`: `ink-950 #070708`, `bone #F2F2F2`,
`mute #8F8F96`, `accent #E5252A` (cinema red), `accent-deep #8E0E12`.
**Fonts:** Anton (condensed headlines), Inter (body), IBM Plex Mono (labels), Mrs Saint Delafield
(signature), loaded from Google Fonts in `index.html`.

**Photos:** `public/images/portrait-cutout.webp` (hero cut-out, from `images/Portrait_studio_decoupe_en_costume_noir.png`)
and `public/og-image.jpg` (social preview, from `images/exemple.png`). Hero figures live in `stats`
in `src/data/personal.js`.

## Accessibility & performance

- Semantic landmarks, skip link, labelled sections, visible focus rings.
- Modal with focus trap, Escape to close and focus restoration.
- Headline text is always in the DOM for screen readers (typed copies are `aria-hidden`); the canvas
  and build overlays are `aria-hidden`; the intro status is announced via `role="status"`.
- Custom pointer only on fine pointers (native cursor kept in form fields); the swarm, Lenis and
  parallax are turned off with `prefers-reduced-motion`.
- Images are compressed WebP files and lazy-loaded; vendor code is split into separate `react` and `motion` chunks.

## Deployment

`dist/` is a static site, so it deploys anywhere: Vercel, Netlify, GitHub Pages or Cloudflare Pages.
On Vercel: framework preset **Vite**, build command `npm run build`, output directory `dist`.

---

© Mostafa Lahfa. Designed & Built with passion.
