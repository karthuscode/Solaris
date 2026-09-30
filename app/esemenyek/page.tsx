import type { Metadata } from "next";
import Link from "next/link";
import { getEvents } from "../../lib/data";
import { formatEventDate } from "../../lib/content";

export const metadata: Metadata = { title: "Események", description: "Solaris Days események és közös napok Csíkszeredában és környékén." };
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents();
  const now = Date.now();
  const upcoming = events.filter((e) => e.startsAt && new Date(e.startsAt).getTime() >= now).sort((a,b) => (a.startsAt || "").localeCompare(b.startsAt || ""));
  const past = events.filter((e) => e.startsAt && new Date(e.startsAt).getTime() < now);
  return <main className="inner-page"><div className="inner-hero"><span className="eyebrow">Solaris Days</span><h1>Együtt<br/>történik.</h1><p className="intro">Minden Solaris nap egy új alkalom a mozgásra és a találkozásra. Nézd meg, mi készül, és honnan indultunk.</p></div><section className="content-section"><div className="section-kicker"><span>Következő alkalmak</span><span>A részletek itt jelennek meg</span></div><div className="event-list">{upcoming.length ? upcoming.map((e) => <Link href={`/esemenyek/${e.slug}`} className="event-tile" key={e.slug}><div className="event-meta"><span>{formatEventDate(e.startsAt)}</span><span>{e.city}</span></div><div><h2>{e.title}</h2><p>{e.subtitle}</p></div><strong>Részletek ↗</strong></Link>) : <div className="event-tile pending"><div className="event-meta"><span>A folytatás</span><span>Hamarosan</span></div><div><h2>Újabb nap készül.</h2><p>A következő időpontot és helyszínt itt tesszük közzé.</p></div><span>Találkozzunk hamarosan.</span></div>}</div></section><section className="content-section"><div className="section-kicker"><span>Korábbi napok</span><span>A történet folytatódik</span></div><div className="event-list">{past.map((e) => <Link href={`/esemenyek/${e.slug}`} className="event-tile" key={e.slug}><div className="event-meta"><span>{formatEventDate(e.startsAt)}</span><span>{e.city}</span></div><div><h2>{e.title}</h2><p>{e.subtitle}</p></div><strong>Az esemény története ↗</strong></Link>)}</div></section></main>;
}
