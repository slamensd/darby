import { useState } from 'react';
import { Link } from 'wouter';
import { EndAction, PageHero, SectionHead, Src, useMeta } from '@/components/site';
import { WarehouseMap } from '@/components/warehouse-map';
import { DISCHARGE, ORIGINS, SRC } from '@/data';

const L = ['Kaohsiung', 'Singapore', 'Laem Chabang', 'Belawan', 'Tanjung Pelepas'];
const R = ['Tacoma', 'Oakland', 'Los Angeles', 'Houston', 'Savannah', 'Baltimore'];

export function LaneMap() {
  const [hover, setHover] = useState<number | null>(null);
  const ly = (i: number) => 50 + i * 50;
  const ry = (i: number) => 40 + i * 44;
  return (
    <svg viewBox="0 0 1152 300" role="img" aria-label="Trade lanes from Kaohsiung, Singapore, Laem Chabang, Belawan and Tanjung Pelepas to Tacoma, Oakland, Los Angeles, Houston, Savannah and Baltimore" className="block h-auto w-full" data-testid="img-lane-map">
      <g fill="none" strokeWidth="1.5">
        {L.map((_, i) =>
          R.map((__, j) => {
            const on = hover === null ? (i + j) % 3 === 0 : hover === i;
            return (
              <path key={`${i}-${j}`} d={`M170 ${ly(i)} C 500 ${ly(i)}, 680 ${ry(j)}, 982 ${ry(j)}`} stroke={on ? '#8FCF7F' : '#2C5D6E'} strokeWidth={on ? 2 : 1} style={{ transition: 'stroke .3s' }} opacity={on ? 0.95 : 0.6} />
            );
          }),
        )}
      </g>
      {L.map((p, i) => (
        <g key={p} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="cursor-pointer" data-testid={`map-origin-${i}`}>
          <rect x="0" y={ly(i) - 18} width="180" height="36" fill="transparent" />
          <circle cx="170" cy={ly(i)} r="6" fill="#8FCF7F" />
          <text x="152" y={ly(i) + 5} textAnchor="end" fill="#FBFAF7" fontSize="15" fontFamily="IBM Plex Sans">{p}</text>
        </g>
      ))}
      {R.map((p, j) => (
        <g key={p}>
          <circle cx="982" cy={ry(j)} r="6" fill="#FBFAF7" />
          <text x="1000" y={ry(j) + 5} fill="#FBFAF7" fontSize="15" fontFamily="IBM Plex Sans">{p}</text>
        </g>
      ))}
    </svg>
  );
}

function Bars({ rows, id }: { rows: { port: string; n: number }[]; id: string }) {
  const max = rows[0].n;
  return (
    <div className="overflow-x-auto"><table className="ledger w-full min-w-[320px] text-[15px]" data-testid={`table-${id}`}>
      <thead><tr><th>Port</th><th className="!text-right">Shipments</th><th className="w-[40%]" aria-hidden /></tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.port} data-testid={`row-${id}-${r.port.toLowerCase().replace(/\s/g, '-')}`}>
            <td>{r.port}</td>
            <td className="text-right font-mono">{r.n}</td>
            <td><div className="h-2 origin-left bg-[var(--leaf)]" style={{ width: `${(r.n / max) * 100}%` }} /></td>
          </tr>
        ))}
      </tbody>
    </table></div>
  );
}

export default function Logistics() {
  useMeta('Logistics · Ports, warehouses and lanes · Darby Trading', 'Origin ports in Southeast Asia, US discharge ports from the customs record, and stock held at six US port warehouses. Pallet, truckload or tanker.');
  return (
    <>
      <PageHero id="logistics" eyebrow="Logistics" title="Stock held at six US ports, close to your plant." lede="Cargo lands at the port nearest the buyer and is held at one of six US port warehouses. Every lane below is on the public customs record." />

      <section className="bg-[var(--harbor)] text-[#FBFAF7]">
        <div className="wrap py-20">
          <p className="eyebrow mb-6 text-[var(--leaf-light)]">Lanes · hover an origin</p>
          <LaneMap />
          <p className="mt-6 text-sm text-[#9FC4CF]">Origins and discharge ports from <a className="link-u text-[var(--leaf-light)]" href={SRC.importinfo} target="_blank" rel="noreferrer" data-testid="link-source-importinfo">ImportInfo</a> previews.</p>
        </div>
      </section>

      <section className="wrap py-24">
        <SectionHead n="01 · Warehouses" title="Six US port warehouses">
          Order from the warehouse nearest you. Locations are shown at city level. 3PL partner names and lead times by region will be published once Darby confirms them.
        </SectionHead>
        <WarehouseMap idPrefix="logistics-map" />
      </section>

      <section className="border-y border-[var(--rule)] bg-white">
        <div className="wrap py-24">
          <SectionHead n="02 · Customs record" title="Where the cargo comes from and where it lands">
            Ten busiest lading and discharge ports by shipment count. Database counts differ by name variant and window and are not additive.
          </SectionHead>
          <div className="grid gap-12 lg:grid-cols-2 [&>*]:min-w-0">
            <div><h3 className="mb-4 text-2xl font-semibold">Origin and lading ports</h3><Bars rows={ORIGINS} id="origins" /></div>
            <div><h3 className="mb-4 text-2xl font-semibold">US discharge ports</h3><Bars rows={DISCHARGE} id="discharge" /></div>
          </div>
          <p className="src mt-6">Source: <Src href={SRC.importinfo}>ImportInfo</Src> preview. Discharge ports match the six warehouse cities except Houston.</p>
        </div>
      </section>

      <section className="wrap py-24">
        <SectionHead n="03 · Modes" title="Pallet, truckload or tanker" />
        <div className="grid gap-px overflow-hidden rounded-[4px] border border-[var(--rule)] bg-[var(--rule)] md:grid-cols-4">
          {[
            ['Container', 'Full container loads from origin, 52,000 to 133,000 kg per bill of lading in recent samples.'],
            ['Bulk liquid', 'Ex-tank delivery for liquid oils by tanker.'],
            ['FTL', 'Full truckload from the nearest warehouse.'],
            ['LTL', 'Pallet quantities for smaller runs and trials.'],
          ].map(([t, d], i) => (
            <div key={t} className="bg-[var(--paper)] p-7" data-testid={`card-mode-${i}`}>
              <p className="eyebrow text-[var(--leaf)]">Mode 0{i + 1}</p>
              <h3 className="mt-3 text-2xl font-semibold">{t}</h3>
              <p className="mt-2 text-[15px] text-[#2E3A46]">{d}</p>
            </div>
          ))}
        </div>
        <p className="src mt-4">Cargo size from <Src href={SRC.importgenius}>ImportGenius</Src> and <Src href={SRC.panjiva}>Panjiva</Src> previews, late 2024 and 2025.</p>
        <p className="mt-8 text-[15px]"><Link href="/contact" className="link-u font-semibold" data-testid="link-logistics-contact">Contact logistics</Link></p>
      </section>

      <EndAction id="logistics" title="Tell us where the truck needs to go." body="We quote from the warehouse nearest your plant." href="/request-a-quote" label="Request a quote" />
    </>
  );
}
