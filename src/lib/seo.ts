import { PRODUCTS } from '../data';

// Brand domain supplied for this website; never derive canonical URLs from a preview host.
export const SITE_ORIGIN = 'https://darbyinc.com';
export type PageMeta = { title: string; description: string; image: string; imageAlt: string; noindex?: boolean };
const page = (title: string, description: string, image: string, imageAlt: string): PageMeta => ({
  title, description, image: `/social/${image}.jpg`, imageAlt,
});

export const PAGE_META: Record<string, PageMeta> = {
  '/': page('Palm-Based Ingredients & US Supply | Darby Trading',
    'Source palm-based fats, fatty acids and specialty oils for food and animal nutrition. Explore US stock locations, review specifications and request a quote.',
    'home', 'Darby Trading — palm-based ingredients, stocked for your next production run.'),
  '/products': page('Food & Animal Nutrition Ingredients | Darby Trading',
    'Find fats, fatty acids and specialty oils for dairy, bakery, confectionery and more. Compare Darby ingredients, request specifications and get a supply quote.',
    'products', 'Darby Trading — find the right ingredient for your formulation.'),
  '/logistics': page('US Ingredient Stock & Delivery Options | Darby Trading',
    'Explore six US stock locations and delivery options for palm-based ingredients. Share your plant location and volume to confirm availability and lead times.',
    'logistics', 'Darby Trading — six US stock locations, one supply partner.'),
  '/compliance': page('Ingredient Compliance & Traceability | Darby Trading',
    'Review Darby’s RSPO membership, US Customs rulings and ingredient documentation. Request the records your quality team needs to evaluate your next supplier.',
    'compliance', 'Darby Trading — documentation for confident sourcing decisions.'),
  '/trade-finance': page('Ingredient Trade & Supplier Partnerships | Darby Trading',
    'Evaluate Darby as a trading partner. Review ingredient flows, producer relationships and customs records, then request a KYC pack or discuss a partnership.',
    'trade-finance', 'Darby Trading — connect production, trade and supply.'),
  '/about': page('Your Ingredient Trading Partner Since 1992 | Darby Trading',
    'Meet Darby Trading, a New York ingredient trading house importing since 1992. Explore our food and feed expertise, US stock network and approach to supply.',
    'about', 'Darby Trading — ingredient trading experience since 1992.'),
  '/documents': page('Ingredient Specs, SDS & Trade Documents | Darby Trading',
    'Find Darby’s available ingredient specifications, safety data and trade records. Request product-specific documentation to support sourcing and qualification.',
    'documents', 'Darby Trading — the product information your team needs.'),
  '/request-a-quote': page('Request an Ingredient Quote or Sample | Darby Trading',
    'Tell Darby your ingredient, volume, delivery location and timing. Prepare a quote or sample inquiry so our team can discuss the right supply option for you.',
    'quote', 'Darby Trading — tell us what your next production run needs.'),
  '/contact': page('Contact Your Ingredient Supply Partner | Darby Trading',
    'Talk with Darby about ingredient sourcing, stock availability or supplier partnerships. Call our New York team or prepare an inquiry for your next requirement.',
    'contact', 'Darby Trading — let’s discuss your next ingredient requirement.'),
};

for (const product of PRODUCTS) {
  PAGE_META[`/products/${product.slug}`] = page(
    `${product.name} ${product.line === 'animal' ? 'Feed Ingredient' : 'Food Ingredient'} | Darby Trading`,
    `${product.name}: ${product.plain} Ask Darby for specs, US stock availability and a quote for your plant.`,
    'products',
    `Darby Trading — explore ${product.name} and request a supply quote.`,
  );
}

export const NOT_FOUND_META: PageMeta = {
  ...page('Page Not Found | Darby Trading',
    'Find Darby’s ingredient catalog, explore US stock locations or contact our team for help with your sourcing requirements.',
    'home', 'Darby Trading — palm-based ingredients for food and animal nutrition.'),
  noindex: true,
};

export function normalizePath(path: string) {
  return path.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
}

export function getPageMeta(path: string) {
  return PAGE_META[normalizePath(path)] ?? NOT_FOUND_META;
}

export function metaEntries(meta: PageMeta, path: string) {
  const url = `${SITE_ORIGIN}${normalizePath(path) === '/' ? '/' : normalizePath(path)}`;
  return [
    ['name', 'description', meta.description],
    ['name', 'robots', meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'],
    ['property', 'og:title', meta.title],
    ['property', 'og:description', meta.description],
    ['property', 'og:type', 'website'],
    ['property', 'og:site_name', 'Darby Trading'],
    ['property', 'og:locale', 'en_US'],
    ['property', 'og:url', url],
    ['property', 'og:image', `${SITE_ORIGIN}${meta.image}`],
    ['property', 'og:image:secure_url', `${SITE_ORIGIN}${meta.image}`],
    ['property', 'og:image:type', 'image/jpeg'],
    ['property', 'og:image:width', '1200'],
    ['property', 'og:image:height', '630'],
    ['property', 'og:image:alt', meta.imageAlt],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', meta.title],
    ['name', 'twitter:description', meta.description],
    ['name', 'twitter:image', `${SITE_ORIGIN}${meta.image}`],
    ['name', 'twitter:image:alt', meta.imageAlt],
  ] as const;
}
