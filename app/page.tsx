import Link from "next/link";
import { env } from "cloudflare:workers";
import StoryHero from "./story-hero";
import RevealBlock from "./reveal-block";
import PartnerRail from "./partner-rail";
import { formatEventDate, isUpcomingEvent } from "../lib/content";
import { getCopy, getEvents, getMedia, getPartners, getTestimonials } from "../lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const previewMode = env.PUBLIC_LAUNCH_READY !== "1";
  const [intro, nextCopy, events, partners, media, testimonials] = await Promise.all([
    getCopy("home_intro"), getCopy("home_next"), getEvents(), getPartners(previewMode), getMedia("solaris-days-1"), getTestimonials(),
  ]);
  const next = events.filter((e) => e.status === "published" && isUpcomingEvent(e)).sort((a, b) => (a.startsAt || "").localeCompare(b.startsAt || ""))[0];
  const first = events.find((e) => e.slug === "solaris-days-1");

  return <main>
    <StoryHero />
    <section className="manifesto section-pad" id="kozosseg">
      <div className="section-kicker"><span>01 / A közösség</span><span>Csíkszeredából indulva</span></div>
      <div className="manifesto-grid"><p className="eyebrow">A Solaris Community</p><RevealBlock>
        <h2 className="reveal-title"><span className="reveal-line"><span>Van, amikor</span></span><span className="reveal-line"><span>elég <em>elindulni.</em></span></span></h2>
        <p className="lead reveal-float">{intro}</p>
        <Link className="text-link reveal-float" href="/rolunk">Ismerd meg a Solarist <span aria-hidden="true">↗</span></Link>
      </RevealBlock></div>
      <div className="marquee" aria-hidden="true">MOVE TOGETHER · STAY TOGETHER · MOVE TOGETHER · STAY TOGETHER ·</div>
    </section>
    <section className="chapters section-pad" id="fejezetek">
      <div className="section-kicker"><span>02 / Egy nap, két fejezet</span><span>Mozgásból találkozás</span></div>
      <div className="chapter-grid">
        <article className="chapter-card cycling-card"><span className="chapter-no">01 / Nappal</span><img src="/brand/cycling-sun.png" alt="Solaris Cycling napszimbólum" /><RevealBlock className="chapter-card-bottom"><h3 className="reveal-title"><span className="reveal-line"><span>Cycling.</span></span></h3><p className="reveal-float">Induljunk együtt. Közös gurulások és aktív programok, ahol az út legalább annyira számít, mint az érkezés.</p></RevealBlock></article>
        <article className="chapter-card monarch-card"><span className="chapter-no">02 / Délutántól</span><img src="/brand/monarch-sun.png" alt="Solaris Monarch napszimbólum" /><RevealBlock className="chapter-card-bottom"><h3 className="reveal-title"><span className="reveal-line"><span>Monarch.</span></span></h3><p className="reveal-float">Maradj még. Zene, találkozások és beszélgetések, amikor a mozgásból közös emlék lesz.</p></RevealBlock></article>
      </div>
    </section>
    <section className="next-event section-pad" id="kovetkezo"><div className="section-kicker"><span>03 / Következő esemény</span><span>{next ? formatEventDate(next.startsAt) : "A folytatás úton van"}</span></div><div className="next-event-inner"><RevealBlock><span className="eyebrow">{next ? next.city : "Újabb nap készül"}</span><h2 className="reveal-title"><span className="reveal-line"><span>{next ? next.title : "A következő találkozás"}</span></span><span className="reveal-line"><span><em>{next ? next.subtitle : "formálódik."}</em></span></span></h2></RevealBlock><RevealBlock><p className="reveal-float">{next ? next.summary : nextCopy}</p><Link className="pill-link reveal-float" href={next ? `/esemenyek/${next.slug}` : "/esemenyek"}>{next ? "Esemény részletei" : "Események megtekintése"} <span aria-hidden="true">↗</span></Link></RevealBlock></div></section>
    {first && <section className="past-event section-pad"><div className="section-kicker"><span>04 / Ahol elkezdődött</span><span>2026. július 11. · Csíkszereda</span></div><div className="past-grid"><div className="past-type"><span>SOLARIS<br />DAYS</span><strong>#1</strong></div><RevealBlock className="past-copy"><span className="eyebrow">Critical Mass x Matiné</span><h2 className="reveal-title"><span className="reveal-line"><span>Egy város.</span></span><span className="reveal-line"><span>Egy közös nap.</span></span></h2><p className="reveal-float">Az első Solaris Days a közös tekeréstől a sportpark délutáni programjaiig hozta össze Csíkszeredát. Fedezd fel, hogyan indult a történet.</p><Link className="pill-link dark reveal-float" href="/esemenyek/solaris-days-1">Az első esemény <span aria-hidden="true">↗</span></Link></RevealBlock></div></section>}
    {first && <section className="moments section-pad"><div className="section-kicker"><span>05 / Pillanatok</span><span>A Solaris történetei</span></div>{media.length > 0 ? <div className="moments-grid">{media.slice(0, 3).map((m) => <figure key={m.id}><img src={`/api/media/${m.id}`} alt={m.caption || "Solaris eseményfotó"} loading="lazy" /><figcaption>{m.caption}{m.credit ? ` · ${m.credit}` : ""}</figcaption></figure>)}</div> : <RevealBlock className="moments-empty"><p className="eyebrow">Az első nap lenyomata</p><h2 className="reveal-title"><span className="reveal-line"><span>Jó volt</span></span><span className="reveal-line"><span><em>együtt lenni.</em></span></span></h2><p className="reveal-float">A válogatott eseményfotók a szervezői jóváhagyás után kerülnek ide.</p><Link className="text-link reveal-float" href="/esemenyek/solaris-days-1">Az esemény története <span aria-hidden="true">↗</span></Link></RevealBlock>}{testimonials.length > 0 && <div className="quotes-grid">{testimonials.slice(0, 2).map((t) => <blockquote key={t.id}>„{t.quote}”<cite>{t.author}</cite></blockquote>)}</div>}</section>}
    {partners.length > 0 && <section className="partners section-pad"><div className="section-kicker"><span>06 / Korábbi együttműködők</span><span>Együtt több történik</span></div><RevealBlock className="partner-heading"><h2 className="reveal-title"><span className="reveal-line"><span>Akikkel már</span></span><span className="reveal-line"><span><em>együtt mozdultunk.</em></span></span></h2><p className="reveal-float">Az első Solaris nap megvalósításában részt vevő közösségek és helyek. {previewMode && "A partnerlista a szervezői ellenőrzés után végleges."}</p></RevealBlock><PartnerRail partners={partners} /><div className="partner-cta"><p>Van ötleted egy közös programhoz?</p><Link className="text-link" href="/kapcsolat">Beszélgessünk róla <span aria-hidden="true">↗</span></Link></div></section>}
  </main>;
}
