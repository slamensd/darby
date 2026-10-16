import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Info, Maximize2, MapPin } from 'lucide-react';
import type { Map as LeafletMap, Marker as LeafletMarker, Polygon } from 'leaflet';
import { WAREHOUSES } from '@/data';

const RADIUS_MI = 400;
const EARTH_KM = 6371.0088;
const RADIUS_KM = RADIUS_MI * 1.609344;
const US_BOUNDS: [[number, number], [number, number]] = [[-126.5, 23.5], [-65.5, 50.5]];

type Status = 'idle' | 'loading' | 'ready' | 'error';

/** Geodesic circle: points at true great-circle distance from the center. */
function geodesicCircle([lng, lat]: [number, number], km: number, steps = 128): [number, number][] {
  const d = km / EARTH_KM;
  const φ1 = (lat * Math.PI) / 180;
  const λ1 = (lng * Math.PI) / 180;
  const ring: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const θ = (i / steps) * 2 * Math.PI;
    const φ2 = Math.asin(Math.sin(φ1) * Math.cos(d) + Math.cos(φ1) * Math.sin(d) * Math.cos(θ));
    const λ2 = λ1 + Math.atan2(Math.sin(θ) * Math.sin(d) * Math.cos(φ1), Math.cos(d) - Math.sin(φ1) * Math.sin(φ2));
    ring.push([(((λ2 * 180) / Math.PI + 540) % 360) - 180, (φ2 * 180) / Math.PI]);
  }
  ring[steps] = [...ring[0]];
  return ring;
}

const CIRCLES = WAREHOUSES.map((w) => geodesicCircle(w.lngLat, RADIUS_KM));

function boundsOf(ring: [number, number][]): [[number, number], [number, number]] {
  let w = 180, s = 90, e = -180, n = -90;
  for (const [x, y] of ring) {
    w = Math.min(w, x); e = Math.max(e, x); s = Math.min(s, y); n = Math.max(n, y);
  }
  return [[w, s], [e, n]];
}

