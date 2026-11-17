// Listings come from the QuantWeb CRM (Supabase) so the owner can manage boats themselves.
// The URL and publishable key are public by design (the database only returns Live/Sold listings to them).
// If the CRM isn't configured or can't be reached, the site falls back to the built-in list in boats.ts.
import { boats as localBoats, type Boat, type PhotoRef } from './boats';

export const CRM = {
  url: import.meta.env.PUBLIC_CRM_URL ?? 'https://eahtbcrwiwjbmmqpfuvn.supabase.co',
  key: import.meta.env.PUBLIC_CRM_KEY ?? 'sb_publishable_ueMsDojXj2exexplcCqeGg_oCxAsdX-',
  business: 'd13629a7-8c7e-4c4c-91dd-0434385315fe', // Loughside Boat Sales in the QuantWeb CRM
};

type Row = {
  slug: string; status: 'published' | 'sold'; title: string; price: string | null; price_note: string | null; badge: string | null;
  location: string | null; headline: string | null; body: string | null; viewing: string | null; attrs: Record<string, string>;
  sections: { title: string; items: string[] }[]; photos: { base: string; widths: number[]; w: number; h: number; alt?: string; ext?: string }[];
};

const photo = (p: Row['photos'][number]): PhotoRef => {
  const u = (w: number) => `${CRM.url}/storage/v1/object/public/listing-photos/${p.base}-${w}.${p.ext || 'webp'}`;
  return { src: u(p.widths[p.widths.length - 1]), srcset: p.widths.map((w) => `${u(w)} ${w}w`).join(', '), w: p.w, h: p.h };
};

const toBoat = (l: Row): Boat => ({
  slug: l.slug,
  title: l.title,
  year: l.attrs?.year || '',
  make: l.attrs?.make || '',
  model: l.attrs?.model || '',
  headline: l.headline || undefined,
  price: l.price || 'Price on request',
  priceNote: l.price_note || undefined,
  status: l.status === 'sold' ? 'Sold' : l.badge || undefined,
  sold: l.status === 'sold',
  location: l.location || undefined,
  summary: l.headline || '',
  sections: (l.sections || []).filter((s) => s.title && s.items?.length),
  body: (l.body || '').split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
  viewing: l.viewing || undefined,
  photos: (l.photos || []).map(photo),
  oldUrl: '',
});

export async function getBoats(): Promise<Boat[]> {
  if (!CRM.url || !CRM.key) return localBoats;
  try {
    const q = new URLSearchParams({
      select: 'slug,status,title,price,price_note,badge,location,headline,body,viewing,attrs,sections,photos',
      business_id: `eq.${CRM.business}`,
      status: 'in.(published,sold)',
      order: 'status.asc,sort.asc,updated_at.desc',
    });
    const res = await fetch(`${CRM.url}/rest/v1/listings?${q}`, { headers: { apikey: CRM.key }, signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`CRM ${res.status}`);
    const rows = (await res.json()) as Row[];
    // live boats first, sold ones after (status.asc sorts "published" before "sold")
    return rows.filter((r) => r.photos?.length).map(toBoat);
  } catch (e) {
    console.error('[crm] falling back to built-in listings:', (e as Error).message);
    return localBoats;
  }
}

// Short CDN cache so changes made in the CRM show within about a minute.
export const LISTING_CACHE = 'public, max-age=0, s-maxage=60, stale-while-revalidate=600';
