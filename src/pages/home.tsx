import { Link } from 'wouter';
import { ArrowRight, FileText, ShieldCheck, Lock, FlaskConical } from 'lucide-react';
import { Reveal, Src, useMeta } from '@/components/site';
import { HeroVideo } from '@/components/hero-video';
import { MARKETS, PRODUCTS, SRC, TIMELINE } from '@/data';
import { WarehouseMap } from '@/components/warehouse-map';

export default function Home() {
  useMeta(
    'Darby Trading · Palm-based ingredient trading house since 1992',
    'Darby Trading imports, stocks and delivers palm-based fats and fatty acids for dairy rations, bakery and confectionery across the United States. Since 1992. Purchase, New York.',
  );
  const animal = PRODUCTS.filter((p) => p.line === 'animal');
  const food = PRODUCTS.filter((p) => p.line === 'food');
  return (
    <>
      <section className="relative isolate overflow-hidden bg-[var(--deep)] text-[#FBFAF7]" data-testid="section-hero">
        <HeroVideo />
        <div className="wrap relative pb-20 pt-24 md:pb-28 md:pt-36">
          <h1 className="rise max-w-[1020px] break-words text-[40px] min-[400px]:text-[46px] sm:text-[60px] lg:text-[84px] font-semibold leading-[0.98] tracking-[-0.018em] [text-shadow:0_2px_24px_rgba(6,20,32,.45)]" data-testid="text-hero-title">
            Essential ingredients for the industries that feed the world.
          </h1>
          <p className="rise mt-8 max-w-[620px] text-lg md:text-[22px] leading-[1.4] text-[#DCE3E9]" style={{ animationDelay: '120ms' }}>
            Palm-based fats and fatty acids for your rations, your bakery lines and your confectionery. Specified, documented and in stock at a US port near you.
          </p>
          <div className="rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: '220ms' }}>
            <Link href="/request-a-quote" className="btn btn-go text-[17px] !px-7 !py-4" data-testid="link-hero-quote">Request a quote</Link>
            <Link href="/products" className="btn btn-ghost-dark bg-[rgba(11,28,43,.35)] text-[17px] !px-7 !py-4" data-testid="link-hero-products">See the 23 products</Link>
          </div>
        </div>
      </section>

      <nav aria-label="Choose your route" className="border-b border-[var(--rule)] bg-white">
        <div className="wrap grid md:grid-cols-3">
          {[
            { t: 'I buy ingredients', d: 'Catalog, specs and stock by US port', h: '/products' },
            { t: 'I produce ingredients', d: 'Our record as a counterparty for terms', h: '/trade-finance#suppliers' },
            { t: 'I finance or insure trade', d: 'Trade flows, rulings and the KYC pack', h: '/trade-finance' },
          ].map((c, i) => (
            <Link
              key={c.t}
              href={c.h}
              className={`group flex items-center justify-between gap-6 py-8 transition-colors hover:bg-[var(--paper)] md:py-10 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-[var(--rule)]' : ''} ${i === 0 ? 'md:pr-8' : i === 1 ? 'md:px-8' : 'md:pl-8'}`}
              data-testid={`link-route-${i}`}
            >
              <span className="min-w-0">
                <span className="serif block text-[28px] md:text-[32px] font-semibold leading-[1.1]">{c.t}</span>
                <span className="mt-2 block text-[15px] text-[var(--slate)]">{c.d}</span>
              </span>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--ink)] transition-colors group-hover:border-[var(--leaf)] group-hover:bg-[var(--leaf)] group-hover:text-[#FBFAF7]">
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </nav>

      <section className="wrap py-24">
        <Reveal><h2 className="mb-10 max-w-2xl text-[34px] md:text-[44px] font-semibold leading-[1.1]">Built for the way you make things</h2></Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MARKETS.map((m, i) => (
            <Reveal key={m.name} delay={i * 90} className={i % 2 ? 'lg:mt-12' : ''}>
              <Link href={m.to} className="group relative flex min-h-[340px] md:min-h-[380px] flex-col justify-end overflow-hidden rounded-[4px] p-6 text-[#FBFAF7]" style={{ background: m.tone }} data-testid={`card-market-${i}`}>
                <span className="eyebrow absolute left-6 top-6" style={{ color: m.tint }}>0{i + 1}</span>
                <span className="serif absolute -right-3 top-6 text-[150px] leading-none font-semibold opacity-[.08] transition-transform duration-700 group-hover:-translate-x-3">{m.name[0]}</span>
                <span className="serif text-[26px] font-semibold leading-[1.15]">{m.name}</span>
                <span className="mt-2 text-[15px]" style={{ color: m.tint }}>{m.line}</span>
                <span className="mt-6 flex items-center gap-2 text-sm font-semibold opacity-70 transition group-hover:opacity-100">View <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-label="Statement" className="bg-[var(--linen)]">
        <Reveal className="wrap py-24 md:py-28 text-center">
          <p className="serif mx-auto max-w-[920px] text-[28px] md:text-[44px] leading-[1.2]" data-testid="text-statement">
            You should not need an import desk to buy a container of palmitic acid. Order it the way you order soy. We handle the ocean, the customs and the warehouse.
          </p>
        </Reveal>
      </section>

      <section className="wrap py-24">
        <h2 className="mb-10 text-[34px] md:text-[44px] font-semibold leading-[1.1]">What you get with every order</h2>
        <div className="relative grid gap-10 md:grid-cols-4 md:gap-8">
          <div className="absolute left-[16px] right-[16px] top-[16px] hidden h-[2px] bg-[var(--rule)] md:block" />
          {[
            ['Source', 'The same producers we have bought from for years, so your spec stays consistent lot to lot.'],
            ['Finance', 'Terms on your order. We carry the cargo until it lands.'],
            ['Land', 'Classified and cleared before it reaches you. No surprise duties.'],
            ['Deliver', 'Pallet, truckload or tanker from the nearest warehouse, with spec, SDS and COA ahead of the truck.'],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 120} className="relative">
              <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-[var(--leaf)] bg-[var(--paper)]"><span className="h-2.5 w-2.5 rounded-full bg-[var(--leaf)]" /></span>
              <h3 className="mt-5 text-[30px] font-semibold">{t}</h3>
              <p className="mt-2 text-[15px] text-[#2E3A46]">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--rule)] bg-white">
        <div className="wrap grid gap-6 py-20 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="flex min-h-[420px] flex-col justify-between rounded-[4px] bg-[var(--ink)] p-10 text-[#FBFAF7]">
              <div className="serif text-[160px] font-semibold leading-[.85] tracking-[-0.03em]" data-testid="text-product-count">23</div>
              <div>
                <p className="mb-5 text-xl leading-[1.35]">Products, each sold under the exact name on your purchase order, with an HS code and a document path.</p>
                <Link href="/products" className="font-semibold text-[var(--leaf-light)] inline-flex items-center gap-2" data-testid="link-full-catalog">Full catalog <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </Reveal>
          <div className="grid gap-6 lg:col-span-7">
            {[
              { t: 'Animal nutrition', d: 'Raise ration energy density without upsetting rumen function.', list: animal, line: 'animal' },
              { t: 'Food ingredients', d: 'Replacers and shortenings that behave like the fats they replace.', list: food, line: 'food' },
            ].map((x, i) => (
              <Reveal key={x.t} delay={i * 120}>
                <Link href={`/products?line=${x.line}`} className="group grid grid-cols-[1fr_auto] gap-6 rounded-[4px] border border-[var(--rule)] p-8 transition-colors hover:border-[var(--ink)]" data-testid={`card-line-${x.line}`}>
                  <div>
                    <h3 className="text-[28px] font-semibold">{x.t}</h3>
                    <p className="mt-2 text-[#2E3A46]">{x.d}</p>
                    <p className="mt-4 text-sm text-[var(--slate)]">{x.list.map((p) => p.name).join(' · ')}</p>
                  </div>
                  <span className="serif text-[48px] font-semibold leading-none text-[var(--leaf)]">{x.list.length}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--harbor)] text-[#FBFAF7]">
        <div className="wrap py-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-2xl text-[34px] md:text-[44px] font-semibold leading-[1.1]">Stock held at six US ports, close to your plant</h2>
            <Link href="/logistics" className="btn btn-ghost-dark" data-testid="link-home-logistics">Ports and warehouses <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <WarehouseMap tone="dark" idPrefix="home-map" />
          <p className="mt-6 text-sm text-[#9FC4CF]">Order from the warehouse nearest you by pallet, truckload or tanker. Discharge ports on our customs record · <a href={SRC.importinfo} className="link-u text-[var(--leaf-light)]" target="_blank" rel="noreferrer" data-testid="link-source-lanes">ImportInfo</a></p>
        </div>
      </section>

      <section className="wrap py-24">
        <h2 className="mb-12 max-w-3xl text-[34px] md:text-[44px] font-semibold leading-[1.1]">We have been your supplier's supplier since 1992</h2>
        <ol className="grid gap-8 border-t-2 border-[var(--ink)] pt-6 sm:grid-cols-3 lg:grid-cols-6">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.y} delay={i * 70}>
              <li className="grid gap-2.5 list-none" data-testid={`text-timeline-${t.y}`}>
                <span className="serif text-[40px] font-semibold leading-none">{t.y}</span>
                <span className="text-[15px] text-[#2E3A46]">{t.t} <span className="src"><Src href={t.src}>{t.s}</Src></span></span>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="border-y border-[var(--rule)] bg-white">
        <div className="wrap grid items-center gap-10 py-20 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-[34px] md:text-[40px] font-semibold leading-[1.1]">The documents your team will ask for, ready before you ask</h2>
            <p className="mt-4 text-[#2E3A46]">Vendor onboarding should take an afternoon, not a quarter.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {[
              { i: ShieldCheck, t: 'RSPO member', d: 'No. 2-1713-26-000-00', h: SRC.rspo },
              { i: FileText, t: 'Two US Customs rulings', d: 'H312647 · H312954', h: '/compliance' },
              { i: Lock, t: 'FDA food facility registration', d: 'Number to be supplied by Darby', h: '/compliance' },
              { i: FlaskConical, t: 'Lot-level documents', d: 'Spec, SDS and COA by SKU, on request', h: '/documents' },
            ].map((c, k) => {
              const inner = (
                <>
                  <c.i className="h-9 w-9 shrink-0 text-[var(--leaf)]" strokeWidth={1.5} />
                  <span><strong className="block text-[17px]">{c.t}</strong><span className="text-sm text-[var(--slate)]">{c.d}</span></span>
                </>
              );
              const cls = 'flex items-center gap-4 rounded-[4px] border border-[var(--rule)] px-6 py-5 transition-colors hover:border-[var(--leaf)]';
              return c.h.startsWith('/') ? (
                <Link key={c.t} href={c.h} className={cls} data-testid={`card-proof-${k}`}>{inner}</Link>
              ) : (
                <a key={c.t} href={c.h} target="_blank" rel="noreferrer" className={cls} data-testid={`card-proof-${k}`}>{inner}</a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[var(--ink)] text-[#FBFAF7]">
        <div className="wrap grid items-center gap-10 py-24 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="text-[36px] md:text-[52px] font-semibold leading-[1.05]">If you finance us or supply us, here is the record.</h2>
            <p className="mt-5 max-w-[640px] text-lg text-[#C8D0D8]">Regular container cargoes since 2006, pre-sold or sold from US stock, classification settled by ruling. Ask for the KYC pack.</p>
          </div>
          <div className="grid gap-3 lg:col-span-4">
            <Link href="/trade-finance" className="btn btn-go justify-center !py-4" data-testid="link-home-kyc">Request the KYC pack</Link>
            <Link href="/compliance" className="btn btn-ghost-dark justify-center !py-4" data-testid="link-home-compliance">Compliance</Link>
          </div>
        </div>
      </section>

      <section className="wrap grid items-center gap-10 py-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="flex aspect-[4/5] flex-col justify-between rounded-[4px] border border-dashed border-[#B8B4AB] bg-[var(--linen)] p-6">
            <img src="/brand/DT-Mark-green.png" alt="" className="h-10 w-auto self-start opacity-80" />
            <p className="eyebrow text-[var(--slate)]" data-testid="text-portrait-placeholder">Portrait pending · Ryan Fales at the Purchase office</p>
          </div>
        </div>
        <div className="lg:col-span-7">
          <h2 className="text-[34px] md:text-[44px] font-semibold leading-[1.1]">Call us and you reach the person who decides</h2>
          <p className="mt-5 text-lg text-[#2E3A46]">Ryan Fales, CEO on the New York filing, runs Darby Trading from Purchase, New York. When you need a price, a lot change or a faster truck, you are talking to the person who can say yes.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/about" className="btn btn-ink" data-testid="link-home-about">About Darby</Link>
            <a href={SRC.ryan} target="_blank" rel="noreferrer" className="btn btn-ghost" data-testid="link-ryan-linkedin">Ryan Fales on LinkedIn</a>
          </div>
        </div>
      </section>

      <section className="bg-[var(--linen)]">
        <div className="wrap flex flex-col items-start justify-between gap-8 py-20 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-[var(--slate)]">Next step</p>
            <h2 className="mt-3 text-[34px] md:text-[48px] font-semibold leading-[1.05]">Tell us the product, volume and destination.</h2>
            <p className="mt-3 text-[#2E3A46]">A trader replies within one business day.</p>
          </div>
          <Link href="/request-a-quote" className="btn btn-go !px-7 !py-4 text-[17px]" data-testid="link-home-final-quote">Request a quote <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
