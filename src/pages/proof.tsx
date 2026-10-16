import { Link } from 'wouter';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, ExternalLink, FileText } from 'lucide-react';
import { EndAction, PageHero, Reveal, SectionHead, Src, useMeta } from '@/components/site';
import { CONTACT, PRODUCERS, SRC, TIMELINE } from '@/data';

function Faq({ items, id }: { items: [string, string][]; id: string }) {
  return (
    <Accordion.Root type="single" collapsible className="border-t-2 border-[var(--ink)]" data-testid={`accordion-${id}`}>
      {items.map(([q, a], i) => (
        <Accordion.Item key={q} value={`i${i}`} className="border-b border-[var(--rule)]">
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold hover:text-[var(--leaf)]" data-testid={`button-accordion-${id}-${i}`}>
              {q}
              <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <p className="max-w-3xl pb-6 text-[16px] text-[#2E3A46]">{a}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

const STATUS = (s: 'Sourced' | 'Pending' | 'Not held') => (
  <span className={`eyebrow inline-block rounded-[3px] px-2 py-1 text-[10px] ${s === 'Sourced' ? 'bg-[#E3F0DF] text-[#2D6B22]' : s === 'Pending' ? 'bg-[#F3EBD9] text-[#7A5A2E]' : 'bg-[var(--linen)] text-[var(--slate)]'}`}>{s}</span>
);

export function Compliance() {
  useMeta('Compliance · RSPO membership, CBP rulings, registrations · Darby Trading', 'RSPO member no. 2-1713-26-000-00. Two US Customs rulings on the DT line, H312647 and H312954. The registry facts procurement and lenders ask for.');
  return (
    <>
      <PageHero id="compliance" eyebrow="Compliance" title="The registry facts, each linked to its source." lede="Procurement and credit teams should not have to take our word. Every entry below points to the public record or says plainly that the document is pending." />
      <section className="wrap py-24">
        <SectionHead n="01 · Register" title="Certificate and registry register" />
        <div className="overflow-x-auto">
          <table className="ledger w-full min-w-[760px] text-[15px]" data-testid="table-compliance">
            <thead><tr><th>Item</th><th>Issuer</th><th>Number</th><th>Status</th><th>Record</th></tr></thead>
            <tbody>
              <tr data-testid="row-compliance-rspo"><td className="font-semibold">RSPO ordinary member</td><td>Roundtable on Sustainable Palm Oil</td><td className="font-mono">2-1713-26-000-00</td><td>{STATUS('Sourced')}</td><td><Src href={SRC.rspo}>Member page</Src></td></tr>
              <tr data-testid="row-compliance-h312647"><td className="font-semibold">Classification ruling, DT 80</td><td>US Customs and Border Protection</td><td className="font-mono">HQ H312647</td><td>{STATUS('Sourced')}</td><td><Src href={SRC.cbp1}>CBP</Src></td></tr>
              <tr data-testid="row-compliance-h312954"><td className="font-semibold">Classification ruling, DT 80, DT 98, DT 100</td><td>US Customs and Border Protection</td><td className="font-mono">HQ H312954</td><td>{STATUS('Sourced')}</td><td><Src href={SRC.cbp2}>CBP</Src></td></tr>
              <tr data-testid="row-compliance-fda"><td className="font-semibold">FDA food facility registration</td><td>US Food and Drug Administration</td><td className="text-[var(--slate)]">To be supplied by Darby</td><td>{STATUS('Pending')}</td><td className="text-[var(--slate)]">On request</td></tr>
              <tr data-testid="row-compliance-recalls"><td className="font-semibold">FDA recall records naming Darby</td><td>openFDA enforcement</td><td className="font-mono">None found</td><td>{STATUS('Sourced')}</td><td><Src href={SRC.openfda}>openFDA</Src></td></tr>
              <tr data-testid="row-compliance-kosher"><td className="font-semibold">Kosher or halal certificates</td><td>n/a</td><td className="text-[var(--slate)]">None published</td><td>{STATUS('Not held')}</td><td className="text-[var(--slate)]">Ask about specific SKUs</td></tr>
              <tr data-testid="row-compliance-nydos"><td className="font-semibold">New York incorporation</td><td>NY Department of State</td><td className="font-mono">DOS ID 2588926</td><td>{STATUS('Sourced')}</td><td><Src href={SRC.nydos}>NY DOS</Src></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-y border-[var(--rule)] bg-white">
        <div className="wrap grid gap-12 py-24 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow text-[var(--leaf)]">Customs</p>
            <h2 className="mt-3 text-[34px] font-semibold leading-[1.1]">Your duty on the DT line is already settled.</h2>
            <p className="mt-4 text-[#2E3A46]">HQ H312647, 16 February 2021: protest granted, DT 80 classified under 3823.19.20. HQ H312954, 8 July 2021: DT 80 and DT 100 at 2.3 percent, DT 98 under 2915.70.0110 at 5 percent.</p>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow text-[var(--leaf)]">Palm</p>
            <h2 className="mt-3 text-[34px] font-semibold leading-[1.1]">RSPO member, in the processors and traders category.</h2>
            <p className="mt-4 text-[#2E3A46]">Darby is an RSPO member. It does not yet hold an RSPO supply chain certificate, and no ACOP report has been filed. We say member, not certified.</p>
          </Reveal>
        </div>
      </section>

      <section className="wrap py-24">
        <SectionHead n="02 · Questions" title="What procurement usually asks" />
        <Faq
          id="compliance"
          items={[
            ['Is Darby RSPO certified?', 'Darby is an RSPO member, no. 2-1713-26-000-00. A supply chain certificate has not been issued. We will update this page if that changes.'],
            ['Can I get the FDA registration number for a vendor form?', 'Yes. Ask and we send it with the vendor pack. It will be published here once confirmed.'],
            ['Which HS codes apply to your products?', 'The DT line is covered by the two rulings above. Other SKUs carry their HS code on the specification sheet.'],
            ['Do you hold kosher or halal certificates?', 'None are published today. Ask about a specific SKU and we will check with the producer.'],
          ]}
        />
      </section>
      <EndAction id="compliance" title="Onboarding us as a vendor?" body="Ask for the vendor pack. It goes out the same day." href={`mailto:${CONTACT.email}?subject=Vendor%20pack%20request`} label="Request the vendor pack" />
    </>
  );
}

export function TradeFinance() {
  useMeta('Trade finance and counterparty · Darby Trading', 'For lenders, credit insurers and overseas producers: origins, commodities, HS codes, cadence, ports and buyer segments of Darby Trading flows. KYC pack on request.');
  const kyc = `mailto:${CONTACT.email}?subject=${encodeURIComponent('KYC pack request')}&body=${encodeURIComponent('Institution:\nName and role:\nPurpose (credit line, credit insurance, supply terms):\n')}`;
  return (
    <>
      <PageHero id="finance" eyebrow="Trade finance and counterparty" title="If you finance us or supply us, here is the record." lede="Regular container cargoes since 2006, pre-sold or sold from US stock, classification settled by ruling.">
        <a href={kyc} className="btn btn-go" data-testid="link-hero-kyc">Request the KYC pack</a>
      </PageHero>

      <section className="wrap py-24">
        <SectionHead n="01 · Flow" title="The trade flow, stated for underwriting" />
        <div className="overflow-x-auto">
          <table className="ledger w-full min-w-[700px] text-[15px]" data-testid="table-flow">
            <tbody>
              {[
                ['Origins', 'Malaysia and Indonesia producers; lading at Kaohsiung, Singapore, Laem Chabang, Belawan, Tanjung Pelepas', <Src href={SRC.importinfo}>ImportInfo</Src>],
                ['Commodities', 'Palm fatty acids, rumen-protected fats and calcium salts, specialty food fats', <Src href={SRC.panjiva}>Panjiva</Src>],
                ['HS codes', '2915.70 · 3823.11 · 3823.19.20 · 2309.90', <Src href={SRC.cbp2}>CBP</Src>],
                ['Cadence', 'About 80 to 120 shipments a year. Estimated', <Src href={SRC.importgenius}>ImportGenius</Src>],
                ['Cargo size', '52,000 to 133,000 kg per bill of lading in late 2024 and 2025 samples', <Src href={SRC.importgenius}>ImportGenius</Src>],
                ['US discharge', 'Tacoma, Oakland, Baltimore, Savannah, Norfolk and others; six port warehouses', <Link href="/logistics" className="link-u" data-testid="link-flow-logistics">Logistics</Link>],
                ['Buyer segments', 'US feed mills and nutritionists, bakery and confectionery manufacturers, distributors', 'Company'],
                ['Continuous importing', 'Customs record from November 2006', <Src href={SRC.importgenius}>ImportGenius</Src>],
              ].map(([k, v, s], i) => (
                <tr key={i} data-testid={`row-flow-${i}`}>
                  <td className="w-[22%] font-semibold">{k}</td>
                  <td className="text-[#2E3A46]">{v}</td>
                  <td className="w-[16%] text-sm text-[var(--slate)]">{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-[var(--ink)] text-[#FBFAF7]">
        <div className="wrap grid gap-px py-20 md:grid-cols-4">
          {[
            ['Pre-sold cargo', 'Cargoes are pre-sold to US buyers or sold from US stock held at port warehouses.'],
            ['Letter of credit', 'Producer terms can be supported by documentary credit on request.'],
            ['Borrowing base', 'Inventory sits in US 3PL warehouses with lot-level documents.'],
            ['Credit-insured receivable', 'Receivables are from US manufacturers and distributors.'],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 90} className="border-l border-[#1E3A52] px-6 py-4">
              <p className="eyebrow text-[var(--leaf-light)]">0{i + 1}</p>
              <h3 className="mt-3 text-2xl font-semibold">{t}</h3>
              <p className="mt-2 text-[15px] text-[#C8D0D8]">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="suppliers" className="wrap grid scroll-mt-24 gap-12 py-24 lg:grid-cols-2">
        <div>
          <p className="text-[15px] font-semibold text-[var(--leaf)]">For producers</p>
          <h2 className="mt-2 text-[34px] font-semibold leading-[1.1]">Named producers on the customs record</h2>
          <p className="mt-3 text-[#2E3A46]">Repeat relationships with Southeast Asian oleochemical producers. If you are deciding on terms, ask for the KYC pack below.</p>
          <p className="src mt-3">Source: <Src href={SRC.importgenius}>ImportGenius</Src> and <Src href={SRC.importinfo}>ImportInfo</Src> previews.</p>
        </div>
        <ul className="grid gap-0 border-t-2 border-[var(--ink)]">
          {PRODUCERS.map((p, i) => (
            <li key={p} className="flex justify-between border-b border-[var(--rule)] py-3 text-[16px]" data-testid={`text-producer-${i}`}><span>{p}</span><span className="font-mono text-sm text-[var(--slate)]">{String(i + 1).padStart(2, '0')}</span></li>
          ))}
        </ul>
      </section>

      <section className="border-t border-[var(--rule)] bg-white">
        <div className="wrap py-24">
          <SectionHead n="02 · Counterparty" title="What is in the KYC pack" />
          <Faq
            id="finance"
            items={[
              ['Corporate documents', 'New York filings for Darby Trading Incorporated, DOS ID 2588926, and officer details.'],
              ['Trade record', 'Shipment history by origin, discharge port and HS code, drawn from the customs record.'],
              ['Compliance', 'RSPO membership, CBP rulings H312647 and H312954, FDA registration.'],
              ['Banks and credit insurers', 'Institutions are described in the pack and named only with their written consent. Facility sizes are not published.'],
            ]}
          />
        </div>
      </section>
      <EndAction id="finance" title="Request the KYC pack." body="Tell us your institution and purpose. The pack goes out the same day." href={kyc} label="Request the KYC pack" />
    </>
  );
}

export function About() {
  useMeta('About Darby Trading · Importing since 1992 · Purchase, New York', 'Darby Trading Incorporated, a palm-based ingredient trading house in Purchase, New York. Filed in New York in 1992. CEO Ryan Fales.');
  return (
    <>
      <PageHero id="about" eyebrow="About" title="A trading house with a public record since 1992." lede="Darby Trading imports palm-based fats, fatty acids and specialty oils from named producers in Malaysia and Indonesia and holds them at six US ports." />
      <section className="wrap grid items-center gap-12 py-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="flex aspect-[4/5] flex-col justify-between rounded-[4px] border border-dashed border-[#B8B4AB] bg-[var(--linen)] p-6">
            <img src="/brand/DT-Mark-green.png" alt="" className="h-10 w-auto self-start opacity-80" />
            <p className="eyebrow text-[var(--slate)]">Portrait pending · Ryan Fales</p>
          </div>
        </div>
        <div className="lg:col-span-7">
          <p className="eyebrow text-[var(--leaf)]">Principal</p>
          <h2 className="mt-3 text-[40px] font-semibold leading-[1.08]" data-testid="text-principal">Ryan Fales, CEO</h2>
          <p className="mt-5 text-lg text-[#2E3A46]">Ryan Fales is named as CEO on the New York filing for Darby Trading Incorporated. He runs the business from Purchase, New York. Call and you reach the person who decides.</p>
          <p className="mt-4 text-sm text-[var(--slate)]">A fuller biography will be added after the owner interview.</p>
          <a href={SRC.ryan} target="_blank" rel="noreferrer" className="link-u mt-5 inline-flex items-center gap-1.5 font-semibold" data-testid="link-about-ryan">Ryan Fales on LinkedIn <ExternalLink className="h-3.5 w-3.5" /></a>
        </div>
      </section>

      <section className="border-y border-[var(--rule)] bg-white">
        <div className="wrap py-24">
          <SectionHead n="01 · Record" title="The record, year by year" />
          <ol className="relative ml-2 border-l-2 border-[var(--ink)]">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.y} delay={i * 60}>
                <li className="relative grid gap-2 pb-10 pl-8 md:grid-cols-[140px_1fr]" data-testid={`row-about-timeline-${t.y}`}>
                  <span className="absolute -left-[7px] top-3 h-3 w-3 rounded-full bg-[var(--leaf)]" />
                  <span className="serif text-[40px] font-semibold leading-none">{t.y}</span>
                  <span className="pt-2 text-[17px] text-[#2E3A46]">{t.t} <span className="src"><Src href={t.src}>{t.s}</Src></span></span>
                </li>
              </Reveal>
            ))}
          </ol>
          <p className="src">Three New York entities share the Darby name and Fales family officers. No document states the merger chain between them.</p>
        </div>
      </section>

      <section className="wrap grid gap-12 py-24 lg:grid-cols-2">
        <div>
          <h2 className="text-[34px] font-semibold leading-[1.1]">Boilerplate</h2>
          <p className="mt-4 text-lg text-[#2E3A46]" data-testid="text-boilerplate">Darby Trading is a specialist palm-based ingredient trading house. It imports documented fats, fatty acids and specialty oils from named Malaysian and Indonesian producers and holds them in six US port warehouses. Darby has imported continuously since 2006 and was first filed in New York in 1992.</p>
        </div>
        <div>
          <h2 className="text-[34px] font-semibold leading-[1.1]">Offices on record</h2>
          <div className="mt-4 overflow-x-auto"><table className="ledger w-full text-[15px]">
            <tbody>
              <tr><td>2019 on</td><td>3000 Westchester Ave, Suite 200A, Purchase NY</td></tr>
              <tr><td>To 2019</td><td>1133 Westchester Ave, White Plains NY</td></tr>
              <tr><td>Earlier</td><td>110 Corporate Park Dr, West Harrison NY</td></tr>
              <tr><td>1995 to 2001</td><td>Stamford CT</td></tr>
            </tbody>
          </table></div>
        </div>
      </section>
      <EndAction id="about" title="Talk to Darby." body="One phone number, one inbox, and the person who decides." href="/contact" label="Contact" />
    </>
  );
}

const DOCS = [
  { cat: 'Registry', t: 'RSPO membership', d: '2-1713-26-000-00', h: SRC.rspo, ok: true },
  { cat: 'Ruling', t: 'CBP HQ H312647', d: 'DT 80 classification', h: SRC.cbp1, ok: true },
  { cat: 'Ruling', t: 'CBP HQ H312954', d: 'DT 80, DT 98, DT 100', h: SRC.cbp2, ok: true },
  { cat: 'Specification', t: 'Spec sheets, 23 SKUs', d: 'Typical analysis by product', ok: false },
  { cat: 'Safety', t: 'Safety data sheets', d: 'SDS by product', ok: false },
  { cat: 'Quality', t: 'Sample COAs', d: 'Certificate of analysis by product', ok: false },
  { cat: 'Registry', t: 'FDA food facility registration', d: 'Number from Darby', ok: false },
  { cat: 'Commercial', t: 'Terms of sale', d: 'Standard terms', ok: false },
  { cat: 'Commercial', t: 'W-9', d: 'On request', ok: false },
  { cat: 'Brand', t: 'Logo files', d: 'Wide, negative and mark', h: '/brand/DT-Logo-wide.png', ok: true },
];

const docId = (cat: string) => (cat === 'Specification' ? 'specs' : cat === 'Safety' ? 'sds' : undefined);

export function Documents() {
  useMeta('Documents · Spec sheets, SDS, COAs and certificates · Darby Trading', 'One library for Darby Trading documents: RSPO membership, CBP rulings, specification sheets, safety data sheets, sample COAs, terms of sale and logo files.');
  return (
    <>
      <PageHero id="documents" eyebrow="Documents" title="Download what you need." lede="Registry records link straight to the issuer. Product documents are being collected from producers and go out on request until they are posted." />
      <section className="wrap py-20">
        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {DOCS.map((d, i) => {
            const body = (
              <>
                <span className="flex items-center justify-between">
                  <span className="eyebrow text-[10px] text-[var(--slate)]">{d.cat}</span>
                  {d.ok ? <ExternalLink className="h-4 w-4 text-[var(--leaf)]" /> : <FileText className="h-4 w-4 text-[var(--slate)]" />}
                </span>
                <span>
                  <strong className="block text-[16px] leading-tight">{d.t}</strong>
                  <span className="text-[13px] text-[var(--slate)]">{d.d}</span>
                  <span className={`eyebrow mt-3 block text-[10px] ${d.ok ? 'text-[var(--leaf)]' : 'text-[#7A5A2E]'}`}>{d.ok ? 'Open' : 'On request'}</span>
                </span>
              </>
            );
            const cls = `flex aspect-[3/4] flex-col justify-between rounded-[4px] border bg-white p-5 transition-transform duration-300 hover:-translate-y-1 ${d.ok ? 'border-[var(--rule)] shadow-[0_1px_0_#D9D6CF]' : 'border-dashed border-[#B8B4AB]'}`;
            return d.h ? (
              <a key={d.t} href={d.h} target="_blank" rel="noreferrer" id={docId(d.cat)} className={cls} data-testid={`card-document-${i}`}>{body}</a>
            ) : (
              <a key={d.t} id={docId(d.cat)} href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Document request: ${d.t}`)}`} className={cls} data-testid={`card-document-${i}`}>{body}</a>
            );
          })}
        </div>
        <p className="src mt-8">Product documents are listed as on request until Darby posts the PDFs. Nothing on this page is a placeholder file.</p>
      </section>
      <EndAction id="documents" title="Need a document we have not posted?" body="Ask for it by product and lot." href={`mailto:${CONTACT.email}?subject=Document%20request`} label="Email for documents" />
    </>
  );
}

export function Contact() {
  useMeta('Contact Darby Trading · Purchase, New York', 'Darby Trading Incorporated, 3000 Westchester Ave, Suite 200A, Purchase, NY 10577. +1 914 701 0003. info@darbyinc.com.');
  return (
    <>
      <PageHero id="contact" eyebrow="Contact" title="Make a human reachable." lede="Call or write. You reach the people who price, ship and sign." />
      <section className="wrap grid gap-12 py-24 lg:grid-cols-2">
        <div className="grid content-start gap-8">
          <div>
            <p className="eyebrow text-[var(--slate)]">Telephone</p>
            <a href={CONTACT.tel} className="serif mt-2 block text-[30px] sm:text-[40px] font-semibold hover:text-[var(--leaf)]" data-testid="link-contact-phone">{CONTACT.phone}</a>
          </div>
          <div>
            <p className="eyebrow text-[var(--slate)]">Email</p>
            <a href={`mailto:${CONTACT.email}`} className="serif mt-2 block break-all text-[26px] sm:text-[40px] font-semibold hover:text-[var(--leaf)]" data-testid="link-contact-email">{CONTACT.email}</a>
          </div>
          <div>
            <p className="eyebrow text-[var(--slate)]">Office</p>
            <address className="mt-2 text-lg not-italic" data-testid="text-contact-address">{CONTACT.address.map((l) => <span key={l} className="block">{l}</span>)}</address>
            <a href="https://maps.google.com/?q=3000+Westchester+Ave+Purchase+NY+10577" target="_blank" rel="noreferrer" className="link-u mt-3 inline-flex items-center gap-1.5 font-semibold" data-testid="link-contact-map">Open in maps <ExternalLink className="h-3.5 w-3.5" /></a>
          </div>
          <a href={SRC.linkedin} target="_blank" rel="noreferrer" className="link-u font-semibold" data-testid="link-contact-linkedin">Darby Trading on LinkedIn</a>
        </div>
        <div>
          <div className="overflow-x-auto"><table className="ledger w-full min-w-[320px] text-[15px]" data-testid="table-contact-functions">
            <thead><tr><th>Function</th><th>Route</th></tr></thead>
            <tbody>
              <tr><td className="font-semibold">Quotes and samples</td><td><Link href="/request-a-quote" className="link-u" data-testid="link-contact-quote">Request a quote form</Link></td></tr>
              <tr><td className="font-semibold">Logistics and delivery</td><td><a href={`mailto:${CONTACT.email}?subject=Logistics`} className="link-u" data-testid="link-contact-logistics">{CONTACT.email}</a></td></tr>
              <tr><td className="font-semibold">Documents and vendor forms</td><td><Link href="/documents" className="link-u" data-testid="link-contact-documents">Documents</Link></td></tr>
              <tr><td className="font-semibold">Producers and lenders</td><td><Link href="/trade-finance" className="link-u" data-testid="link-contact-finance">KYC pack request</Link></td></tr>
            </tbody>
          </table></div>
          <p className="src mt-4">Named contacts by function will be listed once Darby confirms them.</p>
          <div className="mt-8 overflow-hidden rounded-[4px] border border-[var(--rule)]">
            <iframe title="Darby Trading office map" src="https://maps.google.com/maps?q=3000%20Westchester%20Ave%20Purchase%20NY&z=14&output=embed" className="h-72 w-full" loading="lazy" data-testid="iframe-map" />
          </div>
        </div>
      </section>
      <EndAction id="contact" title="Ready to price a load?" body="Send product, volume and destination." href="/request-a-quote" label="Request a quote" />
    </>
  );
}
