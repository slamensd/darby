import { useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, Phone, Mail } from 'lucide-react';
import { CONTACT, SRC } from '@/data';
import { SiteHeader } from '@/components/site-header';
import { getPageMeta, metaEntries, normalizePath, SITE_ORIGIN } from '@/lib/seo';

function useMeta() {
  const [location] = useLocation();
  useEffect(() => {
    const meta = getPageMeta(location);
    document.title = meta.title;
    const setMeta = (selector: string, attribute: string, key: string, content: string) => {
      let meta = document.querySelector<HTMLMetaElement>(selector);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    for (const [attribute, key, content] of metaEntries(meta, location)) {
      setMeta(`meta[${attribute}="${key}"]`, attribute, key, content);
    }
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE_ORIGIN}${normalizePath(location)}`;
  }, [location]);
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
  useMeta();
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
      <SiteHeader />
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
