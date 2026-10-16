import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Plugin } from 'vite';
import { getPageMeta, metaEntries, normalizePath, PAGE_META, SITE_ORIGIN } from './src/lib/seo';

const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function renderMetadata(html: string, route: string) {
  const meta = getPageMeta(route);
  const tags = [
    `<title>${escape(meta.title)}</title>`,
    ...metaEntries(meta, route).map(([attribute, key, content]) =>
      `<meta ${attribute}="${key}" content="${escape(content)}" />`),
    `<link rel="canonical" href="${SITE_ORIGIN}${normalizePath(route)}" />`,
  ].join('\n    ');
  return html.replace(/<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->/, `<!-- SEO:START -->\n    ${tags}\n    <!-- SEO:END -->`);
}

// Social crawlers commonly do not run JavaScript. Emit a distinct HTML shell for
// every public route, not just client-side tags. React still renders the page UI.
export function seoPlugin(): Plugin {
  let outputDirectory: string;
  let isBuild = false;
  return {
    name: 'darby-route-metadata',
    configResolved(config) {
      outputDirectory = path.resolve(config.root, config.build.outDir);
      isBuild = config.command === 'build';
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        // Vite rewrites SPA requests to /index.html; originalUrl retains the route.
        const route = context.originalUrl || (context.path === '/index.html' ? '/' : context.path);
        return renderMetadata(html, route);
      },
    },
    async closeBundle() {
      if (!isBuild) return;
      const template = await readFile(path.join(outputDirectory, 'index.html'), 'utf8');
      for (const route of Object.keys(PAGE_META)) {
        const filename = path.join(outputDirectory, route.slice(1), 'index.html');
        await mkdir(path.dirname(filename), { recursive: true });
        await writeFile(filename, renderMetadata(template, route));
      }
      await writeFile(path.join(outputDirectory, '404.html'), renderMetadata(template, '/404'));
    },
  };
}
