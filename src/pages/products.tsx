import { useMemo, type ReactNode } from 'react';
import { Link, useLocation, useParams, useSearch } from 'wouter';
import { ArrowLeft, ArrowRight, FileText, Search, X } from 'lucide-react';
import { EndAction, PageHero, Src, useMeta } from '@/components/site';
import { APPS, PRODUCTS, SRC, type Product } from '@/data';

const LINES = [
  { v: 'all', l: 'All lines' },
  { v: 'animal', l: 'Animal nutrition' },
  { v: 'food', l: 'Food ingredients' },
];

export default function Products() {
  useMeta('Products · 23 palm-based fats, fatty acids and specialty oils · Darby Trading', 'Rumen-protected fats and calcium salts for animal nutrition. Cocoa butter replacers, shortenings and specialty oils for bakery and confectionery. HS codes and documents by SKU.');
  const search = useSearch();
  const [, navigate] = useLocation();
  const q = new URLSearchParams(search);
  const line = q.get('line') ?? 'all';
  const app = q.get('app') ?? 'all';
  const ruling = q.get('ruling') === '1';
  const text = q.get('q') ?? '';

  const set = (k: string, v: string | null) => {
    const n = new URLSearchParams(search);
    if (v === null || v === 'all' || v === '') n.delete(k);
    else n.set(k, v);
    const s = n.toString();
    navigate(`/products${s ? `?${s}` : ''}`, { replace: true });
  };

  const list = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          (line === 'all' || p.line === line) &&
          (app === 'all' || p.apps.includes(app)) &&
          (!ruling || !!p.ruling) &&
          (!text || (p.name + p.plain).toLowerCase().includes(text.toLowerCase())),
      ),
    [line, app, ruling, text],
  );
  const filtered = line !== 'all' || app !== 'all' || ruling || text;

  return (
    <>
      <PageHero id="products" eyebrow="Products · 23 SKUs in two lines" title="Specified product, sold under the name on your purchase order." lede="Rumen-protected fats and calcium salts for animal nutrition. Specialty fats, shortenings and cocoa butter replacers for bakery and confectionery." />

      <section className="wrap py-14">
        <div className="sticky top-[72px] z-20 -mx-6 mb-8 border-b border-[var(--rule)] bg-[var(--paper)]/95 px-6 py-4 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <div className="seg max-w-full overflow-x-auto" role="tablist">
              {LINES.map((x) => (
                <button key={x.v} type="button" role="tab" aria-selected={line === x.v} onClick={() => set('line', x.v)} className="seg-btn whitespace-nowrap" data-testid={`filter-line-${x.v}`}>{x.l}</button>
              ))}
            </div>
            <select value={app} onChange={(e) => set('app', e.target.value)} className="field !w-auto max-w-full" aria-label="Application" data-testid="select-application">
              <option value="all">All applications</option>
              {APPS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <label className="check">
              <input type="checkbox" checked={ruling} onChange={(e) => set('ruling', e.target.checked ? '1' : null)} data-testid="checkbox-ruling" />
              Has a CBP ruling
            </label>
            <div className="relative ml-auto w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--slate)]" />
              <input value={text} onChange={(e) => set('q', e.target.value)} placeholder="Search DT80, CHOCH..." aria-label="Search products" className="field !pl-9" data-testid="input-product-search" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4 text-sm text-[var(--slate)]">
            <span data-testid="text-result-count"><strong className="text-[var(--ink)]">{list.length}</strong> of 23 products</span>
            {filtered && <button type="button" onClick={() => navigate('/products', { replace: true })} className="flex items-center gap-1 font-semibold text-[var(--ink)] hover:text-[var(--leaf)]" data-testid="button-clear-filters"><X className="h-3.5 w-3.5" />Clear filters</button>}
          </div>
        </div>

        {list.length === 0 ? (
          <div className="rounded-[4px] border border-dashed border-[#B8B4AB] py-20 text-center" data-testid="status-empty">
            <p className="serif text-3xl font-semibold">No product matches those filters.</p>
            <p className="mt-2 text-[var(--slate)]">If you need something we do not list, ask. We trade more than the catalog shows.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button type="button" onClick={() => navigate('/products', { replace: true })} className="btn btn-ghost" data-testid="button-empty-clear">Clear filters</button>
              <Link href="/request-a-quote" className="btn btn-go" data-testid="link-empty-quote">Ask a trader</Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="ledger w-full min-w-[720px] text-[15px]" data-testid="table-products">
              <thead><tr><th>Product</th><th>Line</th><th>Description</th><th>HS code</th><th /></tr></thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.slug} className="cursor-pointer" onClick={() => navigate(`/products/${p.slug}`)} data-testid={`row-product-${p.slug}`}>
                    <td><Link href={`/products/${p.slug}`} className="serif text-lg font-semibold hover:text-[var(--leaf)]" onClick={(e) => e.stopPropagation()} data-testid={`link-product-${p.slug}`}>{p.name}</Link></td>
                    <td className="whitespace-nowrap text-[var(--slate)]">{p.line === 'animal' ? 'Animal nutrition' : 'Food ingredients'}</td>
                    <td className="text-[#2E3A46]">{p.plain}</td>
                    <td className="whitespace-nowrap font-mono text-sm">{p.hs ?? <span className="text-[var(--slate)]">On spec sheet</span>}</td>
                    <td className="text-right"><ArrowRight className="ml-auto h-4 w-4 text-[var(--leaf)]" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <EndAction id="products" title="Need a sample before you switch?" body="Tell us the product and the plant. We send a sample with its documents." href="/request-a-quote?type=sample" label="Request a sample" />
    </>
  );
}

function Row({ k, v }: { k: string; v: ReactNode }) {
  return (
    <tr><td className="w-[38%] text-[var(--slate)]">{k}</td><td>{v}</td></tr>
  );
}

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const p = PRODUCTS.find((x) => x.slug === slug);
  useMeta(
    p ? `${p.name} · ${p.line === 'animal' ? 'Animal nutrition' : 'Food ingredients'} · Darby Trading` : 'Product not found · Darby Trading',
    p ? `${p.name}: ${p.plain} Imported and held in US port warehouses by Darby Trading. Request a quote or a sample.` : 'This product is not in the Darby Trading catalog.',
  );
  if (!p) {
    return (
      <div className="wrap py-32 text-center">
        <h1 className="text-5xl font-semibold" data-testid="text-product-missing">Product not found</h1>
        <Link href="/products" className="btn btn-ink mt-8" data-testid="link-back-catalog">Back to the catalog</Link>
      </div>
    );
  }
  const siblings: Product[] = PRODUCTS.filter((x) => x.line === p.line && x.slug !== p.slug).slice(0, 4);
  return (
    <>
      <section className="border-b border-[var(--rule)] bg-white">
        <div className="wrap py-10">
          <nav className="flex items-center gap-2 text-sm text-[var(--slate)]" aria-label="Breadcrumb">
            <Link href="/products" className="flex items-center gap-1 hover:text-[var(--ink)]" data-testid="link-breadcrumb-products"><ArrowLeft className="h-3.5 w-3.5" />Products</Link>
            <span>/</span>
            <Link href={`/products?line=${p.line}`} className="hover:text-[var(--ink)]" data-testid="link-breadcrumb-line">{p.line === 'animal' ? 'Animal nutrition' : 'Food ingredients'}</Link>
          </nav>
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div>
              <h1 className="rise break-words text-[48px] sm:text-[64px] md:text-[96px] font-semibold leading-[.92] tracking-[-0.025em]" data-testid="text-product-name">{p.name}</h1>
              <p className="mt-6 max-w-xl text-xl text-[#2E3A46]" data-testid="text-product-description">{p.plain}</p>
              <p className="mt-2 text-sm text-[var(--slate)]" data-testid="text-product-apps">{p.apps.join(' · ')}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/request-a-quote?product=${encodeURIComponent(p.name)}`} className="btn btn-go" data-testid="link-product-quote">Request a quote</Link>
                <Link href={`/request-a-quote?type=sample&product=${encodeURIComponent(p.name)}`} className="btn btn-ghost" data-testid="link-product-sample">Request a sample</Link>
              </div>
            </div>
            <div className="min-w-0 self-start overflow-x-auto"><table className="ledger w-full text-[15px]" data-testid="table-product-facts">
              <thead><tr><th colSpan={2}>Product record</th></tr></thead>
              <tbody>
                <Row k="Line" v={p.line === 'animal' ? 'Animal nutrition' : 'Food ingredients'} />
                <Row k="HS code" v={p.hs ? <span className="font-mono">{p.hs}</span> : <span className="text-[var(--slate)]">Listed on the spec sheet</span>} />
                <Row k="CBP ruling" v={p.ruling ? <span className="font-mono"><Src href={p.ruling.includes('H312647') ? SRC.cbp1 : SRC.cbp2}>{p.ruling}</Src></span> : <span className="text-[var(--slate)]">None specific to this SKU</span>} />
                <Row k="Origin" v="Malaysia and Indonesia producers" />
                <Row k="Held at" v="US port warehouses. Ask for nearest stock." />
                <Row k="Pack sizes" v={<span className="text-[var(--slate)]">On request</span>} />
              </tbody>
            </table></div>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-12 py-20 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold">Typical analysis</h2>
          <p className="mt-3 text-[#2E3A46]">The typical analysis for {p.name} is published on its specification sheet. We will post it here once the sheet is in the library. Until then, a trader sends it the same day you ask.</p>
          <a href={`mailto:info@darbyinc.com?subject=${encodeURIComponent(`${p.name} specification sheet`)}`} className="link-u mt-4 inline-block font-semibold" data-testid="link-request-spec">Email for the {p.name} spec sheet</a>
        </div>
        <div>
          <h2 className="text-3xl font-semibold">Documents</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {['Specification', 'Safety data sheet', 'Sample COA'].map((d) => (
              <div key={d} className="flex aspect-[3/4] flex-col justify-between rounded-[4px] border border-[var(--rule)] bg-white p-4" data-testid={`card-doc-${d.toLowerCase().replace(/\s/g, '-')}`}>
                <FileText className="h-5 w-5 text-[var(--slate)]" />
                <span><strong className="block text-sm leading-tight">{p.name} {d}</strong><span className="eyebrow text-[10px] text-[var(--slate)]">On request</span></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {siblings.length > 0 && (
        <section className="border-t border-[var(--rule)] bg-white">
          <div className="wrap py-16">
            <h2 className="mb-6 text-2xl font-semibold">Also in {p.line === 'animal' ? 'animal nutrition' : 'food ingredients'}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {siblings.map((s) => (
                <Link key={s.slug} href={`/products/${s.slug}`} className="group rounded-[4px] border border-[var(--rule)] p-5 transition-colors hover:border-[var(--ink)]" data-testid={`link-sibling-${s.slug}`}>
                  <strong className="serif text-xl">{s.name}</strong>
                  <p className="mt-1 text-sm text-[var(--slate)]">{s.plain}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <EndAction id="product" title={`Price ${p.name} to your plant.`} body="Tell us the volume and destination. A trader replies with price and availability by warehouse." href={`/request-a-quote?product=${encodeURIComponent(p.name)}`} label="Request a quote" />
    </>
  );
}
