# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start dev server (Vite, hot-reload)
npm run build     # production build → ./dist
npm run preview   # serve the dist build locally on port 8080
```

There are no test or lint scripts configured.

## Architecture

This is a minimal React 18 + Vite SPA with no router. Navigation is pure React state in [src/App.jsx](src/App.jsx):

- `activeSession === null` → renders `<Library>` (the card grid)
- `activeSession` set to a session object → renders `<Session>` (iframe viewer)

### Data flow

`App.jsx` fetches `{BASE_URL}sessions.json` once on mount and passes the array down as props. There is no global state library — all state lives in `App`.

### Sessions manifest

[public/sessions.json](public/sessions.json) is the single source of truth for what appears in the library. Each entry shape:

```json
{
  "id": "my-session",
  "title": "Page Title",
  "url": "https://original-url.com",
  "date": "YYYY-MM-DD",
  "tags": ["topic"],
  "questionCount": 7,
  "file": "sessions/my-session.html",
  "excerpt": "One sentence description."
}
```

The actual HTML learning files live in [public/sessions/](public/sessions/) and are loaded inside an `<iframe>` in `Session.jsx`.

### Base path / deployment

`vite.config.js` reads `VITE_BASE_PATH` (defaults to `/`). For GitHub Pages the base must match the repo name (e.g. `/reader-library/`). The CI workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds and deploys `./dist` to GitHub Pages on every push to `main`. Enable it in **Settings → Pages → Source → GitHub Actions**.

### Adding a new session

1. Drop the generated HTML file into `public/sessions/`.
2. Add an entry to `public/sessions.json`.
3. Push to `main` — CI redeploys automatically.
