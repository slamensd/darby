import { useState, type ReactNode } from 'react';
import { useSearch } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Mail } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { CONTACT, PRODUCTS, WAREHOUSES } from '@/data';

const schema = z.object({
  type: z.enum(['quote', 'sample']),
  product: z.string().min(1, 'Choose a product'),
  grade: z.string().optional(),
  volume: z.string().min(2, 'State a volume, for example 2 x 20 ft containers'),
  pack: z.string().optional(),
  destination: z.string().min(2, 'City and state of delivery'),
  port: z.string().optional(),
  timing: z.string().min(1, 'When do you need it'),
  incoterm: z.string().optional(),
  company: z.string().min(2, 'Company name'),
  name: z.string().min(2, 'Your name'),
  role: z.string().min(1, 'Choose a role'),
  email: z.string().email('A valid work email'),
  phone: z.string().optional(),
  notes: z.string().optional(),
});
type F = z.infer<typeof schema>;

function L({ label, n, req, error, children }: { label: string; n: string; req?: boolean; error?: string; children: ReactNode }) {
  return (
    <label className="grid min-w-0 gap-1.5 text-sm font-medium" data-invalid={error ? "true" : undefined}>
      <span>{label}{req && <span className="text-[var(--leaf)]"> *</span>}</span>
      {children}
      {error && <span className="text-[13px] text-[hsl(var(--destructive))]" role="alert" data-testid={`error-${n}`}>{error}</span>}
    </label>
  );
}

const field = 'field';

