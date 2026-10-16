import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, ChevronDown, Menu, X, Phone, Mail } from 'lucide-react';
import { CONTACT, PRODUCTS, APPS, SRC } from '@/data';

export function useMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const setMeta = (selector: string, attribute: string, key: string, content: string) => {
      let meta = document.querySelector<HTMLMetaElement>(selector);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
  }, [title, description]);
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <div className={`reveal ${className}`} style={delay ? { animationDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

export function Src({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="link-u hover:text-[var(--leaf)]" data-testid={`link-source-${String(children).toLowerCase().replace(/\s+/g, '-')}`}>
      {children}
    </a>
  );
}

const NAV = [
  { href: '/logistics', label: 'Logistics' },
  { href: '/compliance', label: 'Compliance' },
  { href: '/trade-finance', label: 'Trade finance' },
  { href: '/about', label: 'About' },
  { href: '/documents', label: 'Documents' },
  { href: '/contact', label: 'Contact' },
];

function Header() {
  const [open, setOpen] = useState<null | 'products' | 'markets' | 'drawer'>(null);
  const [location] = useLocation();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => setOpen(null), [location]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    const c = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(null);
    document.addEventListener('keydown', k);
    document.addEventListener('click', c);
    return () => {
      document.removeEventListener('keydown', k);
      document.removeEventListener('click', c);
    };
  }, []);

  const toggle = (k: 'products' | 'markets' | 'drawer') => setOpen((o) => (o === k ? null : k));
  const active = (h: string) => location === h || location.startsWith(h + '/');
  const animal = PRODUCTS.filter((p) => p.line === 'animal');
  const food = PRODUCTS.filter((p) => p.line === 'food');

  return (
    <header ref={ref} className="sticky top-0 z-50 no-print">
      <div className="relative bg-[var(--deep)] text-[#FBFAF7] border-b border-[#1E3A52]">
        <div className="wrap flex items-center justify-between gap-4 py-4">
          <Link href="/" aria-label="Darby Trading home" className="flex shrink-0 items-center" data-testid="link-home-logo">
            <img
              src="/brand/DT-Mark-white.png"
              alt="Darby Trading"
              className="h-8 w-auto sm:h-9"
              data-testid="img-header-logo"
            />
          </Link>
          <nav aria-label="Primary" className="hidden xl:flex items-center gap-3 text-[13px] font-medium">
            {(['markets', 'products'] as const).map((k) => (
              <button
                key={k}
                type="button"
                aria-expanded={open === k}
                onClick={() => toggle(k)}
                className={`flex items-center gap-1 whitespace-nowrap py-2 border-b-2 transition-colors ${open === k || (k === 'products' && active('/products')) ? 'border-[var(--leaf)] text-[#FBFAF7]' : 'border-transparent text-[#D9DEE4] hover:text-[#FBFAF7]'}`}
                data-testid={`button-nav-${k}`}
              >
                {k === 'markets' ? 'Markets' : 'Products'}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open === k ? 'rotate-180' : ''}`} />
              </button>
            ))}
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={`whitespace-nowrap py-2 border-b-2 transition-colors ${active(n.href) ? 'border-[var(--leaf)] text-[#FBFAF7]' : 'border-transparent text-[#D9DEE4] hover:text-[#FBFAF7]'}`} data-testid={`link-nav-${n.href.slice(1)}`}>
                {n.label}
              </Link>
            ))}
            <Link href="/request-a-quote" className="btn btn-go shrink-0 whitespace-nowrap !py-3 !px-4" data-testid="link-nav-quote">Request a quote</Link>
          </nav>
          <button type="button" className="xl:hidden flex h-11 w-11 items-center justify-center rounded border border-[#5B7085]" aria-label={open === 'drawer' ? 'Close menu' : 'Open menu'} aria-expanded={open === 'drawer'} onClick={() => toggle('drawer')} data-testid="button-mobile-menu">
            {open === 'drawer' ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open === 'markets' && (
          <div className="panel-in absolute inset-x-0 top-full bg-[var(--paper)] text-[var(--ink)] shadow-[0_16px_32px_rgba(6,20,32,.25)]" data-testid="panel-markets">
            <div className="wrap grid grid-cols-4 gap-4 py-7">
              {[
                ['Dairy and beef nutrition', 'More energy per pound of ration', '/products?line=animal'],
                ['Bakery', 'Fats that hold up on the line', '/products?app=Industrial%20bakery'],
                ['Confectionery', 'Coatings that set clean and snap', '/products?app=Compound%20chocolate%20and%20coatings'],
                ['Distributors and blenders', 'We carry the import, you carry the product', '/trade-finance'],
              ].map(([t, d, h], i) => (
                <Link key={t} href={h} className="group grid gap-1 rounded-[4px] border border-[var(--rule)] bg-white p-5 hover:border-[var(--leaf)] transition-colors" data-testid={`link-market-${i}`}>
                  <span className="eyebrow text-[var(--slate)]">0{i + 1}</span>
                  <strong className="serif text-[19px]">{t}</strong>
                  <span className="text-sm text-[var(--slate)]">{d}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {open === 'products' && (
          <div className="panel-in absolute inset-x-0 top-full bg-[var(--paper)] text-[var(--ink)] shadow-[0_16px_32px_rgba(6,20,32,.25)]" data-testid="panel-products">
            <div className="wrap grid grid-cols-[1.1fr_1.1fr_.9fr_.9fr] gap-8 py-8 text-[15px]">
              {[['Animal nutrition', animal, 'animal'], ['Food ingredients', food, 'food']].map(([t, list, line]) => (
                <div key={t as string} className="grid content-start gap-1.5">
                  <Link href={`/products?line=${line}`} className="serif text-[18px] font-semibold mb-1 hover:text-[var(--leaf)]" data-testid={`link-line-${line}`}>{t as string} <span className="text-[var(--leaf)]">{(list as typeof PRODUCTS).length}</span></Link>
                  {(list as typeof PRODUCTS).map((p) => (
                    <Link key={p.slug} href={`/products/${p.slug}`} className="hover:text-[var(--leaf)]" data-testid={`link-menu-product-${p.slug}`}>{p.name}</Link>
                  ))}
                </div>
              ))}
              <div className="grid content-start gap-1.5">
                <strong className="serif text-[18px] mb-1 text-[var(--slate)]">By application</strong>
                {APPS.map((a) => (
                  <Link key={a} href={`/products?app=${encodeURIComponent(a)}`} className="hover:text-[var(--leaf)]" data-testid={`link-menu-app-${a}`}>{a}</Link>
                ))}
              </div>
              <div className="grid content-start gap-2.5 rounded-[4px] border border-[var(--rule)] bg-white p-5">
                <strong className="serif text-[18px] mb-1 text-[var(--slate)]">Documents</strong>
                <Link href="/documents" className="font-semibold hover:text-[var(--leaf)]" data-testid="link-menu-specs">Spec sheet library</Link>
                <Link href="/documents" className="font-semibold hover:text-[var(--leaf)]" data-testid="link-menu-sds">Safety data sheets</Link>
                <Link href="/compliance" className="font-semibold hover:text-[var(--leaf)]" data-testid="link-menu-certs">Certificates</Link>
                <Link href="/request-a-quote?type=sample" className="btn btn-ink justify-center mt-2 !py-2.5" data-testid="link-menu-sample">Request a sample</Link>
              </div>
            </div>
          </div>
        )}

        {open === 'drawer' && (
          <div className="panel-in xl:hidden border-t border-[#1E3A52] max-h-[calc(100dvh-76px)] overflow-y-auto" data-testid="panel-drawer">
            <nav aria-label="Mobile" className="grid py-2 text-[18px] font-medium">
              <Link href="/products" className="px-6 py-3.5" data-testid="link-mobile-products">Products</Link>
              <Link href="/products?line=animal" className="px-10 py-2 text-base text-[#D9DEE4]" data-testid="link-mobile-animal">Animal nutrition</Link>
              <Link href="/products?line=food" className="px-10 py-2 pb-3.5 text-base text-[#D9DEE4]" data-testid="link-mobile-food">Food ingredients</Link>
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className={`px-6 py-3.5 ${active(n.href) ? 'text-[var(--leaf-light)]' : ''}`} data-testid={`link-mobile-${n.href.slice(1)}`}>{n.label}</Link>
              ))}
            </nav>
            <div className="grid gap-2.5 border-t border-[#1E3A52] px-6 pb-6 pt-4">
              <Link href="/request-a-quote" className="btn btn-go justify-center" data-testid="link-mobile-quote">Request a quote</Link>
              <a href={CONTACT.tel} className="text-center text-[#C8D0D8]" data-testid="link-mobile-phone">{CONTACT.phone}</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[var(--deep)] text-[#C8D0D8] text-sm no-print">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="grid content-start gap-4">
          <img src="/brand/DT-Logo-negative.png" alt="Darby Trading" className="h-16 w-auto justify-self-start" data-testid="img-footer-logo" />
          <address className="not-italic leading-relaxed">{CONTACT.address.map((l) => <span key={l} className="block">{l}</span>)}</address>
          <p className="max-w-xs text-[#9FB0BF]">Palm-based ingredient trading house. Importing since 1992. Stock at six US ports.</p>
        </div>
        <div className="grid content-start gap-2">
          <strong className="text-[#FBFAF7]">Products</strong>
          <Link href="/products?line=animal" className="hover:text-[#FBFAF7]" data-testid="link-footer-animal">Animal nutrition</Link>
          <Link href="/products?line=food" className="hover:text-[#FBFAF7]" data-testid="link-footer-food">Food ingredients</Link>
          <Link href="/documents" className="hover:text-[#FBFAF7]" data-testid="link-footer-documents">Documents</Link>
          <Link href="/request-a-quote" className="hover:text-[#FBFAF7]" data-testid="link-footer-quote">Request a quote</Link>
        </div>
        <div className="grid content-start gap-2">
          <strong className="text-[#FBFAF7]">Company</strong>
          {NAV.slice(0, 4).map((n) => <Link key={n.href} href={n.href} className="hover:text-[#FBFAF7]" data-testid={`link-footer-${n.href.slice(1)}`}>{n.label}</Link>)}
        </div>
        <div className="grid content-start gap-2">
          <strong className="text-[#FBFAF7]">Contact</strong>
          <a href={CONTACT.tel} className="flex items-center gap-2 hover:text-[#FBFAF7]" data-testid="link-footer-phone"><Phone className="h-3.5 w-3.5" />{CONTACT.phone}</a>
          <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-[#FBFAF7]" data-testid="link-footer-email"><Mail className="h-3.5 w-3.5" />{CONTACT.email}</a>
          <a href={SRC.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#FBFAF7]" data-testid="link-footer-linkedin">LinkedIn</a>
          <Link href="/contact" className="hover:text-[#FBFAF7]" data-testid="link-footer-contact">All contact details</Link>
        </div>
      </div>
      <div className="border-t border-[#1E3A52]">
        <div className="wrap flex flex-wrap justify-between gap-3 py-4 text-[13px]">
          <span>© 2026 Darby Trading Incorporated</span>
          <span>
            <a href={SRC.rspo} target="_blank" rel="noreferrer" className="hover:text-[#FBFAF7]" data-testid="link-footer-rspo">RSPO member 2-1713-26-000-00</a> · Privacy policy and terms of sale to follow
          </span>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  useEffect(() => {
    const anchor = window.location.hash.slice(1);
    const target = anchor ? document.getElementById(anchor) : null;
    if (target) {
      const frame = window.requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
      return () => window.cancelAnimationFrame(frame);
    }
    window.scrollTo(0, 0);
    return undefined;
  }, [location]);
  return (
    <div className="grain min-h-[100dvh] flex flex-col overflow-x-clip bg-[var(--paper)] text-[var(--ink)]">
      <Header />
      <main className="flex-1" key={location}>{children}</main>
      <Footer />
    </div>
  );
}

export function PageHero({ title, lede, children, id }: { eyebrow?: string; title: string; lede: string; children?: ReactNode; id: string }) {
  return (
    <section className="relative overflow-hidden bg-[var(--deep)] text-[#FBFAF7]">
      <Lines />
      <div className="wrap relative py-20 md:py-28">
        <h1 className="rise max-w-4xl break-words text-[38px] sm:text-[48px] md:text-[68px] font-semibold leading-[1] tracking-[-0.015em]" style={{ animationDelay: '80ms' }} data-testid={`text-title-${id}`}>{title}</h1>
        <p className="rise mt-7 max-w-2xl text-lg md:text-xl leading-[1.45] text-[#C8D0D8]" style={{ animationDelay: '160ms' }}>{lede}</p>
        {children && <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: '240ms' }}>{children}</div>}
      </div>
    </section>
  );
}

export function Lines({ strong = false }: { strong?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 1440 720" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4C9A3B" stopOpacity="0" />
          <stop offset=".5" stopColor="#4C9A3B" stopOpacity=".9" />
          <stop offset="1" stopColor="#4C9A3B" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="#1E3A52" strokeWidth="1">
        {[560, 620, 680, 500, 440, 380, 320].map((y, i) => (
          <path key={y} d={`M-40 ${y} C ${300 + i * 10} ${y - 140 - i * 10}, ${700 - i * 20} ${y - 140}, 1480 ${y - 260}`} />
        ))}
      </g>
      {strong && (
        <g fill="none" stroke="url(#fade)" strokeWidth="2">
          <path className="lane" d="M-40 560 C 300 420, 700 420, 1480 300" />
          <path className="lane" style={{ animationDelay: '.6s' }} d="M-40 440 C 290 290, 680 300, 1480 180" />
        </g>
      )}
      <g fill="#4C9A3B">
        {[[300, 494], [420, 463], [1040, 392], [1180, 366], [1290, 343], [1380, 322]].map(([x, y], i) => (
          <circle key={x} cx={x} cy={y} r="4" className="pulse" style={{ animationDelay: `${i * 0.35}s` }} />
        ))}
      </g>
    </svg>
  );
}

export function EndAction({ title, body, href, label, id }: { title: string; body: string; href: string; label: string; id: string }) {
  return (
    <section className="border-t border-[var(--rule)] bg-[var(--linen)]">
      <div className="wrap flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <h2 className="text-[34px] md:text-[44px] font-semibold leading-[1.08]">{title}</h2>
          <p className="mt-4 text-[17px] text-[#2E3A46]">{body}</p>
        </div>
        {href.startsWith('/') ? (
          <Link href={href} className="btn btn-go shrink-0 max-w-full" data-testid={`link-end-${id}`}>{label}<ArrowRight className="h-4 w-4" /></Link>
        ) : (
          <a href={href} className="btn btn-go shrink-0 max-w-full" data-testid={`link-end-${id}`}>{label}<ArrowRight className="h-4 w-4" /></a>
        )}
      </div>
    </section>
  );
}

export function SectionHead({ n, title, children }: { n: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-10 grid gap-4 border-t-2 border-[var(--ink)] pt-5 md:grid-cols-[120px_1fr]">
      <span className="eyebrow text-[var(--slate)]">{n}</span>
      <div>
        <h2 className="max-w-3xl text-[32px] md:text-[44px] font-semibold leading-[1.08]">{title}</h2>
        {children && <div className="mt-4 max-w-2xl text-[17px] text-[#2E3A46]">{children}</div>}
      </div>
    </div>
  );
}
