export type InitialPartner = { id: string; name: string; logo_key: string | null; sort_order: number };

// Marks are extracted from the supplied Solaris Style Guide. Athos is named in
// the first event's public description, but no Athos mark is in the guide.
export const initialPartners: InitialPartner[] = [
  { id: "guide-cstit", name: "CSTIT", logo_key: "static:/partners/cstit.webp", sort_order: 10 },
  { id: "guide-funbike", name: "Funbike", logo_key: "static:/partners/funbike.webp", sort_order: 20 },
  { id: "guide-beats", name: "Beats in the Park", logo_key: "static:/partners/beats-in-the-park.webp", sort_order: 30 },
  { id: "guide-kolumban", name: "Kolumbán Optika", logo_key: "static:/partners/kolumban-optika.webp", sort_order: 40 },
  { id: "guide-ecset", name: "ECSET", logo_key: "static:/partners/ecset.webp", sort_order: 50 },
  { id: "guide-feelmkr", name: "feelmkr", logo_key: "static:/partners/feelmkr.webp", sort_order: 60 },
  { id: "guide-mimi", name: "MiMi", logo_key: "static:/partners/mimi.webp", sort_order: 70 },
  { id: "guide-watchthis", name: "WATCHTHIS WORKS", logo_key: "static:/partners/watchthis-works.webp", sort_order: 80 },
  { id: "guide-pekengo", name: "Pekengo", logo_key: "static:/partners/pekengo.webp", sort_order: 90 },
  { id: "guide-athos", name: "Athos", logo_key: null, sort_order: 100 },
];

export function partnerLogoSrc(partner: { id: string; logo_key: string | null }) {
  if (!partner.logo_key) return null;
  return partner.logo_key.startsWith("static:")
    ? partner.logo_key.slice("static:".length)
    : `/api/media/logo/${encodeURIComponent(partner.id)}`;
}
