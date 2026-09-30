import type { Metadata } from "next";
import { env } from "cloudflare:workers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { canRsvp, formatEventDate, isPastEvent } from "../../../lib/content";
import { getEvent, getMedia, getPartners, getVideos } from "../../../lib/data";
import { partnerLogoSrc } from "../../../lib/partners";
import RsvpForm from "./rsvp-form";

type Params = Promise<{ slug: string }>;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const e = await getEvent((await params).slug);
  return e ? { title: e.title, description: e.summary } : { title: "Esemény nem található" };
}

export default async function EventPage({ params }: { params: Params }) {
  const slug = (await params).slug;
  const e = await getEvent(slug);
  if (!e) notFound();
  const [media, allPartners, videos] = await Promise.all([getMedia(slug), getPartners(env.PUBLIC_LAUNCH_READY !== "1"), getVideos(slug)]);
  const partners = allPartners.filter((p) => !p.event_slug || p.event_slug === slug);
  const isPast = isPastEvent(e);
  const structured = e.status === "published" && e.startsAt ? { "@context": "https://schema.org", "@type": "Event", name: `${e.title} — ${e.subtitle}`, startDate: e.startsAt, location: { "@type": "Place", name: e.venue, address: { "@type": "PostalAddress", addressLocality: e.city, addressCountry: "RO" } }, description: e.summary, eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode" } : null;
  return <main className="inner-page">{structured && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />}<div className="inner-hero event-hero event-hero--branded"><Link className="eyebrow" href="/esemenyek">← Események</Link><h1>{e.title}</h1><p className="intro">{e.subtitle}</p></div><section className="content-section"><div className="event-details"><div className="detail-box"><span className="eyebrow">Mikor</span><strong>{formatEventDate(e.startsAt)}</strong></div><div className="detail-box"><span className="eyebrow">Hol</span><strong>{e.city}</strong></div><div className="detail-box"><span className="eyebrow">Találkozás</span><strong>{e.venue || "Részletek hamarosan"}</strong></div></div></section><section className="content-section"><div className="content-grid"><h2>{isPast ? "Egy nap, amit együtt éltünk meg." : "Egy nap, amit együtt élhetünk meg."}</h2><div><p>{e.summary}</p>{env.PUBLIC_LAUNCH_READY !== "1" && e.slug === "solaris-days-1" && <p className="source-note">Az első esemény adatait a szervezők a nyilvános indulás előtt ellenőrzik.</p>}</div></div></section><section className="content-section"><div className="section-kicker"><span>01 / Mozgás &nbsp; 02 / Együttlét</span><span>Solaris Cycling x Monarch</span></div><div className="day-timeline" style={{marginTop:40}}><article className="timeline-card"><span className="eyebrow">01 / Cycling</span><h3>Együtt indulunk.</h3><p>{e.cycling}</p></article><article className="timeline-card monarch"><span className="eyebrow">02 / Monarch</span><h3>Együtt maradunk.</h3><p>{e.monarch}</p></article></div></section><section className="content-section"><div className="section-kicker"><span>Az esemény képei</span><span>Válogatott pillanatok</span></div>{media.length ? <div className="media-grid">{media.map((m) => <figure key={m.id}><img src={`/api/media/${m.id}`} alt={m.caption || `${e.title} eseménykép`} loading="lazy" /><figcaption>{m.caption}{m.credit ? ` · Fotó: ${m.credit}` : ""}</figcaption></figure>)}</div> : <div className="gallery-empty" style={{marginTop:35}}><strong>A nap képei<br/>hamarosan.</strong><p>A jóváhagyott fotóválogatás itt kap helyet.</p></div>}</section>{videos.length > 0 && <section className="content-section"><div className="section-kicker"><span>Videók</span><span>Az esemény mozgásban</span></div><div className="video-links">{videos.map((v) => <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer">{v.caption || "Eseményvideó"} ↗</a>)}</div></section>}{partners.length > 0 && <section className="content-section"><div className="section-kicker"><span>Az esemény közreműködői</span><span>Együtt több történik</span></div><div className="partner-grid" style={{marginTop:40}}>{partners.map((p) => <div className="partner-cell" key={p.id}>{partnerLogoSrc(p) ? <img src={partnerLogoSrc(p)!} alt={p.name} /> : <span className="partner-wordmark">{p.name}</span>}</div>)}</div></section>}{canRsvp(e) && <section className="content-section"><div className="content-grid"><div><h2>Találkozzunk ott.</h2><p>A részvételi szándék jelzése nem helyfoglalás. A program ingyenes.</p></div><RsvpForm slug={e.slug} /></div></section>}<section className="content-section"><Link className="text-link" href="/esemenyek">További események <span aria-hidden="true">↗</span></Link></section></main>;
}
