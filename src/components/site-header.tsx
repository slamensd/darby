import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as RKE } from 'react';
import { Link, useLocation, useSearch } from 'wouter';
import { ChevronDown, Menu, X } from 'lucide-react';
import { CONTACT } from '@/data';

type Item = { label: string; desc: string; href: string };
type Group = { key: string; label: string; items: Item[] };

const GROUPS: Group[] = [
  {
    key: 'products',
    label: 'Products',
    items: [
      { label: 'Animal nutrition', desc: 'Rumen-protected fats and calcium salts', href: '/products?line=animal' },
      { label: 'Food ingredients', desc: 'Bakery, confectionery and specialty fats', href: '/products?line=food' },
      { label: 'Browse by application', desc: 'Filter the catalog by end use', href: '/products#catalog-filters' },
      { label: 'All products', desc: 'The full 23-product catalog', href: '/products' },
    ],
  },
  {
    key: 'how',
    label: 'How we work',
    items: [
      { label: 'Stock and delivery', desc: 'Six US port warehouses and lanes', href: '/logistics' },
      { label: 'Supplier partnerships', desc: 'For producers deciding on terms', href: '/trade-finance#suppliers' },
      { label: 'Trade finance', desc: 'Flows, rulings and the KYC pack', href: '/trade-finance' },
    ],
  },
  {
    key: 'resources',
    label: 'Resources',
    items: [
      { label: 'Product specifications', desc: 'Spec sheets and typical analysis', href: '/documents#specs' },
      { label: 'Safety data sheets', desc: 'SDS by product', href: '/documents#sds' },
      { label: 'Compliance', desc: 'RSPO, CBP rulings and registrations', href: '/compliance' },
    ],
  },
  {
    key: 'company',
    label: 'Company',
    items: [
      { label: 'About Darby', desc: 'Since 1992, Purchase, New York', href: '/about' },
      { label: 'Contact', desc: 'Phone, email and office', href: '/contact' },
    ],
  },
];

function splitHref(href: string) {
  const [rest, hash = ''] = href.split('#');
  const [path, query = ''] = rest.split('?');
  return { path, query, hash };
}

/** Scroll to a hash target after navigation, including same-path navigation where Layout does not re-run. */
function scrollToHash(hash: string) {
  if (!hash) return;
  let tries = 0;
  const run = () => {
    const el = document.getElementById(hash);
    if (el) el.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    else if (tries++ < 20) window.setTimeout(run, 50);
  };
  window.requestAnimationFrame(run);
}

