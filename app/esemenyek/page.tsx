import type { Metadata } from "next";
import Link from "next/link";
import { getEvents } from "../../lib/data";
import { formatEventDate, isPastEvent, isUpcomingEvent } from "../../lib/content";

export const metadata: Metadata = { title: "Események", description: "Solaris Days események és közös napok Csíkszeredában és környékén." };
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents();
  const upcoming = events.filter(isUpcomingEvent).sort((a, b) => (a.startsAt || "").localeCompare(b.startsAt || ""));
  const past = events.filter(isPastEvent);
  return <main className="inner-page events-page">
    <div className="inner-hero events-inner-hero"><span className="eyebrow">Solaris Days</span><h1>Együtt<br />történik.</h1><p className="intro">Minden Solaris nap egy új alkalom a mozgásra és a találkozásra. Nézd meg, mi készül, és honnan indultunk.</p></div>
    <section className="content-section"><div className="section-kicker"><span>Következő alkalmak</span><span>A részletek itt jelennek meg</span></div><div className={`event-list${upcoming.length <= 1 ? " event-list--single" : ""}`}>{upcoming.length ? upcoming.map((e) => <Link href={`/esemenyek/${e.slug}`} className="event-tile event-tile--upcoming" key={e.slug}><div className="event-meta"><span>{formatEventDate(e.startsAt)}</span><span>{e.city}</span></div><div className="event-tile__body"><h2>{e.title}</h2><p>{e.subtitle}</p></div><strong>Részletek ↗</strong></Link>) : <div className="event-tile pending"><div className="event-meta"><span>A folytatás</span><span>Hamarosan</span></div><div className="event-tile__body"><h2>Újabb nap készül.</h2><p>A következő időpontot és helyszínt itt tesszük közzé.</p></div><span>Találkozzunk hamarosan.</span></div>}</div></section>
    <section className="content-section"><div className="section-kicker"><span>Korábbi napok</span><span>A történet folytatódik</span></div><div className={`event-list${past.length === 1 ? " event-list--single" : ""}`}>{past.map((e) => <Link href={`/esemenyek/${e.slug}`} className="event-tile event-tile--past" key={e.slug}><div className="event-meta"><span>{formatEventDate(e.startsAt)}</span><span>{e.city}</span></div><div className="event-tile__body"><h2>{e.title}</h2><p>{e.subtitle}</p></div><strong>Az esemény története ↗</strong></Link>)}</div></section>
  </main>;
}