const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function WarehouseMap({ tone = 'light', idPrefix = 'map' }: { tone?: 'light' | 'dark'; idPrefix?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);
  const circlesRef = useRef<Polygon[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [sel, setSel] = useState<number | null>(null);
  const selRef = useRef<number | null>(null);
  selRef.current = sel;

  const dark = tone === 'dark';

  const focus = useCallback((i: number | null) => {
    setSel(i);
    const map = mapRef.current;
    if (!map) return;
    const bounds = i === null ? US_BOUNDS : boundsOf(CIRCLES[i]);
    map.fitBounds([[bounds[0][1], bounds[0][0]], [bounds[1][1], bounds[1][0]]], {
      padding: [36, 36], animate: !reducedMotion(), duration: 0.8,
    });
  }, []);

  // Paint selection state into the map layers + marker elements.
  useEffect(() => {
    circlesRef.current.forEach((circle, i) => circle.setStyle({
      fillOpacity: sel === i ? 0.2 : sel === null ? 0.09 : 0.035,
      opacity: sel === i ? 1 : sel === null ? 0.55 : 0.22,
      weight: sel === i ? 2.25 : 1.25,
    }));
    markersRef.current.forEach((m, i) => {
      const el = m.getElement()?.querySelector('button');
      el?.setAttribute('aria-pressed', String(sel === i));
      if (el) el.dataset.active = String(sel === i);
    });
  }, [sel, status]);

  // Lazy-load when the section approaches the viewport.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let cancelled = false;
    let timeout: number | undefined;
    let resize: ResizeObserver | undefined;

    const start = async () => {
      setStatus('loading');
      try {
        const [mod] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]);
        if (cancelled || !containerRef.current) return;
        const L = mod;
        const map = L.map(containerRef.current, {
          zoomControl: false,
          scrollWheelZoom: false,
          dragging: !L.Browser.mobile,
          touchZoom: true,
          keyboard: true,
          minZoom: 2,
          maxZoom: 10,
          zoomSnap: 0.25,
          zoomDelta: 0.5,
          maxBounds: [[5, -170], [70, -40]],
        });
        map.fitBounds([[23.5, -126.5], [50.5, -65.5]], { padding: [24, 24] });
        mapRef.current = map;
        L.control.zoom({ position: 'topright' }).addTo(map);
        map.attributionControl.setPrefix(false);

        let loaded = false;
        timeout = window.setTimeout(() => {
          if (!loaded && !cancelled) setStatus('error');
        }, 15000);
        const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
          maxZoom: 19,
          crossOrigin: true,
        });
        tiles.on('tileload', () => {
          if (cancelled || loaded) return;
          loaded = true;
          window.clearTimeout(timeout);
          setStatus('ready');
        });
        tiles.on('tileerror', () => console.warn('A stock-location map tile could not load.'));
        tiles.addTo(map);

        circlesRef.current = CIRCLES.map((ring) => L.polygon(
          ring.map(([lng, lat]) => [lat, lng] as [number, number]),
          { color: '#2F6E24', fillColor: '#4C9A3B', weight: 1.25, opacity: 0.55, fillOpacity: 0.09, dashArray: '6 4', interactive: false },
        ).addTo(map));
        markersRef.current = WAREHOUSES.map((w, i) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'wh-marker';
          b.setAttribute('aria-label', `${w.city}, ${w.coast}. Show illustrative ${RADIUS_MI} mile radius`);
          b.setAttribute('data-testid', `${idPrefix}-marker-${i}`);
          b.innerHTML = `<span class="wh-dot"></span><span class="wh-label">${w.city}</span>`;
          b.addEventListener('click', (e) => {
            e.stopPropagation();
            focus(selRef.current === i ? null : i);
          });
          return L.marker([w.lngLat[1], w.lngLat[0]], {
            icon: L.divIcon({ className: 'wh-marker-host', html: b, iconSize: [44, 44], iconAnchor: [22, 22] }),
            keyboard: false,
          }).addTo(map);
        });
        if (selRef.current !== null) focus(selRef.current);
        resize = new ResizeObserver(() => map.invalidateSize({ pan: false }));
        resize.observe(containerRef.current);
      } catch (error) {
        console.warn('Stock-location map initialization failed.', error);
        if (!cancelled) setStatus('error');
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      resize?.disconnect();
      window.clearTimeout(timeout);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      circlesRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [focus, idPrefix]);

  const w = sel === null ? null : WAREHOUSES[sel];
  const quoteHref = w ? `/request-a-quote?warehouse=${encodeURIComponent(w.city)}` : '/request-a-quote';

  return (
    <div id={`${idPrefix}-locations`} ref={wrapRef} className={`wh-root scroll-mt-24 grid overflow-hidden rounded-[6px] border lg:grid-cols-[minmax(0,1fr)_340px] ${dark ? 'border-[#1E3A52] bg-[#0B2430]' : 'border-[var(--rule)] bg-white'}`} data-testid={`${idPrefix}-root`}>
      <div className="relative isolate min-h-[340px] h-[56vh] max-h-[620px] sm:min-h-[420px] lg:h-auto lg:min-h-[600px] lg:max-h-none">
        <div ref={containerRef} className="absolute inset-0 z-0" role="region" aria-label={`Map of six US warehouse cities with illustrative ${RADIUS_MI} mile radii. Use the city list for full keyboard access.`} data-testid={`${idPrefix}-canvas`} />

        {(status === 'idle' || status === 'loading') && (
          <div className="absolute inset-0 z-[450] grid place-items-center bg-[#EEF0EC]" aria-live="polite" data-testid={`${idPrefix}-loading`}>
            <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(#DADDD6_1px,transparent_1px),linear-gradient(90deg,#DADDD6_1px,transparent_1px)] [background-size:48px_48px]" />
            <div className="relative flex items-center gap-3 rounded-full bg-white/90 px-5 py-3 text-sm font-medium text-[var(--ink)] shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--leaf)] pulse" />
              Loading map
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 z-[450] grid place-items-center bg-[#EEF0EC] p-6" role="status" data-testid={`${idPrefix}-error`}>
            <div className="max-w-sm text-center text-[var(--ink)]">
              <MapPin className="mx-auto h-8 w-8 text-[var(--slate)]" strokeWidth={1.5} />
              <p className="serif mt-3 text-2xl font-semibold">The map could not load.</p>
              <p className="mt-2 text-[15px] text-[var(--slate)]">The map service could not be reached. The city list and quote link are still available.</p>
            </div>
          </div>
        )}

        {status === 'ready' && (
          <button type="button" onClick={() => focus(null)} className="wh-reset absolute left-3 top-3 z-[450]" data-testid={`${idPrefix}-button-reset`}>
            <Maximize2 className="h-4 w-4" />
            Show all six
          </button>
        )}

        {status === 'ready' && (
          <div className="pointer-events-none absolute bottom-9 left-3 z-[450] hidden items-center gap-2 rounded-[4px] bg-white/92 px-3 py-2 text-[12px] text-[var(--ink)] shadow-sm sm:flex">
            <span className="h-3 w-5 rounded-[2px] border border-dashed border-[#2F6E24] bg-[rgba(76,154,59,.18)]" />
            Illustrative {RADIUS_MI} mile straight-line radius
          </div>
        )}
      </div>

      <aside className={`flex min-w-0 flex-col border-t lg:border-l lg:border-t-0 ${dark ? 'border-[#1E3A52] text-[#FBFAF7]' : 'border-[var(--rule)] text-[var(--ink)]'}`}>
        <div role="group" aria-label="Warehouse city" className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-1" data-testid={`${idPrefix}-selector`}>
          <button type="button" aria-pressed={sel === null} onClick={() => focus(null)} className={`wh-opt col-span-2 sm:col-span-3 lg:col-span-1 ${dark ? 'wh-opt-dark' : ''}`} data-testid={`${idPrefix}-option-all`}>
            <span className="font-semibold">All six cities</span>
            <span className="text-[13px] opacity-70">National view</span>
          </button>
          {WAREHOUSES.map((c, i) => (
            <button key={c.city} type="button" aria-pressed={sel === i} onClick={() => focus(i)} className={`wh-opt ${dark ? 'wh-opt-dark' : ''}`} data-testid={`${idPrefix}-option-${i}`}>
              <span className="serif text-[19px] font-semibold leading-tight">{c.city}</span>
              <span className="text-[13px] opacity-70">{c.coast}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5" aria-live="polite" data-testid={`${idPrefix}-details`}>
          {w ? (
            <>
              <div>
                <p className={`text-[13px] font-semibold ${dark ? 'text-[var(--leaf-light)]' : 'text-[var(--leaf)]'}`}>Selected</p>
                <p className="serif text-[28px] font-semibold leading-tight" data-testid={`${idPrefix}-selected-city`}>{w.city}</p>
                <p className={`text-[14px] ${dark ? 'text-[#C8D0D8]' : 'text-[var(--slate)]'}`}>{w.coast} · city-level location, not a warehouse address</p>
              </div>
              <Link href={quoteHref} className="btn btn-go w-full" data-testid={`${idPrefix}-link-quote`}>
                Request a quote from {w.city} <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <>
              <p className={`text-[15px] ${dark ? 'text-[#C8D0D8]' : 'text-[#2E3A46]'}`}>Six port cities on three coasts and the Gulf. Pick a city to focus its region.</p>
              <Link href={quoteHref} className="btn btn-go w-full" data-testid={`${idPrefix}-link-quote`}>
                Request a quote <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
          <p className={`mt-auto flex gap-2 text-[12.5px] leading-snug ${dark ? 'text-[#9FB0BF]' : 'text-[var(--slate)]'}`} data-testid={`${idPrefix}-disclaimer`}>
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>Circles show an illustrative {RADIUS_MI} mile straight-line radius from each city center. They are not truck routes and do not promise same-day or next-day transit. Confirm stock and delivery timing with Darby.</span>
          </p>
        </div>
      </aside>
    </div>
  );
}