export function SiteHeader() {
  const [location] = useLocation();
  const search = useSearch();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const menuBtn = useRef<HTMLButtonElement>(null);
  const uid = useId();

  const closeAll = useCallback(() => {
    setOpen(null);
    setMobile(false);
  }, []);

  // Close on any route, search or hash change.
  useEffect(() => {
    closeAll();
  }, [location, search, closeAll]);
  useEffect(() => {
    window.addEventListener('hashchange', closeAll);
    return () => window.removeEventListener('hashchange', closeAll);
  }, [closeAll]);

  // Escape closes and returns focus; outside pointer closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (mobile) menuBtn.current?.focus();
      else if (open) triggers.current[open]?.focus();
      closeAll();
    };
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) closeAll();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [closeAll, mobile, open]);

  // Crossing the desktop breakpoint closes whichever menu belongs to the other layout.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const on = () => closeAll();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [closeAll]);

  // Lock page scroll behind the mobile sheet.
  useEffect(() => {
    if (!mobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobile]);

  const params = new URLSearchParams(search);
  const itemActive = (href: string) => {
    const { path, query, hash } = splitHref(href);
    if (location !== path) return false;
    if (hash) return false;
    if (!query) return !params.get('line') || path !== '/products';
    const q = new URLSearchParams(query);
    return [...q.entries()].every(([k, v]) => params.get(k) === v);
  };
  const groupActive = (g: Group) => g.items.some((i) => {
    const p = splitHref(i.href).path;
    return location === p || location.startsWith(p + '/');
  });

  const onNav = (href: string) => () => {
    closeAll();
    scrollToHash(splitHref(href).hash);
  };

  const onPanelKey = (e: RKE<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const links = Array.from(e.currentTarget.querySelectorAll<HTMLAnchorElement>('a'));
    const i = links.indexOf(document.activeElement as HTMLAnchorElement);
    e.preventDefault();
    const next = e.key === 'ArrowDown' ? (i + 1) % links.length : (i - 1 + links.length) % links.length;
    links[next]?.focus();
  };

  return (
    <header
      ref={rootRef}
      className="sticky top-0 z-50 no-print"
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) closeAll();
      }}
    >
      <div className="relative border-b border-[#1E3A52] bg-[var(--deep)] text-[#FBFAF7]">
        <div className="wrap flex h-[72px] items-center justify-between gap-4">
          <Link href="/" aria-label="Darby Trading home" className="nav-focus flex shrink-0 items-center rounded-[3px]" onClick={onNav('/')} data-testid="link-home-logo">
            <img src="/brand/DT-Mark-white.png" alt="Darby Trading" className="h-8 w-auto sm:h-9" data-testid="img-header-logo" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            <ul className="flex items-center gap-1">
              {GROUPS.map((g) => {
                const isOpen = open === g.key;
                const panelId = `${uid}-panel-${g.key}`;
                return (
                  <li key={g.key} className="relative">
                    <button
                      ref={(el) => {
                        triggers.current[g.key] = el;
                      }}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : g.key)}
                      className={`nav-trigger ${groupActive(g) ? 'is-current' : ''}`}
                      data-testid={`button-nav-${g.key}`}
                    >
                      {g.label}
                      <ChevronDown className={`h-3.5 w-3.5 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
                    </button>
                    {isOpen && (
                      <div id={panelId} className="nav-panel panel-in" onKeyDown={onPanelKey} data-testid={`panel-nav-${g.key}`}>
                        <ul className="grid gap-0.5">
                          {g.items.map((it) => (
                            <li key={it.href}>
                              <Link
                                href={it.href}
                                onClick={onNav(it.href)}
                                aria-current={itemActive(it.href) ? 'page' : undefined}
                                className="nav-item"
                                data-testid={`link-nav-${g.key}-${it.label.toLowerCase().replace(/\s+/g, '-')}`}
                              >
                                <span className="font-semibold">{it.label}</span>
                                <span className="text-[13px] text-[var(--slate)]">{it.desc}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            <Link href="/request-a-quote" onClick={onNav('/request-a-quote')} className="btn btn-go nav-focus ml-4 !px-5 !py-2.5" aria-current={location === '/request-a-quote' ? 'page' : undefined} data-testid="link-nav-quote">
              Request a quote
            </Link>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/request-a-quote" onClick={onNav('/request-a-quote')} className="btn btn-go nav-focus hidden !px-4 !py-2 text-[14px] min-[380px]:inline-flex" data-testid="link-mobile-bar-quote">
              Quote
            </Link>
            <button
              ref={menuBtn}
              type="button"
              className="nav-focus flex h-11 w-11 items-center justify-center rounded-[4px] border border-[#5B7085] transition-colors hover:border-[#8FCF7F]"
              aria-label={mobile ? 'Close menu' : 'Open menu'}
              aria-expanded={mobile}
              aria-controls={`${uid}-mobile`}
              onClick={() => setMobile((m) => !m)}
              data-testid="button-mobile-menu"
            >
              {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobile && (
          <div id={`${uid}-mobile`} className="panel-in max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain border-t border-[#1E3A52] lg:hidden" data-testid="panel-drawer">
            <nav aria-label="Mobile" className="wrap py-2">
              <ul>
                {GROUPS.map((g) => {
                  const isOpen = mobileGroup === g.key;
                  const sid = `${uid}-m-${g.key}`;
                  return (
                    <li key={g.key} className="border-b border-[#1E3A52]">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={sid}
                        onClick={() => setMobileGroup(isOpen ? null : g.key)}
                        className={`nav-focus flex min-h-[56px] w-full items-center justify-between text-left text-[18px] font-medium ${groupActive(g) ? 'text-[var(--leaf-light)]' : ''}`}
                        data-testid={`button-mobile-${g.key}`}
                      >
                        {g.label}
                        <ChevronDown className={`h-5 w-5 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
                      </button>
                      <div id={sid} hidden={!isOpen}>
                        <ul className="grid pb-3">
                          {g.items.map((it) => (
                            <li key={it.href}>
                              <Link
                                href={it.href}
                                onClick={onNav(it.href)}
                                aria-current={itemActive(it.href) ? 'page' : undefined}
                                className="nav-focus flex min-h-[48px] flex-col justify-center rounded-[3px] px-4 py-2 text-[16px] text-[#D9DEE4] hover:bg-[#12293C] aria-[current=page]:text-[var(--leaf-light)]"
                                data-testid={`link-mobile-${g.key}-${it.label.toLowerCase().replace(/\s+/g, '-')}`}
                              >
                                {it.label}
                                <span className="text-[13px] text-[#8A9BAA]">{it.desc}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="grid gap-2 py-5">
                <Link href="/request-a-quote" onClick={onNav('/request-a-quote')} className="btn btn-go nav-focus w-full" data-testid="link-mobile-quote">Request a quote</Link>
                <a href={CONTACT.tel} className="nav-focus flex min-h-[44px] items-center justify-center text-[#C8D0D8]" data-testid="link-mobile-phone">{CONTACT.phone}</a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
