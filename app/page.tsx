import Link from "next/link";
import { env } from "cloudflare:workers";
import StoryHero from "./story-hero";
import { formatEventDate, oldPartnerNames } from "../lib/content";
import { getCopy, getEvents, getMedia, getPartners, getTestimonials } from "../lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [intro, nextCopy, events, partners, media, testimonials] = await Promise.all([getCopy("home_intro"), getCopy("home_next"), getEvents(), getPartners(), getMedia("solaris-days-1"), getTestimonials()]);
  const next = events.filter((e) => e.status === "published" && e.startsAt && new Date(e.startsAt).getTime() > Date.now()).sort((a,b) => (a.startsAt || "").localeCompare(b.startsAt || ""))[0];
  const first = events.find((e) => e.slug === "solaris-days-1");
  const previewMode = env.PUBLIC_LAUNCH_READY !== "1";
  return <main>
    <StoryHero />
    <section className="manifesto section-pad" id="kozosseg">
      <div className="section-kicker"><span>01 / A közösség</span><span>Csíkszeredából indulva</span></div>
      <div className="manifesto-grid"><p className="eyebrow">A Solaris Community</p><div><h2>Van, amikor elég <em>elindulni.</em></h2><p className="lead">{intro}</p><Link className="text-link" href="/rolunk">Ismerd meg a Solarist <span aria-hidden="true">↗</span></Link></div></div>
      <div className="marquee" aria-hidden="true">MOVE TOGETHER · STAY TOGETHER · MOVE TOGETHER · STAY TOGETHER ·</div>
    </section>
    <section className="chapters section-pad" id="fejezetek">
      <div className="section-kicker"><span>02 / Egy nap, két fejezet</span><span>Mozgásból találkozás</span></div>
      <div className="chapter-grid"><article className="chapter-card cycling-card"><span className="chapter-no">01 / Nappal</span><img src="/brand/cycling-sun.png" alt="Solaris Cycling napszimbólum" /><div className="chapter-card-bottom"><h3>Cycling.</h3><p>Induljunk együtt. Közös gurulások és aktív programok, ahol az út legalább annyira számít, mint az érkezés.</p></div></article><article className="chapter-card monarch-card"><span className="chapter-no">02 / Délutántól</span><img src="/brand/monarch-sun.png" alt="Solaris Monarch napszimbólum" /><div className="chapter-card-bottom"><h3>Monarch.</h3><p>Maradj még. Zene, találkozások és beszélgetések, amikor a mozgásból közös emlék lesz.</p></div></article></div>
    </section>
    <section className="next-event section-pad" id="kovetkezo"><div className="section-kicker"><span>03 / Következő esemény</span><span>{next ? formatEventDate(next.startsAt) : "A folytatás úton van"}</span></div><div className="next-event-inner"><div><span className="eyebrow">{next ? next.city : "Újabb nap készül"}</span><h2>{next ? <>{next.title} <em>{next.subtitle}</em></> : <>A következő találkozás <em>formálódik.</em></>}</h2></div><div><p>{next ? next.summary : nextCopy}</p><Link className="pill-link" href={next ? `/esemenyek/${next.slug}` : "/esemenyek"}>{next ? "Esemény részletei" : "Események megtekintése"} <span aria-hidden="true">↗</span></Link></div></div></section>
    {first && <section className="past-event section-pad"><div className="section-kicker"><span>04 / Ahol elkezdődött</span><span>2026. július 11. · Csíkszereda</span></div><div className="past-grid"><div className="past-type"><span>SOLARIS<br/>DAYS</span><strong>#1</strong></div><div className="past-copy"><span className="eyebrow">Critical Mass x Matiné</span><h2>Egy város.<br/>Egy közös nap.</h2><p>Az első Solaris Days a közös tekeréstől a sportpark délutáni programjaiig hozta össze Csíkszeredát. Fedezd fel, hogyan indult a történet.</p><Link className="pill-link dark" href="/esemenyek/solaris-days-1">Az első esemény <span aria-hidden="true">↗</span></Link></div></div></section>}
    {first && <section className="moments section-pad"><div className="section-kicker"><span>05 / Pillanatok</span><span>A Solaris történetei</span></div>{media.length > 0 ? <div className="moments-grid">{media.slice(0,3).map((m) => <figure key={m.id}><img src={`/api/media/${m.id}`} alt={m.caption || "Solaris eseményfotó"} loading="lazy" /><figcaption>{m.caption}{m.credit ? ` · ${m.credit}` : ""}</figcaption></figure>)}</div> : <div className="moments-empty"><p className="eyebrow">Az első nap lenyomata</p><h2>Jó volt <em>együtt lenni.</em></h2><p>A válogatott eseményfotók a szervezői jóváhagyás után kerülnek ide.</p><Link className="text-link" href="/esemenyek/solaris-days-1">Az esemény története <span aria-hidden="true">↗</span></Link></div>}{testimonials.length > 0 && <div className="quotes-grid">{testimonials.slice(0,2).map((t) => <blockquote key={t.id}>„{t.quote}”<cite>{t.author}</cite></blockquote>)}</div>}</section>}
    {(partners.length > 0 || previewMode) && <section className="partners section-pad"><div className="section-kicker"><span>06 / Korábbi együttműködők</span><span>Együtt több történik</span></div><div className="partner-heading"><h2>Akikkel már <em>együtt mozdultunk.</em></h2><p>Az első Solaris nap megvalósításában részt vevő közösségek és helyek. {previewMode && "A partnerlista a szervezői ellenőrzés után végleges."}</p></div><div className="partner-grid">{partners.length ? partners.map((p) => <div key={p.id} className="partner-cell">{p.logo_key ? <img src={`/api/media/logo/${p.id}`} alt={p.name} /> : p.name}</div>) : oldPartnerNames.map((p) => <div key={p} className="partner-cell">{p}</div>)}</div><div className="partner-cta"><p>Van ötleted egy közös programhoz?</p><Link className="text-link" href="/kapcsolat">Beszélgessünk róla <span aria-hidden="true">↗</span></Link></div></section>}
  </main>;
}
