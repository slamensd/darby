# Darby Trading

Responsive Darby Trading website built with React, TypeScript, Vite and Tailwind CSS.

## Local development

Use Node.js 22 and the pnpm version specified in `package.json`:

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

No environment variables, Replit services, database or Mapbox token are required.

```sh
pnpm typecheck
pnpm build
pnpm preview
```

The production files are generated in `dist/public`.

## Deploy on Vercel

1. In Vercel, choose **Add New → Project**, then import **slamensd/darby**.
2. Use the repository root (`.`), not an `artifacts/` subdirectory.
3. Keep the settings provided by `vercel.json`:
   - Framework: **Vite**
   - Install: `pnpm install --frozen-lockfile`
   - Build: `pnpm run build`
   - Output: `dist/public`
   - Node.js: **22.x**
4. No environment variables are needed. Choose **Deploy**.

The SPA rewrite supports refreshes and direct visits to `/products`, product
detail URLs, `/logistics`, `/request-a-quote` and the other client-side routes.
Vercel's GitHub integration can build subsequent commits and pull requests.

## Current functionality and boundaries

- Product catalog and filters, product details, compliance/document information,
  audience calls to action, and responsive navigation.
- Silent looping harbor video with reduced-motion and still-image fallbacks.
  Video attribution/license: [reference/hero-video-source.md](reference/hero-video-source.md).
- Leaflet map uses OpenStreetMap tiles with visible attribution. Locations are
  city-level. Shaded 400-mile radii are illustrative, not road travel times,
  verified inventory, or delivery commitments. For significant traffic, choose a
  suitable hosted tile plan and comply with the provider's usage policy.
- Quote requests validate in the browser and open a prefilled email draft.
  They are **not** sent or stored by a backend.
- Documents not supplied by Darby remain available on request; missing files,
  certifications and registration details are not fabricated.

## Editing from Replit

The Replit workspace remains the source while it contains multiple artifacts.
This repository is a standalone export of the Darby site only. In that workspace:

```sh
node scripts/src/export-darby-site.mjs /tmp/darby-export
```

Use a fresh directory, install dependencies to generate the standalone lockfile,
run the build, then commit and push the export into this repository. This is not
automatic two-way sync: changes made directly in this GitHub repository should
be brought back into the Replit site before the next export. Review the diff
before each push. Never force-push over changes made by someone else.
