# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server (HMR on localhost:5173)
npm run build      # production build → dist/
npm run preview    # serve the production build locally
npm run lint       # run ESLint
```

No test suite is configured.

## Architecture

This is a single-page React 19 portfolio site built with Vite 8. There are no routes, no state management library, and no component library — the entire UI lives in `src/App.jsx`.

**React Compiler** is enabled via `babel-plugin-react-compiler` (configured in `vite.config.js`). This means manual `useMemo`/`useCallback` optimisations are unnecessary and should not be added.

### Content data

All editable content sits at the top of `src/App.jsx` as plain JS constants:

- `PROJECTS` — project cards (name, tag, description, bullets, stack, github, demo)
- `BLOG_POSTS` — blog card entries (title, tag, date, url)
- `SKILLS` — skill groups (category + items array)
- `NAV_LINKS` — ordered list of section IDs used for both the nav and scroll tracking
- `RESUME_URL` — path to the resume PDF; the file must live at `public/resume.pdf`

To add a project or blog post, append an entry to the relevant constant.

### Styling

All styles are inline (`style={{...}}` props) — there is no CSS framework or utility classes. `src/index.css` defines CSS custom properties and base resets but App.jsx overrides everything with its own dark-theme colour palette:

- Background: `#0a0e15`
- Primary accent: `#4a9ede`
- Muted accent: `#2a6496`
- Body text: `#6a7d8f` / `#8899aa`
- Heading text: `#f0f4f8`

Global keyframe animations (`blink`, `fadeUp`, `fadeIn`) and Google Fonts (`DM Serif Display`, `DM Sans`, `JetBrains Mono`) are injected via a `<style>` tag inside the JSX return, not through `index.css`.

### Scroll-based nav

`App` tracks `activeSection` state with a `scroll` event listener that iterates `NAV_LINKS` against element `offsetTop`. Section IDs must exactly match the entries in `NAV_LINKS` for active highlighting and `scrollTo()` to work.

### Contact form

The form is purely client-side: submitting sets `sent = true` and shows a confirmation message. No backend or email service is wired up — adding real submission requires integrating a service (e.g. Formspree, EmailJS, or an API route).
