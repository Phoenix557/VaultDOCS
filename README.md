# PhxDOCS

Documentation site for PHX Services apps. Built with Astro, Tailwind CSS, and MDX.

The homepage opens directly to the VaultCDN API reference. Guides cover setup, deployment, and usage.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) — redirects to `/vaultcdn/docs`.

## Build

```bash
npm run build
npm run preview
```

Static output is written to `dist/` for deployment to any static host.

## Structure

- `/vaultcdn/docs` — API reference (scroll page with sidebar)
- `/vaultcdn/guides/*` — Prose guides from the VaultCDN README
- `/` — Redirects to the default app docs

## Adding a new app

1. Add an entry to `src/data/apps/index.ts`
2. Create `src/data/apps/{slug}/config.ts` and `api.ts`
3. Add guide MDX files under `src/content/{slug}-guides/`
4. Register the content collection in `src/content/config.ts`

## VaultCDN links

- **Live:** [cdn.phxservices.co](https://cdn.phxservices.co)
- **Source:** [github.com/Phoenix557/PhxCDN](https://github.com/Phoenix557/PhxCDN)
