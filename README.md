# Paritosh Tripathi — portfolio

Static Astro site deployed on Netlify. Content lives in `src/data/`; GitHub and WakaTime stats are fetched at build time.

- Node 22.12+ (`.nvmrc`; Netlify pins it in `netlify.toml`)
- `npm install`, then `npm run dev` (http://localhost:4321) or `npm run build`
- Env (`.env` locally, Netlify env vars in prod): `WAKATIME_API_KEY` for the activity panel, optional `GITHUB_TOKEN` to avoid GitHub's 60 req/hr limit. Without them the site falls back to static data.
- `/win95` is a Windows 95 themed version of the site.
