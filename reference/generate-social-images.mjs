// Maintainer utility: requires ImageMagick locally, not during the Vercel build.
// Photography attribution/license is recorded in hero-video-source.md.
import { execFileSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'public/social');
await mkdir(output, { recursive: true });
const cards = {
  home: ['Palm-based ingredients.', 'Stocked for your', 'next production run.', 'EXPLORE INGREDIENTS'],
  products: ['Find the right', 'ingredient for', 'your formulation.', 'FOOD + ANIMAL NUTRITION'],
  logistics: ['Six US stock locations.', 'One ingredient', 'supply partner.', 'EXPLORE STOCK + DELIVERY'],
  compliance: ['Documentation for', 'confident sourcing', 'decisions.', 'REVIEW OUR RECORD'],
  'trade-finance': ['Connect production,', 'trade and supply.', '', 'EXPLORE PARTNERSHIPS'],
  about: ['Ingredient trading', 'experience', 'since 1992.', 'MEET DARBY TRADING'],
  documents: ['The product', 'information', 'your team needs.', 'SPECS + SAFETY DATA'],
  quote: ['What does your next', 'production run need?', '', 'REQUEST A QUOTE OR SAMPLE'],
  contact: ['Let’s discuss', 'your next ingredient', 'requirement.', 'CONTACT DARBY TRADING'],
};
for (const [name, lines] of Object.entries(cards)) {
  execFileSync('magick', [
    path.join(root, 'public/media/trade-hero-poster.jpg'),
    '-resize', '1200x630^', '-gravity', 'center', '-extent', '1200x630',
    '-fill', '#0b2035bb', '-draw', 'rectangle 0,0 1200,630',
    '-fill', '#10263af2', '-draw', 'rectangle 0,0 770,630',
    '(', path.join(root, 'public/brand/DT-Mark-white.png'), '-resize', '88x88', ')',
    '-gravity', 'northwest', '-geometry', '+64+48', '-composite',
    '-font', 'DejaVu-Sans', '-fill', '#ffffff', '-pointsize', '25',
    '-annotate', '+176+99', 'DARBY TRADING',
    '-font', 'DejaVu-Serif', '-pointsize', '48',
    '-annotate', '+64+249', lines[0],
    '-annotate', '+64+314', lines[1],
    '-annotate', '+64+379', lines[2],
    '-font', 'DejaVu-Sans-Bold', '-pointsize', '20', '-fill', '#b9d6b0',
    '-annotate', '+64+516', lines[3],
    '-fill', '#639651', '-draw', 'rectangle 0,614 1200,630',
    '-strip', '-quality', '88', path.join(output, `${name}.jpg`),
  ], { stdio: 'inherit' });
}
console.log(`Created ${Object.keys(cards).length} social images at 1200 × 630.`);