export default function Quote() {
  const q = new URLSearchParams(useSearch());
  const [sent, setSent] = useState<string | null>(null);
  const form = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: q.get('type') === 'sample' ? 'sample' : 'quote',
      product: q.get('product') ?? '',
      grade: '', volume: '', pack: '', destination: '', port: WAREHOUSES.find((w) => w.city.toLowerCase() === (q.get('warehouse') ?? '').toLowerCase())?.city ?? '', timing: '', incoterm: '',
      company: '', name: '', role: '', email: '', phone: '', notes: '',
    },
  });
  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;
  const type = watch('type');

  const onSubmit = (d: F) => {
    const subject = `${d.type === 'sample' ? 'Sample request' : 'RFQ'}: ${d.product} · ${d.company}`;
    const lines = [
      ['Request', d.type === 'sample' ? 'Sample' : 'Quote'], ['Product', d.product], ['Grade or spec', d.grade], ['Volume', d.volume],
      ['Pack', d.pack], ['Destination', d.destination], ['Preferred warehouse', d.port], ['Timing', d.timing], ['Incoterm', d.incoterm],
      ['Company', d.company], ['Name', d.name], ['Role', d.role], ['Email', d.email], ['Phone', d.phone], ['Notes', d.notes],
    ].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');
    const href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
    setSent(href);
    window.location.href = href;
  };

  return (
    <>
      <section className="bg-[var(--deep)] text-[#FBFAF7]">
        <div className="wrap py-16 md:py-20">
          <h1 className="rise max-w-3xl text-[38px] sm:text-[48px] md:text-[64px] font-semibold leading-[1]" data-testid="text-title-quote">Tell us what you need and where.</h1>
          <p className="rise mt-5 max-w-xl text-lg text-[#C8D0D8]">A trader replies within one business day with price and availability by warehouse.</p>
        </div>
      </section>

      <section className="wrap grid gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_320px]">
        {sent ? (
          <div className="rise rounded-[4px] border border-[var(--rule)] bg-white p-10" data-testid="status-quote-sent">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--leaf)] text-[#FBFAF7]"><Check className="h-6 w-6" /></span>
            <h2 className="mt-6 text-4xl font-semibold">Your request is drafted.</h2>
            <p className="mt-3 max-w-lg text-[#2E3A46]">Your email app should have opened with the request addressed to {CONTACT.email}. Press send there to reach a trader.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={sent} className="btn btn-go" data-testid="link-reopen-mail"><Mail className="h-4 w-4" />Open the draft again</a>
              <button type="button" className="btn btn-ghost" onClick={() => setSent(null)} data-testid="button-edit-request">Edit the request</button>
            </div>
          </div>
        ) : (
          <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-10" data-testid="form-quote">
            <div className="seg self-start" role="radiogroup" aria-label="Request type">
              {(['quote', 'sample'] as const).map((t) => (
                <button key={t} type="button" role="radio" aria-checked={type === t} onClick={() => setValue('type', t)} className="seg-btn" data-testid={`button-type-${t}`}>
                  {t === 'quote' ? 'Price quote' : 'Sample request'}
                </button>
              ))}
            </div>

            <fieldset className="grid gap-5 sm:grid-cols-2">
              <legend className="eyebrow mb-4 w-full border-b-2 border-[var(--ink)] pb-3 text-[var(--slate)]">01 · Product</legend>
              <L label="Product" n="product" error={errors.product?.message} req>
                <select {...register('product')} className={field} data-testid="select-product">
                  <option value="">Choose a product</option>
                  <optgroup label="Animal nutrition">{PRODUCTS.filter((p) => p.line === 'animal').map((p) => <option key={p.slug}>{p.name}</option>)}</optgroup>
                  <optgroup label="Food ingredients">{PRODUCTS.filter((p) => p.line === 'food').map((p) => <option key={p.slug}>{p.name}</option>)}</optgroup>
                  <option>Other, described in notes</option>
                </select>
              </L>
              <L label="Grade or specification" n="grade" error={errors.grade?.message}><input {...register('grade')} placeholder="Customer spec or producer grade" className={field} data-testid="input-grade" /></L>
              <L label={type === 'sample' ? 'Sample size' : 'Volume'} n="volume" error={errors.volume?.message} req><input {...register('volume')} placeholder={type === 'sample' ? '2 kg' : '2 x 20 ft containers or 40,000 lb'} className={field} data-testid="input-volume" /></L>
              <L label="Pack" n="pack" error={errors.pack?.message}>
                <select {...register('pack')} className={field} data-testid="select-pack">
                  <option value="">No preference</option><option>Bags on pallets</option><option>Drums</option><option>Totes</option><option>Bulk liquid, tanker</option>
                </select>
              </L>
            </fieldset>

            <fieldset className="grid gap-5 sm:grid-cols-2">
              <legend className="eyebrow mb-4 w-full border-b-2 border-[var(--ink)] pb-3 text-[var(--slate)]">02 · Delivery</legend>
              <L label="Destination" n="destination" error={errors.destination?.message} req><input {...register('destination')} placeholder="City, state" className={field} data-testid="input-destination" /></L>
              <L label="Preferred warehouse" n="port" error={errors.port?.message}>
                <select {...register('port')} className={field} data-testid="select-port">
                  <option value="">Nearest to destination</option>
                  {WAREHOUSES.map((w) => <option key={w.city}>{w.city}</option>)}
                </select>
              </L>
              <L label="Timing" n="timing" error={errors.timing?.message} req>
                <select {...register('timing')} className={field} data-testid="select-timing">
                  <option value="">Choose</option><option>This month</option><option>Next 1 to 3 months</option><option>Contract, 6 to 12 months</option><option>Pricing only</option>
                </select>
              </L>
              <L label="Incoterm" n="incoterm" error={errors.incoterm?.message}>
                <select {...register('incoterm')} className={field} data-testid="select-incoterm">
                  <option value="">Delivered, US warehouse</option><option>FCA warehouse</option><option>DAP</option><option>CIF US port</option><option>FOB origin</option>
                </select>
              </L>
            </fieldset>

            <fieldset className="grid gap-5 sm:grid-cols-2">
              <legend className="eyebrow mb-4 w-full border-b-2 border-[var(--ink)] pb-3 text-[var(--slate)]">03 · You</legend>
              <L label="Company" n="company" error={errors.company?.message} req><input {...register('company')} className={field} data-testid="input-company" /></L>
              <L label="Role" n="role" error={errors.role?.message} req>
                <select {...register('role')} className={field} data-testid="select-role">
                  <option value="">Choose</option><option>Nutritionist or formulator</option><option>Procurement</option><option>R&amp;D or QA</option><option>Distributor or blender</option><option>Other</option>
                </select>
              </L>
              <L label="Name" n="name" error={errors.name?.message} req><input {...register('name')} className={field} data-testid="input-name" /></L>
              <L label="Work email" n="email" error={errors.email?.message} req><input type="email" {...register('email')} className={field} data-testid="input-email" /></L>
              <L label="Phone" n="phone" error={errors.phone?.message}><input {...register('phone')} className={field} data-testid="input-phone" /></L>
              <div className="sm:col-span-2">
                <L label="Notes" n="notes" error={errors.notes?.message}><textarea {...register('notes')} rows={4} className="field field-area" data-testid="input-notes" /></L>
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center gap-5">
              <button type="submit" className="btn btn-go !px-8 !py-4 text-[17px]" data-testid="button-submit-quote">{type === 'sample' ? 'Send sample request' : 'Send request'}</button>
              <span className="text-sm text-[var(--slate)]">Opens an email draft to {CONTACT.email}.</span>
            </div>
          </form>
          </Form>
        )}

        <aside className="grid content-start gap-6 lg:sticky lg:top-[100px] lg:self-start">
          <div className="rounded-[4px] bg-[var(--ink)] p-7 text-[#FBFAF7]">
            <p className="eyebrow text-[var(--leaf-light)]">What happens next</p>
            <ol className="mt-4 grid gap-4 text-[15px]">
              {['A trader reads the request.', 'You get price and availability by warehouse.', 'Spec, SDS and COA go with the offer.'].map((t, i) => (
                <li key={t} className="flex gap-3"><span className="font-mono text-[var(--leaf-light)]">0{i + 1}</span>{t}</li>
              ))}
            </ol>
          </div>
          <div className="rounded-[4px] border border-[var(--rule)] bg-white p-7 text-[15px]">
            <p className="eyebrow text-[var(--slate)]">Prefer to call</p>
            <a href={CONTACT.tel} className="serif mt-2 block text-2xl font-semibold hover:text-[var(--leaf)]" data-testid="link-quote-phone">{CONTACT.phone}</a>
          </div>
        </aside>
      </section>
    </>
  );
}
